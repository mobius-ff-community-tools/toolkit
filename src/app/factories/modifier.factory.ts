import { ImbueElement, Modifier, ModifierTrait, ModifierContext } from '@app/models';
import { inspect } from 'util';

export class ModifierFactory {
    static CreateModifier(value: number, name: string, traits: ModifierTrait, context: ModifierContext): Modifier {
        const result = new Modifier(value, name, traits, context);
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

    static CreateEnElementModifier(): Modifier {
        const traits = ModifierTrait.ElementEnhance;
        return ModifierFactory.CreateModifier(0.3, 'EnElement', traits, ModifierContext.BreakDamage);
    }

    static CreateImbueModifier(element: ImbueElement): Modifier {
        const traits = ModifierTrait.Imbue;
        return ModifierFactory.CreateModifier(element, 'Imbue', traits, ModifierContext.BreakDamage);
    }

    static CreatePiercingBreakModifier(value: number): Modifier {
        const traits = ModifierTrait.PiercingBreak | ModifierTrait.Percentage;
        return ModifierFactory.CreateModifier(value, 'Piercing Break', traits, ModifierContext.BreakDamage);
    }

    static CreateExploitWeaknessModifier(value: number): Modifier {
        const traits = ModifierTrait.ElementEnhance | ModifierTrait.Percentage;
        return ModifierFactory.CreateModifier(value, 'Exploit Weakness', traits, ModifierContext.BreakDamage);
    }

    static CreateFractalModifier(stat: ModifierContext, value: number): Modifier {
        const traits = ModifierTrait.Fractal | ModifierTrait.Percentage;
        return ModifierFactory.CreateModifier(value, 'Break Power Fractal', traits, ModifierContext.BreakDamage);
    }

    static CreateCustomPanelModifier(stat: ModifierContext, value: number): Modifier {
        const traits = ModifierTrait.BaseValue;
        return ModifierFactory.CreateModifier(value, 'Break Custom Panel', traits, ModifierContext.BreakDamage);
    }
}
