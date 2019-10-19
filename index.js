const webpack = require('webpack');

const defaultOptions = {
  disable: false,
  clearMeasures: false
};

function WebpackRequirePerformancePlugin(options) {
  this.options = Object.assign(defaultOptions, options);
}

function setRequireHook(compiler, callback) {
  if (compiler.hooks) {
    compiler.hooks.compilation.tap('WebpackRequirePerformancePlugin', function (compilation) {
      if (webpack.JavascriptModulesPlugin) {
        // Webpack 5
        webpack.JavascriptModulesPlugin.getCompilationHooks(compilation)
          .renderRequire.tap('WebpackRequirePerformancePlugin', callback);
      } else {
        const { mainTemplate } = compilation;
        mainTemplate.hooks.require.tap('WebpackRequirePerformancePlugin', callback);
      }
    });
    return;
  }
  // Deprecated API of Tapable
  compiler.plugin('compilation', function (compilation) {
    const { mainTemplate } = compilation;
    mainTemplate.plugin('require', callback);
  });
}

WebpackRequirePerformancePlugin.prototype.apply = function (compiler) {
  const { disable, clearMeasures } = this.options;
  if (disable) return;
  setRequireHook(compiler, function (source/*, chunk, hash */) {
    const beforeExecuteModule = '// Execute the module function';
    const afterExecuteModule = '// Flag the module as loaded';
    return source
      .replace(
        beforeExecuteModule,
        [
          '// Begin mark of performance',
          'if (typeof performance !== "undefined") performance.mark(moduleId);',
          '',
          beforeExecuteModule,
        ].join('\n'),
      )
      .replace(
        afterExecuteModule,
        [
          '// End mark of performance',
          'if (typeof performance !== "undefined") {',
          '  performance.measure(moduleId, moduleId);',
          '  performance.clearMarks(moduleId);',
          clearMeasures ? '  performance.clearMeasures(moduleId);' : '',
          '}',
          '',
          afterExecuteModule,
        ].join('\n'),
      );
  });
};

module.exports = WebpackRequirePerformancePlugin;
