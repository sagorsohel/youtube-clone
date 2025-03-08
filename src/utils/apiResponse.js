class apiResponse {
  constructor(statusCode, data, message, success) {
    this.statusCode = statusCode;

    this.message = message;
    this.data = data;
    this.success = success;
  }
}

export default apiResponse;
