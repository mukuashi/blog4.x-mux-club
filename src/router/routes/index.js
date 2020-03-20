/*
 * Copyright (c) 2019-Now Asako Studio, All rights reseved.
 * @fileoverview | Service Index | 独立业务合并
 * @Author: mukuashi | mukuashi@icloud.com
 * @version 0.1 | 2019-08-07 // Initial version.
 * @Date:   2019-08-07 18:20:27
 * @Last Modified by: mukuashi
 * @Last Modified time: 2020-03-17 16:32:53
 */
// route-level async code splitting ( ()=>import() )
// 公共页面
import common from './common'
//
import home from './home'
export default [
	...common,
	...home
]
