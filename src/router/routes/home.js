/*
 * Copyright (c) 2019-Now Asako Studio, All rights reseved.
 * @fileoverview | 公共 - Service
 * @Author: mukuashi | mukuashi@icloud.com
 * @version 0.1 | 2019-08-07 // Initial version.
 * @Date:   2019-08-07 18:20:27
 * @Last Modified by: mukuashi
 * @Last Modified time: 2020-03-17 16:32:33
 */
export default [
	{
		path: '/',
		name: 'home',
		component: () => import('@/views/home'),
		meta: {
			title: 'Home Page'
		}
	}
]