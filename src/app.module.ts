import { Module } from '@nestjs/common';
import { EnvModule } from './infrastructure/configs/env.module';
import { TestModule } from './modules/test/test.module';

@Module({
  imports: [
    EnvModule,
    TestModule,
  ],
})
export class AppModule {
}
