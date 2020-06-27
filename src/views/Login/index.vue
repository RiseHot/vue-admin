<template>
	<div id="login">
		<div class="login-wrap">
			<ul class="menu-tab">
				<li :class="{'current': item.current}" v-for="item in menuTab" :key="item.id" @click="toggleMenu(item)">{{item.txt}}</li>
			</ul>
			<!-- 表单 start-->
			<el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" class="login-form" size="medium">

				<el-form-item prop="username" class="item-from">
					<label for="username">邮箱</label>
					<el-input id="username" type="email" v-model="ruleForm.username" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item prop="password" class="item-from">
					<label for="password">密码</label>
					<el-input id="password" minlength="6" maxlength="20" type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item prop="passwords" class="item-from" v-if="model === 'register'">
					<label for="passwords">确认密码</label>
					<el-input id="passwords" minlength="6" maxlength="20" type="password" v-model="ruleForm.passwords" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item prop="code" class="item-from">
					<label for="code">验证码</label>
					<el-row :gutter="10">
						<el-col :span="15">
							<el-input id="code" type="text" minlength="6" maxlength="6" v-model="ruleForm.code"></el-input>
						</el-col>
						<el-col :span="9">
							<el-button type="success" class="block" @click="getSms()" :disabled="codeButtonStatus.status">{{ codeButtonStatus.text }}</el-button>
						</el-col>
					</el-row>

				</el-form-item>

				<el-form-item>
					<el-button type="danger" @click="submitForm('loginForm')" class="login-btn block" :disabled="loginButtonStatus">{{ model === 'login' ? "登录" : "注册" }}</el-button>
				</el-form-item>
			</el-form>
		</div>

	</div>
</template>

<script>
	import sha1 from "js-sha1";
	import {GetSms,Register,Login} from "@/api/login";
	import {reactive,ref,onMounted} from '@vue/composition-api';
	import {stripscript,validateEmail,validatePass,validateCode} from '@/utils/validate';

	export default {
		name: 'login',
		// setup(props, context){
		setup(props, {
			refs,
			root
		}) {
			//验证邮箱
			let validateUsername = (rule, value, callback) => {
				//正则验证
				if (value === '') {
					callback(new Error('请输入邮箱'));
				} else if (validateEmail(value)) {
					callback(new Error('邮箱格式有误'));
				} else {
					callback(); //true
				}
			};
			//验证密码
			let validatePassword = (rule, value, callback) => {

				//过滤后的数据
				ruleForm.password = stripscript(value)
				value = ruleForm.password
				if (value === '') {
					callback(new Error('请输入密码'));
				} else if (validatePass(value)) {
					callback(new Error('密码6-20位，数字+字母!'));
				} else {
					callback();
				}
			};
			//验证重复密码
			let validatePasswords = (rule, value, callback) => {
				// if (model.value === 'login'){ callback(); }
				//过滤后的数据
				ruleForm.passwords = stripscript(value)
				value = ruleForm.passwords
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value != ruleForm.password) {
					callback(new Error('两次密码不相等!'));
				} else {
					callback();
				}
			};
			//验证验证码
			let checkCode = (rule, value, callback) => {
				if (value === '') {
					return callback(new Error('请输入验证码'));
				} else if (validateCode(value)) {
					return callback(new Error('验证码错误！'))
				} else {
					callback();
				};

			};
			//声明数据
			//放置data数据 生命周期 自定义函数
			const menuTab = reactive([{
					txt: '登录',
					current: true,
					type: 'login'
				},
				{
					txt: '注册',
					current: false,
					type: 'register'
				}
			])
			//模块值
			const model = ref('login');
			//登录按钮禁用状态
			const loginButtonStatus = ref(true);
			//验证码按钮状态
			const codeButtonStatus = reactive({
				status: false,
				text: "获取验证码"
			})
			//倒计时
			const timer = ref(null);


			//表单数据
			const ruleForm = reactive({
				username: '',
				password: '',
				code: '',
				passwords: '',
			})
			//表单的验证
			const rules = reactive({
				username: [{validator: validateUsername,trigger: 'blur'}],
				password: [{validator: validatePassword,trigger: 'blur'}],
				code: [{validator: checkCode,trigger: 'blur'}],
				passwords: [{validator: validatePasswords,trigger: 'blur'}]
			})
			//声明函数
			//切换模块
			const toggleMenu = (data => {

				menuTab.forEach(elem => {
					elem.current = false
				});
				//高光
				data.current = true
				//修改模块值
				model.value = data.type
				//重置表单
				reseFromData()
				clearCountDown()
			})
			//清除表单数据
			const reseFromData = (() => {
				refs.loginForm.resetFields();
			})
			//更新按钮的状态
			const updataButtonStatus = ((params) => {
				codeButtonStatus.status = params.status;
				codeButtonStatus.text = params.text;
			})
			//获取验证码
			const getSms = (() => {
				//进行提示
				if (!ruleForm.username) {
					root.$message.error('邮箱不能为空！');
					return false
				}
				if (validateEmail(ruleForm.username)) {
					root.$message.error('邮箱格式错误！');
					return false
				}
				//验证码携带参数
				let requestData = {
					code: ruleForm.username,
					module: model.value
				}
				//修改验证码按钮状态
				updataButtonStatus({
					status: true,
					text: "发送中"
				})
				
				setTimeout(() => {
					//后台响应
					GetSms(requestData).then(response => {
						let data = response.data
						root.$message({
							message: data.msg,
							type: 'success'
						})
						//启用登录或注册按钮
						loginButtonStatus.value = false
						//调用定时器 这有个BUG
						countDown(30)
					}).catch(error => {

					})
				})
			})
			//提交表单
			const submitForm = (formName => {
				refs[formName].validate((valid) => {
					//表单验证通过
					if (valid) {
						model.value === "login" ? login() : register()
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			})
			//登录
			const login = (() => {
				let requestData = {
					username: ruleForm.username,
					password: sha1(ruleForm.password),
					code: sha1(ruleForm.code)
				}
				Login(requestData).then(response => {
					//跳转
					root.$router.push({
						name: "Console"
					})
				}).catch(error => {

				})
			})
			//注册
			const register = (() => {
				let requestData = {
					username: ruleForm.username,
					password: sha1(ruleForm.password),
					code: sha1(ruleForm.code)
				}
				Register(requestData).then(response => {
					let data = response.data
					root.$message({
						message: data.msg,
						type: 'success'
					})
					//成功之后执行
					toggleMenu(menuTab[0])
					clearCountDown()
				}).catch(error => {
					//失败执行什么
				})
			})
			//倒计时
			const countDown = ((number) => {
				//setTimout:clearTimeout(val) 只执行一次
				//setInterval:clearInterval(val) 循环执行，需要条件才会停止
				//判断定时器是否存在
				if (timer.value) {
					clearInterval(timer.value);
				}
				let time = number
				timer.value = setInterval(() => {
					time--;
					if (time === 0) {
						clearInterval(timer.value)
						updataButtonStatus({
							status: false,
							text: "再次发送"
						})
					} else {
						codeButtonStatus.text = `倒计时${time}秒`
					}
				}, 1000)
			})
			//清除倒计时
			const clearCountDown = (() => {
				//还原验证码默认状态
				updataButtonStatus({
					status: false,
					text: "获取验证码"
				})
				//清除倒计时
				clearInterval(timer.value)
			})
			/**
			 * 生命周期
			 */
			//挂载完成后
			onMounted(() => {

			})

			return {
				menuTab,
				model,
				toggleMenu,
				submitForm,
				ruleForm,
				rules,
				getSms,
				loginButtonStatus,
				codeButtonStatus

			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#login {
		height: 100vh;
		background-color: #344a5f;
	}

	.login-wrap {
		width: 330px;
		margin: 0 auto;
	}

	.menu-tab {
		text-align: center;

		li {
			display: inline-block;
			width: 88px;
			line-height: 36px;
			font-size: 14px;
			color: #fff;
			border-radius: 2px;
			cursor: pointer;
		}

		.current {
			background-color: rgba(0, 0, 0, .1);
		}
	}

	.login-form {
		margin-top: 29px;

		label {
			display: block;
			margin-bottom: 3px;
			font-size: 14px;
			color: #fff;
		}

		.item-from {
			margin-bottom: 13px;
		}

		.block {
			display: block;
			width: 100%;
		}

		.login-btn {
			margin-top: 19px;
		}
	}
</style>
