import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)   // 👈 register i18n
app.use(vuetify)

router.beforeEach((to, from, next) => {
  if (to.fullPath === '/' || to.fullPath === '') {
    next('/login')
  } else {
    next()
  }
})

app.use(router)
app.mount('#app')
