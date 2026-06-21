import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx) => {
  return ctx.switchToHttp().getRequest().user;
});
