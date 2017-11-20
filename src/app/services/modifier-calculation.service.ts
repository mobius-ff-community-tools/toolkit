import { Injectable } from '@angular/core';
import { isObservable } from '@angular/core/src/util/lang';

import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

import { Modifier, ModifierContext, ModifierTrait } from '@app/models';

@Injectable()
export class ModifierCalculationService {

    get breakTraits(): ModifierTrait[] {
        return [ModifierTrait.BaseValue, ModifierTrait.Boon];
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
        let result = _.sum(modifierMap[ModifierTrait.BaseValue]);
        const [independentBoons, additiveBoons] = this._partitionByTraits(modifierMap[ModifierTrait.Boon], ModifierTrait.Independent);
        const boons = _.concat(independentBoons, _.sumBy(additiveBoons, 'value') + 1);
        result = _.reduce(boons, (total, modifier) => total * modifier.value, result);
        return result;
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
