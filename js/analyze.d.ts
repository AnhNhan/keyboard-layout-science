import { BasicKeystroke, DetailedKeystroke } from './definitions';
export declare let rate_keystroke_sequence_basic: (keystrokes: BasicKeystroke[]) => {
    score: number;
    theorethical_sore: number;
    efficiency: number;
};
/**
 * More sophisticated rating algorithm which also considers the position of the keys and used modifiers.
 */
export declare let rate_keystroke_sequence_sophisticated: (keystrokes: DetailedKeystroke[]) => {
    score: number;
    theorethical_sore: number;
    efficiency: number;
};
