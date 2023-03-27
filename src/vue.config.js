'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = '项目名称'

module.exports = {
  lintOnSave: process.env.NODE_ENV === 'development',
  // 路径别名
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
