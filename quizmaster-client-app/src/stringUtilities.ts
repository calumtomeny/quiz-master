declare global {
  interface String {
    toUrlFormat(): string;
  }
}
// eslint-disable-next-line no-extend-native
String.prototype.toUrlFormat = function () {
  return this.toLowerCase().replace(new RegExp(" ", "g"), "-");
};

export {};
