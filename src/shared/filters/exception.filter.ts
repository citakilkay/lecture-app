import { ExceptionFilter, Catch, Logger, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { CustomHttpExceptionResponse, HttpExceptionResponse } from "./models/exception-response.interface";

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    private readonly logger: Logger = new Logger();
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()

        let status: HttpStatus
        let errorMessage: string
        if (exception instanceof HttpException) {
            status = exception.getStatus()
            const errorResponse = exception.getResponse()
            errorMessage = (errorResponse as HttpExceptionResponse).error || exception.message
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR
            errorMessage = 'Critical Internal Server error occured!'
        }
        const errorResponse = this.getErrorResponse(status, errorMessage, request)
        this.logError(errorResponse, request, exception)
        response.status(status).json(errorResponse);
    }

    private getErrorResponse = (status: HttpStatus, errorMessage: string, request: Request): CustomHttpExceptionResponse => ({
        statusCode: status,
        error: errorMessage,
        path: request.url,
        method: request.method,
        timeStamp: new Date().toISOString()
    })

    private logError = (errorResponse: CustomHttpExceptionResponse, request: any, exception: unknown): void => {
        const { statusCode, error } = errorResponse;
        const { method, url } = request;
        const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n\n ${JSON.stringify(errorResponse)}\n\n
            User: ${JSON.stringify(request.user ?? 'Not signed in')}\n\n
            ${exception instanceof HttpException ? exception.stack : error}\n\n`;
        this.logger.error(errorLog, exception);
    }
}