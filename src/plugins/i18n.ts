import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    travelPlanner: {value: 'Travel Planner'},
    language: {value: 'Language'},
    username: { value: "User Name"},
    password: { value: "Password" },
    login: { value: "Sign In" },
    logout: { value: "Logout" },
    portal: { welcome: "Welcome to Travel Planner" },
    home : { value: "Home" },
    profile: { value: "Profile" },
    setting: { value: "Setting" },
    settings: { value: "settings" },
    travels: { value: "Travels" },
    newtravel: { value: "Start New Travel"},
    reports: { value: "reports" },
  },
  zh: {
    travelPlanner: {value: '旅行计划器'},
    language: {value: '语言'},
    username: { value: "用户名" },
    password: { value: "密码" },
    login: { value: "登录" },
    logout: { value: "退出" },
    portal: { welcome: "欢迎使用旅行计划器" },
    home: { value: "主页" },
    profile: { value: "我的" },
    setting: { value: "设置" },
    settings: { value: "设置" },
    travels: { value: "旅程" },
    newtravel: { value: "开始新的旅程"},
    reports: { value: "报告" },
  },
}

const i18n = createI18n({
  legacy: false,     // ✅ composition API mode
  globalInjection: true, // ✅ enables $t in ALL components without imports
  locale: 'zh',
  fallbackLocale: 'zh',
  messages,
})

export default i18n
