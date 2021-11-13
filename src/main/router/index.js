import Vue from 'vue'
import VueRouter from 'vue-router'
import Whatsapp from '../views/Whatsapp.vue'
import About from "../views/About.vue";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Whatsapp',
        component: Whatsapp
    },
    {
        path: '/about',
        name: 'About',
        component: About
    }
]

const router = new VueRouter({
    routes
})

export default router
