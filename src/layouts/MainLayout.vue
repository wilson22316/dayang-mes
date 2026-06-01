<template>
    <q-layout view="hHh lpR fFf">
        <q-header bordered class="top-navbar">
            <TheTopNavbar />
        </q-header>

        <q-drawer v-model="drawer" side="left" bordered :width="192" :breakpoint="0" persistent>
            <TheSidebar />
        </q-drawer>

        <q-page-container>
            <q-page>
                <router-view />
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import TheTopNavbar from '@/components/TheTopNavbar.vue'
import TheSidebar from '@/components/TheSidebar.vue'

const drawer = ref(true)
</script>

<style scoped>
.top-navbar {
    background-color: #ffffff !important;
    color: var(--c-fg);
}

.body--dark .top-navbar {
    background-color: #0f1724 !important;
}
</style>
