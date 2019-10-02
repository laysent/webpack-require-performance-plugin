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
    new RequirePerformancePlugin({ disable: false }),
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
