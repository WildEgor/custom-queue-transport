import { BaseRpcContext } from '@nestjs/microservices';
import { Channel, ConsumeMessage } from 'amqplib';
import { IRabbitMessage, RabbitMessageContextArgs } from './rabbit-transport.models';

export class RabbitMessageContext<TData = unknown> extends BaseRpcContext<RabbitMessageContextArgs<TData>> {

  /**
   * Returns the original message (with properties, fields, and content).
   */
  public getMessage(): ConsumeMessage {
    return this.args[0];
  }

  /**
   * Returns the reference to the original RMQ channel.
   */
  public getChannelRef(): Channel {
    return this.args[1];
  }

  /**
   * Returns the parsed message content.
   */
  public getContent(): IRabbitMessage<TData> {
    return this.args[2];
  }

}
