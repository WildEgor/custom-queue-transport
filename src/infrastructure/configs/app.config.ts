import { Injectable } from '@nestjs/common';
import { IAppConfig } from '../interfaces/configs/app.interface';
import { EnvService } from './env.service';

@Injectable()
export class AppConfig implements IAppConfig {

  public readonly name: string;
  public readonly port: number;

  constructor(envService: EnvService) {
    this.name = envService.getString('APP_NAME');
    this.port = envService.getNumber('APP_PORT');
  }

}
