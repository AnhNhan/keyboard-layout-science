(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.hand_left = {
        id: 123,
        thumb: { hand: undefined, id: 1 },
        pointer: { hand: undefined, id: 2 },
        middle: { hand: undefined, id: 3 },
        ring: { hand: undefined, id: 4 },
        pinky: { hand: undefined, id: 5 }
    };
    exports.hand_right = {
        id: 321,
        thumb: { hand: undefined, id: 6 },
        pointer: { hand: undefined, id: 7 },
        middle: { hand: undefined, id: 8 },
        ring: { hand: undefined, id: 9 },
        pinky: { hand: undefined, id: 10 }
    };
    exports.hand_left.thumb.hand = exports.hand_left;
    exports.hand_left.pointer.hand = exports.hand_left;
    exports.hand_left.middle.hand = exports.hand_left;
    exports.hand_left.ring.hand = exports.hand_left;
    exports.hand_left.pinky.hand = exports.hand_left;
    exports.hand_right.thumb.hand = exports.hand_right;
    exports.hand_right.pointer.hand = exports.hand_right;
    exports.hand_right.middle.hand = exports.hand_right;
    exports.hand_right.ring.hand = exports.hand_right;
    exports.hand_right.pinky.hand = exports.hand_right;
});
//# sourceMappingURL=definitions.js.map