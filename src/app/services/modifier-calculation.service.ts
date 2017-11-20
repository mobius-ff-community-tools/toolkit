import { Injectable } from '@angular/core';
import { isObservable } from '@angular/core/src/util/lang';

import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

import { AnyElement, Element, Modifier, ModifierContext, ModifierTrait } from '@app/models';

@Injectable()
export class ModifierCalculationService {

    get breakTraits(): ModifierTrait[] {
        return [ModifierTrait.BaseValue,
            ModifierTrait.Boon,
            ModifierTrait.Fractal,
            ModifierTrait.Imbue,
            ModifierTrait.Weakness];
    }

    calculateBreakDamage(source: Observable<Modifier[]> | Modifier[]): Observable<number> | number {
        if (isObservable(source)) {
            return source.map(this._calculateBreakDamage);
        } else {
            return this._calculateBreakDamage(source);
        }
    }

    private _calculateBreakDamage(source: Modifier[]): number {
        const filteredModifiers = _.filter(source, (modifier) => modifier.context === ModifierContext.BreakDamage);
        const modifierMap = this._createModifierMap(filteredModifiers, this.breakTraits, {});
        let result = this._calculateBaseBreak(modifierMap[ModifierTrait.BaseValue]);
        result *= this._calculateTraitMultiplier(modifierMap, ModifierTrait.Fractal);
        result *= this._calculateTraitMultiplier(modifierMap, ModifierTrait.Boon);

        // TODO: Get target element
        if (this._hasImbue(modifierMap[ModifierTrait.Imbue], AnyElement)) {
            result *= this._calculateTraitMultiplier(modifierMap, ModifierTrait.Weakness);
        }
        return result;
    }

    private _hasImbue(modifiers: Modifier[], targetElement: Element): boolean {
        return _.some(modifiers, (modifier) =>
            modifier.trait === ModifierTrait.Imbue && (modifier.value & targetElement));
    }

    private _calculateBaseBreak(modifiers: Modifier[]): number {
        const [independent, additive] = this._partitionByTraits(modifiers, ModifierTrait.Independent);
        const result = _.sumBy(additive, (modifier) => modifier.value);
        return _.reduce(independent, (total, modifier) => total * modifier.value, result);
    }

    private _calculateTraitMultiplier(map: ModifierMap, trait: ModifierTrait): number {
        const modifiers = map[trait];
        const [independent, additive] = this._partitionByTraits(modifiers, ModifierTrait.Independent);
        const multiplier = _.sumBy(additive, (modifier) => modifier.value) + 1;
        return  _.reduce(independent, (total, modifier) => total * (1 + modifier.value), multiplier);
    }

    private _partitionByTraits(source: Modifier[], traits: ModifierTrait): Modifier[][] {
        return (source.length > 0) ? _.partition(source, (modifier) => modifier.traits & traits) : [[], []];
    }

    private _createModifierMap(source: Modifier[], traits: ModifierTrait[], accumulator: ModifierMap): ModifierMap {
        if (source.length <= 0 || traits.length <= 0) {
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
