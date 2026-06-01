<template>
    <div class="page">
        <div v-if="!machine" class="center-msg">機台資料不存在</div>
        <template v-else>
            <!-- Header -->
            <div class="header">
                <button class="back-btn" @click="goBack"><ArrowLeft :size="20" /></button>
                <div>
                    <div class="machine-name">{{ machine.name }}</div>
                    <div class="machine-sub">{{ machine.location }} · {{ machine.category }}</div>
                </div>
                <div class="status-pill" :class="statusCfg.cls">
                    <component :is="statusCfg.icon" :size="16" /><span>{{ statusCfg.text }}</span>
                </div>
            </div>

            <!-- Active Work Order -->
            <div v-if="activeRecord" class="wo-card">
                <div class="wo-col"><div class="wo-label">當前工單</div><div class="wo-val fw-500">{{ activeRecord.workOrder }}</div></div>
                <div class="wo-col"><div class="wo-label">操作人員</div><div class="wo-val">{{ activeRecord.operator }}</div></div>
                <div class="wo-col"><div class="wo-label">開工時間</div><div class="wo-val">{{ activeRecord.startTime }}</div></div>
                <div v-if="activeRecord.glueBatchNo" class="wo-col"><div class="wo-label">膠料批號</div><div class="wo-val">{{ activeRecord.glueBatchNo }}</div></div>
                <div v-if="activeRecord.coatingBatchNo" class="wo-col"><div class="wo-label">塗佈批號</div><div class="wo-val">{{ activeRecord.coatingBatchNo }}</div></div>
            </div>

            <!-- Points Grid -->
            <div class="points-grid">
                <div v-for="(p, i) in machine.points" :key="i" class="point-card">
                    <div class="point-header">
                        <span class="point-name">{{ p.name }}</span>
                        <span class="status-dot" :class="'dot-' + p.status" />
                    </div>
                    <div class="point-value">{{ p.value }}</div>
                    <div class="point-unit">{{ p.unit }}</div>
                </div>
            </div>

            <!-- Diagram Placeholder -->
            <div class="diagram-placeholder">
                <Activity :size="64" style="opacity:0.3" />
                <div class="diagram-title">人機圖顯示區域</div>
                <div class="diagram-desc">若有人機圖則顯示在此，否則僅顯示點位資訊</div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Activity, Play, Pause, PowerOff } from 'lucide-vue-next'
import { useWorkRecordsStore } from '@/stores/workRecords.js'

const route = useRoute()
const router = useRouter()
const store = useWorkRecordsStore()

const machineId = computed(() => route.params.machineId)
const fromCategory = window.history.state?.fromCategory

const mockData = {
    R001: { name: '製膠攪拌機', location: 'A棟1樓', category: '製膠', status: 'running', communicationStatus: 'normal', points: [{ name: '溫度1', value: '78.5°C', unit: '°C', status: 'normal' },{ name: '溫度2', value: '82.1°C', unit: '°C', status: 'normal' },{ name: '壓力', value: '3.2 bar', unit: 'bar', status: 'normal' },{ name: '轉速', value: '1250 rpm', unit: 'rpm', status: 'normal' },{ name: '電流', value: '45.2 A', unit: 'A', status: 'normal' },{ name: '振動', value: '0.8 mm/s', unit: 'mm/s', status: 'normal' }] },
    C001: { name: '調膠溫度與啟動', location: 'B棟1樓', category: '塗佈', status: 'running', communicationStatus: 'normal', points: [{ name: '膠體溫度', value: '72.3°C', unit: '°C', status: 'normal' },{ name: '攪拌轉速', value: '860 rpm', unit: 'rpm', status: 'normal' },{ name: '黏度', value: '1420 cP', unit: 'cP', status: 'warning' },{ name: '液位', value: '68 %', unit: '%', status: 'normal' },{ name: '電流', value: '32.1 A', unit: 'A', status: 'normal' }] },
    C002: { name: '塗佈機', location: 'B棟1樓', category: '塗佈', status: 'standby', communicationStatus: 'normal', points: [{ name: '塗佈溫度', value: '65.3°C', unit: '°C', status: 'normal' },{ name: '烘箱溫度', value: '120.5°C', unit: '°C', status: 'normal' },{ name: '張力', value: '15.2 N', unit: 'N', status: 'warning' },{ name: '速度', value: '80 m/min', unit: 'm/min', status: 'normal' },{ name: '塗佈厚度', value: '25.5 μm', unit: 'μm', status: 'normal' },{ name: '電流', value: '28.7 A', unit: 'A', status: 'normal' }] },
    P001: { name: '熱切分條機', location: 'C棟1樓', category: '本業加工', status: 'running', communicationStatus: 'normal', points: [{ name: '切刀溫度', value: '185.0°C', unit: '°C', status: 'normal' },{ name: '切割速度', value: '45 m/min', unit: 'm/min', status: 'normal' },{ name: '張力', value: '22.8 N', unit: 'N', status: 'normal' },{ name: '刀壓', value: '4.5 bar', unit: 'bar', status: 'normal' },{ name: '電流', value: '38.4 A', unit: 'A', status: 'normal' }] },
    P002: { name: '裁切設備', location: 'C棟1樓', category: '本業加工', status: 'standby', communicationStatus: 'normal', points: [{ name: '刀具溫度', value: '28.2°C', unit: '°C', status: 'normal' },{ name: '裁切速度', value: '0 m/min', unit: 'm/min', status: 'normal' },{ name: '氣壓', value: '6.0 bar', unit: 'bar', status: 'normal' },{ name: '電流', value: '2.1 A', unit: 'A', status: 'normal' }] },
    P003: { name: '複捲設備', location: 'C棟2樓', category: '本業加工', status: 'stopped', communicationStatus: 'error', points: [{ name: '捲取張力', value: '—', unit: 'N', status: 'error' },{ name: '捲取速度', value: '0 m/min', unit: 'm/min', status: 'normal' },{ name: '電流', value: '0 A', unit: 'A', status: 'normal' },{ name: '通訊狀態', value: '失聯', unit: '', status: 'error' }] },
    CV001: { name: '分條機', location: 'D棟1樓', category: 'COVER加工', status: 'running', communicationStatus: 'normal', points: [{ name: '分條速度', value: '60 m/min', unit: 'm/min', status: 'normal' },{ name: '張力', value: '18.5 N', unit: 'N', status: 'normal' },{ name: '刀具溫度', value: '42.0°C', unit: '°C', status: 'normal' },{ name: '電流', value: '25.3 A', unit: 'A', status: 'normal' },{ name: '振動', value: '0.5 mm/s', unit: 'mm/s', status: 'normal' }] },
    CV002: { name: '貼合設備', location: 'D棟1樓', category: 'COVER加工', status: 'standby', communicationStatus: 'normal', points: [{ name: '貼合壓力', value: '3.8 bar', unit: 'bar', status: 'normal' },{ name: '貼合速度', value: '0 m/min', unit: 'm/min', status: 'normal' },{ name: '溫度', value: '35.1°C', unit: '°C', status: 'normal' },{ name: '電流', value: '1.8 A', unit: 'A', status: 'normal' }] },
    CV003: { name: 'AOI 檢出資料', location: 'D棟2樓', category: 'COVER加工', status: 'running', communicationStatus: 'normal', points: [{ name: '檢測速度', value: '55 m/min', unit: 'm/min', status: 'normal' },{ name: '缺陷檢出率', value: '99.8 %', unit: '%', status: 'normal' },{ name: '光源亮度', value: '1850 lux', unit: 'lux', status: 'normal' },{ name: '相機幀率', value: '120 fps', unit: 'fps', status: 'normal' },{ name: 'CPU使用率', value: '62 %', unit: '%', status: 'normal' }] },
    CV004: { name: '薄膜斷裁機', location: 'D棟2樓', category: 'COVER加工', status: 'stopped', communicationStatus: 'normal', points: [{ name: '裁切溫度', value: '28.0°C', unit: '°C', status: 'normal' },{ name: '裁切速度', value: '0 m/min', unit: 'm/min', status: 'normal' },{ name: '氣壓', value: '5.8 bar', unit: 'bar', status: 'normal' },{ name: '電流', value: '0.5 A', unit: 'A', status: 'normal' }] },
    L001: { name: '淋膜機', location: 'E棟1樓', category: '淋膜', status: 'running', communicationStatus: 'normal', points: [{ name: '淋膜溫度', value: '168.0°C', unit: '°C', status: 'normal' },{ name: '淋膜速度', value: '75 m/min', unit: 'm/min', status: 'normal' },{ name: '膜厚', value: '18.2 μm', unit: 'μm', status: 'normal' },{ name: '張力', value: '20.1 N', unit: 'N', status: 'normal' },{ name: '電流', value: '52.6 A', unit: 'A', status: 'normal' },{ name: '冷卻水溫', value: '18.5°C', unit: '°C', status: 'normal' }] },
    L002: { name: '薄膜複捲機', location: 'E棟1樓', category: '淋膜', status: 'standby', communicationStatus: 'normal', points: [{ name: '捲取張力', value: '12.0 N', unit: 'N', status: 'normal' },{ name: '捲取速度', value: '0 m/min', unit: 'm/min', status: 'normal' },{ name: '電流', value: '1.5 A', unit: 'A', status: 'normal' },{ name: '卷徑', value: '320 mm', unit: 'mm', status: 'normal' }] },
    F001: { name: '廠務設備', location: 'F棟地下室', category: '廠務', status: 'running', communicationStatus: 'normal', points: [{ name: '供水壓力', value: '4.2 bar', unit: 'bar', status: 'normal' },{ name: '水溫', value: '22.1°C', unit: '°C', status: 'normal' },{ name: '流量', value: '12.5 m³/h', unit: 'm³/h', status: 'normal' },{ name: '電流', value: '18.3 A', unit: 'A', status: 'normal' }] },
    F002: { name: '主鍋爐溫度', location: 'F棟1樓', category: '廠務', status: 'running', communicationStatus: 'normal', points: [{ name: '鍋爐溫度', value: '185.5°C', unit: '°C', status: 'normal' },{ name: '蒸汽壓力', value: '8.5 bar', unit: 'bar', status: 'normal' },{ name: '水位', value: '72 %', unit: '%', status: 'normal' },{ name: '燃燒效率', value: '91.2 %', unit: '%', status: 'normal' },{ name: '排煙溫度', value: '145.0°C', unit: '°C', status: 'normal' }] },
    F003: { name: 'RTO PLC', location: 'F棟頂樓', category: '廠務', status: 'running', communicationStatus: 'normal', points: [{ name: '爐膛溫度', value: '820.0°C', unit: '°C', status: 'normal' },{ name: '風量', value: '3500 m³/h', unit: 'm³/h', status: 'normal' },{ name: '廢氣濃度', value: '85 ppm', unit: 'ppm', status: 'normal' },{ name: '熱回收效率', value: '94.5 %', unit: '%', status: 'normal' },{ name: '電流', value: '62.8 A', unit: 'A', status: 'normal' }] },
}

const machine = computed(() => mockData[machineId.value])
const activeRecord = computed(() => store.activeRecords.find(r => r.machineId === machineId.value))

const statusConfig = {
    running: { text: '運轉中', icon: Play, cls: 'status-running' },
    standby: { text: '待機', icon: Pause, cls: 'status-standby' },
    stopped: { text: '停機', icon: PowerOff, cls: 'status-stopped' },
}
const statusCfg = computed(() => machine.value ? statusConfig[machine.value.status] : statusConfig.stopped)

function goBack() {
    router.push({ path: '/', state: { tab: fromCategory } })
}
</script>

<style scoped>
.page { padding: 24px; }
.center-msg { display: flex; align-items: center; justify-content: center; height: 192px; color: var(--c-muted-fg); }
.header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.back-btn { padding: 8px; border: none; background: none; cursor: pointer; border-radius: var(--radius); color: var(--c-fg); transition: background-color 0.2s; }
.back-btn:hover { background: var(--c-secondary); }
.machine-name { font-size: 20px; font-weight: 500; color: var(--c-fg); }
.machine-sub { font-size: 14px; color: var(--c-muted-fg); }
.status-pill { margin-left: auto; display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: var(--radius); font-size: 14px; }
.status-running { background: rgba(34,197,94,0.2); color: var(--c-green); }
.status-standby { background: rgba(234,179,8,0.2); color: var(--c-yellow); }
.status-stopped { background: rgba(239,68,68,0.2); color: var(--c-red); }
.wo-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius); padding: 16px; margin-bottom: 24px; display: flex; flex-wrap: wrap; gap: 24px; font-size: 14px; }
.wo-col {}
.wo-label { font-size: 12px; color: var(--c-muted-fg); margin-bottom: 2px; }
.wo-val { color: var(--c-fg); }
.fw-500 { font-weight: 500; }
.points-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.point-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius); padding: 16px; transition: border-color 0.2s; }
.point-card:hover { border-color: color-mix(in srgb, var(--c-primary) 50%, transparent); }
.point-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; }
.point-name { font-size: 14px; color: var(--c-muted-fg); }
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.dot-normal { background: var(--c-green); }
.dot-warning { background: var(--c-yellow); }
.dot-error { background: var(--c-red); }
.point-value { font-size: 24px; font-weight: 500; color: var(--c-card-fg); }
.point-unit { font-size: 12px; color: var(--c-muted-fg); margin-top: 4px; }
.diagram-placeholder { margin-top: 24px; background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius); padding: 32px; text-align: center; color: var(--c-muted-fg); }
.diagram-title { font-weight: 500; margin: 16px 0 4px; }
.diagram-desc { font-size: 14px; }

@media (max-width: 768px) {
    .points-grid { grid-template-columns: 1fr; }
}
</style>
