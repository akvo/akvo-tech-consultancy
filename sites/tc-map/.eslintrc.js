module.exports = {
    env: {browser: true, jquery: true},
    extends: ["eslint:recommended", "jquery"],
    globals: {moment: true},
    rules: {
        "array-bracket-spacing": ["error", "never"],
        "array-element-newline": ["off", {"multiline": true, "minItems": 3}],
        "comma-dangle": [
            "error",
            {
                "arrays": "always-multiline",
                "objects": "always-multiline",
                "imports": "always-multiline",
                "exports": "always-multiline",
                "functions": "only-multiline",
            },
        ],
        "comma-spacing": [ "error", {"before": false, "after": true}],
        "complexity": ["error", 10],
        "function-paren-newline": ["error", "multiline"],
        "indent": ["error", 4],
        "keyword-spacing": [
            "error",
            {
                "before": true,
                "after": true,
                "overrides": {
                    "return": {"after": true},
                    "throw": {"after": true},
                    "case": {"after": true},
                },
            },
        ],
        "linebreak-style": ["error", "unix"],
        "max-depth": ["error", 4],
        "max-len": [
            "error",
            {
                "code": 120,
                "ignoreComments": true,
                "ignoreUrls": true,
                "ignoreRegExpLiterals": true
            },
        ],
        "max-lines": [
            "error",
            {
                "max": 1000,
                "skipBlankLines": true,
                "skipComments": true,
            },
        ],
        "max-nested-callbacks": ["error", 3],
        "max-params": ["error", 5],
        "max-statements": [ "error", 50, {"ignoreTopLevelFunctions": true}],
        "max-statements-per-line": "error",
        "no-array-constructor": "error",
        "no-alert": "error",
        "no-else-return": ["error", {"allowElseIf": false}],
        "no-eval": "error",
        "no-implied-eval": "error",
        "no-implicit-globals": "error",
        "no-mixed-operators": [
            "error",
            {
                "groups": [
                    ["%", "**"],
                    ["%", "+"],
                    ["%", "-"],
                    ["%", "*"],
                    ["%", "/"],
                    ["**", "+"],
                    ["**", "-"],
                    ["**", "*"],
                    ["**", "/"],
                    ["&", "|", "^", "~", "<<", ">>", ">>>"],
                    ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                    ["&&", "||"],
                    ["in", "instanceof"],
                ],
                "allowSamePrecedence": false,
            },
        ],
        "no-new-object": "error",
        "no-restricted-globals": [
            "error",
            "isFinite",
            "isNaN",
        ],
        "no-restricted-properties": [
            "error",
            {
                "object": "arguments",
                "property": "callee",
                "message": "arguments.callee is deprecated",
            },
            {
                "object": "global",
                "property": "isFinite",
                "message": "Please use Number.isFinite instead",
            },
            {
                "object": "self",
                "property": "isFinite",
                "message": "Please use Number.isFinite instead",
            },
            {
                "object": "window",
                "property": "isFinite",
                "message": "Please use Number.isFinite instead",
            },
            {
                "object": "global",
                "property": "isNaN",
                "message": "Please use Number.isNaN instead",
            },
            {
                "object": "self",
                "property": "isNaN",
                "message": "Please use Number.isNaN instead",
            },
            {
                "object": "window",
                "property": "isNaN",
                "message": "Please use Number.isNaN instead",
            },
            {
                "property": "__defineGetter__",
                "message": "Please use Object.defineProperty instead.",
            },
            {
                "property": "__defineSetter__",
                "message": "Please use Object.defineProperty instead.",
            },
            {
                "object": "Math",
                "property": "pow",
                "message": "Use the exponentiation operator (**) instead.",
            },
        ],
        "no-throw-literal": "error",
        "no-underscore-dangle": [
            "error",
            {
                "allow": ["__lc"],
                "allowAfterThis": false,
                "allowAfterSuper": false,
                "enforceInMethodNames": false,
            },
        ],
        "no-unneeded-ternary": ["error", {"defaultAssignment": false}],
        "no-whitespace-before-property": "error",
        "object-curly-newline": [
            "error",
            {
                "ObjectExpression": {
                    "minProperties": 4,
                    "multiline": true,
                    "consistent": true,
                },
                "ObjectPattern": {
                    "minProperties": 4,
                    "multiline": true,
                    "consistent": true,
                },
            },
        ],
        "object-curly-spacing": ["error", "always"],
        "quote-props": [
            "error",
            "as-needed",
            {
                "keywords": true,
                "unnecessary": true,
                "numbers": true,
            },
        ],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "space-before-function-paren": [
            "error",
            {
                "anonymous": "always",
                "named": "never",
            },
        ],
        "space-in-parens": ["error", "never"],
        "strict": ["error", "function"],
        "camelcase": "off",
    },
};
