import { HttpStatusCode } from "../utils/enum";
import { HttpException } from "./http.exception";

export class BadRequestException extends HttpException {
    constructor(description = 'Bad Request', validationErrors?: any) {
        super('BAD REQUEST', HttpStatusCode.BAD_REQUEST, description, validationErrors);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(description = 'Unauthorized') {
        super('UNAUTHORIZED', HttpStatusCode.UNAUTHORIZED, description);
    }
}

export class ForbiddenException extends HttpException {
    constructor(description = 'Forbidden') {
        super('FORBIDDEN', HttpStatusCode.FORBIDDEN, description);
    }
}

export class ConflictException extends HttpException {
    constructor(description = 'Conflict') {
        super('CONFLICT', HttpStatusCode.CONFLICT, description);
    }
}

export class InternalServerErrorException extends HttpException {
    constructor(description = 'Internal Server Error') {
        super('INTERNAL SERVER ERROR', HttpStatusCode.INTERNAL_SERVER, description);
    }
}

export class MethodNotAllowedException extends HttpException {
    constructor(description = 'Method Not Allowed') {
        super('METHOD NOT ALLOWRD', HttpStatusCode.METHOD_NOT_ALLOWED, description);
    }
}

export class NotFoundException extends HttpException {
    constructor(description = 'Not Found') {
        super('NOT FOUND', HttpStatusCode.NOT_FOUND, description);
    }
}

export class RequestTimeoutException extends HttpException {
    constructor(description = 'Request Timeout') {
        super('REQUEST TIMEOUT', HttpStatusCode.REQUEST_TIMEOUT, description);
    }
}