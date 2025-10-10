// ErrorHandler.js
import { ApiError } from '../utils/ApiError.js';

const ErrorHandler = (err, req, res, next) => {
  console.log('Middleware Error Handling');

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal Server Error',
      stack: err.stack,
    });
  }

  // fallback for unhandled errors in production
  return res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
};

export default ErrorHandler;
