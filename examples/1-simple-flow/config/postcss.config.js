//-------------------------------------------------------------------------------
// The PostCSS plugin allows for adding many tools that can transform and
// modify the css after the initial compilation.
//
// PostCSS import allows for referencing other stylesheets within a stylesheet.
// PostCSS URL inlines ressources in base64.
// Flexbugs-fixes brings transpiles flexboxes for older browser (IE...).
// Preset-env brings in the auto-prefixer and some goodies like transpiling
// down to older CSS syntax.
// Nano minifies what can be minified.
//
//-------------------------------------------------------------------------------

module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-url'),
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: { grid: true },
      stage: 0 }),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
