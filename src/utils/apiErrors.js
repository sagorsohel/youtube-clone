class apiErrors extends Error {
  constructor(
    message = "An error occurred while processing your request",
    statusCode,
    errors = [],
    stack
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.stack = stack;
    this.data=null,
    this.success=false
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default apiErrors;