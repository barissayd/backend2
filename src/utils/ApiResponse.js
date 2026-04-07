/**
 * Standardized success envelope so the React Native client can rely on a
 * single response shape:  { status, message, data, meta? }
 */
export class ApiResponse {
  static success(res, { statusCode = 200, message = 'OK', data = null, meta } = {}) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
      ...(meta && { meta }),
    });
  }
}
