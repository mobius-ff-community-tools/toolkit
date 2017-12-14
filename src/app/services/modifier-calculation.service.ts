import { Injectable } from '@angular/core';

import { NGXLogger } from 'ngx-logger';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as _ from 'lodash';
import { inspect } from 'util';

import { AnyElement, ImbueElement, Modifier, ModifierContext, ModifierTrait, modifierTraitToString } from '@app/models';

@Injectable()
export class ModifierCalculationService {

    constructor(private logger: NGXLogger) { }

    get breakTraits(): ModifierTrait[] {
        return [
            ModifierTrait.Ailment,
            ModifierTrait.BaseValue,
            ModifierTrait.Boon,
            ModifierTrait.Fractal,
            ModifierTrait.Imbue,
            ModifierTrait.ElementEnhance,
            ModifierTrait.PiercingBreak
        ];
    }

    calculateEffectiveBreakPower(source: Observable<Modifier[]> | Modifier[]): Observable<number> | number {
        if (source instanceof Observable) {
            return source.map(_.bind(this._calculateEffectiveBreakPower, this));
        } else {
            return this._calculateEffectiveBreakPower(source);
        }
    }

    private _calculateEffectiveBreakPower(source: Modifier[]): number {
        const filteredModifiers = _.filter(source, (modifier) => modifier.context === ModifierContext.BreakDamage);
        const modifierMap = this._createModifierMap(filteredModifiers, this.breakTraits, {});
        let result = this._calculateBaseBreak(modifierMap[ModifierTrait.BaseValue]);
        result *= this._calculateTraitMultiplier(modifierMap, ModifierTrait.Fractal);
        result *= this._calculateTraitMultiplier(modifierMap, ModifierTrait.Boon);
        result *= this._calculateTraitMultiplier(modifierMap, ModifierTrait.Ailment);
        result *= this._calculateTraitMultiplier(modifierMap, ModifierTrait.PiercingBreak);

        // TODO: Get target element
        if (this._hasImbue(modifierMap[ModifierTrait.Imbue], AnyElement)) {
            result *= this._calculateTraitMultiplier(modifierMap, ModifierTrait.ElementEnhance);
        }
        return result;
    }

    private _hasImbue(modifiers: Modifier[], targetElement: ImbueElement): boolean {
        this.logger.debug('ModifierCalculatationService#_hasImbue');
        this.logger.debug(`\tmodifiers: ${inspect(modifiers)}`);
        const result = _.some(modifiers, (modifier) => {
            this.logger.debug(`\thas correct trait: ${(modifier.traits & ModifierTrait.Imbue) === ModifierTrait.Imbue}`);
            this.logger.debug(`\thas correct element: ${(modifier.value & targetElement) === targetElement}`);
            const hasImbue = ((modifier.traits & ModifierTrait.Imbue) === ModifierTrait.Imbue) && (modifier.value & targetElement);
            return hasImbue;
        });
        this.logger.debug(`\tresult: ${result}`);
        return result;
    }

    private _calculateBaseBreak(modifiers: Modifier[]): number {
        const [independent, additive] = this._partitionByTraits(modifiers, ModifierTrait.Independent);
        const result = _.sumBy(additive, (modifier) => modifier.value);
        return _.reduce(independent, (total, modifier) => total * modifier.value, result);
    }

    private _calculateTraitMultiplier(map: ModifierMap, trait: ModifierTrait): number {
        this.logger.debug('ModifierCalculationService#_calculateTraitMultiplier');
        this.logger.debug(`\ttrait: ${modifierTraitToString(trait)}`);

        const modifiers = map[trait];
        const [independent, additive] = this._partitionByTraits(modifiers, ModifierTrait.Independent);

        this.logger.debug(`\tadditive modifiers: ${inspect(additive)}`);

        const multiplier = _.sumBy(additive, (modifier) => modifier.value) + 1;

        this.logger.debug(`\tadditive multiplier: ${multiplier}`);
        this.logger.debug(`\tindependent multipliers: ${inspect(independent)}`);

        return  _.reduce(independent, (total, modifier) => total * (modifier.value), multiplier);
    }

    private _partitionByTraits(source: Modifier[], traits: ModifierTrait): Modifier[][] {
        return (source && source.length > 0) ? _.partition(source, (modifier) => modifier.traits & traits) : [[], []];
    }

    private _createModifierMap(source: Modifier[], traits: ModifierTrait[], accumulator: ModifierMap): ModifierMap {
        if (source.length <= 0 || traits.length <= 0) {
            this.logger.debug('ModifierCalculationService#_createModifierMap');
            this.logger.debug(`\tresult: ${inspect(accumulator)}`);
            return accumulator;
        } else {
            const trait = _.head(traits);
            const [matchingModifiers, remainingModifiers] = this._partitionByTraits(source, trait);
            accumulator[trait] = matchingModifiers;
            return this._createModifierMap(remainingModifiers, _.tail(traits), accumulator);
        }
    }
}

interface ModifierMap {
    [key: number]: Modifier[];
}
