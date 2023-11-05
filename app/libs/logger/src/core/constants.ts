export const LOG_REFLECTOR_FACTORY = 'LOG_REFLECTOR_FACTORY';
export const LOG_REFLECTOR_FACTORY_OPTIONS = 'LOG_REFLECTOR_FACTORY_OPTIONS';
export const LOG_REFLECTOR_SERIALIZER = 'LOG_REFLECTOR_SERIALIZER';

export const ON_EXCEPTION_TEMPLATE = '[{class}.cs, {method}] Exception.';
export const ON_EXCEPTION_TEMPLATE_WITH_TRACKINGID =
  '[{class}.cs, {method}, {trackingid}] Exception.';
export const ON_ENTRY_TEMPLATE_AND_PARAMETERS =
  '[{class}.cs, {method}] Start Call. Parameters: {parameters}.';
export const ON_ENTRY_TEMPLATE_WITH_REQUESTID_AND_PARAMETERS =
  '[{class}.cs, {method}, {trackingid}] Start Call. Parameters: {parameters}.';
export const ON_EXIT_TEMPLATE_WITH_DURATION_AND_RESULT =
  '[{class}.cs, {method}] End Call. Took {took} ms. Result Value: {result}';
export const ON_EXIT_TEMPLATE_WITH_RESULT =
  '[{class}.cs, {method}] End Call. Result Value: {result}';
export const ON_EXIT_TEMPLATE_WITH_TRACKINGID_AND_DURATION_AND_RESULT =
  '[{class}.cs, {method}, {trackingid}] End Call. Took {took} ms. Result Value: {result}';
export const ON_EXIT_TEMPLATE_WITH_TRACKINGID_AND_RESULT =
  '[{class}.cs, {method}, {trackingid}] End Call. Result Value: {result}';
export const LOG_REFLECTOR_SENSITIVE = 'LOG_REFLECTOR_SENSITIVE';
