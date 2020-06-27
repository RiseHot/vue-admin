import axios from 'axios';
import { Message } from 'element-ui';

//创建axios,赋值给service
const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devapi';
const service = axios.create({
	 baseURL: BASEURL, //请求地址
	 timeout: 10000, //超时时间
});


//添加请求拦截器
service.interceptors.request.use(function (config){
	//请求之前token userid 传给后端
	
	return config;
}, function (error) {
	//请求错误
	return Promise.reject(error);
});

//添加响应拦截器
service.interceptors.response.use(function (response){
	//对响应数据做些什么
	let data = response.data
	if(data.code !== 200){		
		Message.error(data.msg)
		return Promise.reject(data);
	}else{
		return response;
	}

}, function (error) {
	//响应错误
	return Promise.reject(error);
});

export default service; //default 不能同时存在多个 文件引入不需要花括号