import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CustomStrategy } from '@nestjs/microservices';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AppConfig } from './infrastructure/configs/app.config';
import { RabbitConsumerConfig } from './infrastructure/configs/rabbit-consumer.config';
import { RabbitTransportStrategy } from './shared/transports/rabbit/rabbit-transport.strategy';

const bootstrap = async(): Promise<void> => {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  app.enableCors();
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = app.get(AppConfig);
  const logger = new Logger('Bootstrap');

  const rmqConsumerConfig = app.get(RabbitConsumerConfig);

  app.connectMicroservice<CustomStrategy>({
    strategy: new RabbitTransportStrategy({
      options: {
        amqp: rmqConsumerConfig,
      },
    }),
  });

  await app.listen(config.port, '0.0.0.0', (_, address) => {
    logger.debug(`Service available on ${address}`);
  });
  await app.startAllMicroservices();
};
bootstrap();
