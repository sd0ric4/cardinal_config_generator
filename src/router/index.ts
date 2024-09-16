import { createRouter, createWebHistory } from 'vue-router'
import Sm4App from '@/components/Sm4App.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Sm4App
    },
    {
      path: '/config_generator',
      name: 'config_generator',
      component: () => import('@/components/JsonSchemaForm.vue')
    },
    {
      path: '/sm4',
      name: 'sm4',
      component: Sm4App
    }
  ]
})

export default router
