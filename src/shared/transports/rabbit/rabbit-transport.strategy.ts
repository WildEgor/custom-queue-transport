import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { AmqpConnectionManager, connect } from 'amqp-connection-manager';
import { Channel, ConfirmChannel, ConsumeMessage } from 'amqplib';
import { RabbitMessageContext } from './rabbit-message.context';
import { RMQ_TRANSPORT } from './rabbit-transport.constants';
import {
  IRabbitMessage,
  IRabbitPattern,
  IRabbitTransportInitProps,
  IRabbitTransportOptions,
} from './rabbit-transport.models';
import { ObjectUtil } from './rabbit-transport.utils';

type RabbitHandler = (data: unknown, context: RabbitMessageContext) => Promise<unknown>;
export class RabbitTransportStrategy extends Server implements CustomTransportStrategy {

  private connection?: AmqpConnectionManager;
  private readonly options: IRabbitTransportOptions;

  constructor({ options }: IRabbitTransportInitProps) {
    super();
    this.options = options;
  }

  private parseMessage(payload: unknown): IRabbitMessage | undefined {
    if (!Buffer.isBuffer(payload)) {
      return undefined;
    }

    const buf = payload.toString();

    try {
      return JSON.parse(buf);
    }
    catch (e) {
      return undefined;
    }
  }

  private async setupChannel(
    queue: string,
    handler: RabbitHandler,
    channel: Channel,
  ): Promise<void> {
    // TODO: We can get options from metadata
    await channel.assertQueue(queue, {
      durable: false,
    });
    await channel.prefetch(1);

    await channel.consume(queue, async(msg: ConsumeMessage | null) => {
      if (msg) {
        const content = this.parseMessage(msg.content);

        if (!content || !handler) {
          channel.ack(msg);
          return;
        }

        const context = new RabbitMessageContext([
          msg,
          channel,
          content,
        ]);

        const response$ = this.transformToObservable(
          await handler(content, context),
        );

        this.send(response$, (data) => {
          if (data.response === undefined) {
            channel.ack(msg);
          }
        });
      }
    }, {
      noAck: false,
    });
  }

  private async consume(callback: (err?: Error) => void): Promise<void> {
    if (!this.connection) {
      return callback();
    }

    for (const [pattern, handler] of this.getHandlers()) {
      if (!pattern.startsWith('{') || !pattern.endsWith('}')) {
        continue;
      }

      const rabbitPattern: IRabbitPattern = JSON.parse(pattern);

      if (ObjectUtil.isObject(rabbitPattern) && rabbitPattern?.transport === RMQ_TRANSPORT) {
        const channelWrapper = this.connection.createChannel({
          name: rabbitPattern.queue,
          json: false,
          setup: (channel: ConfirmChannel) => this.setupChannel(
            rabbitPattern.queue,
            handler,
            channel,
          ),
        });

        await channelWrapper.waitForConnect();

        this.logger.log(`Init handler for queue ${rabbitPattern.queue}`);
      }
    }

    return callback();
  }

  public listen(callback: (err?: Error) => void): void {
    this.connection = connect(this.options?.amqp, this.options?.manager);
    this.connection.on('connect', this.consume.bind(this, callback));
    this.connection.on('connectFailed', callback);
    this.connection.on('error', callback);
  }

  public async close(): Promise<void> {
    await this.connection?.close();
  }

}
