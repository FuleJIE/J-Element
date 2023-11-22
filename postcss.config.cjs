/* eslint-env node */
module.exports = {
  plugins: [
    // 渐进式开发，可选的插入插件
    require('postcss-nested'),
    require('postcss-each-variables'),
    require('postcss-each')({
      plugins: {
        beforeEach: [
          require('postcss-for'),
          require('postcss-color-mix'),
        ]
      }
    }),
  ]
}