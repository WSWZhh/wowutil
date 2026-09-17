function isType<T>(value: unknown, ctor: new (...args: any[]) => T): value is T {
  return value instanceof ctor;
}

function assertType<T>(value: unknown, ctor: new (...args: any[]) => T): asserts value is T {
  if (!isType(value, ctor)) throw new TypeError(` type should be  ${ctor.name}`);
}