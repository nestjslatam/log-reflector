import { Injectable } from '@nestjs/common';
import { ISerializer } from '../../interfaces';

import * as stringify from 'json-stringify-safe';

@Injectable()
export class JsonSerializer implements ISerializer {
  serialize(value: any): string {
    return stringify(value, null, 2);
  }
}
