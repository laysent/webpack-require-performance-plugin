const defaultOptions = {
  disable: false
};

function RequirePerformancePlugin(options) {
  this.options = Object.assign(defaultOptions, options);
}

RequirePerformancePlugin.prototype.apply = function (compiler) {
  if (this.options.disable) return;
  compiler.plugin('compilation', function (compilation) {
    compilation.mainTemplate.plugin('require', function (source/*, chunk, hash */) {
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
            '  performance.clearMeasures(moduleId);',
            '}',
            '',
            afterExecuteModule,
          ].join('\n'),
        );
    });
  });
};

module.exports = RequirePerformancePlugin;
