class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'Unauthorized';
  }
}

module.exports = UnauthorizedError;
