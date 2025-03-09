class apiResponse {
  constructor(statusCode, message, data, success) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
  }
}

export default apiResponse;
