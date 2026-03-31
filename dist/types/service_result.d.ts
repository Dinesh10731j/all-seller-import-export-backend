import { HttpStatusCode } from "../constant/statusCode.interface";
export type ServiceResult<T = unknown> = {
    status: HttpStatusCode;
    data?: T;
};
//# sourceMappingURL=service_result.d.ts.map