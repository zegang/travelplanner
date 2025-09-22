import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from "@/pages/LoginPage.vue"
import PortalPage from "@/pages/PortalPage.vue"

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginPage },
  { path: "/portal", component: PortalPage },
];

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(), // 👈 use hash mode
  routes: routes,
})

export default router
