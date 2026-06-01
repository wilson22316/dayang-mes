<template>
    <div class="page">
        <!-- Stats Row -->
        <div class="stats-grid">
            <div v-for="s in stats" :key="s.label" class="stat-card">
                <div class="stat-icon" :style="{ background: s.bg }">
                    <component :is="s.icon" :size="18" :color="s.color" />
                </div>
                <div class="stat-content">
                    <div class="stat-label">{{ s.label }}</div>
                    <div class="stat-value" :style="{ color: s.color }">
                        {{ s.value }} <span class="stat-unit">台</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Category Tabs -->
        <q-tabs v-model="tab" active-color="primary" indicator-color="primary" align="left" narrow-indicator class="q-mb-md tab-bar">
            <q-tab v-for="c in categories" :key="c.id" :name="c.id" :label="c.name" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="panels">
            <q-tab-panel v-for="c in categories" :key="c.id" :name="c.id" class="q-pa-none">
                <div class="machine-grid">
                    <MachineCard
                        v-for="m in enrichedMachines(c.id)"
                        :key="m.id"
                        :machine="m"
                        :show-work-report="c.id !== 'facility'"
                        :category-id="c.id"
                    />
                </div>
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Cpu, Play, Pause, PowerOff, Wifi, WifiOff } from 'lucide-vue-next'
import { useWorkRecordsStore } from '@/stores/workRecords.js'
import MachineCard from '@/components/MachineCard.vue'

const store = useWorkRecordsStore()

/* Initial tab from navigation state */
const initialTab = window.history.state?.tab ?? 'rubber'
const tab = ref(initialTab)

const categories = [
    { id: 'rubber', name: '製膠' },
    { id: 'coating', name: '塗佈' },
    { id: 'processing', name: '本業加工' },
    { id: 'cover', name: 'COVER加工' },
    { id: 'lamination', name: '淋膜' },
    { id: 'facility', name: '廠務' },
]

const machines = {
    rubber: [
        { id: 'R001', name: '製膠攪拌機', location: 'A棟1樓', status: 'running', communicationStatus: 'normal' },
    ],
    coating: [
        { id: 'C001', name: '調膠1', location: 'B棟1樓', status: 'running', communicationStatus: 'normal' },
        { id: 'C003', name: '調膠2', location: 'B棟1樓', status: 'standby', communicationStatus: 'normal' },
        { id: 'C004', name: '調膠3', location: 'B棟1樓', status: 'running', communicationStatus: 'normal' },
        { id: 'C005', name: '調膠4', location: 'B棟1樓', status: 'standby', communicationStatus: 'normal' },
        { id: 'C002', name: '塗佈機1', location: 'B棟1樓', status: 'standby', communicationStatus: 'normal' },
        { id: 'C006', name: '塗佈機2', location: 'B棟1樓', status: 'running', communicationStatus: 'normal' },
    ],
    processing: [
        { id: 'P001', name: '熱切分條機 (E-17)', location: 'C棟1樓', status: 'running', communicationStatus: 'normal' },
        { id: 'P002', name: '裁切設備 (E-11)', location: 'C棟1樓', status: 'standby', communicationStatus: 'normal' },
        { id: 'P004', name: '裁切設備 (E-12)', location: 'C棟1樓', status: 'running', communicationStatus: 'normal' },
        { id: 'P003', name: '複捲設備', location: 'C棟2樓', status: 'stopped', communicationStatus: 'error' },
    ],
    cover: [
        { id: 'CV001', name: '分條機 (G-01)', location: 'D棟1樓', status: 'running', communicationStatus: 'normal' },
        { id: 'CV005', name: '分條機 (G-02)', location: 'D棟1樓', status: 'standby', communicationStatus: 'normal' },
        { id: 'CV006', name: '分條機 (G-03)', location: 'D棟1樓', status: 'running', communicationStatus: 'normal' },
        { id: 'CV002', name: '貼合機1', location: 'D棟1樓', status: 'standby', communicationStatus: 'normal' },
        { id: 'CV007', name: '貼合機2', location: 'D棟1樓', status: 'running', communicationStatus: 'normal' },
        { id: 'CV004', name: '薄膜斷裁機', location: 'D棟2樓', status: 'stopped', communicationStatus: 'normal' },
    ],
    lamination: [
        { id: 'L001', name: '淋膜機', location: 'E棟1樓', status: 'running', communicationStatus: 'normal' },
        { id: 'L002', name: '薄膜複捲機', location: 'E棟1樓', status: 'standby', communicationStatus: 'normal' },
    ],
    facility: [
        { id: 'F001', name: '廠務設備', location: 'F棟地下室', status: 'running', communicationStatus: 'normal' },
        { id: 'F002', name: '主鍋爐溫度', location: 'F棟1樓', status: 'running', communicationStatus: 'normal' },
        { id: 'F003', name: 'RTO PLC', location: 'F棟頂樓', status: 'running', communicationStatus: 'normal' },
    ],
}

const allMachines = Object.values(machines).flat()

const stats = computed(() => {
    const total = allMachines.length
    const running = allMachines.filter(m => m.status === 'running').length
    const standby = allMachines.filter(m => m.status === 'standby').length
    const stopped = allMachines.filter(m => m.status === 'stopped').length
    const commOk = allMachines.filter(m => m.communicationStatus === 'normal').length
    const commErr = total - commOk
    return [
        { label: '機台總數', value: total, icon: Cpu, bg: 'rgba(0,194,255,0.08)', color: '#00c2ff' },
        { label: '運轉中', value: running, icon: Play, bg: 'rgba(16,185,129,0.08)', color: '#10b981' },
        { label: '待機中', value: standby, icon: Pause, bg: 'rgba(251,191,36,0.08)', color: '#fbbf24' },
        { label: '停機中', value: stopped, icon: PowerOff, bg: 'rgba(248,113,113,0.08)', color: '#f87171' },
        { label: '通訊正常', value: commOk, icon: Wifi, bg: 'rgba(0,194,255,0.08)', color: '#00c2ff' },
        { label: '通訊異常', value: commErr, icon: WifiOff, bg: 'rgba(249,115,22,0.08)', color: '#f97316' },
    ]
})

/* Enrich machine objects with active work order info */
function enrichedMachines(categoryId) {
    return (machines[categoryId] ?? []).map(m => {
        const rec = store.activeRecords.find(r => r.machineId === m.id)
        return { ...m, workOrder: rec?.workOrder, startTime: rec?.startTime }
    })
}
</script>

<style scoped>
.page { padding: 24px; }
.stats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card {
    display: flex; align-items: center; gap: 16px;
    background-color: var(--c-card); border: 1px solid var(--c-border); border-radius: 8px; padding: 14px 16px;
}
.stat-icon { width: 38px; height: 38px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-content { display: flex; flex-direction: column; gap: 2px; }
.stat-value { font-size: 20px; font-weight: 600; line-height: 1.2; display: flex; align-items: baseline; gap: 4px; }
.stat-unit { font-size: 13px; font-weight: 400; }
.stat-label { font-size: 12px; color: var(--c-muted-fg); }
.tab-bar { background: transparent; }
.tab-bar :deep(.q-tab) { color: var(--c-muted-fg); text-transform: none; font-size: 14px; }
.tab-bar :deep(.q-tab--active) { color: var(--c-fg); }
.panels { background: transparent; }
.machine-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
</style>
