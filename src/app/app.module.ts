import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from '@components/app/app.component';
import { BreakDamageFormComponent } from '@components/break-damage-form';
import { CheckboxButtonComponent, CheckboxButtonContentDirective } from '@components/checkbox-button';

import { AppService } from '@services/app.service';

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
    HttpModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
