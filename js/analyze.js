(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    function abstract_keystroke_sequence_rating(callable, max_score_per_key) {
        return function (keystrokes) {
            var result = keystrokes.reduce(callable, { score: 0, last_keystroke: undefined });
            return { score: result.score, theorethical_sore: keystrokes.length * max_score_per_key, efficiency: (result.score / (keystrokes.length * max_score_per_key) * 100 | 0) / 100 };
        };
    }
    /// Basic rating, only taking finger switching between key presses into account
    exports.rate_keystroke_sequence_basic = abstract_keystroke_sequence_rating(function (result, keystroke) {
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
    exports.rate_keystroke_sequence_sophisticated = abstract_keystroke_sequence_rating(function (result, keystroke) {
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
            result.score += keystroke.pressed_modifiers.map(function (_) { return _.primary_hand.id == keystroke.primary_finger.id ? -1 : 2; }).reduce(function (x, y) { return x + y; });
        }
        else if (!result.last_keystroke.pressed_modifiers && keystroke.pressed_modifiers) {
            result.score += keystroke.pressed_modifiers.map(function (_) { return _.primary_hand.id == keystroke.primary_finger.id ? -3 : -1; }).reduce(function (x, y) { return x + y; });
        }
        result.last_keystroke = keystroke;
        return result;
    }, 10);
});
//# sourceMappingURL=analyze.js.map