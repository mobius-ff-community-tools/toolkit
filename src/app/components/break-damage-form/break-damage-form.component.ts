// Angular
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// RXJS
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

// Misc
import { inspect } from 'util';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';

// Application
import { Modifier, ModifierTrait, ModifierContext } from '@app/models';
import { ModifierFactory } from '@app/factories';
import { ModifierCalculationService } from '@app/services';

@Component({
    selector: 'app-break-damage-form',
    templateUrl: './break-damage-form.component.html',
    styleUrls: ['./break-damage-form.component.css']
})
export class BreakDamageFormComponent implements OnInit {
    breakDamageForm: FormGroup;

    debugInfoCollapsed = true;

    private _modifiersSubject = new BehaviorSubject<Modifier[]>([]);
    private _effectiveBreakPowerSubject = new BehaviorSubject<number>(0);
    private _tapsSubject = new BehaviorSubject<number>(0);
    private _targetBreakDefenseSubject = new BehaviorSubject<number>(0);

    constructor(private builder: FormBuilder,
        private logger: NGXLogger,
        private calculationService: ModifierCalculationService) {
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
            const piercingBreak = this.breakDamageForm.get('piercingBreak').value;

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

            if (piercingBreak !== '') {
                result *= (1 + (piercingBreak / 100));
            }
        }

        return result;
    }

    get effectiveBreakPower$(): Observable<number> {
        return this._effectiveBreakPowerSubject.asObservable();
    }

    get taps$(): Observable<number> {
        return this._tapsSubject.asObservable();
    }

    get targetBreakDefense$(): Observable<number> {
        return this._targetBreakDefenseSubject.asObservable();
    }

    get targetBreakDamageRatio(): number {
        let result = 0;
        const targetBreakGauge = this.breakDamageForm.get('targetBreakGauge').value;
        const numberOfTaps = this.breakDamageForm.get('numberOfTaps').value;
        const totalBreakPower = this.totalBreakPower;

        result = Math.min(1, Math.max(0, (targetBreakGauge - (totalBreakPower * numberOfTaps)) / targetBreakGauge));

        this.logger.debug('BreakDamageFormComponent#targetBreakDamageRatio');
        this.logger.debug(`\tresult: ${result}`);
        this.logger.debug(`\t\t${inspect(result)}`);

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
            baseBreak: [0, Validators.compose([Validators.required, Validators.min(0)])],
            exploitWeakness: [0, Validators.min(0)],
            hasBoost: false,
            hasTrance: false,
            hasBDD: false,
            hasEnElement: false,
            hasWeaken: false,
            numberOfTaps: [0, Validators.min(0)],
            piercingBreak: [0, Validators.min(0)],
            targetBreakGauge: [0, Validators.min(0)]
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

        this.breakDamageForm.get('targetBreakGauge')
            .valueChanges.subscribe(this._targetBreakDefenseSubject);

        this.breakDamageForm.get('numberOfTaps')
            .valueChanges.subscribe(this._tapsSubject);

        const calculation = this.calculationService.calculateBreakDamage(this.modifiers$);

        if (typeof calculation !== 'number') {
            calculation
                .do(_.bind(this.logger.debug, this.logger, 'CalculationService#calculateBreakDamage - result'))
                .subscribe(this._effectiveBreakPowerSubject);
        }
    }

    private logModifierArray(context: String, modifiers: Modifier[]) {
        this.logger.debug(`BreakDamageFormComponent#logModifierArray`);
        this.logger.debug(`\tcontext: ${context}`);
        this.logger.debug(`\tmodifiers: ${modifiers}`);
        this.logger.debug(`\t\t${inspect(modifiers)}`);
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
                if (value) {
                    result.push(ModifierFactory.CreateBoostModifier());
                }
                break;
            case 'hasTrance':
                if (value) {
                    result.push(ModifierFactory.CreateTranceModifier());
                }
                break;
            case 'hasBDD':
                if (value) {
                    result.push(ModifierFactory.CreateBDDModifier());
                }
                break;
            case 'hasWeaken':
                if (value) {
                    result.push(ModifierFactory.CreateWeakenModifier());
                }
                break;
            case 'hasEnElement':
                if (value) {
                    result.push(ModifierFactory.CreateEnElementModifier());
                }
                break;
            case 'piercingBreak':
                result.push(ModifierFactory.CreatePiercingBreakModifier(value));
                break;
            case 'exploitWeakness':
                result.push(ModifierFactory.CreateExploitWeaknessModifier(value));
                break;
        }
    }
}
