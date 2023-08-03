import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(): any {
  return applyDecorators(
    SetMetadata('isAuth', true),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
