// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// 3rd-Party Angular Extensions
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

// Components
import { AppComponent } from '@components/app/app.component';
import { BreakDamageFormComponent } from '@components/break-damage-form';
import { CheckboxButtonComponent, CheckboxButtonContentDirective } from '@components/checkbox-button';

// Services
import { AppService } from '@services/app.service';

// Misc
import { environment } from '@env/environment';
import { getLogLevel } from '@app/utilities';

@NgModule({
  declarations: [
    AppComponent,
    BreakDamageFormComponent,
    CheckboxButtonComponent,
    CheckboxButtonContentDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    NgbModule.forRoot(),
    LoggerModule.forRoot({
        level: getLogLevel(environment),
        serverLogLevel: NgxLoggerLevel.ERROR
    })
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
