import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import axios from 'axios'
import VueAxios from 'vue-axios'
import treeTable from 'vue-table-with-tree-grid'
import '@/assets/Global.css'


// 配置富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */ )

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

// 格式化时间过滤器
Vue.filter("formattingTime", function(timeData) {
    let time = new Date(timeData);
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();
    month = month > 9 ? month : '0' + month;
    date = date > 9 ? date : '0' + date;
    h = h > 9 ? h : '0' + h;
    m = m > 9 ? m : '0' + m;
    s = s > 9 ? s : '0' + s;
    return `${year}-${month}-${date} ${h}:${m}:${s}`
})

Vue.use(VueAxios, axios)
Vue.config.productionTip = false
Vue.component('tree-table', treeTable)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')