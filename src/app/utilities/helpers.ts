import { environment } from '@env/environment';
import { NgxLoggerLevel } from 'ngx-logger';

export function getLogLevel(env: typeof environment) {
    return (env.production) ?
        NgxLoggerLevel.INFO :
        NgxLoggerLevel.DEBUG;
}
