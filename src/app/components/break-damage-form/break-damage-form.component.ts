import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Modifier } from '@app/models';

@Component({
    selector: 'app-break-damage-form',
    templateUrl: './break-damage-form.component.html',
    styleUrls: ['./break-damage-form.component.css']
})
export class BreakDamageFormComponent {
    breakDamageForm: FormGroup;

    constructor(private builder: FormBuilder) {
        this.initialize();
    }

    get totalBreakPower(): number {
        let result = 0;

        if (this.breakDamageForm.valid) {
            const hasBoost = this.breakDamageForm.get('hasBoost').value;
            const hasTrance = this.breakDamageForm.get('hasTrance').value;
            const hasBDD = this.breakDamageForm.get('hasBDD').value;
            const hasEnElement = this.breakDamageForm.get('hasEnElement').value;
            const hasWeaken = this.breakDamageForm.get('hasWeaken').value;
            const peircingBreak = this.breakDamageForm.get('piercingBreak').value;

            result += this.breakDamageForm.get('baseBreak').value;

            if (hasBoost) {
                result *= 2;
            }

            if (hasBDD) {
                result *= 1.5;
            }

            if (hasTrance) {
                result *= 1.3;
            }

            if (hasEnElement) {
                let elementMultiplier = 1.3;
                const exploitWeakness = this.breakDamageForm.get('exploitWeakness').value;

                if (exploitWeakness !== '') {
                    elementMultiplier += (exploitWeakness / 100);
                }

                if (hasWeaken) {
                    elementMultiplier += 0.5;
                }

                result *= elementMultiplier;
            }

            if (peircingBreak !== '') {
                result *= (1 + (peircingBreak / 100));
            }
        }

        return result;
    }

    private initialize() {
        this.breakDamageForm = this.builder.group({
            baseBreak: '',
            exploitWeakness: '',
            hasBoost: false,
            hasTrance: false,
            hasBDD: false,
            hasEnElement: false,
            hasWeaken: false,
            piercingBreak: '',
            targetBreakGauge: ''
        });
    }
}
