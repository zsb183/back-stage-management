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
    },

    {
        path: '/home',
        component: () =>
            import ('../views/Home.vue'),
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
                    import ('../components/goods/Goods.vue')
            },
            {
                path: '/goods/add',
                component: () =>
                    import ('../components/goods/addGoods.vue'),
            },
            {
                path: '/params',
                component: () =>
                    import ('../components/goods/Params.vue')
            },
            {
                path: '/categories',
                component: () =>
                    import ('../components/goods/Categories.vue')
            },
            {
                path: '/orders',
                component: () =>
                    import ('../components/order/Orders.vue')
            },
            {
                path: '/reports',
                component: () =>
                    import ('../components/report/Reports.vue')
            },
        ]

    }
]

const router = new VueRouter({
    routes
})

// ??????????????????????????????
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