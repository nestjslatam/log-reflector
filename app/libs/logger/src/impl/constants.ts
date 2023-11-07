export const LOG_REFLECTOR_OPTIONS = 'LOG_REFLECTOR_OPTIONS';
export const LOG_REFLECTOR_OPTIONS_FACTORY = 'LOG_REFLECTOR_OPTIONS_FACTORY';
export const LOG_REFLECTOR_SERIALIZER = 'LOG_REFLECTOR_SERIALIZER';
export const LOG_REFLECTOR_SERIALIZER_FACTORY =
  'LOG_REFLECTOR_SERIALIZER_FACTORY';
export const LOG_REFLECTOR_SENSITIVE = 'LOG_REFLECTOR_SENSITIVE';

export const ON_EXCEPTION_TEMPLATE =
  '{datetime} - [{class}.cs, {method}]. Took {took} ms. Exception: {error}.';

export const ON_EXCEPTION_TEMPLATE_TRACKING =
  '{datetime} - [{class}.cs, {method}, {trackingid}]. Took {took} ms. Exception: {error}.';

export const ON_ENTRY_TEMPLATE =
  '{datetime} - [{class}.cs, {method}] Start Call. Took {took} ms. Args: {returnedValue}.';

export const ON_ENTRY_TEMPLATE_TRACKING =
  '{datetime} - [{class}.cs, {method}, {trackingid}] Start Call. Took {took} ms. Args: {returnedValue}.';

export const ON_CALL_TEMPLATE =
  '{datetime} - [{class}.cs, {method}]. Took {took} ms. Result: {result}.';

export const ON_CALL_TEMPLATE_TRACKING =
  '{datetime} - [{class}.cs, {method}, {trackingid}]. Took {took} ms. Result: {result}.';

export const ON_EXIT_TEMPLATE =
  '{datetime} - [{class}.cs, {method}] End Call. Took {took} ms.';

export const ON_EXIT_TEMPLATE_TRACKING =
  '{datetime} - [{class}.cs, {method}, {trackingid}] End Call. Took {took} ms.';
