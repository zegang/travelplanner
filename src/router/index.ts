import { createRouter } from 'vue-router'
// import { createWebHistory } from 'vue-router'
import { createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LoginPage from "@/pages/LoginPage.vue"
import PortalPage from "@/pages/PortalPage.vue"
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Travels from '@/pages/Travels.vue'
import NewTravel from '@/pages/baidumap/NewTravel.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: "travels", name: 'travels', component: Travels },
      { path: "newtravel", name: 'newtravel', component: NewTravel },
      { path: "portal", name: 'portal', component: PortalPage },
    ],
  },
  // Redirect root `/` to login
  {
    path: '/',
    redirect: '/login',
  },
  // Catch-all fallback (optional)
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(), // 👈 use hash mode
  routes: routes,
})

export default router
