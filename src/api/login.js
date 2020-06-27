import service from '@/utils/request'
//获取验证码的接口
export function GetSms(data){
	return service.request({
		method:"post",
		url: "/getSms",
		data
	})
}
//获取用户角色

//登录
export function Login(data){
	return service.request({
		method: "post",
		url: "login",
		data
	})
}
//注册
export function Register(data){
	return service.request({
		method: "post",
		url: "register",
		data
	})
}