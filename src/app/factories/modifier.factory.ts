import { Modifier, ModifierTrait, ModifierContext } from '@app/models';
import { inspect } from 'util';

export class ModifierFactory {
    static CreateModifier(value: number, name: string, traits: ModifierTrait, context: ModifierContext): Modifier {
        const result = new Modifier(value, name, traits, context);
        console.log(`ModifierFactory.CreateModifier`);
        console.log(`\tModifier: ${inspect(result)}`);
        return result;
    }

    static CreateBaseBreakModifier(value: number): Modifier {
        const traits = ModifierTrait.BaseValue;
        return ModifierFactory.CreateModifier(value, 'Break Power', traits, ModifierContext.BreakDamage);
    }

    static CreateBoostModifier(): Modifier {
        const traits = ModifierTrait.Boon | ModifierTrait.Independent;
        return ModifierFactory.CreateModifier(2, 'Boost', traits, ModifierContext.BreakDamage);
    }

    static CreateTranceModifier(): Modifier {
        const traits = ModifierTrait.Boon | ModifierTrait.Independent;
        return ModifierFactory.CreateModifier(1.3, 'Trance', traits, ModifierContext.BreakDamage);
    }

    static CreateBDDModifier(): Modifier {
        const traits = ModifierTrait.Ailment | ModifierTrait.Independent;
        return ModifierFactory.CreateModifier(1.5, 'Break Defense Down', traits, ModifierContext.BreakDamage);
    }

    static CreateWeakenModifier(): Modifier {
        const traits = ModifierTrait.ElementEnhance;
        return ModifierFactory.CreateModifier(0.5, 'Weaken', traits, ModifierContext.BreakDamage);
    }
}
