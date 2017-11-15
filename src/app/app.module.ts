import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from '@components/app/app.component';
import { BreakDamageFormComponent } from '@components/break-damage-form/break-damage-form.component';

import { AppService } from '@services/app.service';

@NgModule({
  declarations: [
    AppComponent,
    BreakDamageFormComponent
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
