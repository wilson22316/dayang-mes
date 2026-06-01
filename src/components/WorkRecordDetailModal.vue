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
                    <div class="info-item full-width-grid">
                        <div class="info-label">開工時間</div>
                        <div class="info-val">{{ record.startTime }}</div>
                    </div>
                    <div v-if="record.endTime" class="info-item full-width-grid">
                        <div class="info-label">完工時間</div>
                        <div class="info-val">{{ record.endTime }}</div>
                    </div>
                </div>

                <!-- Batch info, if any, also beautifully formatted -->
                <template v-if="record.glueBatchNo || record.coatingBatchNo">
                    <div class="batch-section">
                        <div v-if="record.glueBatchNo" class="batch-group">
                            <div class="info-label">膠料批號</div>
                            <div class="info-val" style="font-weight: 500; margin-bottom: 6px;">{{ record.glueBatchNo }}</div>
                            <div v-if="record.glueBatchHistory?.length" class="batch-history-box">
                                <div class="history-title">批號更新紀錄</div>
                                <div v-for="(e, i) in record.glueBatchHistory" :key="i" class="history-row">
                                    <span class="h-no">{{ e.batchNo }}</span><span class="h-time">{{ e.time }}</span>
                                </div>
                            </div>
                        </div>
                        <div v-if="record.coatingBatchNo" class="batch-group">
                            <div class="info-label">塗佈批號</div>
                            <div class="info-val" style="font-weight: 500; margin-bottom: 6px;">{{ record.coatingBatchNo }}</div>
                            <div v-if="record.coatingBatchHistory?.length" class="batch-history-box">
                                <div class="history-title">批號更新紀錄</div>
                                <div v-for="(e, i) in record.coatingBatchHistory" :key="i" class="history-row">
                                    <span class="h-no">{{ e.batchNo }}</span><span class="h-time">{{ e.time }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Footer Buttons -->
            <div v-if="record.status === '進行中' && onComplete" class="dialog-footer">
                <button class="btn-complete-teal" @click="confirmOpen = true">完工</button>
            </div>
        </q-card>
    </q-dialog>

    <!-- Confirm Dialog -->
    <q-dialog v-model="confirmOpen" persistent>
        <q-card class="confirm-card">
            <div class="confirm-header">確認完工</div>
            <div class="confirm-body">
                確定要將工單 <strong class="highlight-wo">{{ record?.workOrder }}</strong> 標記為完工？此操作無法撤銷。
            </div>
            <div class="confirm-actions">
                <button class="confirm-cancel-btn" @click="confirmOpen = false">取消</button>
                <button class="confirm-ok-btn" @click="handleComplete">確認完工</button>
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
const emit = defineEmits(['update:modelValue'])
const open = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })
const confirmOpen = ref(false)

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

.batch-section {
    margin-top: 16px;
    border-top: 1px solid var(--c-dialog-border);
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.batch-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.batch-history-box {
    background-color: var(--c-batch-bg);
    border-radius: 6px;
    padding: 10px 12px;
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
</style>
