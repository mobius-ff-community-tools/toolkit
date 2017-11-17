import { Modifier, ModifierKind, ModifierContext } from '@app/models';
import { inspect } from 'util';

export class ModifierFactory {
    static CreateModifier(value: number, name: string, kind: ModifierKind, context: ModifierContext): Modifier {
        const result = new Modifier(value, name, kind, context);
        console.log(`ModifierFactory.CreateModifier`);
        console.log(`\tModifier: ${inspect(result)}`);
        return result;
    }

    static CreateBaseBreakModifier(value: number): Modifier {
        const kind = ModifierKind.BaseValue;
        return ModifierFactory.CreateModifier(value, 'Break Power', kind, ModifierContext.BreakDamage);
    }

    static CreateBoostModifier(): Modifier {
        const kind = ModifierKind.Boon | ModifierKind.Independent;
        return ModifierFactory.CreateModifier(2, 'Boost', kind, ModifierContext.BreakDamage);
    }

    static CreateTranceModifier(): Modifier {
        const kind = ModifierKind.Boon | ModifierKind.Independent;
        return ModifierFactory.CreateModifier(1.3, 'Trance', kind, ModifierContext.BreakDamage);
    }

    static CreateBDDModifier(): Modifier {
        const kind = ModifierKind.Ailment | ModifierKind.Independent;
        return ModifierFactory.CreateModifier(1.5, 'Break Defense Down', kind, ModifierContext.BreakDamage);
    }

    static CreateWeakenModifier(): Modifier {
        const kind = ModifierKind.ElementEnhance;
        return ModifierFactory.CreateModifier(0.5, 'Weaken', kind, ModifierContext.BreakDamage);
    }
}
