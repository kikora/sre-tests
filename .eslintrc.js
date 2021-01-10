/*
  👋 Hi! This file was autogenerated by tslint-to-eslint-config.
  https://github.com/typescript-eslint/tslint-to-eslint-config

  It represents the closest reasonable ESLint configuration to this
  project's original TSLint configuration.

  We recommend eventually switching this configuration to extend from
  the recommended rulesets in typescript-eslint. 
  https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

  Happy linting! 💖
*/
module.exports = {
  "env": {
    "browser": true,
    "node": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.json",
    "sourceType": "module"
  },
  "plugins": [
    "eslint-plugin-jsdoc",
    "eslint-plugin-import",
    "@typescript-eslint",
    "@typescript-eslint/tslint"
  ],
  "ignorePatterns": [".eslintrc.js", "*.d.ts"],
  "extends": ["plugin:jsdoc/recommended"],
  "settings": {
    "jsdoc": {
      "tagNamePreference": {
        "returns": "return",
        "file": "fileoverview"
      }
    }
  },
  "rules": {
    "@typescript-eslint/naming-convention": ["error", {
      "selector": "enumMember",
      "format": ["UPPER_CASE"],
      "leadingUnderscore": "forbid",
      "trailingUnderscore": "forbid"
    }],
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        "accessibility": "explicit"
      }
    ],
    "@typescript-eslint/indent": ["error", 2, {
      "VariableDeclarator": "off",
      "ArrayExpression": "first",
      "ObjectExpression": "first",
      "FunctionExpression": {
        "parameters": "first"
      },
      "CallExpression": {
        "arguments": "first"
      },
      "SwitchCase": 0
    }],
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
          "delimiter": "comma",
          "requireLast": false
        },
        "singleline": {
          "delimiter": "semi",
          "requireLast": false
        },
        "overrides": {
          "interface": {
            "multiline": {
                "delimiter": "semi",
                "requireLast": true
            }
          }
        }
      }
    ],
    "@typescript-eslint/member-ordering": "error", // Make this more precise!
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/quotes": [
      "error",
      "single"
    ],
    "@typescript-eslint/semi": [
      "error"
    ],
    "@typescript-eslint/type-annotation-spacing": "error",
    "brace-style": [
      "error",
      "1tbs"
    ],
    "curly": "error",
    "eol-last": "error",
    "eqeqeq": [
      "error",
      "smart"
    ],
    "id-blacklist": [
      "error",
      "any",
      "Number",
      "number",
      "String",
      "string",
      "Boolean",
      "boolean",
      "Undefined",
      "undefined"
    ],
    "id-match": "error",
    "import/order": "error",
    "jsdoc/require-param-type": "off",
    "jsdoc/require-property-type": "off",
    "jsdoc/require-returns-type": "off",
    "jsdoc/check-alignment": "error",
    "jsdoc/check-indentation": "off",
    "jsdoc/newline-after-description": "error",
    "linebreak-style": "error",
    "max-len": [
      "error",
      {
        "code": 80,
        "ignorePattern": "^import\ .*node_modules.*"
      }
    ],
    "no-eval": "error",
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 1
      }
    ],
    "no-redeclare": "error",
    "no-trailing-spaces": "error",
    "no-var": "error",
    "spaced-comment": [
      "error",
      "always",
      {
        "markers": [
          "/"
        ]
      }
    ],
    "@typescript-eslint/tslint/config": [
      "error",
      {
        "rules": {
          // "jsdoc-require": [
          //   true,
          //   "no-private-properties"
          // ],
          "whitespace": [
            true,
            "check-branch",
            "check-decl",
            "check-operator",
            "check-separator",
            "check-type"
          ]
        }
      }
    ]
  },
  "overrides": [
    {
      "files": ["ts/**/*.test.ts"],
      "rules": {
        "max-len": ["off"]
      }
    }
  ]
};
