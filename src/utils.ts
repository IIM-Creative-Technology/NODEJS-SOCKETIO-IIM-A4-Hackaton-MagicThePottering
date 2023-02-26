export function hasProperty (obj: any, propertyName: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(obj, propertyName);
}
