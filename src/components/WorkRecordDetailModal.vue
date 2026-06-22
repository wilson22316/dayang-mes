<template>
    <q-dialog v-model="open" persistent>
        <q-card class="dialog-card">
            <!-- Header -->
            <div class="dialog-header">
                <span class="dialog-title">工單詳情</span>
                <q-btn icon="close" flat round dense class="close-btn" @click="open = false" />
            </div>

            <!-- Body -->
            <div class="dialog-body">
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">工單編號</div>
                        <div class="info-val">{{ record.workOrder }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">狀態</div>
                        <div class="info-val">
                            <span class="status-badge" :class="statusClass(record.status)">{{ record.status }}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">機台分類</div>
                        <div class="info-val">{{ record.category ?? '—' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">機台名稱</div>
                        <div class="info-val">{{ record.machine }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">區域名稱</div>
                        <div class="info-val">{{ record.location ?? '—' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">操作人員</div>
                        <div class="info-val">{{ record.operator }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">開工時間</div>
                        <div class="info-val">{{ record.startTime }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">完工時間</div>
                        <div class="info-val">{{ record.endTime ?? '—' }}</div>
                    </div>
                </div>

                <!-- 批號 chip timeline -->
                <template v-if="rubberBatchRows.length || glueBatchRows.length || coatingBatchRows.length">
                    <div class="batch-chips-section">
                        <div v-if="rubberBatchRows.length" class="wo-batch-timeline">
                            <span class="wo-batch-label">製膠批號更新紀錄</span>
                            <div class="batch-chips">
                                <template v-for="(b, i) in rubberBatchRows" :key="i">
                                    <div class="batch-chip" :class="b.isCompleted ? 'chip-completed' : b.isLast ? 'chip-active' : 'chip-done'">
                                        <div class="chip-no">{{ b.batchNo }}</div>
                                        <div class="chip-sub">{{ b.time }}</div>
                                        <div class="chip-dur" :class="b.isCompleted ? 'dur-completed' : b.isLast ? 'dur-active' : ''">{{ b.duration }}</div>
                                    </div>
                                    <span v-if="i < rubberBatchRows.length - 1" class="chip-arrow">→</span>
                                </template>
                            </div>
                        </div>
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
                    </div>
                </template>

                <!-- AOI 資料（分條機工單才顯示） -->
                <div v-if="isSlittingMachine" class="aoi-section">
                    <div class="aoi-title">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
                        AOI 檢測資料
                    </div>
                    <div class="aoi-file-list">
                        <div v-for="f in aoiFiles" :key="f.name" class="aoi-file-row">
                            <div class="aoi-file-info">
                                <svg class="file-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                <div>
                                    <div class="aoi-file-name">{{ f.name }}</div>
                                    <div class="aoi-file-meta">{{ f.size }} · {{ f.generatedAt }}</div>
                                </div>
                            </div>
                            <button class="aoi-dl-btn" @click.stop="downloadAoi(f)">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                下載
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        </q-card>
    </q-dialog>


</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const props = defineProps({
    modelValue: Boolean,
    record: Object,
    onComplete: Function,
})

/* 批號 chip helpers */
function parseMs(t) {
    if (!t) return null
    return new Date(t.replace(' ', 'T') + ':00').getTime()
}
function formatDuration(s, e) {
    const start = parseMs(s), end = e ? parseMs(e) : Date.now()
    if (!start || !end) return '-'
    const m = Math.floor((end - start) / 60000)
    const h = Math.floor(m / 60)
    return h > 0 ? `${h}時${m % 60 > 0 ? (m % 60) + '分' : ''}` : `${m}分`
}
function buildBatchRows(history, endTime = null) {
    if (!history?.length) return []
    const isCompleted = !!endTime
    return history.map((entry, i) => {
        const isLast = i === history.length - 1
        let duration
        if (!isLast)         duration = formatDuration(entry.time, history[i + 1].time)
        else if (endTime)    duration = formatDuration(entry.time, endTime)
        else                 duration = formatDuration(entry.time, null) + ' (進行中)'
        return { batchNo: entry.batchNo, time: entry.time, isLast, isCompleted: isLast && isCompleted, duration }
    })
}

const rubberBatchRows  = computed(() => buildBatchRows(props.record?.rubberBatchHistory,  props.record?.endTime))
const glueBatchRows    = computed(() => buildBatchRows(props.record?.glueBatchHistory,    props.record?.endTime))
const coatingBatchRows = computed(() => buildBatchRows(props.record?.coatingBatchHistory, props.record?.endTime))
const emit = defineEmits(['update:modelValue'])
const open = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })
const confirmOpen = ref(false)

/* 分條機判斷：machineId 為 CV001 / CV005 / CV006，或名稱含「分條機」 */
const SLITTING_IDS = ['CV001', 'CV005', 'CV006']
const isSlittingMachine = computed(() =>
    SLITTING_IDS.includes(props.record?.machineId) ||
    props.record?.machine?.includes('分條機')
)

/* 根據工單產生對應的 AOI 假資料檔案清單 */
const aoiFiles = computed(() => {
    if (!props.record) return []
    const wo = props.record.workOrder ?? ''
    const date = (props.record.endTime ?? props.record.startTime ?? '').slice(0, 10).replace(/-/g, '')
    return [
        { name: `AOI_結果報告_${wo}_${date}.csv`,  size: '42 KB',  generatedAt: props.record.endTime ?? props.record.startTime ?? '', type: 'summary' },
        { name: `AOI_缺陷明細_${wo}_${date}.csv`, size: '128 KB', generatedAt: props.record.endTime ?? props.record.startTime ?? '', type: 'detail'  },
    ]
})

/* 產生並下載假 CSV */
function downloadAoi(file) {
    const wo       = props.record?.workOrder ?? ''
    const machine  = props.record?.machine   ?? ''
    const operator = props.record?.operator  ?? ''
    const startTime = props.record?.startTime ?? ''
    const endTime   = props.record?.endTime   ?? ''

    let csv = ''
    if (file.type === 'summary') {
        csv = [
            '# AOI 檢測結果報告',
            `工單編號,${wo}`,
            `機台名稱,${machine}`,
            `操作人員,${operator}`,
            `開工時間,${startTime}`,
            `完工時間,${endTime}`,
            '',
            '總檢測數,良品數,不良品數,良率',
            '1200,1185,15,98.75%',
            '',
            '不良類型統計',
            '缺陷類型,數量,比例',
            '邊緣毛刺,8,53.3%',
            '表面刮傷,4,26.7%',
            '尺寸偏差,3,20.0%',
        ].join('\n')
    } else {
        const rows = ['序號,位置,缺陷類型,尺寸(mm),嚴重度,判定']
        const defects = ['邊緣毛刺', '表面刮傷', '尺寸偏差']
        const sevs    = ['輕微', '中等', '嚴重']
        for (let i = 1; i <= 15; i++) {
            const pos = `R${String(Math.ceil(i / 3)).padStart(2, '0')}C${String((i % 3) + 1).padStart(2, '0')}`
            rows.push(`${i},${pos},${defects[i % 3]},${(0.3 + i * 0.07).toFixed(2)},${sevs[Math.floor((i - 1) / 5)]},NG`)
        }
        for (let i = 16; i <= 20; i++) {
            rows.push(`${i},R${String(i - 10).padStart(2, '0')}C01,無,0.00,—,OK`)
        }
        csv = `# AOI 缺陷明細報告\n工單編號,${wo}\n\n` + rows.join('\n')
    }

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = file.name; a.click()
    URL.revokeObjectURL(url)
    $q.notify({ type: 'positive', message: '下載已開始', caption: file.name })
}

function statusClass(s) {
    if (s === '進行中') return 'badge-green'
    if (s === '已完工') return 'badge-blue'
    return 'badge-red'
}

function handleComplete() {
    props.onComplete?.()
    $q.notify({ type: 'positive', message: '完工成功', caption: `工單 ${props.record?.workOrder} 已完工` })
    confirmOpen.value = false
    open.value = false
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
    max-height: 60vh;
    overflow-y: auto;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 24px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.full-width-grid {
    grid-column: span 2;
}

.info-label {
    color: var(--c-muted-fg);
    font-size: 13px;
    font-weight: 400;
}

.info-val {
    color: var(--c-dialog-title);
    font-size: 15px;
    font-weight: 500;
}

.status-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.badge-green {
    background-color: rgba(0, 201, 81, 0.12) !important;
    color: #00c951 !important;
}

.badge-blue {
    background-color: rgba(37, 99, 235, 0.12) !important;
    color: #2563eb !important;
}

.badge-red {
    background-color: rgba(239, 68, 68, 0.12) !important;
    color: #ef4444 !important;
}

/* 批號 chip timeline */
.batch-chips-section {
    margin-top: 0;
    padding-top: 0;
    display: flex;
    flex-direction: column;
}
.wo-batch-timeline { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding-top: 16px; }
.wo-batch-label { font-size: 14px; color: var(--c-muted-fg); line-height: 1.6; }
.batch-chips { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.batch-chip { padding: 6px 12px; border-radius: 7px; display: flex; flex-direction: column; gap: 1px; min-width: 90px; }
.chip-done      { background: var(--c-wo-bg); border: 1px solid var(--c-border); }
.chip-active    { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.3); }
.chip-completed { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.3); }
.chip-no  { font-size: 16px; font-weight: 600; color: var(--c-dialog-title); }
.chip-sub { font-size: 12px; color: var(--c-muted-fg); margin-top: 1px; }
.chip-dur { font-size: 12px; color: var(--c-muted-fg); margin-top: 2px; }
.dur-active    { color: var(--c-green); font-weight: 500; }
.dur-completed { color: var(--c-blue);  font-weight: 500; }
.chip-arrow { color: var(--c-muted-fg); font-size: 14px; flex-shrink: 0; }

.dialog-footer {
    border-top: 1px solid var(--c-dialog-border);
    padding: 16px 24px 24px 24px;
    display: flex;
}

.btn-complete-teal {
    background-color: #0d9488;
    color: #ffffff;
    border-radius: 6px;
    height: 42px;
    font-size: 14px;
    font-weight: 500;
    width: 100%;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
}
.btn-complete-teal:hover {
    opacity: 0.9;
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
    color: var(--c-muted-fg);
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
    color: var(--c-muted-fg);
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

/* AOI 區塊 */
.aoi-section {
    margin-top: 16px;
    border-top: 1px solid var(--c-dialog-border);
    padding-top: 16px;
}
.aoi-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--c-dialog-title);
    margin-bottom: 10px;
}
.aoi-file-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.aoi-file-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--c-wo-bg);
    border: 1px solid var(--c-border);
    border-radius: 7px;
    padding: 10px 12px;
    gap: 12px;
}
.aoi-file-info {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}
.file-icon {
    color: var(--c-muted-fg);
    flex-shrink: 0;
}
.aoi-file-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--c-dialog-title);
    word-break: break-all;
}
.aoi-file-meta {
    font-size: 11px;
    color: var(--c-muted-fg);
    margin-top: 2px;
}
.aoi-dl-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
    height: 30px;
    padding: 0 12px;
    font-size: 12px;
    font-weight: 500;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: opacity 0.2s;
}
.aoi-dl-btn:hover { opacity: 0.85; }
</style>
