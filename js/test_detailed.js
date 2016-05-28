(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    function key(label, row, column, primary_finger, characters, is_modifier) {
        if (is_modifier === void 0) { is_modifier = false; }
        return {
            label: label,
            row: row,
            column: column,
            primary_finger: primary_finger,
            primary_hand: primary_finger.hand,
            is_modifier: is_modifier,
            characters: characters
        };
    }
});
//# sourceMappingURL=test_detailed.js.map