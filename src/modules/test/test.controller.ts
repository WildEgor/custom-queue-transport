import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RabbitConsumerConfig } from '../../infrastructure/configs/rabbit-consumer.config';
import { ITestPayload } from '../../infrastructure/interfaces/test/test-payload.interface';
import { RabbitRoute } from '../../shared/transports/rabbit/rabbit-route.decorator';
import { IRabbitMessage } from '../../shared/transports/rabbit/rabbit-transport.models';
import { TestService } from './test.service';

@Controller()
export class TestController {

  private readonly testService: TestService;
  private readonly logger: Logger;

  constructor(
    testService: TestService,
  ) {
    this.testService = testService;
    this.logger = new Logger(TestController.name);
  }

  // Handle messages per queue
  @RabbitRoute(RabbitConsumerConfig.RABBIT_TEST_QUEUE)
  public async myTestHandler(
    @Payload() payload: IRabbitMessage<ITestPayload>,
    // @Ctx() context: RabbitMessageContext, // Can also get raw messages context
  ): Promise<void> {
    this.logger.debug(payload);
    // this.logger.debug(context.getMessage());
    await this.testService.handle(payload.data);
  }

  // Handle any message with default transport too
  @MessagePattern('test')
  public test(): void {
    this.logger.debug('EXEC TEST');
  }

}
