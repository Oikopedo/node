module.exports = class MestoError extends Error {
  constructor(code = 500, ...params) {
    super(...params);
    this.name = 'MestoError';
    this.code = code;
  }
};
