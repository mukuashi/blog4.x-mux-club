// 添加css前缀
const autoprefixer = require('autoprefixer')({
  overrideBrowserslist: [
    '> 1%',
    'last 2 versions',
    'iOS >= 8',
    'Safari >= 8',
    'not ie <= 8'
  ]
})
// 处理容器宽高比
const aspectRatio = require('postcss-aspect-ratio-mini')()

// https://github.com/evrone/postcss-px-to-viewport/blob/master/README_CN.md
const pxToViewport = require('postcss-px-to-viewport')({
  unitToConvert: 'vpx',
  viewportWidth: 750,
  unitPrecision: 3,
  propList: ['*'],
  viewportUnit: 'vw',
  fontViewportUnit: 'vw',
  minPixelValue: 1,
  mediaQuery: false,
  replace: true,
  exclude: [],
  landscape: false,
  landscapeUnit: 'vw',
  landscapeWidth: 568
})

module.exports = {
  loader: 'postcss-loader',
  options: {
    plugins: [
      autoprefixer,
      aspectRatio,
      pxToViewport
    ]
  }
}
