import { ISerializer } from '../../interfaces';
import { Parameter } from '../../models';

export class SerializerHelper {
  private static instance: SerializerHelper;

  private constructor(private readonly serializeService: ISerializer) {}

  public static getInstance(serializer: ISerializer): SerializerHelper {
    if (!SerializerHelper.instance) {
      SerializerHelper.instance = new SerializerHelper(serializer);
    }

    return SerializerHelper.instance;
  }

  serializeParameters(parameters: Parameter[]) {
    return this.serializeService.serialize(parameters);
  }
}
