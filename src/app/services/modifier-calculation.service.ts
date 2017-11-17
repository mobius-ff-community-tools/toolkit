import { Injectable } from '@angular/core';
import { isObservable } from '@angular/core/src/util/lang';

import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

import { Modifier, ModifierContext, ModifierKind } from '@app/models';

@Injectable()
export class ModifierCalculationService {

    get kinds(): ModifierKind[] {
        return [ModifierKind.BaseValue, ModifierKind.Boon];
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
        const modifierMap = this._createModifierMap(filteredModifiers, this.kinds, {});
        let result = _.sum(modifierMap[ModifierKind.BaseValue]);
        const [independentBoons, additiveBoons] = this._partitionByKind(modifierMap[ModifierKind.Boon], ModifierKind.Independent);
        const boons = _.concat(independentBoons, _.sumBy(additiveBoons, 'value') + 1);
        result = _.reduce(boons, (total, modifier) => total * modifier.value, result);
        return result;
    }

    private _partitionByKind(source: Modifier[], kind: ModifierKind): Modifier[][] {
        return (source.length > 0) ? _.partition(source, (modifier) => modifier.kind & kind) : [[], []];
    }

    private _createModifierMap(source: Modifier[], kinds: ModifierKind[], accumulator: ModifierMap): ModifierMap {
        if (source.length <= 0 || kinds.length <= 0) {
            return accumulator;
        } else {
            const kind = _.head(kinds);
            const [matchingModifiers, remainingModifiers] = this._partitionByKind(source, kind);
            accumulator[kind] = matchingModifiers;
            return this._createModifierMap(remainingModifiers, _.tail(kinds), accumulator);
        }
    }
}

interface ModifierMap {
    [key: number]: Modifier[];
}
