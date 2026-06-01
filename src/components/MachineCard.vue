<template>
    <div class="card">
        <div class="card-header">
            <div class="header-row">
                <h3 class="machine-name">{{ machine.name }}</h3>
                <div class="status-pill" :class="statusCfg.bg">
                    <component :is="statusCfg.icon" :size="12" color="#fff" />
                    <span>{{ statusCfg.text }}</span>
                </div>
            </div>
            <div class="location">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>{{ machine.location }}</span>
            </div>
        </div>

        <div v-if="categoryId !== 'facility'" class="work-order-block">
            <div v-if="machine.workOrder" class="wo-info">
                <div class="wo-label">當前工單</div>
                <div class="wo-value">{{ machine.workOrder }}</div>
                <div class="wo-label" style="margin-top:8px">開工時間</div>
                <div class="wo-value">{{ machine.startTime }}</div>
            </div>
            <div v-else class="wo-empty">無開工工單</div>
        </div>

        <div class="comm-status" :class="machine.communicationStatus === 'normal' ? 'comm-ok' : 'comm-err'">
            <Wifi v-if="machine.communicationStatus === 'normal'" :size="16" />
            <WifiOff v-else :size="16" />
            <span>{{ machine.communicationStatus === 'normal' ? '通訊正常' : '通訊異常' }}</span>
        </div>

        <div class="actions">
            <button class="btn-sec" @click="goDetail">
                <Eye :size="16" /><span>查看詳情</span>
            </button>
            <button v-if="showWorkReport" class="btn-pri" @click="showModal = true">
                <FileText :size="16" /><span>報工</span>
            </button>
        </div>

        <WorkReportModal v-if="showWorkReport" v-model="showModal" :machine="machine" :category-id="categoryId" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, FileText, Wifi, WifiOff, Play, Pause, PowerOff } from 'lucide-vue-next'
import WorkReportModal from '@/components/WorkReportModal.vue'

const props = defineProps({
    machine: { type: Object, required: true },
    showWorkReport: { type: Boolean, default: true },
    categoryId: { type: String, default: '' },
})

const router = useRouter()
const showModal = ref(false)

const statusMap = {
    running: { text: '運轉中', bg: 'bg-green', icon: Play },
    standby: { text: '待機', bg: 'bg-yellow', icon: Pause },
    stopped: { text: '停機', bg: 'bg-red', icon: PowerOff },
}
const statusCfg = computed(() => statusMap[props.machine.status] ?? statusMap.stopped)

function goDetail() {
    router.push({ path: `/machine/${props.machine.id}`, state: { fromCategory: props.categoryId } })
}
</script>

<style scoped>
.card {
    background-color: var(--c-card); border-radius: var(--radius);
    border: 1px solid var(--c-border); padding: 16px; transition: border-color 0.2s;
}
.card:hover { border-color: color-mix(in srgb, var(--c-primary) 50%, transparent); }
.card-header { margin-bottom: 12px; }
.header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.machine-name { margin: 0 !important; font-size: 15px; font-weight: 500; color: var(--c-card-fg); line-height: 1.2; }
.status-pill { display: flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 999px; font-size: 12px; font-weight: 500; color: #fff; line-height: 1.2; }
.bg-green { background-color: #00c951 !important; }
.bg-yellow { background-color: #EEB000 !important; }
.bg-red { background-color: var(--c-red); }
.location { display: flex; align-items: center; gap: 6px; font-size: 14px; color: var(--c-muted-fg); }
.work-order-block { margin-bottom: 12px; }
.wo-info { background-color: var(--c-wo-bg); border-radius: var(--radius); padding: 12px; height: 104px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; }
.wo-label { font-size: 12px; color: var(--c-muted-fg); margin-bottom: 2px; }
.wo-value { font-size: 14px; color: var(--c-card-fg); font-weight: 500; }
.wo-empty { background-color: var(--c-wo-bg); border-radius: var(--radius); padding: 12px; height: 104px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--c-muted-fg); }
.comm-status { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 12px; }
.comm-ok { color: var(--c-green); }
.comm-err { color: var(--c-red); }
.actions { display: flex; gap: 8px; }
.actions button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 12px; border-radius: 6px; border: none; cursor: pointer; font-size: 14px; transition: opacity 0.2s; }
.btn-sec { background-color: var(--c-secondary); color: var(--c-secondary-fg); }
.btn-sec:hover { opacity: 0.8; }
.btn-pri { background-color: var(--c-primary); color: var(--c-primary-fg); }
.btn-pri:hover { opacity: 0.9; }
</style>
