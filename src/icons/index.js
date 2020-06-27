import Vue from "vue";
import SvgIcon from "./SvgIcon.vue"
//全局自定义组件 配置'vue': 'vue/dist/vue.js',
Vue.component('svg-icon', SvgIcon);

//参数1、读取目录 2、是否遍历子级目录 3、定义遍历文件规则
const req = require.context("./svg", false, /\.svg$/)
const requireAll = requireContext => {
	return requireContext.keys().map(requireContext)
}
requireAll(req)