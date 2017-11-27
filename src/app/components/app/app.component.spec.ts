import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BreakDamageFormComponent } from '@components/break-damage-form';

import { AppService } from '@services/app.service';
import { ModifierCalculationService } from '@services/modifier-calculation.service';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule
            ],
            declarations: [
                AppComponent,
                BreakDamageFormComponent
            ],
            providers: [
                AppService,
                ModifierCalculationService
            ]
        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
