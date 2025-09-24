<template>
  <v-navigation-drawer app v-model="drawer" :rail="rail" permanent>
    <!-- Sidebar content in a column -->
    <div class="d-flex flex-column fill-height">
      <!-- Top menu -->
      <div>
        <v-list-item
          :prepend-icon="mdiMenu"
          title="Menu"
          @click="rail = !rail"
        />
        <v-divider />

        <!-- Scrollable nav items -->
        <v-list density="compact" nav class="flex-grow-1 overflow-y-auto">
          <v-list-item
            v-for="item in items"
            :key="item.value"
            :title="$t(item.title + '.value')"
            :prepend-icon="item.icon"
            @click="go(item.value)"
          />
        </v-list>
      </div>

      <!-- Bottom pinned account -->
      <div class="mt-auto">
        <v-divider />
        <v-list nav>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/men/32.jpg"
            title="John Doe"
            subtitle="john@example.com"
          >
            <template #append>
              <v-menu>
                <template #activator="{ props }">
                  <v-btn :icon="mdiDotsVertical" v-bind="props" />
                </template>
                <v-list>
                  <v-list-item @click="go('profile')" :prepend-icon="mdiAccount">
                    {{ $t('profile.value') }}
                  </v-list-item>
                  <v-list-item @click="go('settings')" :prepend-icon="mdiCog">
                    {{ $t('setting.value') }}
                  </v-list-item>
                  <v-list-item :prepend-icon="mdiLogout" @click="logout">
                    {{ $t('logout.value') }}
                  </v-list-item>
                  <v-list-item>
                    <v-menu>
                      <template #activator="{ props }">
                        <v-btn v-bind="props" :icon="mdiTranslate"></v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="$i18n.locale = 'en'">English</v-list-item>
                        <v-list-item @click="$i18n.locale = 'zh'">中文</v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import {
  mdiAccount, mdiMenu, mdiDotsVertical, mdiCog, mdiLogout, mdiTranslate,
  mdiViewDashboard, mdiAirplane, mdiFileChart, mdiLogin, mdiWalletTravel
} from '@mdi/js'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ drawer: boolean }>()
const emit = defineEmits(['update:drawer'])

const drawer = ref(props.drawer)
watch(() => props.drawer, (val) => (drawer.value = val))

const rail = ref(false)

const items = [
  { title: 'login', value: 'login', icon: mdiLogin },
  { title: 'travels', value: 'travels', icon: mdiViewDashboard },
  { title: 'newtravel', value: 'newtravel', icon: mdiAirplane },
  { title: 'Travel Planner', value: 'portal', icon: mdiWalletTravel },
  { title: 'reports', value: 'reports', icon: mdiFileChart },
]

const router = useRouter()
function go(page: string) {
  router.push({ name: page })
}
function logout() {
  router.push('/login')
}
</script>
