var { inlineSource } = require("inline-source");

function HtmlWebpackInlinePlugin(options) {
  this.options = options;
}

HtmlWebpackInlinePlugin.prototype.apply = function (compiler) {
  let self = this;
  if (compiler.hooks) {
    compiler.hooks.compilation.tap("HtmlWebpackInlinePlugin", (compilation) => {
      if (!compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
        throw new Error(
          "The expected HtmlWebpackPlugin hook was not found! Ensure HtmlWebpackPlugin is installed and was initialized before this plugin."
        );
      }
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
        "HtmlWebpackInlinePlugin",
        (htmlPluginData, callback) => {
          var html = htmlPluginData.html;
          inlineSource(html, self.options)
            .then((html) => {
              htmlPluginData.html = html;
              callback(null, htmlPluginData);
            })
            .catch((err) => {
              callback(err);
            });
        }
      );
    });
  } else {
    compiler.plugin("compilation", (compilation, options) => {
      compilation.plugin(
        "html-webpack-plugin-before-html-processing",
        (htmlPluginData, callback) => {
          var html = htmlPluginData.html;
          inlineSource(html, self.options)
            .then((html) => {
              htmlPluginData.html = html;
              callback(null, htmlPluginData);
            })
            .catch((err) => {
              callback(err);
            });
        }
      );
    });
  }
};

module.exports = HtmlWebpackInlinePlugin;
