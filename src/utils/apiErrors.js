class apiErrors extends Error {
  constructor(
    statusCode,
    message = "An error occurred while processing your request",
    errors = [],
    stack
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message, // ✅ Ensure message is included
      errors: this.errors,
      data: this.data,
      success: this.success,
    };
  }
}

export default apiErrors;
