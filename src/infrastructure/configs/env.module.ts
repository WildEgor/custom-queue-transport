import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from './app.config';
import { EnvService } from './env.service';
import { RabbitConsumerConfig } from './rabbit-consumer.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env.local',
        '.env',
      ],
    }),
  ],
  providers: [
    ConfigService,
    EnvService,
    AppConfig,
    RabbitConsumerConfig,
  ],
  exports: [
    AppConfig,
    RabbitConsumerConfig,
  ],
})
export class EnvModule {
}
