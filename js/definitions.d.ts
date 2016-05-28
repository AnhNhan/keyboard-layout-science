export interface Hand {
    id: number;
    thumb: Finger;
    pointer: Finger;
    middle: Finger;
    ring: Finger;
    pinky: Finger;
}
export interface Finger {
    id: number;
    hand: Hand;
}
export declare let hand_left: Hand;
export declare let hand_right: Hand;
export interface BasicKeystroke {
    primary_finger: Finger;
    primary_hand: Hand;
}
export interface DetailedKeystroke extends BasicKeystroke {
    row: number;
    column: number;
    label: string;
    wanted_character: string;
    pressed_modifiers: DetailedKeystroke[];
    pressed_key?: Key;
}
export interface Key {
    row: number;
    column: number;
    primary_finger: Finger;
    primary_hand: Hand;
    is_modifier: boolean;
    label: string;
    /**
     * List of typable characters on this key, with a note about which modifiers are required.
     */
    characters: {
        [character: string]: Key[];
    };
}
export declare type Keystrokes<Key extends BasicKeystroke> = Array<Key>;
export declare type FingerMap = [string, Finger][];
export declare type KeyMap<Key extends BasicKeystroke> = {
    [label: string]: Key;
};
