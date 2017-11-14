import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable()
export class AppService {
    get version(): string {
        return environment.version;
    }
}
