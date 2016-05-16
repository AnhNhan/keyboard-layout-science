(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Hand;
    (function (Hand) {
        var Left;
        var Right;
    })(Hand = exports.Hand || (exports.Hand = {}));
    var Finger;
    (function (Finger) {
        var Thumb;
        var Pointer;
        var Middle;
        var Ring;
        var Pinky;
    })(Finger = exports.Finger || (exports.Finger = {}));
    var Keygroup;
    (function (Keygroup) {
        var Alpha;
        var Modifier;
    })(Keygroup = exports.Keygroup || (exports.Keygroup = {}));
    var AlphaGroup;
    (function (AlphaGroup) {
        var Letter;
        var Digit;
        /** e.g. Space and Tab */
        var Whitespace;
        /** e.g. Slash, Dash */
        var Special;
        var NonPrintable;
    })(AlphaGroup = exports.AlphaGroup || (exports.AlphaGroup = {}));
    var Modifiers;
    (function (Modifiers) {
        var Ctrl;
        var Shift;
        var Alt;
        var AltGr;
        var Tab;
    })(Modifiers = exports.Modifiers || (exports.Modifiers = {}));
});
