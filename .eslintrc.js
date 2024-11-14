/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "vuetify",
        "@vue/eslint-config-typescript",
        "./.eslintrc-auto-import.json",
    ],
    rules: {
        "vue/multi-word-component-names": "off",
        "vue/script-indent": "off",
        "vue/attributes-order": "off",
        "vue/html-indent": "off",
        "vue/html-self-closing": "off",
        "space-before-function-paren": "off",
        quotes: "off",
        semi: "off",
        indent: "off",
        "quote-props": "off",
        "no-tabs": "off",
        "arrow-parens": "off",
    },
};
