import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export const useThemeStore = defineStore('theme', () => {
    const $q = useQuasar()
    const theme = ref($q.dark.isActive ? 'dark' : 'light')

    function toggleTheme() {
        $q.dark.toggle()
        theme.value = $q.dark.isActive ? 'dark' : 'light'
    }

    return { theme, toggleTheme }
})
