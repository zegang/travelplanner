import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify' 

const app = createApp(App)

router.beforeEach((to, from, next) => {
  if (to.fullPath === '/' || to.fullPath === '') {
    next('/login')
  } else {
    next()
  }
})

app.use(vuetify)
app.use(router)

app.mount('#app')
