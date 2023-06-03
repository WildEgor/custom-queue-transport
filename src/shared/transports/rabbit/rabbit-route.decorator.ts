import { applyDecorators, SetMetadata } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RMQ_ROUTES_OPTIONS, RMQ_ROUTES_PATH, RMQ_TRANSPORT } from './rabbit-transport.constants';
import { IRouteOptions } from './rabbit-transport.models';

export const RabbitRoute = (queue: string, options?: IRouteOptions): MethodDecorator => applyDecorators(
  SetMetadata(RMQ_ROUTES_OPTIONS, {
    ...options,
  }),
  SetMetadata(RMQ_ROUTES_PATH, queue),
  MessagePattern({ queue, transport: RMQ_TRANSPORT }),
);
