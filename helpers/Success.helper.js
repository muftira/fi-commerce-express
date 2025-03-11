class SuccessResponse {
  constructor(res, status, data, message) {
    return res.status(status).json({
      status: true,
      message: message,
      data: data,
      error: {},
    });
  }
}

module.exports = SuccessResponse;
