export const LogReflector = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    console.log(`From Target: ${JSON.stringify(target)}`);
    console.log(`From PropertyKey: ${propertyKey}`);
    console.log(`From Descriptor: ${JSON.stringify(descriptor)}`);
  };
};
