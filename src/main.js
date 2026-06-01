import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Dark, Notify } from 'quasar'
import router from './router'
import App from './App.vue'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import './styles/variables.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
    plugins: { Dark, Notify },
    config: {
        notify: {
            position: 'top',
        }
    }
})

app.mount('#app')
