import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import axios from 'axios'
import VueAxios from 'vue-axios'
import treeTable from 'vue-table-with-tree-grid'
import '@/assets/Global.css'

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // Vue.prototype.$http = axios
    // 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    // 获取 token 如果有，向请求头添加token
    let token_ = window.sessionStorage.getItem('token_');
    if (token_) {
        config.headers.Authorization = token_;
        return config;
    }
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

Vue.use(VueAxios, axios)
Vue.config.productionTip = false
Vue.component('tree-table', treeTable)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')