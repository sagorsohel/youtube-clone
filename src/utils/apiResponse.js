class apiResponse {
  constructor(statusCode, message, data = null, success = true) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      success: this.success,
    };
  }
}

export default apiResponse;
