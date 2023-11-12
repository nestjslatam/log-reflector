import { Injectable } from '@nestjs/common';

import { ISerializer } from '../../interfaces';

@Injectable()
export class JsonSerializer implements ISerializer {
  serialize(value: any): string {
    return JSON.stringify(value);
  }
}
