import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
}, {
    path: '/login',
    component: Login
}, {
    path: '/home',
    component: () =>
        import ('../views/home.vue'),
    children: [{
            path: '/home',
            redirect: '/welcome'
        },
        {
            path: '/welcome',
            component: () =>
                import ('../components/Welcome.vue')
        }, {
            path: '/users',
            component: () =>
                import ('../components/User/Users.vue')
        },
        {
            path: '/roles',
            component: () =>
                import ('../components/power/Roles.vue')
        }, {
            path: '/rights',
            component: () =>
                import ('../components/power/Rights.vue')
        },
        {
            path: '/goods',
            component: () =>
                import ('../components/Goods.vue')
        },
        {
            path: '/params',
            component: () =>
                import ('../components/Params.vue')
        },
        {
            path: '/categories',
            component: () =>
                import ('../components/Categories.vue')
        },
        {
            path: '/orders',
            component: () =>
                import ('../components/Orders.vue')
        },
        {
            path: '/reports',
            component: () =>
                import ('../components/Reports.vue')
        },
    ]

}]

const router = new VueRouter({
    routes
})

// 添加全局路由前置守卫
router.beforeEach((to, from, next) => {

    const token_ = window.sessionStorage.getItem('token_');
    if (to.fullPath == '/login') {
        next();
    } else {
        if (!token_) {
            next('/login');
        } else {
            next();
        }
    }


})

export default router