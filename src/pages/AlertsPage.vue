<template>
    <div class="page">
        <div class="filter-bar">
            <q-select v-model="filterMachine" :options="machineOptions" emit-value map-options dense outlined 
                :display-value="filterMachine ? undefined : '機台名稱'" 
                :class="{ 'select-empty': !filterMachine }"
                style="min-width:160px" class="filter-select" clearable />
            <q-select v-model="filterType" :options="typeOptions" emit-value map-options dense outlined 
                :display-value="filterType ? undefined : '異常類型'" 
                :class="{ 'select-empty': !filterType }"
                style="min-width:140px" class="filter-select" clearable />
            <input v-model="dateFrom" type="date" class="field-input" :class="{ 'date-empty': !dateFrom }" style="max-width:160px" />
            <input v-model="dateTo" type="date" class="field-input" :class="{ 'date-empty': !dateTo }" style="max-width:160px" />
        </div>

        <div class="card">
            <table class="data-table">
                <thead>
                    <tr><th>異常發生時間</th><th>機台分類</th><th>機台名稱</th><th>區域名稱</th><th>異常類型</th><th>異常訊息</th></tr>
                </thead>
                <tbody>
                    <template v-if="filteredAlerts.length">
                        <tr v-for="a in filteredAlerts" :key="a.id" class="data-row" @click="goMachine(a)">
                            <td>{{ a.time }}</td><td>{{ a.category }}</td><td>{{ a.machine }}</td><td>{{ a.location }}</td>
                            <td><span class="badge badge-red">{{ a.type }}</span></td>
                            <td>{{ a.message }}</td>
                        </tr>
                    </template>
                    <tr v-else><td colspan="6" class="empty">無異常警報紀錄</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const filterMachine = ref(null)
const filterType = ref(null)
const dateFrom = ref('')
const dateTo = ref('')

const alerts = [
    { id: 1, time: '2026-05-22 14:32', machine: '複捲設備', machineId: 'P003', location: 'B棟3樓', category: '本業加工', type: '通訊異常', message: '設備通訊中斷超過10分鐘' },
    { id: 2, time: '2026-05-22 11:15', machine: '塗佈機', machineId: 'C002', location: 'D棟1樓', category: '塗佈', type: '參數異常', message: '張力值超出正常範圍 (15.2N > 12N)' },
    { id: 3, time: '2026-05-22 09:48', machine: '調膠溫度與啟動', machineId: 'C001', location: 'D棟1樓', category: '塗佈', type: '參數異常', message: '黏度值異常偏高 (1420cP > 1200cP)' },
    { id: 4, time: '2026-05-21 16:20', machine: '製膠攪拌機', machineId: 'R001', location: 'C棟1F', category: '製膠', type: '設備警報', message: '攪拌機振動值偏高' },
    { id: 5, time: '2026-05-21 13:45', machine: '薄膜斷裁機', machineId: 'CV004', location: 'B棟4樓', category: 'COVER加工', type: '設備警報', message: '氣壓不足警報' },
    { id: 6, time: '2026-05-21 10:30', machine: '淋膜機', machineId: 'L001', location: 'B棟1F', category: '淋膜', type: '參數異常', message: '淋膜溫度波動過大' },
    { id: 7, time: '2026-05-20 15:55', machine: '主鍋爐溫度', machineId: 'F002', location: '-', category: '廠務', type: '設備警報', message: '排煙溫度超標 (160°C > 150°C)' },
    { id: 8, time: '2026-05-20 08:10', machine: 'RTO PLC', machineId: 'F003', location: '-', category: '廠務', type: '通訊異常', message: 'PLC通訊短暫中斷' },
]

const machineOptions = [...new Set(alerts.map(a => a.machine))].map(m => ({ label: m, value: m }))
const typeOptions = [...new Set(alerts.map(a => a.type))].map(t => ({ label: t, value: t }))

const filteredAlerts = computed(() => {
    let list = alerts
    if (filterMachine.value) list = list.filter(a => a.machine === filterMachine.value)
    if (filterType.value) list = list.filter(a => a.type === filterType.value)
    if (dateFrom.value) list = list.filter(a => a.time >= dateFrom.value)
    if (dateTo.value) list = list.filter(a => a.time <= dateTo.value + ' 23:59')
    return list
})

function goMachine(a) {
    router.push({ path: `/machine/${a.machineId}` })
}
</script>

<style scoped>
.page { padding: 24px; }
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
.card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius); overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.data-table th { text-align: left; padding: 12px 16px; font-weight: 500; color: var(--c-muted-fg); border-bottom: 1px solid var(--c-border); white-space: nowrap; }
.data-table td { padding: 12px 16px; color: var(--c-card-fg); white-space: nowrap; }
.data-row { cursor: pointer; transition: background-color 0.15s; }
.data-row:hover { background: color-mix(in srgb, var(--c-secondary) 50%, transparent); }
.data-row:nth-child(even) { background: color-mix(in srgb, var(--c-secondary) 30%, transparent); }
.empty { text-align: center; padding: 40px 16px !important; color: var(--c-muted-fg); }
.badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.badge-red { background: rgba(239,68,68,0.2); color: var(--c-red); }
</style>
