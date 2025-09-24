import { createRouter } from 'vue-router'
import { createWebHistory } from 'vue-router'
// import { createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LoginPage from "@/pages/LoginPage.vue"
import PortalPage from "@/pages/PortalPage.vue"
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import MobileLayout from '@/layouts/MobileLayout.vue'
import Travels from '@/pages/Travels.vue'
import NewTravel from '@/pages/baidumap/NewTravel.vue'
import MobileNewTravel from '@/pages/mobile/baidumap/NewTravel.vue'

// Step 1: Simple utility function for device detection
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false; // Server-side rendering safety
  // Checks for common mobile identifiers in the User Agent
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/',
    component: isMobileDevice() ? MobileLayout : DefaultLayout,
    children: [
      { path: "travels", name: 'travels', component: Travels },
      { path: "newtravel", name: 'newtravel',
        component: isMobileDevice() ? MobileNewTravel : NewTravel },
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
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(), // 👈 use hash mode
  routes: routes,
})

export default router
