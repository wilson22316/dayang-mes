<template>
    <nav class="sidebar">
        <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="sidebar-item"
            :class="{ active: isActive(item.path) }"
        >
            <component :is="item.icon" :size="20" />
            <span>{{ item.name }}</span>
        </router-link>
    </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Monitor, ClipboardList, AlertTriangle } from 'lucide-vue-next'

const route = useRoute()

const menuItems = [
    { name: '機台監控', icon: Monitor, path: '/' },
    { name: '報工紀錄', icon: ClipboardList, path: '/work-records' },
    { name: '異常警報', icon: AlertTriangle, path: '/alerts' },
]

function isActive(path) {
    if (path === '/') return route.path === '/'
    return route.path.startsWith(path)
}
</script>

<style scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px 0;
    background-color: var(--c-sidebar);
}

.sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    color: var(--c-sidebar-fg);
    text-decoration: none;
    transition: background-color 0.2s, color 0.2s;
    font-size: 16px;
}

.sidebar-item:hover {
    background-color: var(--c-sidebar-accent);
}

.sidebar-item.active {
    background-color: var(--c-sidebar-primary);
    color: var(--c-sidebar-primary-fg);
}
</style>
