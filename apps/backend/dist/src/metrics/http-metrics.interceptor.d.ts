import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Histogram } from 'prom-client';
export declare class HttpMetricsInterceptor implements NestInterceptor {
    private readonly histogram;
    constructor(histogram: Histogram<string>);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
