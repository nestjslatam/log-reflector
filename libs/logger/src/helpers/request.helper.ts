import { ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';

export class RequestHelper {
  static getTrackingId(context: ExecutionContext) {
    const newTrackingId = uuidv4();

    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      // do something that is only important in the context of regular HTTP requests (REST)
      const trackingId = request?.body?.trackingId;
      // do something that is only important in the context of Microservice requests
      return trackingId ?? newTrackingId;
    }

    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo();
      const parentType = info.parentType.name;

      if (parentType === 'Query' || parentType === 'Mutation') {
        const trackingId =
          gqlContext.getContext().req.body?.variables?.trackingId;

        return trackingId ?? newTrackingId;
      }
    }

    // If a trackingId is provided, use it, otherwise generate a new one
    return newTrackingId;
  }
}
