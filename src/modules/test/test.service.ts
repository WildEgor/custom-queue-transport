import { Injectable, Logger } from '@nestjs/common';
import { ITestPayload } from '../../infrastructure/interfaces/test/test-payload.interface';

@Injectable()
export class TestService {

  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(TestService.name);
  }

  public async handle(data: ITestPayload): Promise<void> {
    this.logger.log('Handle message');
    this.logger.log(data);
    await Promise.resolve();
  }

}
