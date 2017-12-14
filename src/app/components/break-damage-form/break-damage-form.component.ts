// Angular
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// RXJS
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

// Misc
import { inspect } from 'util';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';

// Application
import { AnyElement, Modifier, ModifierTrait, ModifierContext } from '@app/models';
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

    targetPresets = {
        '5* Sicarius (1st Gen)': 70500,
        '5* Guard': 20000,
        '4* Sicarius (1st Gen)': 40500,
        '3* Sicarius (1st Gen)': 30500,
        '2* Sicarius (1st Gen)': 6500,
        '1* Sicarius (1st Gen)': 2500
    };

    private _modifiersSubject = new BehaviorSubject<Modifier[]>([]);
    private _effectiveBreakPowerSubject = new BehaviorSubject<number>(0);
    private _tapsSubject = new BehaviorSubject<number>(0);
    private _targetBreakDefenseSubject = new BehaviorSubject<number>(0);

    constructor(private builder: FormBuilder,
        private logger: NGXLogger,
        private calculationService: ModifierCalculationService) {
        this.createForm();
    }

    get presets(): string[] {
        return _.keys(this.targetPresets);
    }

    get modifiers$(): Observable<Modifier[]> {
        return this._modifiersSubject.asObservable();
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

    get targetBreakDamageRatio$(): Observable<number> {
        const log = _.bind(this.logger.debug, this.logger, 'BreakDamageFormComponent#targetBreakDamageRatio$');
        return Observable.combineLatest(this.effectiveBreakPower$, this.targetBreakDefense$, this.taps$,
            (effectiveBreakPower, breakDefense, taps) => {
                this.logger.debug('BreakDamageFormComponent#targetBreakDamageRatio$');
                this.logger.debug(`\teffectiveBreakPower: ${effectiveBreakPower}`);
                this.logger.debug(`\tbreakDefense: ${breakDefense}`);
                this.logger.debug(`\ttaps: ${taps}`);

                return Math.min(1, Math.max(0, (breakDefense - (effectiveBreakPower * taps)) / breakDefense));
            }).do(log);
    }

    get hideTargetBreakDamageResult(): boolean {
        return !this.breakDamageForm.valid ||
            this.breakDamageForm.get('targetBreakDefense').value === 0 ||
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
            targetBreakDefense: [0, Validators.min(0)],
            targetPreset: undefined
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

        this.breakDamageForm.get('targetBreakDefense')
            .valueChanges.subscribe(this._targetBreakDefenseSubject);

        this.breakDamageForm.get('numberOfTaps')
            .valueChanges.subscribe(this._tapsSubject);

        this.breakDamageForm.get('targetPreset')
            .valueChanges.filter(_.negate(_.isUndefined))
            .map((value: string) => this.targetPresets[value])
            .subscribe((value: number) => {
                this.breakDamageForm.get('targetBreakDefense').setValue(value);
            });

        const calculation = this.calculationService
            .calculateEffectiveBreakPower(this.modifiers$);

        if (typeof calculation !== 'number') {
            calculation
                .do(_.bind(this.logger.debug, this.logger, 'CalculationService#calculateEffectiveBreakPower - result'))
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
        switch (key) {
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
                    // TODO: Provide the correct element instead of AnyElement
                    result.push(ModifierFactory.CreateImbueModifier(AnyElement));
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
