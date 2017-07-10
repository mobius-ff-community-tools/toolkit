export const enum ModifierKind {
    None,
    Damage         = 1 << 1,
    Magic          = 1 << 2,
    Multiplayer    = 1 << 3,
    Break          = 1 << 4,
    Weakness       = 1 << 5,
    Ailment        = 1 << 6,
    Boon           = 1 << 7,
    ElementEnhance = 1 << 8,
    Critical       = 1 << 9
}
