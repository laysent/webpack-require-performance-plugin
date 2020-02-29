const webpack = require('webpack');

const defaultOptions = {
  disable: false,
  clearMeasures: false,
  project: '',
  prefix: undefined,
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
  const { disable, clearMeasures, project, prefix } = this.options;
  let prefixText = '';
  if (typeof prefix === 'string') prefixText = prefixText;
  else if (project !== '') prefixText = `${project}:`;
  if (disable) return;
  setRequireHook(compiler, function (source/*, chunk, hash */) {
    const beforeExecuteModule = '// Execute the module function';
    const afterExecuteModule = '// Flag the module as loaded';
    return source
      .replace(
        beforeExecuteModule,
        [
          '// Begin mark of performance',
          `var moduleKey = ${JSON.stringify(project)} + moduleId;`,
          'if (typeof performance !== "undefined") performance.mark(moduleKey);',
          '',
          beforeExecuteModule,
        ].join('\n'),
      )
      .replace(
        afterExecuteModule,
        [
          '// End mark of performance',
          'if (typeof performance !== "undefined") {',
          `  var moduleLabel = ${JSON.stringify(prefixText)} + moduleId;`,
          '  performance.measure(moduleLabel, moduleKey);',
          '  performance.clearMarks(moduleKey);',
          clearMeasures ? '  performance.clearMeasures(moduleKey);' : '',
          '}',
          '',
          afterExecuteModule,
        ].join('\n'),
      );
  });
};

module.exports = WebpackRequirePerformancePlugin;
