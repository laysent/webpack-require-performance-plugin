const defaultOptions = {
  disable: false,
  clearMeasures: false
};

function WebpackRequirePerformancePlugin(options) {
  this.options = Object.assign(defaultOptions, options);
}

WebpackRequirePerformancePlugin.prototype.apply = function (compiler) {
  const { disable, clearMeasures } = this.options;
  if (disable) return;
  (compiler.hooks ?
    compiler.hooks.compilation.tap.bind(compiler.hooks.compilation, 'WebpackRequirePerformancePlugin') :
    compiler.plugin.bind(compiler, 'compilation')
  )(function (compilation) {
    const { mainTemplate } = compilation;
    (mainTemplate.hooks ?
      mainTemplate.hooks.require.tap.bind(mainTemplate.hooks.require, 'WebpackRequirePerformancePlugin') :
      mainTemplate.require.bind(mainTemplate, 'require')
    )(function (source/*, chunk, hash */) {
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
  });
};

module.exports = WebpackRequirePerformancePlugin;
