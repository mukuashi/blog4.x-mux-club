/*
 * Copyright (c) 2019-Now Asako Studio, All rights reseved.
 * @fileoverview | 公共 - Service
 * @Author: mukuashi | mukuashi@icloud.com
 * @version 0.1 | 2019-08-07 // Initial version.
 * @Date:   2019-08-07 18:20:27
 * @Last Modified by: mukuashi
 * @Last Modified time: 2020-03-19 17:25:20
 */
export default [
  {
    path: '/common/guide',
    name: 'guide',
    component: () => import('@/views/common'),
    meta: {
      title: 'Common Page'
    }
  }
]