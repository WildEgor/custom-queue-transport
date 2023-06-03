import { IRabbitQueues } from '../../../shared/transports/rabbit/rabbit-transport.models';

export interface IRabbitConsumerConfig {
  hostname: string;
  port: number;
  username: string;
  password: string;
  queues: IRabbitQueues[];
}
