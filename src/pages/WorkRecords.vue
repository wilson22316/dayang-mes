<template>
    <div class="page">
        <q-tabs v-model="tab" active-color="primary" indicator-color="primary" align="left" narrow-indicator class="tab-bar q-mb-md">
            <q-tab name="current" label="當前報工" />
            <q-tab name="history" label="歷史報工紀錄" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="panels">
            <!-- Current Tab -->
            <q-tab-panel name="current" class="q-pa-none">
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr><th>操作</th><th>工單編號</th><th>機台分類</th><th>機台名稱</th><th>區域名稱</th><th>狀態</th><th>操作人員</th><th>開工時間</th></tr>
                        </thead>
                        <tbody>
                            <template v-if="currentRows.length">
                                <tr v-for="r in currentRows" :key="r.key" class="data-row" @click="openDetail(r)">
                                    <td @click.stop="openDetail(r)">
                                        <button class="detail-btn">
                                            <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            <span>詳情</span>
                                        </button>
                                    </td>
                                    <td>{{ r.workOrder }}</td>
                                    <td>{{ r.category }}</td>
                                    <td>{{ r.machine }}</td>
                                    <td>{{ r.location }}</td>
                                    <td><span class="badge badge-green">進行中</span></td>
                                    <td>{{ r.operator }}</td>
                                    <td>{{ r.startTime }}</td>
                                </tr>
                            </template>
                            <tr v-else><td colspan="8" class="empty">無進行中的工單</td></tr>
                        </tbody>
                    </table>
                </div>
            </q-tab-panel>

            <!-- History Tab -->
            <q-tab-panel name="history" class="q-pa-none">
                <div class="filter-bar">
                    <input v-model="keyword" class="field-input" placeholder="搜尋工單編號或名稱" style="max-width:240px" />
                    <q-select v-model="filterCat" :options="catOptions" emit-value map-options dense outlined 
                        :display-value="filterCat ? undefined : '機台分類'" 
                        :class="{ 'select-empty': !filterCat }"
                        style="min-width:140px" class="filter-select" clearable />
                    <q-select v-model="filterStatus" :options="statusOptions" emit-value map-options dense outlined 
                        :display-value="filterStatus ? undefined : '狀態'" 
                        :class="{ 'select-empty': !filterStatus }"
                        style="min-width:120px" class="filter-select" clearable />
                    <input v-model="dateFrom" type="date" class="field-input" :class="{ 'date-empty': !dateFrom }" style="max-width:160px" />
                    <input v-model="dateTo" type="date" class="field-input" :class="{ 'date-empty': !dateTo }" style="max-width:160px" />
                </div>
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr><th>操作</th><th>工單編號</th><th>工單名稱</th><th>機台名稱</th><th>區域名稱</th><th>操作人員</th><th>開工時間</th><th>完工時間</th><th>狀態</th></tr>
                        </thead>
                        <tbody>
                            <template v-if="filteredHistory.length">
                                <tr v-for="r in filteredHistory" :key="r.key" class="data-row" @click="openHistoryDetail(r)">
                                    <td @click.stop="openHistoryDetail(r)">
                                        <button class="detail-btn">
                                            <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            <span>詳情</span>
                                        </button>
                                    </td>
                                    <td>{{ r.workOrder }}</td>
                                    <td>{{ r.workOrderName }}</td>
                                    <td>{{ r.machine }}</td>
                                    <td>{{ r.location }}</td>
                                    <td>{{ r.operator }}</td>
                                    <td>{{ r.startTime }}</td>
                                    <td>{{ r.endTime ?? '—' }}</td>
                                    <td><span class="badge" :class="statusCls(r.status)">{{ r.status }}</span></td>
                                </tr>
                            </template>
                            <tr v-else><td colspan="9" class="empty">無歷史紀錄</td></tr>
                        </tbody>
                    </table>
                </div>
            </q-tab-panel>
        </q-tab-panels>

        <WorkRecordDetailModal v-model="showRecordModal" :record="selectedRecord" :on-complete="selectedComplete" />
        <GlueCoatingDetailModal v-model="showGCModal" :record="selectedGC" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWorkRecordsStore } from '@/stores/workRecords.js'
import WorkRecordDetailModal from '@/components/WorkRecordDetailModal.vue'
import GlueCoatingDetailModal from '@/components/GlueCoatingDetailModal.vue'

const store = useWorkRecordsStore()
const tab = ref('current')
const keyword = ref('')
const filterCat = ref(null)
const filterStatus = ref(null)
const dateFrom = ref('')
const dateTo = ref('')

const showRecordModal = ref(false)
const showGCModal = ref(false)
const selectedRecord = ref(null)
const selectedGC = ref(null)
const selectedComplete = ref(null)

const catOptions = ['製膠', '塗佈', '本業加工', 'COVER加工', '淋膜', '廠務'].map(c => ({ label: c, value: c }))
const statusOptions = [{ label: '已完工', value: '已完工' }]

/* Current tab rows */
const currentRows = computed(() => {
    const nonGC = store.records.filter(r => r.status === '進行中').map(r => ({
        ...r, key: r.id, isGC: false, displayStatus: '進行中',
    }))
    const gcRows = store.glueCoatingRecords.filter(r => r.status !== '已完工').map(r => ({
        key: `gc-${r.workOrder}`, workOrder: r.workOrder, workOrderName: r.workOrderName,
        machine: r.glueMachine, location: r.glueLocation, operator: r.glueOperator,
        startTime: r.glueStartTime, isGC: true, displayStatus: r.status, _gcRecord: r,
        category: '塗佈',
    }))
    return [...nonGC, ...gcRows]
})

/* History */
const mockHistory = [
    { id: '101', workOrder: 'WO-2026-R002', workOrderName: '產品B製膠工單', machine: '製膠攪拌機', machineId: 'R001', location: 'A棟1樓', category: '製膠', operator: '張三', startTime: '2026-05-21 08:00', endTime: '2026-05-21 16:30', status: '已完工' },
    { id: '104', workOrder: 'WO-2026-L001', workOrderName: '產品A淋膜工單', machine: '淋膜機', machineId: 'L001', location: 'E棟1樓', category: '淋膜', operator: '趙六', startTime: '2026-05-20 10:00', endTime: '2026-05-20 18:20', status: '已完工' },
    { id: '105', workOrder: 'WO-2026-CV001', workOrderName: '產品A分條工單', machine: '分條機 (G-01)', machineId: 'CV001', location: 'B棟4樓', category: 'COVER加工', operator: '陳七', startTime: '2026-05-20 08:30', endTime: '2026-05-20 15:45', status: '已完工' },
    { id: '106', workOrder: 'WO-2026-CV002', workOrderName: '產品B分條工單', machine: '分條機 (G-01)', machineId: 'CV001', location: 'B棟4樓', category: 'COVER加工', operator: '陳七', startTime: '2026-05-19 09:00', endTime: '2026-05-19 17:00', status: '已完工' },
]

const mockHistoryGC = [
    {
        workOrder: 'WO-2026-G010', workOrderName: '產品X塗佈工單', status: '已完工',
        glueOperator: '王大', glueStartTime: '2026-05-19 08:00', glueEndTime: '2026-05-19 12:00',
        glueMachine: '調膠溫度與啟動', glueMachineId: 'C001', glueLocation: 'B棟1樓',
        glueBatchNo: 'B-OLD-001', glueBatchHistory: [{ batchNo: 'B-OLD-001', time: '2026-05-19 08:00' }],
        coatingOperator: '李小', coatingStartTime: '2026-05-19 13:00', coatingEndTime: '2026-05-19 18:00',
        coatingMachine: '塗佈機', coatingMachineId: 'C002', coatingLocation: 'B棟1樓',
        coatingBatchNo: 'CB-OLD-001', coatingBatchHistory: [{ batchNo: 'CB-OLD-001', time: '2026-05-19 13:00' }],
    },
]

const allHistory = computed(() => {
    const completed = store.records.filter(r => r.status === '已完工').map(r => ({ ...r, key: `c-${r.id}` }))
    const completedGC = store.glueCoatingRecords.filter(r => r.status === '已完工').map(r => ({
        key: `gc-h-${r.workOrder}`, workOrder: r.workOrder, workOrderName: r.workOrderName,
        machine: r.glueMachine, location: r.glueLocation, operator: r.glueOperator,
        startTime: r.glueStartTime, endTime: r.coatingEndTime ?? r.glueEndTime, status: '已完工',
        category: '塗佈', _gcRecord: r,
    }))
    const mh = mockHistory.map(r => ({ ...r, key: `mh-${r.id}` }))
    const mghc = mockHistoryGC.filter(r => r.status === '已完工').map(r => ({
        key: `mghc-${r.workOrder}`, workOrder: r.workOrder, workOrderName: r.workOrderName,
        machine: r.glueMachine, location: r.glueLocation, operator: r.glueOperator,
        startTime: r.glueStartTime, endTime: r.coatingEndTime, status: '已完工',
        category: '塗佈', _gcRecord: r,
    }))
    return [...completed, ...completedGC, ...mh, ...mghc]
})

const filteredHistory = computed(() => {
    let rows = allHistory.value
    if (keyword.value) {
        const kw = keyword.value.toLowerCase()
        rows = rows.filter(r => r.workOrder?.toLowerCase().includes(kw) || r.workOrderName?.toLowerCase().includes(kw))
    }
    if (filterCat.value) rows = rows.filter(r => r.category === filterCat.value)
    if (filterStatus.value) rows = rows.filter(r => r.status === filterStatus.value)
    if (dateFrom.value) rows = rows.filter(r => r.startTime >= dateFrom.value)
    if (dateTo.value) rows = rows.filter(r => r.startTime <= dateTo.value + ' 23:59')
    return rows
})

function statusCls(s) {
    if (s === '進行中') return 'badge-green'
    if (s === '已完工') return 'badge-blue'
    return 'badge-red'
}
function gcStatusCls(s) {
    if (s === '調膠中') return 'badge-yellow'
    if (s === '待塗佈') return 'badge-lightblue'
    if (s === '調膠塗佈中') return 'badge-orange'
    if (s === '塗佈中') return 'badge-green'
    if (s === '已完工') return 'badge-blue'
    return 'badge-green'
}

function openDetail(r) {
    if (r.isGC || r._gcRecord) {
        selectedGC.value = r._gcRecord ?? store.glueCoatingRecords.find(g => g.workOrder === r.workOrder)
        showGCModal.value = true
    } else {
        selectedRecord.value = r
        selectedComplete.value = () => store.completeRecord(r.id)
        showRecordModal.value = true
    }
}
function openHistoryDetail(r) {
    if (r._gcRecord) {
        selectedGC.value = r._gcRecord
        showGCModal.value = true
    } else {
        selectedRecord.value = r
        selectedComplete.value = null
        showRecordModal.value = true
    }
}
</script>

<style scoped>
.page { padding: 24px; }
.tab-bar { background: transparent; }
.tab-bar :deep(.q-tab) { color: var(--c-muted-fg); text-transform: none; font-size: 14px; }
.tab-bar :deep(.q-tab--active) { color: var(--c-fg); }
.panels { background: transparent; }
.card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius); overflow-x: auto; }
.filter-bar { display: flex; gap: 12px; margin-bottom: 16px; align-items: center; flex-wrap: wrap; }
.field-input { padding: 7px 12px; border: 1px solid var(--c-border); border-radius: 6px; background: var(--c-bg); color: var(--c-fg); font-size: 14px; outline: none; }
.field-input:focus { border-color: var(--c-primary); }

.field-input::placeholder {
    color: var(--c-muted-fg) !important;
    opacity: 1 !important;
}

/* 日期選擇器空值時的預設文字置灰 */
.field-input[type="date"].date-empty::-webkit-datetime-edit {
    color: var(--c-muted-fg) !important;
}

.filter-select :deep(.q-field__control) {
    background: var(--c-bg) !important;
    color: var(--c-fg) !important;
    border-radius: 6px !important;
}

.filter-select :deep(.q-field__control::before) {
    border-color: var(--c-border) !important;
}

.filter-select :deep(.q-field__control:hover::before) {
    border-color: var(--c-primary) !important;
}

.filter-select.q-field--focused :deep(.q-field__control::after) {
    border-color: var(--c-primary) !important;
    border-width: 1px !important;
}

.filter-select :deep(.q-field__native span) {
    color: var(--c-fg) !important;
}

.filter-select.select-empty :deep(.q-field__native span) {
    color: var(--c-muted-fg) !important;
}

.filter-select :deep(.q-field__marginal) {
    color: var(--c-muted-fg) !important;
}
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.data-table th { text-align: left; padding: 12px 16px; font-weight: 500; color: var(--c-muted-fg); border-bottom: 1px solid var(--c-border); white-space: nowrap; }
.data-table td { padding: 12px 16px; color: var(--c-card-fg); white-space: nowrap; }
.data-row { cursor: pointer; transition: background-color 0.15s; }
.data-row:hover { background: color-mix(in srgb, var(--c-secondary) 50%, transparent); }
.data-row:nth-child(even) { background: color-mix(in srgb, var(--c-secondary) 30%, transparent); }
.data-row:nth-child(even):hover { background: color-mix(in srgb, var(--c-secondary) 60%, transparent); }
.empty { text-align: center; padding: 40px 16px !important; color: var(--c-muted-fg); }
.badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.badge-green { background: rgba(34,197,94,0.2); color: var(--c-green); }
.badge-blue { background: rgba(59,130,246,0.2); color: var(--c-blue); }
.badge-red { background: rgba(239,68,68,0.2); color: var(--c-red); }
.badge-yellow { background: rgba(234,179,8,0.2); color: var(--c-yellow); }
.badge-lightblue { background: rgba(96,165,250,0.2); color: #60a5fa; }
.badge-orange { background: rgba(249,115,22,0.2); color: var(--c-orange); }
.detail-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 4px; background-color: #2563eb; color: #ffffff; border: none; cursor: pointer; font-size: 13px; font-weight: 500; transition: opacity 0.2s; }
.detail-btn:hover { opacity: 0.9; }
.eye-icon { width: 14px; height: 14px; color: #ffffff; }
</style>
