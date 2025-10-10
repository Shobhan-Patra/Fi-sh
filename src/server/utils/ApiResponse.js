// Represents a standard API success response.

class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // true if status is 2xx or 3xx
  }
}

export { ApiResponse };
