import service from '@/utils/request'
//获取验证码的接口
export function GetSms(data){
	service.request({
		method:"post",
		url: "/getSms",
		data
	})
}
//获取用户角色

//登录

//注册