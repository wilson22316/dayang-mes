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
                    <div v-if="record.glueBatchNo">
                        <div class="label">膠料批號</div><div class="val q-mb-sm" style="font-weight:500">{{ record.glueBatchNo }}</div>
                        <div v-if="record.glueBatchHistory?.length" class="batch-list">
                            <div class="batch-title">批號更新紀錄</div>
                            <div v-for="(e,i) in record.glueBatchHistory" :key="i" class="batch-row"><span class="batch-no">{{ e.batchNo }}</span><span class="batch-time">{{ e.time }}</span></div>
                        </div>
                    </div>
                    <button v-if="glueActive" class="teal-btn q-mt-sm" @click="confirmMode = 'glue'">調膠完工</button>
                </div>

                <!-- 塗佈階段 -->
                <div class="stage-section">
                    <div class="stage-title">塗佈階段</div>
                    <template v-if="coatingStarted">
                        <div class="info-grid"><div><div class="label">塗佈機台</div><div class="val">{{ record.coatingMachine ?? '—' }}</div></div><div><div class="label">區域名稱</div><div class="val">{{ record.coatingLocation ?? '—' }}</div></div></div>
                        <div class="info-grid"><div><div class="label">塗佈人員</div><div class="val">{{ record.coatingOperator ?? '—' }}</div></div><div><div class="label">狀態</div><span class="badge" :class="coatingBadgeCls">{{ coatingBadgeText }}</span></div></div>
                        <div class="info-grid"><div><div class="label">塗佈開工時間</div><div class="val">{{ record.coatingStartTime }}</div></div><div><div class="label">塗佈完工時間</div><div class="val">{{ record.coatingEndTime ?? '—' }}</div></div></div>
                        <div v-if="record.coatingBatchNo">
                            <div class="label">塗佈批號</div><div class="val q-mb-sm" style="font-weight:500">{{ record.coatingBatchNo }}</div>
                            <div v-if="record.coatingBatchHistory?.length" class="batch-list">
                                <div class="batch-title">批號更新紀錄</div>
                                <div v-for="(e,i) in record.coatingBatchHistory" :key="i" class="batch-row"><span class="batch-no">{{ e.batchNo }}</span><span class="batch-time">{{ e.time }}</span></div>
                            </div>
                        </div>
                        <button v-if="coatingActive" class="teal-btn q-mt-sm" @click="confirmMode = 'coating'">塗佈完工</button>
                    </template>
                    <div v-else class="text-muted">尚未開始塗佈</div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>

    <q-dialog v-model="showConfirm" persistent>
        <q-card class="dialog-card" style="width:380px">
            <q-card-section>
                <div class="text-subtitle1" style="font-weight:500">確認完工</div>
                <div class="text-body2 q-mt-sm" style="color:var(--c-muted-fg)">
                    確定要將工單 <strong style="color:var(--c-fg)">{{ record?.workOrder }}</strong> 執行{{ confirmMode === 'glue' ? '調膠完工' : '塗佈完工' }}？此操作無法撤銷。
                </div>
            </q-card-section>
            <q-card-actions class="q-px-md q-pb-md">
                <button class="cancel-btn" @click="confirmMode = null">取消</button>
                <button class="teal-btn" @click="handleConfirm">確認完工</button>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useWorkRecordsStore } from '@/stores/workRecords.js'

const $q = useQuasar()
const store = useWorkRecordsStore()

const props = defineProps({ modelValue: Boolean, record: Object })
const emit = defineEmits(['update:modelValue'])
const open = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })
const confirmMode = ref(null)
const showConfirm = computed({ get: () => confirmMode.value !== null, set: (v) => { if (!v) confirmMode.value = null } })

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
.batch-list { margin-top: 4px; }
.batch-title { font-size: 12px; color: var(--c-muted-fg); margin-bottom: 4px; }
.batch-row { display: flex; justify-content: space-between; font-size: 12px; background: var(--c-batch-bg); border-radius: 4px; padding: 6px 10px; margin-bottom: 4px; }
.batch-no { color: var(--c-dialog-title); font-weight: 500; }
.batch-time { color: var(--c-muted-fg); }
.teal-btn, .cancel-btn { flex: 1; padding: 8px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; width: 100%; }
.teal-btn { background: var(--c-teal); color: #fff; }
.teal-btn:hover { opacity: 0.85; }
.cancel-btn { background: var(--c-secondary); color: var(--c-secondary-fg); margin-right: 12px; }
</style>
