import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Modifier, ModifierTrait, ModifierContext } from '@app/models';
import { ModifierFactory } from '@app/factories';

import { inspect } from 'util';
import * as _ from 'lodash';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-break-damage-form',
    templateUrl: './break-damage-form.component.html',
    styleUrls: ['./break-damage-form.component.css']
})
export class BreakDamageFormComponent implements OnInit{
    breakDamageForm: FormGroup;

    debugInfoCollapsed = true;

    private _modifiersSubject = new BehaviorSubject<Modifier[]>([]);

    constructor(private builder: FormBuilder) {
        this.createForm();
    }

    get modifiers$(): Observable<Modifier[]> {
        return this._modifiersSubject.asObservable();
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
    get targetBreakDamageRatio(): number {
        let result = 0;
        const targetBreakGauge = this.breakDamageForm.get('targetBreakGauge').value;
        const numberOfTaps = this.breakDamageForm.get('numberOfTaps').value;
        const totalBreakPower = this.totalBreakPower;

        result = Math.min(1, Math.max(0, (targetBreakGauge - (totalBreakPower * numberOfTaps)) / targetBreakGauge));

        console.log(`BreakDamageFormComponent#targetBreakDamageRatio - result: ${result}`);

        return result;
    }

    get hideTargetBreakDamageResult(): boolean {
        return !this.breakDamageForm.valid ||
            this.breakDamageForm.get('targetBreakGauge').pristine ||
            this.breakDamageForm.get('numberOfTaps').pristine;
    }

    ngOnInit() {
        this.observeFormChanges();
    }

    private createForm() {
        this.breakDamageForm = this.builder.group({
            baseBreak: ['', Validators.required],
            exploitWeakness: '',
            hasBoost: false,
            hasTrance: false,
            hasBDD: false,
            hasEnElement: false,
            hasWeaken: false,
            numberOfTaps: '',
            piercingBreak: '',
            targetBreakGauge: ''
        });
    }

    private observeFormChanges() {
        const context = `BreakDamageFormComponent#observeFormChanges`;
        const logWithContext = _.bind(this.logModifierArray, this, context);
        const createModifierArray = _.bind(this.createModifierArrayFromChanges, this);

        this.breakDamageForm
            .valueChanges.filter(() => this.breakDamageForm.valid, this)
            .map(createModifierArray)
            .do(logWithContext)
            .subscribe(this._modifiersSubject);
    }

    private logModifierArray(context: String, modifiers: Modifier[]) {
        console.log(`BreakDamageFormComponent#logModifierArray`);
        console.log(`\tContext: ${context}`);
        console.log(`\tModifiers: ${inspect(modifiers)}`);
    }

    private createModifierArrayFromChanges(changes: any): Modifier[] {
        const result = _.transform(changes, this.transformChange, []);
        return result;
    }

    private transformChange(result: Modifier[], value: any, key: string, object: any) {
        switch(key) {
            case 'baseBreak':
                result.push(ModifierFactory.CreateBaseBreakModifier(value));
                break;
            case 'hasBoost':
                result.push(ModifierFactory.CreateBoostModifier());
                break;
            case 'hasTrance':
                result.push(ModifierFactory.CreateTranceModifier());
                break;
            case 'hasBDD':
                result.push(ModifierFactory.CreateBDDModifier());
        }
    }
}
