import MessageResponse from './MessageResponse';

export default interface ErrorResponse extends MessageResponse {
    stack?: string;
}

export interface GeneralErrorResponse {
    error: string;
}
