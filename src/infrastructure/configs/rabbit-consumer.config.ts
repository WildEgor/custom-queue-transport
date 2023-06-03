import { Injectable } from '@nestjs/common';
import { IRabbitQueues } from '../../shared/transports/rabbit/rabbit-transport.models';
import { IRabbitConsumerConfig } from '../interfaces/configs/rabbit-consumer.interface';
import { EnvService } from './env.service';

@Injectable()
export class RabbitConsumerConfig implements IRabbitConsumerConfig {

  public readonly hostname: string;
  public readonly port: number;
  public readonly username: string;
  public readonly password: string;
  public readonly queues: IRabbitQueues[] = [];

  constructor(envService: EnvService) {
    this.hostname = envService.getString('RABBIT_HOST');
    this.port = envService.getNumber('RABBIT_PORT');
    this.username = envService.getString('RABBIT_USER');
    this.password = envService.getString('RABBIT_PASS');

    this.initQueues();
  }

  private initQueues(): void {
    this.queues.push({
      name: 'my_test_queue',
    });
  }

}
