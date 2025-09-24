import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi, aliases as vuetifyAliases } from 'vuetify/iconsets/mdi-svg'
import {
  mdiAccount, mdiMagnify, mdiFilter, mdiMenu,
  mdiDotsVertical, mdiTranslate, mdiLock,
  mdiHome, mdiCog
} from '@mdi/js'

const customAliases = {
  ...vuetifyAliases,
  account: mdiAccount,
  lock: mdiLock,
  magnify: mdiMagnify,
  filter: mdiFilter,
  menu: mdiMenu,
  dotsVertical: mdiDotsVertical,
  translate: mdiTranslate,
  home: mdiHome,
  cog: mdiCog
}

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: customAliases,
    sets: { mdi },
  },
})

export default vuetify
