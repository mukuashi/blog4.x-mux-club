/*
 * Copyright (c) 2019-Now Asako Studio, All rights reseved.
 * @fileoverview | 平台 request base
 * @Author: mukuashi | mukuashi@icloud.com
 * @version 0.1 | 2019-03-01 // Initial version.
 * @version 0.2 | 2019-05-30 // 优化 success&error toast干掉原有opt策略.
 * @Date:   2019-05-16 18:20:27
 * @Last Modified by: mukuashi
 * @Last Modified time: 2020-03-18 14:48:34
 */
import Vue from 'vue'
import axios from 'axios'
import app from '@/config'

const isServer = process.env.VUE_ENV === 'server'

function handleHttpSuccess(vm) {
  if (!vm.res.ok && vm.res.errorCode !== 0) {
    if (isServer) {
      throw new Error(`errorCode:${ vm.res.errorCode } msg:${ vm.res.text }`)
    } else {
      vm.opt && vm.opt.$toast(vm.res.text)
    }
    return false
  }
  return true
}
function handleHttpError(vm) {
  if (isServer) {
    throw new Error(`errorCode:${ vm.errorCode } msg:${ vm.msg }`)
  } else {
    return vm.opt && vm.opt.$toast(vm.msg || '服务器开小差了 ~')
  }
}
export default {
  request(opt) {
    opt = Object.assign(opt, Vue.prototype)
    const config = {
      method: opt.method || 'get',
      baseURL: app.hosts[opt.type] || app.hosts.api,
      url: opt.url,
      data: opt.data,
      params: opt.params,
      withCredentials: opt.withCredentials || false // 是否允许携带cookie
    }
    if (opt.headers) {
      config.headers = opt.headers
    }
    return axios(config).then((res) => {
      if (!handleHttpSuccess({ opt, res: res.data })) {
        return
      }
      if (opt.done) {
        // done回调里不能有window等客户端属性
        opt.done(res.data)
      }
      return res.data
    }).catch((err) => {
      console.error(err)
      if (err.response) {
        const errorCode = err.response.data.errorCode
        const msg = err.response.data.text
        handleHttpError({ opt, msg, errorCode })
        if (opt.fail) {
          // fail回调里不能有window等客户端属性
          opt.fail(err.response)
        }
        return err.response.data
      } else {
        handleHttpError(opt)
      }
    }).catch(opt.fail)
  }
}