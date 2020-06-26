<template>
	<div id="login">
		<div class="login-wrap">
			<ul class="menu-tab">
				<li :class="{'current': item.current}" v-for="item in menuTab" :key="item.id" @click="toggleMenu(item)">{{item.txt}}</li>
			</ul>
			<!-- 表单 start-->
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="login-form" size="medium">
				
				<el-form-item  prop="username" class="item-from">
					<label >邮箱</label>
					<el-input type="email" v-model="ruleForm.username" autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item  prop="password" class="item-from">
					<label >密码</label>
					<el-input minlength="6" maxlength="20" type="text" v-model="ruleForm.password" autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item  prop="passwords" class="item-from" v-if="model === 'register'">
					<label >确认密码</label>
					<el-input minlength="6" maxlength="20" type="text" v-model="ruleForm.passwords" autocomplete="off"></el-input>
				</el-form-item>
				
				<el-form-item  prop="code" class="item-from">
					<label >验证码</label>
					<el-row :gutter="10">
					  <el-col :span="15">
							<el-input minlength="6" maxlength="6" v-model.number="ruleForm.code"></el-input>
						</el-col>
					  <el-col :span="9">
							<el-button type="success" class="block" @click="getSms()">获取验证码</el-button>
						</el-col>
					</el-row>
					
				</el-form-item>
				
				<el-form-item>
					<el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">提交</el-button>
				</el-form-item>
			</el-form>
		</div>

	</div>
</template>

<script>
import { GetSms } from "@/api/login"
import { reactive, ref, onMounted } from '@vue/composition-api'
import { stripscript, validateEmail, validatePass, validateCode } from '@/utils/validate'

export default {
		name: 'login',
		// setup(props, context){
		setup(props, { refs }){
			//验证邮箱
			let validateUsername = (rule, value, callback) => {
				 //正则验证
				if (value === '') {
					callback(new Error('请输入邮箱'));
				} else if(validateEmail(value)) {
					callback(new Error('邮箱格式有误'));
				}else{	
					callback();//true
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
				}else if(validateCode(value)){
					return callback(new Error('验证码错误！'))
				}else{
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
				const model = ref('login')
				//表单数据
				const ruleForm = reactive({
					username: '',
					password: '',
					code: '',
					passwords: '',
				})
				//表单的验证
				const rules = reactive({
					username: [{
						validator: validateUsername,
						trigger: 'blur'
					}],
					password: [{
						validator: validatePassword,
						trigger: 'blur'
					}],
					code: [{
						validator: checkCode,
						trigger: 'blur'
					}],
					passwords: [{
						validator: validatePasswords,
						trigger: 'blur'
					}]
				})
				//声明函数
				const toggleMenu = (data => {
					
					menuTab.forEach(elem => {
						elem.current = false
				});
					//高光
					data.current = true
					//修改模块值
					model.value = data.type
				})
				//获取验证码
				const getSms = (() => {
					let data = {
						code: ruleForm.username
					}
					GetSms(data)
				})
				//提交表单
				const submitForm = (formName => {		
					refs[formName].validate((valid) => {
						if (valid) {
							alert('submit!');
						} else {
							console.log('error submit!!');
							return false;
						}
					})
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
					getSms
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
