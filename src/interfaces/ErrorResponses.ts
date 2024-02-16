export interface GeneralErrorResponse {
    error: string;
}

export default interface ErrorResponse extends GeneralErrorResponse {
    stack?: string;
}
