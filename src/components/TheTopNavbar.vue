<template>
    <div class="navbar">
        <div class="navbar-left">
            <div class="logo">CAPTAIN</div>
            <div class="logo-sub">SINCE 1978</div>
        </div>
        <div class="navbar-center">
            <div class="title-pill">{{ title }}</div>
        </div>
        <div class="navbar-right">
            <button class="icon-btn" @click="themeStore.toggleTheme()" :title="themeStore.theme === 'dark' ? '切換淺色模式' : '切換深色模式'">
                <Sun v-if="themeStore.theme === 'dark'" :size="20" />
                <Moon v-else :size="20" />
            </button>
            <button class="icon-btn notification-btn">
                <Bell :size="20" />
                <span class="badge">0</span>
            </button>
            <button class="icon-btn">
                <Settings :size="20" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, Settings, Sun, Moon } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme.js'

const route = useRoute()
const themeStore = useThemeStore()

const pageTitles = {
    '/': '機台監控',
    '/work-records': '報工紀錄',
    '/alerts': '異常警報',
}

const title = computed(() => {
    if (route.path.startsWith('/machine/')) return '機台詳情'
    return pageTitles[route.path] ?? '主控台'
})
</script>

<style scoped>
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 0 24px;
    background-color: transparent;
    border-bottom: 1px solid var(--c-border);
}

.navbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo {
    font-size: 20px;
    font-weight: 600;
    color: var(--c-fg);
}

.logo-sub {
    font-size: 12px;
    color: var(--c-muted-fg);
}

.navbar-center {
    flex: 1;
    display: flex;
    justify-content: center;
}

.title-pill {
    border-radius: var(--radius);
    padding: 8px 24px;
    min-width: 300px;
    text-align: center;
    background-color: var(--c-secondary);
    color: var(--c-fg);
}

.navbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.icon-btn {
    position: relative;
    padding: 8px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: var(--radius);
    color: var(--c-fg);
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-btn:hover {
    background-color: var(--c-secondary);
}

.notification-btn .badge {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    background-color: var(--c-destructive);
    color: #fff;
    font-size: 12px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
