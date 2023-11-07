export const LOG_REFLECTOR_OPTIONS = 'LOG_REFLECTOR_OPTIONS';
export const LOG_REFLECTOR_OPTIONS_FACTORY = 'LOG_REFLECTOR_OPTIONS_FACTORY';
export const LOG_REFLECTOR_SERIALIZER = 'LOG_REFLECTOR_SERIALIZER';
export const LOG_REFLECTOR_SERIALIZER_FACTORY =
  'LOG_REFLECTOR_SERIALIZER_FACTORY';

export const ON_EXCEPTION_TEMPLATE =
  '[{class}.cs, {method}, {trackingid}] Exception: {error}.';

export const ON_ENTRY_TEMPLATE =
  '[{class}.cs, {method}, {trackingid}] Start Call. Parameters: {parameters}.';

export const ON_CALL_TEMPLATE =
  '[{class}.cs, {method}, {trackingid}] Call: {call}. Parameters: {parameters}.';

export const ON_EXIT_TEMPLATE =
  '[{class}.cs, {method}, {trackingid}] End Call. Took {took} ms. Result Value: {result}';

export const LOG_REFLECTOR_SENSITIVE = 'LOG_REFLECTOR_SENSITIVE';
