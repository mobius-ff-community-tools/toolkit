export const enum Element {
    None,
    Fire  = 1 << 0,
    Water = 1 << 1,
    Wind  = 1 << 2,
    Earth = 1 << 3,
    Light = 1 << 4,
    Dark  = 1 << 5,
}

export const AnyElement = 0b111111;
