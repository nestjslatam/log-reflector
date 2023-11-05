import { ISerializer } from '../interfaces';

export class JsonSerializer implements ISerializer {
  serialize(value: any): string {
    return JSON.stringify(value);
  }
}
