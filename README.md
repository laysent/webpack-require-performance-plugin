# webpack-require-performance-plugin

This is a simple webpack plugin that helps measure performance of requiring modules.

## Installation

```shell
yarn add --dev webpack-require-performance-plugin
```

## Usage

In webpack configuration file, add the following:

```javascript
const RequirePerformancePlugin = require('webpack-require-performance-plugin');

module.exports = (env) => ({
  // ...
  plugins: [
    new RequirePerformancePlugin({ disable: false, project: 'WRPP', prefix: 'plugin' }),
  ],
  optimization: {
    namedModules: true,
  }
  // ...
});
```

RequiredPerformancePlugin will use moduleId as performance mark name. For easy readability, it's recommended to enable `namedModules: true`, so that Webpack will use `NamedModulesPlugin` behind the scene.

## Options

Option is not required when creating the plugin. If provided, following are the available options:

### options.disable

Type: `Boolean`
Default: `false`

If truthy, this plugin does nothing at all.

`{ disable: !process.env.MEASURE }` allows opt-in measurements with `MEASURE=true yarn build`.

### options.clearMeasures

Type: `Boolean`
Default: `false`

If truthy, this plugin will call `performance.clearMeasures` after `performance.measure`.

### options.project

Type: `String`
Default: `''`

The `project` string will be used as prefix for performance measure mark. Providing unique ID for each project makes sure that measure mark won't conflict across difference Webpack compiled packages.

### options.prefix

Type: `String`
Default: Same value as `project` value with suffix `':'`, or `''` if `project` is also empty string

`project` is used for performance mark, while `prefix` is used for label of measured label. `prefix` will be added in front of each module ID, as a way to distinguish.
