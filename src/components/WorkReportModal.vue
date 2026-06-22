<template>
    <q-dialog v-model="open" persistent>
        <q-card class="dialog-card">
            <!-- Header -->
            <div class="dialog-header">
                <span class="dialog-title">報工</span>
                <q-btn icon="close" flat round dense class="close-btn" @click="open = false" />
            </div>

            <!-- Body -->
            <div class="dialog-body">
                <!-- Device Info Card (3 columns) -->
                <div class="device-info-card">
                    <div class="info-item">
                        <div class="info-label">報工類型</div>
                        <div class="info-val">{{ categoryNames[categoryId] || '生產報工' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">設備名稱</div>
                        <div class="info-val">{{ machine.name }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">設備位置</div>
                        <div class="info-val">{{ machine.location }}</div>
                    </div>
                </div>

                <!-- Warning Banner -->
                <div v-if="machineActiveRecord" class="warn-banner">
                    <svg class="warn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span v-if="isRubberMachine || isGlueMachine || isCoatingMachine">此機台已有工單進行中，僅可執行批號更新與完工操作。</span>
                    <span v-else>此機台已有工單進行中，僅可執行完工操作。</span>
                </div>
                <div v-if="isCoatingMachine && !machineActiveRecord && !pendingGCForCoating.length && !activeCoatingGC.length" class="warn-banner">
                    <svg class="warn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span>無可塗佈的工單（需先在調膠機台開工）</span>
                </div>

                <div class="form-section">
                    <!-- Work Order -->
                    <div class="form-group">
                        <label class="form-label">工單</label>
                        <q-select v-model="selectedWO" :options="availableWOs" option-label="label" option-value="value"
                            emit-value map-options dense outlined
                            :display-value="selectedWO ? undefined : '選擇工單'"
                            :disable="!!machineActiveRecord"
                            :class="{ 'select-empty': !selectedWO }"
                            popup-content-class="popup-select" class="form-select-ctrl" />
                    </div>

                    <!-- Operator -->
                    <div class="form-group">
                        <label class="form-label">人員</label>
                        <input v-model="operator" class="form-input-ctrl" :disabled="!!machineActiveRecord" placeholder="輸入操作人員" />
                    </div>

                    <!-- Batch Input Section (Only for Glue/Coating Machines) -->
                    <!-- Glue Machine Batch -->
                    <template v-if="isGlueMachine">
                        <!-- 初始輸入：開工時才顯示 -->
                        <div v-if="!machineActiveRecord" class="form-group">
                            <label class="form-label">膠料批號</label>
                            <input v-model="glueBatchNo" class="form-input-ctrl" placeholder="輸入膠料批號" />
                        </div>
                        <!-- 批號更新紀錄（更新操作已移至卡片上） -->
                        <div v-if="machineActiveRecord?.glueBatchHistory?.length" class="batch-history-box">
                            <div class="history-title">批號更新紀錄</div>
                            <div v-for="(e,i) in machineActiveRecord.glueBatchHistory" :key="i" class="history-row">
                                <span class="h-no">{{ e.batchNo }}</span>
                                <span class="h-time">{{ e.time }}</span>
                            </div>
                        </div>
                    </template>

                    <!-- Coating Machine Batch -->
                    <template v-if="isCoatingMachine">
                        <!-- 初始輸入：開工時才顯示 -->
                        <div v-if="!machineActiveRecord" class="form-group">
                            <label class="form-label">塗佈批號</label>
                            <input v-model="coatingBatchNo" class="form-input-ctrl" placeholder="輸入塗佈批號" />
                        </div>
                        <!-- 批號更新紀錄（更新操作已移至卡片上） -->
                        <div v-if="machineActiveRecord?.coatingBatchHistory?.length" class="batch-history-box">
                            <div class="history-title">批號更新紀錄</div>
                            <div v-for="(e,i) in machineActiveRecord.coatingBatchHistory" :key="i" class="history-row">
                                <span class="h-no">{{ e.batchNo }}</span>
                                <span class="h-time">{{ e.time }}</span>
                            </div>
                        </div>
                    </template>

                    <!-- Rubber Machine Batch -->
                    <template v-if="isRubberMachine">
                        <!-- 初始輸入：開工時才顯示 -->
                        <div v-if="!machineActiveRecord" class="form-group">
                            <label class="form-label">製膠批號</label>
                            <input v-model="rubberBatchNo" class="form-input-ctrl" placeholder="輸入製膠批號" />
                        </div>
                        <!-- 批號更新紀錄（更新操作已移至卡片上） -->
                        <div v-if="machineActiveRecord?.rubberBatchHistory?.length" class="batch-history-box">
                            <div class="history-title">批號更新紀錄</div>
                            <div v-for="(e,i) in machineActiveRecord.rubberBatchHistory" :key="i" class="history-row">
                                <span class="h-no">{{ e.batchNo }}</span>
                                <span class="h-time">{{ e.time }}</span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
 
            <!-- Footer Buttons -->
            <div class="dialog-footer">
                <!-- If machine has active WO, show 100% width Complete button -->
                <template v-if="machineActiveRecord">
                    <button class="btn-complete-teal" style="width: 100%" @click="confirmMode = 'complete'">完工</button>
                </template>
                <!-- If no active WO, display single full-width Blue button to Start -->
                <template v-else>
                    <button class="btn-start-active" :disabled="!canStart" @click="handleStart">開工</button>
                </template>
            </div>
        </q-card>
    </q-dialog>

    <!-- Confirm Dialog -->
    <q-dialog v-model="showConfirm" persistent>
        <q-card class="confirm-card">
            <div class="confirm-header">確認完工</div>
            <div class="confirm-body">
                確定要將工單 <strong class="highlight-wo">{{ machineActiveRecord?.workOrder }}</strong> 標記為完工？此操作無法撤銷。
            </div>
            <div class="confirm-actions">
                <button class="confirm-cancel-btn" @click="confirmMode = null">取消</button>
                <button class="confirm-ok-btn" @click="handleComplete">確認完工</button>
            </div>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useWorkRecordsStore } from '@/stores/workRecords.js'

const GLUE_IDS   = ['C001', 'C003', 'C004', 'C005']
const COAT_IDS   = ['C002', 'C006']
const RUBBER_IDS = ['R011', 'R021', 'R031']

const glueCoatingWorkOrders = [
    { value: 'WO-2026-G001', label: 'WO-2026-G001 產品A塗佈工單' },
    { value: 'WO-2026-G002', label: 'WO-2026-G002 產品B塗佈工單' },
    { value: 'WO-2026-G003', label: 'WO-2026-G003 產品C塗佈工單' },
    { value: 'WO-2026-G004', label: 'WO-2026-G004 產品D塗佈工單' },
    { value: 'WO-2026-G005', label: 'WO-2026-G005 產品E塗佈工單' },
    { value: 'WO-2026-G006', label: 'WO-2026-G006 產品F塗佈工單' },
]

const machineWorkOrders = {
    R001: [
        { value: 'WO-2026-R001', label: 'WO-2026-R001 產品A製膠工單' },
        { value: 'WO-2026-R002', label: 'WO-2026-R002 產品B製膠工單' },
        { value: 'WO-2026-R003', label: 'WO-2026-R003 產品C製膠工單' },
        { value: 'WO-2026-R004', label: 'WO-2026-R004 產品D製膠工單' },
    ],
    R011: [
        { value: 'WO-2026-R011-001', label: 'WO-2026-R011-001 R-11製膠工單A' },
        { value: 'WO-2026-R011-002', label: 'WO-2026-R011-002 R-11製膠工單B' },
        { value: 'WO-2026-R011-003', label: 'WO-2026-R011-003 R-11製膠工單C' },
        { value: 'WO-2026-R011-004', label: 'WO-2026-R011-004 R-11製膠工單D' },
    ],
    R021: [
        { value: 'WO-2026-R021-001', label: 'WO-2026-R021-001 R-21製膠工單A' },
        { value: 'WO-2026-R021-002', label: 'WO-2026-R021-002 R-21製膠工單B' },
        { value: 'WO-2026-R021-003', label: 'WO-2026-R021-003 R-21製膠工單C' },
        { value: 'WO-2026-R021-004', label: 'WO-2026-R021-004 R-21製膠工單D' },
    ],
    R031: [
        { value: 'WO-2026-R031-001', label: 'WO-2026-R031-001 R-31製膠工單A' },
        { value: 'WO-2026-R031-002', label: 'WO-2026-R031-002 R-31製膠工單B' },
        { value: 'WO-2026-R031-003', label: 'WO-2026-R031-003 R-31製膠工單C' },
        { value: 'WO-2026-R031-004', label: 'WO-2026-R031-004 R-31製膠工單D' },
    ],
    P001: [
        { value: 'WO-2026-P001', label: 'WO-2026-P001 產品A熱切工單' },
        { value: 'WO-2026-P002', label: 'WO-2026-P002 產品B熱切工單' },
        { value: 'WO-2026-P003', label: 'WO-2026-P003 產品C熱切工單' },
        { value: 'WO-2026-P004', label: 'WO-2026-P004 產品D熱切工單' },
    ],
    P002: [
        { value: 'WO-2026-P005', label: 'WO-2026-P005 產品A裁切工單' },
        { value: 'WO-2026-P006', label: 'WO-2026-P006 產品B裁切工單' },
        { value: 'WO-2026-P007', label: 'WO-2026-P007 產品C裁切工單' },
        { value: 'WO-2026-P008', label: 'WO-2026-P008 產品D裁切工單' },
    ],
    P004: [
        { value: 'WO-2026-P013', label: 'WO-2026-P013 產品E裁切工單' },
        { value: 'WO-2026-P014', label: 'WO-2026-P014 產品F裁切工單' },
        { value: 'WO-2026-P015', label: 'WO-2026-P015 產品G裁切工單' },
        { value: 'WO-2026-P016', label: 'WO-2026-P016 產品H裁切工單' },
    ],
    P003: [
        { value: 'WO-2026-P009', label: 'WO-2026-P009 產品A複捲工單' },
        { value: 'WO-2026-P010', label: 'WO-2026-P010 產品B複捲工單' },
        { value: 'WO-2026-P011', label: 'WO-2026-P011 產品C複捲工單' },
        { value: 'WO-2026-P012', label: 'WO-2026-P012 產品D複捲工單' },
    ],
    CV001: [
        { value: 'WO-2026-CV001', label: 'WO-2026-CV001 分條機G-01工單A' },
        { value: 'WO-2026-CV002', label: 'WO-2026-CV002 分條機G-01工單B' },
        { value: 'WO-2026-CV003', label: 'WO-2026-CV003 分條機G-01工單C' },
        { value: 'WO-2026-CV004', label: 'WO-2026-CV004 分條機G-01工單D' },
    ],
    CV005: [
        { value: 'WO-2026-CV017', label: 'WO-2026-CV017 分條機G-02工單A' },
        { value: 'WO-2026-CV018', label: 'WO-2026-CV018 分條機G-02工單B' },
        { value: 'WO-2026-CV019', label: 'WO-2026-CV019 分條機G-02工單C' },
        { value: 'WO-2026-CV020', label: 'WO-2026-CV020 分條機G-02工單D' },
    ],
    CV006: [
        { value: 'WO-2026-CV021', label: 'WO-2026-CV021 分條機G-03工單A' },
        { value: 'WO-2026-CV022', label: 'WO-2026-CV022 分條機G-03工單B' },
        { value: 'WO-2026-CV023', label: 'WO-2026-CV023 分條機G-03工單C' },
        { value: 'WO-2026-CV024', label: 'WO-2026-CV024 分條機G-03工單D' },
    ],
    CV002: [
        { value: 'WO-2026-CV005', label: 'WO-2026-CV005 貼合機1工單A' },
        { value: 'WO-2026-CV006', label: 'WO-2026-CV006 貼合機1工單B' },
        { value: 'WO-2026-CV007', label: 'WO-2026-CV007 貼合機1工單C' },
        { value: 'WO-2026-CV008', label: 'WO-2026-CV008 貼合機1工單D' },
    ],
    CV007: [
        { value: 'WO-2026-CV025', label: 'WO-2026-CV025 貼合機2工單A' },
        { value: 'WO-2026-CV026', label: 'WO-2026-CV026 貼合機2工單B' },
        { value: 'WO-2026-CV027', label: 'WO-2026-CV027 貼合機2工單C' },
        { value: 'WO-2026-CV028', label: 'WO-2026-CV028 貼合機2工單D' },
    ],
    CV004: [
        { value: 'WO-2026-CV013', label: 'WO-2026-CV013 產品A斷裁工單' },
        { value: 'WO-2026-CV014', label: 'WO-2026-CV014 產品B斷裁工單' },
        { value: 'WO-2026-CV015', label: 'WO-2026-CV015 產品C斷裁工單' },
        { value: 'WO-2026-CV016', label: 'WO-2026-CV016 產品D斷裁工單' },
    ],
    L001: [
        { value: 'WO-2026-L001', label: 'WO-2026-L001 產品A淋膜工單' },
        { value: 'WO-2026-L002', label: 'WO-2026-L002 產品B淋膜工單' },
        { value: 'WO-2026-L003', label: 'WO-2026-L003 產品C淋膜工單' },
        { value: 'WO-2026-L004', label: 'WO-2026-L004 產品D淋膜工單' },
    ],
    L002: [
        { value: 'WO-2026-L005', label: 'WO-2026-L005 產品A複捲工單' },
        { value: 'WO-2026-L006', label: 'WO-2026-L006 產品B複捲工單' },
        { value: 'WO-2026-L007', label: 'WO-2026-L007 產品C複捲工單' },
        { value: 'WO-2026-L008', label: 'WO-2026-L008 產品D複捲工單' },
    ],
    F001: [
        { value: 'WO-2026-F001', label: 'WO-2026-F001 廠務巡檢工單' },
        { value: 'WO-2026-F002', label: 'WO-2026-F002 廠務維修工單' },
        { value: 'WO-2026-F003', label: 'WO-2026-F003 廠務保養工單' },
        { value: 'WO-2026-F004', label: 'WO-2026-F004 廠務校正工單' },
    ],
    F002: [
        { value: 'WO-2026-F005', label: 'WO-2026-F005 鍋爐巡檢工單' },
        { value: 'WO-2026-F006', label: 'WO-2026-F006 鍋爐維修工單' },
        { value: 'WO-2026-F007', label: 'WO-2026-F007 鍋爐保養工單' },
        { value: 'WO-2026-F008', label: 'WO-2026-F008 鍋爐校正工單' },
    ],
    F003: [
        { value: 'WO-2026-F009', label: 'WO-2026-F009 RTO巡檢工單' },
        { value: 'WO-2026-F010', label: 'WO-2026-F010 RTO維修工單' },
        { value: 'WO-2026-F011', label: 'WO-2026-F011 RTO保養工單' },
        { value: 'WO-2026-F012', label: 'WO-2026-F012 RTO校正工單' },
    ],
}

const categoryNames = { rubber: '製膠', coating: '塗佈', processing: '本業加工', cover: 'COVER加工', lamination: '淋膜', facility: '廠務' }

const $q = useQuasar()
const store = useWorkRecordsStore()

const props = defineProps({ modelValue: Boolean, machine: Object, categoryId: String })
const emit = defineEmits(['update:modelValue'])
const open = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })

const isGlueMachine    = computed(() => GLUE_IDS.includes(props.machine?.id))
const isCoatingMachine = computed(() => COAT_IDS.includes(props.machine?.id))
const isRubberMachine  = computed(() => RUBBER_IDS.includes(props.machine?.id))

const machineActiveRecord = computed(() =>
    store.activeRecords.find(r => r.machineId === props.machine?.id)
)

const pendingGCForCoating = computed(() =>
    store.glueCoatingRecords.filter(r => r.status === '調膠中' || r.status === '待塗佈')
)
const activeCoatingGC = computed(() =>
    store.glueCoatingRecords.filter(r => r.status === '塗佈中' || r.status === '調膠塗佈中')
)

const selectedWO = ref(null)
const operator = ref('')
const glueBatchNo = ref('')
const coatingBatchNo = ref('')
const rubberBatchNo = ref('')
const confirmMode = ref(null)
const showConfirm = computed({ get: () => confirmMode.value !== null, set: (v) => { if (!v) confirmMode.value = null } })

const isBatchSame = computed(() => {
    const rec = machineActiveRecord.value
    if (!rec) return false
    if (isGlueMachine.value) {
        return glueBatchNo.value.trim() === (rec.glueBatchNo || '').trim()
    }
    if (isCoatingMachine.value) {
        return coatingBatchNo.value.trim() === (rec.coatingBatchNo || '').trim()
    }
    return false
})

const hasBatchInput = computed(() => {
    if (isGlueMachine.value) return !!glueBatchNo.value.trim()
    if (isCoatingMachine.value) return !!coatingBatchNo.value.trim()
    return false
})

// Auto-fill values when opening modal with active record
watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        const rec = machineActiveRecord.value
        if (rec) {
            selectedWO.value = rec.workOrder
            operator.value = rec.operator
            if (isGlueMachine.value)    glueBatchNo.value    = rec.glueBatchNo    || ''
            if (isCoatingMachine.value) coatingBatchNo.value = rec.coatingBatchNo || ''
            if (isRubberMachine.value)  rubberBatchNo.value  = rec.rubberBatchNo  || ''
        } else {
            resetForm()
        }
    }
}, { immediate: true })

const availableWOs = computed(() => {
    const activeRec = machineActiveRecord.value
    if (activeRec) {
        return [{ value: activeRec.workOrder, label: `${activeRec.workOrder} ${activeRec.workOrderName || ''}` }]
    }
    if (isGlueMachine.value) {
        const used = new Set(store.glueCoatingRecords.map(r => r.workOrder))
        return glueCoatingWorkOrders.filter(o => !used.has(o.value))
    }
    if (isCoatingMachine.value) {
        return pendingGCForCoating.value.map(r => ({ value: r.workOrder, label: `${r.workOrder} ${r.workOrderName}` }))
    }
    const list = machineWorkOrders[props.machine?.id] ?? []
    const used = new Set(store.records.filter(r => r.machineId === props.machine?.id).map(r => r.workOrder))
    return list.filter(o => !used.has(o.value))
})

const canStart = computed(() => selectedWO.value && operator.value.trim())

function nowStr() {
    const n = new Date()
    const p = v => String(v).padStart(2, '0')
    return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())} ${p(n.getHours())}:${p(n.getMinutes())}`
}

function handleStart() {
    const now = nowStr()
    const woLabel = availableWOs.value.find(o => o.value === selectedWO.value)?.label ?? selectedWO.value
    const woName = woLabel.replace(/^WO-\S+\s*/, '')

    if (isCoatingMachine.value) {
        store.startCoating({
            workOrder: selectedWO.value, workOrderName: woName,
            operator: operator.value, machine: props.machine.name,
            machineId: props.machine.id, location: props.machine.location,
            coatingBatchNo: coatingBatchNo.value || undefined, startTime: now,
        })
    } else {
        store.addRecord({
            id: `new-${Date.now()}`, workOrder: selectedWO.value, workOrderName: woName,
            machine: props.machine.name, machineId: props.machine.id,
            location: props.machine.location, category: categoryNames[props.categoryId] ?? '',
            operator: operator.value, startTime: now, status: '進行中',
            ...(isGlueMachine.value && glueBatchNo.value ? {
                glueBatchNo: glueBatchNo.value,
                glueBatchHistory: [{ batchNo: glueBatchNo.value, time: now }],
            } : {}),
            ...(isRubberMachine.value && rubberBatchNo.value ? {
                rubberBatchNo: rubberBatchNo.value,
                rubberBatchHistory: [{ batchNo: rubberBatchNo.value, time: now }],
            } : {}),
        })
    }

    $q.notify({ type: 'positive', message: '開工成功', caption: `工單 ${selectedWO.value} 已開工` })
    resetForm()
    open.value = false
}

function handleComplete() {
    const rec = machineActiveRecord.value
    if (!rec) return
    if (rec.id?.startsWith('gc-glue-')) {
        store.completeGlueStage(rec.workOrder)
    } else if (rec.id?.startsWith('gc-coating-')) {
        store.completeCoatingStage(rec.workOrder)
    } else {
        store.completeRecord(rec.id)
    }
    $q.notify({ type: 'positive', message: '完工成功', caption: `工單 ${rec.workOrder} 已完工` })
    confirmMode.value = null
    open.value = false
}

function handleGCOnlyUpdate() {
    if (isGlueMachine.value) {
        handleUpdateGlue()
    } else if (isCoatingMachine.value) {
        handleUpdateCoat()
    }
}

function handleUpdateGlue() {
    store.updateGlueBatch(machineActiveRecord.value.workOrder, glueBatchNo.value)
    $q.notify({ type: 'positive', message: '批號已更新' })
}

function handleUpdateCoat() {
    store.updateCoatingBatch(machineActiveRecord.value.workOrder, coatingBatchNo.value)
    $q.notify({ type: 'positive', message: '批號已更新' })
}

function resetForm() {
    selectedWO.value = null; operator.value = ''; glueBatchNo.value = ''; coatingBatchNo.value = ''; rubberBatchNo.value = ''
}
</script>

<style scoped>
.dialog-card {
    background-color: var(--c-dialog-bg);
    color: var(--c-fg);
    border: 1px solid var(--c-dialog-border);
    border-radius: 12px;
    width: 460px;
    max-width: 90vw;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
}

.dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px 10px 24px;
}

.dialog-title {
    font-size: 18px;
    font-weight: 500;
    color: var(--c-dialog-title);
}

.close-btn {
    color: var(--c-muted-fg);
    transition: color 0.2s;
}

.close-btn:hover {
    color: var(--c-dialog-title);
}

.dialog-body {
    padding: 10px 24px 20px 24px;
    max-height: 70vh;
    overflow-y: auto;
}

.device-info-card {
    background-color: var(--c-info-bg);
    padding: 14px 18px;
    border-radius: 8px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.info-label {
    color: var(--c-muted-fg);
    font-size: 12px;
    font-weight: 400;
}

.info-val {
    color: var(--c-dialog-title);
    font-size: 14px;
    font-weight: 500;
}

.warn-banner {
    background-color: var(--c-warn-bg);
    border: 1px solid var(--c-warn-border);
    color: var(--c-warn-fg);
    padding: 10px 14px;
    border-radius: 6px;
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    line-height: 1.4;
}

.warn-icon {
    width: 16px;
    height: 16px;
    color: var(--c-warn-fg);
    flex-shrink: 0;
}

.form-section {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-label {
    color: var(--c-muted-fg);
    font-size: 13px;
    font-weight: 500;
}

.form-select-ctrl :deep(.q-field__control) {
    background-color: var(--c-input-bg) !important;
    border: 1px solid var(--c-dialog-border) !important;
    border-radius: 6px !important;
    height: 40px !important;
    min-height: 40px !important;
    color: var(--c-dialog-title) !important;
}

.form-select-ctrl :deep(.q-field__control::before),
.form-select-ctrl :deep(.q-field__control::after) {
    display: none !important;
}

.form-select-ctrl :deep(.q-field__native),
.form-select-ctrl :deep(.q-field__marginal) {
    height: 40px !important;
    color: var(--c-dialog-title) !important;
}

.form-select-ctrl :deep(.q-field__native span) {
    color: var(--c-dialog-title) !important;
}

.form-select-ctrl.select-empty :deep(.q-field__native span) {
    color: var(--c-muted-fg) !important;
}

/* 確保 placeholder 灰色樣式呈現 */
.form-select-ctrl :deep(.q-placeholder) {
    color: var(--c-muted-fg) !important;
    opacity: 0.8 !important;
}

.form-select-ctrl :deep(.q-field__native .q-placeholder) {
    color: var(--c-muted-fg) !important;
}

.form-select-ctrl.q-field--disabled :deep(.q-field__control) {
    background-color: var(--c-secondary) !important;
    cursor: not-allowed !important;
    opacity: 0.8 !important;
}

.form-select-ctrl.q-field--disabled :deep(.q-field__native),
.form-select-ctrl.q-field--disabled :deep(.q-field__marginal) {
    color: var(--c-muted-fg) !important;
    cursor: not-allowed !important;
}

.form-select-ctrl.q-field--disabled :deep(.q-field__native span) {
    color: var(--c-muted-fg) !important;
}

.form-input-ctrl {
    background-color: var(--c-input-bg);
    border: 1px solid var(--c-dialog-border);
    border-radius: 6px;
    height: 40px;
    padding: 0 12px;
    color: var(--c-dialog-title);
    outline: none;
    box-sizing: border-box;
    font-size: 14px;
    transition: border-color 0.2s;
}

.form-input-ctrl::placeholder {
    color: var(--c-muted-fg) !important;
    opacity: 1 !important;
}

.form-input-ctrl:focus {
    border-color: #2563eb;
}

.form-input-ctrl[readonly] {
    color: var(--c-muted-fg);
    cursor: not-allowed;
    border-color: var(--c-dialog-border);
}

.form-input-ctrl:disabled {
    background-color: var(--c-secondary) !important;
    color: var(--c-muted-fg) !important;
    cursor: not-allowed !important;
    border-color: var(--c-dialog-border) !important;
}

.batch-input-wrapper {
    display: flex;
    gap: 8px;
}

.batch-input-wrapper .form-input-ctrl {
    flex: 1;
}

.update-batch-btn {
    background-color: #2563eb;
    color: #ffffff;
    padding: 0 16px;
    border-radius: 6px;
    border: none;
    font-size: 13px;
    cursor: pointer;
    font-weight: 500;
    transition: opacity 0.2s;
}

.update-batch-btn:hover:not(:disabled) {
    opacity: 0.9;
}

.update-batch-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.batch-history-box {
    background-color: var(--c-batch-bg);
    border-radius: 6px;
    padding: 10px 12px;
    margin-top: 2px;
}

.history-title {
    font-size: 12px;
    color: var(--c-muted-fg);
    margin-bottom: 6px;
    font-weight: 500;
}

.history-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 4px;
}

.history-row:last-child {
    margin-bottom: 0;
}

.h-no {
    color: var(--c-dialog-title);
    font-weight: 500;
}

.h-time {
    color: var(--c-muted-fg);
}

.batch-warn-text {
    color: var(--c-orange);
    font-size: 12px;
    margin-top: 4px;
    font-weight: 500;
    text-align: left;
}

.dialog-footer {
    display: flex;
    gap: 16px;
    padding: 10px 24px 24px 24px;
}

.btn-update-purple {
    background-color: #c7d2fe;
    color: #4f46e5;
    border-radius: 6px;
    height: 42px;
    font-size: 14px;
    font-weight: 500;
    flex: 1;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-update-purple:disabled {
    background-color: #e0e7ff;
    color: #a5b4fc;
    cursor: not-allowed;
}

.body--dark .btn-update-purple {
    background-color: #2563eb;
    color: #ffffff;
}

.body--dark .btn-update-purple:disabled {
    background-color: #1e3a8a;
    color: #60a5fa;
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-update-purple:hover:not(:disabled) {
    opacity: 0.9;
}

.btn-start-disabled {
    background-color: var(--c-secondary);
    color: var(--c-muted-fg);
    border-radius: 6px;
    height: 42px;
    font-size: 14px;
    font-weight: 500;
    flex: 1;
    border: none;
    cursor: not-allowed;
}

.btn-complete-teal {
    background-color: #0d9488;
    color: #ffffff;
    border-radius: 6px;
    height: 42px;
    font-size: 14px;
    font-weight: 500;
    flex: 1;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-complete-teal:hover {
    opacity: 0.9;
}

.btn-start-active {
    background-color: #2563eb;
    color: #ffffff;
    width: 100%;
    border-radius: 6px;
    height: 42px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-start-active:hover:not(:disabled) {
    opacity: 0.9;
}

.btn-start-active:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.popup-select {
    background-color: var(--c-dialog-bg) !important;
    color: var(--c-dialog-title) !important;
    border: 1px solid var(--c-dialog-border) !important;
}

/* Confirm Dialog Styles */
.confirm-card {
    background-color: var(--c-dialog-bg);
    border: 1px solid var(--c-dialog-border);
    border-radius: 10px;
    padding: 20px;
    width: 360px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
}

.confirm-header {
    font-size: 16px;
    font-weight: 500;
    color: var(--c-dialog-title);
    margin-bottom: 12px;
}

.confirm-body {
    font-size: 14px;
    color: #889ab0;
    line-height: 1.5;
    margin-bottom: 20px;
}

.highlight-wo {
    color: var(--c-dialog-title);
    font-weight: 500;
}

.confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.confirm-cancel-btn {
    background-color: var(--c-dialog-bg);
    border: 1px solid var(--c-dialog-border);
    color: #889ab0;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.confirm-cancel-btn:hover {
    background-color: var(--c-secondary);
}

.confirm-ok-btn {
    background-color: #0d9488;
    border: none;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;
}

.confirm-ok-btn:hover {
    opacity: 0.9;
}
</style>
