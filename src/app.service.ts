import { Injectable } from '@nestjs/common';
import { LogMethod } from '@nestjslatam/logreflector-lib';

@Injectable()
export class AppService {
  @LogMethod()
  print(): string {
    return 'PRINTING MESSAGE: Your welcome';
  }
}
