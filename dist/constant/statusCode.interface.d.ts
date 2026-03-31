export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly ACCEPTED: 202;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly METHOD_NOT_ALLOWED: 405;
    readonly REQUEST_TIMEOUT: 408;
    readonly CONFLICT: 409;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
//# sourceMappingURL=statusCode.interface.d.ts.map