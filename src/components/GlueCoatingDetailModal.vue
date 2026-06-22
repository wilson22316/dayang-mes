<template>
    <q-dialog v-model="open" persistent>
        <q-card class="dialog-card" style="width:520px;max-height:85vh;overflow-y:auto">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">工單詳情</div>
                <q-space /><q-btn icon="close" flat round dense @click="open = false" />
            </q-card-section>
            <q-card-section v-if="record" class="q-pt-md detail-body">
                <div class="info-grid">
                    <div><div class="label">工單編號</div><div class="val">{{ record.workOrder }}</div></div>
                    <div><div class="label">整體狀態</div><span class="badge" :class="overallCls">{{ overallLabel }}</span></div>
                </div>

                <!-- 調膠階段 -->
                <div class="stage-section">
                    <div class="stage-title">調膠階段</div>
                    <div class="info-grid"><div><div class="label">調膠機台</div><div class="val">{{ record.glueMachine }}</div></div><div><div class="label">區域名稱</div><div class="val">{{ record.glueLocation }}</div></div></div>
                    <div class="info-grid"><div><div class="label">調膠人員</div><div class="val">{{ record.glueOperator }}</div></div><div><div class="label">狀態</div><span class="badge" :class="glueBadgeCls">{{ glueBadgeText }}</span></div></div>
                    <div class="info-grid"><div><div class="label">調膠開工時間</div><div class="val">{{ record.glueStartTime }}</div></div><div><div class="label">調膠完工時間</div><div class="val">{{ record.glueEndTime ?? '—' }}</div></div></div>
                    <div v-if="glueBatchRows.length" class="wo-batch-timeline">
                        <span class="wo-batch-label">膠料批號更新紀錄</span>
                        <div class="batch-chips">
                            <template v-for="(b, i) in glueBatchRows" :key="i">
                                <div class="batch-chip" :class="b.isCompleted ? 'chip-completed' : b.isLast ? 'chip-active' : 'chip-done'">
                                    <div class="chip-no">{{ b.batchNo }}</div>
                                    <div class="chip-sub">{{ b.time }}</div>
                                    <div class="chip-dur" :class="b.isCompleted ? 'dur-completed' : b.isLast ? 'dur-active' : ''">{{ b.duration }}</div>
                                </div>
                                <span v-if="i < glueBatchRows.length - 1" class="chip-arrow">→</span>
                            </template>
                        </div>
                    </div>

                </div>

                <!-- 塗佈階段 -->
                <div class="stage-section">
                    <div class="stage-title">塗佈階段</div>
                    <template v-if="coatingStarted">
                        <div class="info-grid"><div><div class="label">塗佈機台</div><div class="val">{{ record.coatingMachine ?? '—' }}</div></div><div><div class="label">區域名稱</div><div class="val">{{ record.coatingLocation ?? '—' }}</div></div></div>
                        <div class="info-grid"><div><div class="label">塗佈人員</div><div class="val">{{ record.coatingOperator ?? '—' }}</div></div><div><div class="label">狀態</div><span class="badge" :class="coatingBadgeCls">{{ coatingBadgeText }}</span></div></div>
                        <div class="info-grid"><div><div class="label">塗佈開工時間</div><div class="val">{{ record.coatingStartTime }}</div></div><div><div class="label">塗佈完工時間</div><div class="val">{{ record.coatingEndTime ?? '—' }}</div></div></div>
                        <div v-if="coatingBatchRows.length" class="wo-batch-timeline">
                            <span class="wo-batch-label">塗佈批號更新紀錄</span>
                            <div class="batch-chips">
                                <template v-for="(b, i) in coatingBatchRows" :key="i">
                                    <div class="batch-chip" :class="b.isCompleted ? 'chip-completed' : b.isLast ? 'chip-active' : 'chip-done'">
                                        <div class="chip-no">{{ b.batchNo }}</div>
                                        <div class="chip-sub">{{ b.time }}</div>
                                        <div class="chip-dur" :class="b.isCompleted ? 'dur-completed' : b.isLast ? 'dur-active' : ''">{{ b.duration }}</div>
                                    </div>
                                    <span v-if="i < coatingBatchRows.length - 1" class="chip-arrow">→</span>
                                </template>
                            </div>
                        </div>

                    </template>
                    <div v-else class="text-muted">尚未開始塗佈</div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>


</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useWorkRecordsStore } from '@/stores/workRecords.js'

function parseMs(timeStr) {
    if (!timeStr) return null
    return new Date(timeStr.replace(' ', 'T') + ':00').getTime()
}

function formatDuration(startStr, endStr) {
    const start = parseMs(startStr)
    const end   = endStr ? parseMs(endStr) : Date.now()
    if (!start || !end) return '-'
    const totalMins = Math.floor((end - start) / 60000)
    const h = Math.floor(totalMins / 60)
    const m = totalMins % 60
    return h > 0 ? `${h}時${m > 0 ? m + '分' : ''}` : `${m}分`
}

function buildBatchRows(history, stageEndTime = null, stageCompleted = false) {
    if (!history?.length) return []
    return history.map((entry, i) => {
        const isLast = i === history.length - 1
        let duration
        if (!isLast) {
            duration = formatDuration(entry.time, history[i + 1].time)
        } else if (stageEndTime) {
            duration = formatDuration(entry.time, stageEndTime)
        } else {
            duration = formatDuration(entry.time, null) + ' (進行中)'
        }
        return { batchNo: entry.batchNo, time: entry.time, isLast, isCompleted: isLast && stageCompleted, duration }
    })
}

const $q = useQuasar()
const store = useWorkRecordsStore()

const props = defineProps({ modelValue: Boolean, record: Object })
const emit = defineEmits(['update:modelValue'])
const open = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })
const confirmMode = ref(null)
const showConfirm = computed({ get: () => confirmMode.value !== null, set: (v) => { if (!v) confirmMode.value = null } })

const isOverallCompleted = computed(() => props.record?.status === '已完工')
const glueBatchRows    = computed(() => buildBatchRows(
    props.record?.glueBatchHistory,
    props.record?.glueEndTime ?? props.record?.coatingEndTime,
    !!props.record?.glueEndTime || isOverallCompleted.value
))
const coatingBatchRows = computed(() => buildBatchRows(props.record?.coatingBatchHistory, props.record?.coatingEndTime, !!props.record?.coatingEndTime))

const glueActive = computed(() => props.record && (props.record.status === '調膠中' || props.record.status === '調膠塗佈中'))
const coatingActive = computed(() => props.record && (props.record.status === '調膠塗佈中' || props.record.status === '塗佈中'))
const coatingStarted = computed(() => Boolean(props.record?.coatingStartTime))

const overallLabel = computed(() => props.record?.status === '已完工' ? '已完工' : '進行中')
const overallCls = computed(() => props.record?.status === '已完工' ? 'badge-blue' : 'badge-green')

const glueBadgeText = computed(() => {
    const s = props.record?.status
    if (s === '調膠中' || s === '調膠塗佈中') return '調膠中'
    return '已完工'
})
const glueBadgeCls = computed(() => {
    const s = props.record?.status
    if (s === '調膠中' || s === '調膠塗佈中') return 'badge-yellow'
    return 'badge-blue'
})
const coatingBadgeText = computed(() => {
    const s = props.record?.status
    if (s === '已完工') return '已完工'
    if (s === '塗佈中' || s === '調膠塗佈中') return '塗佈中'
    return '待塗佈'
})
const coatingBadgeCls = computed(() => {
    const s = props.record?.status
    if (s === '已完工') return 'badge-blue'
    if (s === '塗佈中' || s === '調膠塗佈中') return 'badge-green'
    return 'badge-muted'
})

function handleConfirm() {
    if (confirmMode.value === 'glue') {
        store.completeGlueStage(props.record.workOrder)
        $q.notify({ type: 'positive', message: '調膠完工', caption: `工單 ${props.record.workOrder} 調膠階段已完工` })
    } else {
        store.completeCoatingStage(props.record.workOrder)
        $q.notify({ type: 'positive', message: '塗佈完工', caption: `工單 ${props.record.workOrder} 塗佈階段已完工` })
    }
    confirmMode.value = null
    open.value = false
}
</script>

<style scoped>
.dialog-card { background: var(--c-dialog-bg); color: var(--c-fg); border: 1px solid var(--c-dialog-border); border-radius: var(--radius-lg); }
.text-h6 { color: var(--c-dialog-title); }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; }
.label { font-size: 14px; color: var(--c-muted-fg); margin-bottom: 4px; }
.val { font-size: 15px; color: var(--c-dialog-title); }
.text-muted { font-size: 14px; color: var(--c-muted-fg); }
.stage-section { padding-top: 12px; border-top: 1px solid var(--c-dialog-border); margin-top: 12px; }
.stage-title { font-size: 14px; font-weight: 500; color: var(--c-dialog-title); margin-bottom: 12px; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.badge-green { background: rgba(34,197,94,0.2); color: var(--c-green); }
.badge-blue { background: rgba(59,130,246,0.2); color: var(--c-blue); }
.badge-yellow { background: rgba(234,179,8,0.2); color: var(--c-yellow); }
.badge-muted { background: var(--c-secondary); color: var(--c-muted-fg); }
/* 批號 chip timeline */
.wo-batch-timeline { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding-top: 0; margin-top: -4px; }
.wo-batch-label { font-size: 14px; color: var(--c-muted-fg); line-height: 1.2; }
.batch-chips { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.batch-chip { padding: 6px 12px; border-radius: 7px; display: flex; flex-direction: column; gap: 1px; min-width: 90px; }
.chip-done { background: var(--c-wo-bg); border: 1px solid var(--c-border); }
.chip-active { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.3); }
.chip-completed { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.3); }
.chip-no { font-size: 16px; font-weight: 600; color: var(--c-fg); }
.chip-sub { font-size: 12px; color: var(--c-muted-fg); margin-top: 1px; }
.chip-dur { font-size: 12px; color: var(--c-muted-fg); margin-top: 2px; }
.dur-active { color: var(--c-green); font-weight: 500; }
.dur-completed { color: var(--c-blue); font-weight: 500; }
.chip-arrow { color: var(--c-muted-fg); font-size: 14px; flex-shrink: 0; }
.teal-btn, .cancel-btn { flex: 1; padding: 8px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; width: 100%; }
.teal-btn { background: var(--c-teal); color: #fff; }
.teal-btn:hover { opacity: 0.85; }
.cancel-btn { background: var(--c-secondary); color: var(--c-secondary-fg); margin-right: 12px; }
</style>
