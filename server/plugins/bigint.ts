BigInt.prototype.toJSON = function () {
  return `${this.toString()}n`;
};

export default defineNitroPlugin(() => null);
