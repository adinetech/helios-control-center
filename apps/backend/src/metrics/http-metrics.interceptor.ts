import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Histogram } from 'prom-client';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_requests_duration_seconds')
    private readonly histogram: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const method = req.method;

    const endTimer = this.histogram.startTimer();

    return next.handle().pipe(
      tap({
        next: () => {
          const path = req.route ? req.route.path : req.url;
          endTimer({ method, route: path, status_code: res.statusCode });
        },
        error: (err) => {
          const path = req.route ? req.route.path : req.url;
          const status = err.status || 500;
          endTimer({ method, route: path, status_code: status });
        },
      }),
    );
  }
}
