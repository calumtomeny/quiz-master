declare global {
  interface String {
    toUrlFormat(): string;
  }
}

String.prototype.toUrlFormat = function () {
  return this.toLowerCase().replace(new RegExp(" ", "g"), "-");
};

export {};
