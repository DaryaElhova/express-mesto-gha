class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = 'Conflict Error';
  }
}

module.exports = ConflictError;
