import { Keystrokes, BasicKeystroke, DetailedKeystroke } from './definitions';

type IntermediateResult<Keystroke extends BasicKeystroke> = { score: number, last_keystroke: Keystroke };

function abstract_keystroke_sequence_rating<Keystroke extends BasicKeystroke>(callable: (result: IntermediateResult<Keystroke>, keystroke: Keystroke) => IntermediateResult<Keystroke>, max_score_per_key: number)
{
    return function (keystrokes: Keystrokes<Keystroke>)
    {
        let result = keystrokes.reduce(callable, { score: 0, last_keystroke: undefined });
        return { score: result.score, theorethical_sore: keystrokes.length * max_score_per_key, efficiency: (result.score / (keystrokes.length * max_score_per_key) * 100 |0) / 100 };
    }
}

/// Basic rating, only taking finger switching between key presses into account
export
let rate_keystroke_sequence_basic = abstract_keystroke_sequence_rating<BasicKeystroke>(function (result, keystroke)
{
    if (!result || !result.last_keystroke) {
        return { score: 2, last_keystroke: keystroke };
    }
    if (result.last_keystroke.primary_hand.id != keystroke.primary_hand.id) {
        result.score += 1;
    }
    if (result.last_keystroke.primary_finger.id != keystroke.primary_finger.id) {
        result.score += 1;
    }
    result.last_keystroke = keystroke;
    return result;
}, 2);

/**
 * More sophisticated rating algorithm which also considers the position of the keys and used modifiers.
 */
export
let rate_keystroke_sequence_sophisticated = abstract_keystroke_sequence_rating<DetailedKeystroke>(function (result, keystroke)
{
    if (!result || !result.last_keystroke) {
        return { score: result.score, last_keystroke: keystroke };
    }

    if (result.last_keystroke.primary_hand.id != keystroke.primary_hand.id) {
        result.score += 10;
    }
    if (result.last_keystroke.primary_finger.id != keystroke.primary_finger.id) {
        result.score += 10;
    }

    if (result.last_keystroke.column == keystroke.column) {
        result.score += 5;
        if (Math.abs(result.last_keystroke.row - keystroke.row) == 1) {
            result.score += 5;
        }
    }
    if (result.last_keystroke.row == keystroke.row) {
        result.score += 5;
        if (Math.abs(result.last_keystroke.column - keystroke.column) == 1 && result.last_keystroke.primary_hand.id == keystroke.primary_hand.id) {
            result.score += 5;
        }
    }

    if (result.last_keystroke.pressed_modifiers == keystroke.pressed_modifiers) {
        result.score += keystroke.pressed_modifiers.map(_ => _.primary_hand.id == keystroke.primary_finger.id ? -1 : 2).reduce((x, y) => x + y);
    } else if (!result.last_keystroke.pressed_modifiers && keystroke.pressed_modifiers) {
        result.score += keystroke.pressed_modifiers.map(_ => _.primary_hand.id == keystroke.primary_finger.id ? -3 : -1).reduce((x, y) => x + y);
    }

    result.last_keystroke = keystroke;
    return result;
}, 10);
