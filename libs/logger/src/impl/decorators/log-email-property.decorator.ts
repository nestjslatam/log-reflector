// Property Decorator for Email Validation
export function LogEmailPropertyValid(target: any, propertyKey: string) {
  const privateFieldName = `_${propertyKey}`;

  // Store the original setter method
  const originalSetter = Object.getOwnPropertyDescriptor(
    target,
    propertyKey,
  )?.set;

  // Define a new setter for the property
  const newSetter = function (value: any) {
    if (!isValidEmail(value)) {
      throw new Error(`Invalid email address for property "${propertyKey}".`);
    }
    this[privateFieldName] = value;
  };

  // Replace the property's setter method
  Object.defineProperty(target, propertyKey, {
    set: newSetter,
    get() {
      return this[privateFieldName];
    },
    enumerable: true,
    configurable: true,
  });
}

// Helper function to validate email addresses
function isValidEmail(email: string): boolean {
  // Regular expression for a simple email validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

// Parameter Decorator for Email Validation
export function LogEmailParamValid(
  target: any,
  methodName: string,
  parameterIndex: number,
) {
  const originalMethod = target[methodName];

  target[methodName] = function (...args: any[]) {
    const paramValue = args[parameterIndex];

    // Regular expression for a simple email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(paramValue)) {
      throw new Error(
        `Invalid email address provided for parameter at index ${parameterIndex}`,
      );
    }

    return originalMethod.apply(this, args);
  };
}
