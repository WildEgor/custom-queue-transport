import { AmqpConnectionManagerOptions } from 'amqp-connection-manager';
import { Channel, ConsumeMessage, Message, Options } from 'amqplib';

export interface IRabbitAssert extends Options.AssertQueue {
  prefetch?: number;
}

export interface IRabbitQueues extends IRabbitAssert {
  name: string;
}

export interface IRabbitTransportOptions {
  amqp?: Options.Connect;
  manager?: AmqpConnectionManagerOptions;
  queues?: IRabbitQueues[];
  defaultAssert?: IRabbitAssert;
}

export interface IRabbitTransportInitProps {
  options: IRabbitTransportOptions,
}

export interface IRabbitMessage<TData = unknown> {
  data: TData;
}

export type RabbitMessageContextArgs<TData> = [ConsumeMessage, Channel, IRabbitMessage<TData>];

export interface IRouteOptions {
  manualAck?: boolean;
  msgFactory?: (msg: Message) => unknown[];
}

export interface IRabbitPattern {
  queue: string;
  transport: string;
  isEvent?: boolean;
}
