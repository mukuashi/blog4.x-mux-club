/*
 * Copyright (c) 2019-Now Asako Studio, All rights reseved.
 * @fileoverview | 公共module，主要用于控制一些Layout、系统配置项等
 * @version 0.1 | 2018-12-07 // Initial version.
 * @Date:   2018-12-07 18:20:27
 * @Last Modified by: mukuashi
 * @Last Modified time: 2020-03-20 18:55:33
 */
//
export default {
  state: {
    layoutDrawerModal: false // 布局开关管理
  },
  // 同步事务，增删改查 handler，类似dva里的reducers纯函数
  mutations: {
    initializeDrawer(state, payload) {
      state[payload.type] = payload.value;
    }
  },
  // 类似于dva里的effects，异步请求和调mutations都支持，async api
  actions: {}
};
