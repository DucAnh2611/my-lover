const ResponseFormat = {
    ok: (data) => ({
        status: 200,
        success: true,
        ...(data ? { data } : {}),
    }),
    badRequest: (message) => ({
        status: 400,
        success: false,
        message,
    }),
    error: (status = 400, message, error = null) => ({
        status,
        success: false,
        message,
        ...(error ? { error } : {}),
    }),
    internal: {
        status: 500,
        success: false,
        message: "Lỗi nội bộ!",
    },
};

module.exports = ResponseFormat;
