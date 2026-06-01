import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            { path: '', name: 'machine-monitoring', component: () => import('@/pages/MachineMonitoring.vue') },
            { path: 'work-records', name: 'work-records', component: () => import('@/pages/WorkRecords.vue') },
            { path: 'alerts', name: 'alerts', component: () => import('@/pages/AlertsPage.vue') },
            { path: 'machine/:machineId', name: 'machine-detail', component: () => import('@/pages/MachineDetail.vue') },
        ],
    },
]

export default createRouter({
    history: createWebHistory(),
    routes,
})
