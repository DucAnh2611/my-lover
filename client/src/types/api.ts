export type TApiCallResponse = {
    success: boolean;
    status: number;
};

export type TApiCallSuccessResponse<T> = TApiCallResponse & {
    success: true;
    data?: T;
};

export type TApiCallFailedResponse<T> = TApiCallResponse & {
    success: false;
    message?: string;
    error?: T;
};
