import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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

  @RabbitRoute('my-test-queue')
  public async myTestHandler(
    @Payload() payload: IRabbitMessage<ITestPayload>,
    // @Ctx() context: RabbitMessageContext,
  ): Promise<void> {
    this.logger.debug(payload);
    // this.logger.debug(context.getMessage());
    await this.testService.handle(payload.data);
  }

  @MessagePattern('test')
  public test(): void {
    this.logger.debug('EXEC TEST');
  }

}
