import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/* ── Types (via JSDoc) ── */

/**
 * @typedef {{ batchNo: string, time: string }} BatchEntry
 *
 * @typedef {'調膠中'|'待塗佈'|'調膠塗佈中'|'塗佈中'|'已完工'} GCStatus
 *
 * @typedef {{
 *   workOrder: string, workOrderName: string, status: GCStatus,
 *   glueOperator: string, glueStartTime: string, glueEndTime?: string,
 *   glueMachine: string, glueMachineId: string, glueLocation: string,
 *   glueBatchNo?: string, glueBatchHistory?: BatchEntry[],
 *   coatingOperator?: string, coatingStartTime?: string, coatingEndTime?: string,
 *   coatingMachine?: string, coatingMachineId?: string, coatingLocation?: string,
 *   coatingBatchNo?: string, coatingBatchHistory?: BatchEntry[],
 * }} GlueCoatingRecord
 *
 * @typedef {{
 *   id: string, workOrder: string, workOrderName: string,
 *   machine: string, machineId: string, location: string,
 *   category: string, operator: string, startTime: string,
 *   endTime?: string, status: '進行中'|'已完工'|'已刪除',
 *   glueBatchNo?: string, glueBatchHistory?: BatchEntry[],
 *   coatingBatchNo?: string, coatingBatchHistory?: BatchEntry[],
 * }} WorkRecord
 */

function nowString() {
    const n = new Date()
    const pad = (v) => String(v).padStart(2, '0')
    return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())} ${pad(n.getHours())}:${pad(n.getMinutes())}`
}

/** @type {WorkRecord[]} */
const initialRecords = [
    { id: '1', workOrder: 'WO-2026-R001', workOrderName: '產品A製膠工單', machine: '製膠攪拌機', machineId: 'R001', location: 'C棟1F', category: '製膠', operator: '張三', startTime: '2026-05-22 08:00', status: '進行中' },
    { id: '3', workOrder: 'WO-2026-P001', workOrderName: '產品A熱切工單', machine: '熱切分條機', machineId: 'P001', location: 'B棟3樓', category: '本業加工', operator: '王五', startTime: '2026-05-22 07:15', status: '進行中' },
    { id: '4', workOrder: 'WO-2026-CV001', workOrderName: '產品A分條工單', machine: '分條機', machineId: 'CV001', location: 'B棟4樓', category: 'COVER加工', operator: '趙六', startTime: '2026-05-22 10:00', status: '進行中' },
]

/** @type {GlueCoatingRecord[]} */
const initialGCRecords = [
    {
        workOrder: 'WO-2026-G001', workOrderName: '產品A塗佈工單', status: '調膠中',
        glueOperator: '李四', glueStartTime: '2026-05-22 09:30',
        glueMachine: '調膠溫度與啟動', glueMachineId: 'C001', glueLocation: 'B棟1樓',
        glueBatchNo: 'B-2026-001', glueBatchHistory: [{ batchNo: 'B-2026-001', time: '2026-05-22 09:30' }],
    },
]

export const useWorkRecordsStore = defineStore('workRecords', () => {
    /** @type {import('vue').Ref<WorkRecord[]>} */
    const records = ref([...initialRecords])
    /** @type {import('vue').Ref<GlueCoatingRecord[]>} */
    const glueCoatingRecords = ref([...initialGCRecords])

    /* ── Computed ── */

    const activeRecords = computed(() => {
        const nonGActive = records.value.filter((r) => r.status === '進行中')
        const synthetic = []

        for (const r of glueCoatingRecords.value) {
            const glueActive = r.status === '調膠中' || r.status === '調膠塗佈中'
            const coatingActive = r.status === '調膠塗佈中' || r.status === '塗佈中'

            if (glueActive) {
                synthetic.push({
                    id: `gc-glue-${r.workOrder}`, workOrder: r.workOrder, workOrderName: r.workOrderName,
                    machine: r.glueMachine, machineId: r.glueMachineId, location: r.glueLocation,
                    category: '塗佈', operator: r.glueOperator, startTime: r.glueStartTime, status: '進行中',
                    glueBatchNo: r.glueBatchNo, glueBatchHistory: r.glueBatchHistory,
                })
            }
            if (coatingActive) {
                synthetic.push({
                    id: `gc-coating-${r.workOrder}`, workOrder: r.workOrder, workOrderName: r.workOrderName,
                    machine: r.coatingMachine ?? r.glueMachine, machineId: r.coatingMachineId ?? r.glueMachineId,
                    location: r.coatingLocation ?? r.glueLocation, category: '塗佈',
                    operator: r.coatingOperator ?? r.glueOperator, startTime: r.coatingStartTime ?? r.glueStartTime,
                    status: '進行中', coatingBatchNo: r.coatingBatchNo, coatingBatchHistory: r.coatingBatchHistory,
                })
            }
        }
        return [...nonGActive, ...synthetic]
    })

    const completedRecords = computed(() => records.value.filter((r) => r.status === '已完工'))

    /* ── Actions ── */

    function addRecord(record) {
        if (record.workOrder.startsWith('WO-2026-G')) {
            glueCoatingRecords.value.unshift({
                workOrder: record.workOrder, workOrderName: record.workOrderName, status: '調膠中',
                glueOperator: record.operator, glueStartTime: record.startTime,
                glueMachine: record.machine, glueMachineId: record.machineId, glueLocation: record.location,
                glueBatchNo: record.glueBatchNo, glueBatchHistory: record.glueBatchHistory,
            })
        } else {
            records.value.unshift(record)
        }
    }

    function startCoating({ workOrder, workOrderName, operator, machine, machineId, location, coatingBatchNo, startTime }) {
        const idx = glueCoatingRecords.value.findIndex((r) => r.workOrder === workOrder)
        if (idx === -1) return
        const r = { ...glueCoatingRecords.value[idx] }

        if (r.status === '調膠中') {
            r.status = '調膠塗佈中'
        } else if (r.status === '待塗佈') {
            r.status = '塗佈中'
        } else return

        Object.assign(r, {
            coatingOperator: operator, coatingStartTime: startTime,
            coatingMachine: machine, coatingMachineId: machineId, coatingLocation: location,
            coatingBatchNo, coatingBatchHistory: coatingBatchNo ? [{ batchNo: coatingBatchNo, time: startTime }] : [],
        })
        glueCoatingRecords.value.splice(idx, 1, r)
    }

    function completeRecord(id) {
        const idx = records.value.findIndex((r) => r.id === id)
        if (idx !== -1) {
            records.value.splice(idx, 1, { ...records.value[idx], status: '已完工', endTime: nowString() })
        }
    }

    function completeGlueStage(workOrder) {
        const now = nowString()
        const idx = glueCoatingRecords.value.findIndex((r) => r.workOrder === workOrder)
        if (idx === -1) return
        const r = { ...glueCoatingRecords.value[idx] }
        if (r.status === '調膠中') r.status = '待塗佈'
        else if (r.status === '調膠塗佈中') r.status = '塗佈中'
        else return
        r.glueEndTime = now
        glueCoatingRecords.value.splice(idx, 1, r)
    }

    function completeCoatingStage(workOrder) {
        const now = nowString()
        const idx = glueCoatingRecords.value.findIndex((r) => r.workOrder === workOrder)
        if (idx === -1) return
        const r = { ...glueCoatingRecords.value[idx] }
        if (r.status === '塗佈中' || r.status === '調膠塗佈中') {
            r.status = '已完工'
            r.coatingEndTime = now
            glueCoatingRecords.value.splice(idx, 1, r)
        }
    }

    function completeByWorkOrder(workOrderId) {
        const idx = records.value.findIndex((r) => r.workOrder === workOrderId && r.status === '進行中')
        if (idx !== -1) {
            records.value.splice(idx, 1, { ...records.value[idx], status: '已完工', endTime: nowString() })
        }
    }

    function updateGlueBatch(workOrder, batchNo) {
        const now = nowString()
        const idx = glueCoatingRecords.value.findIndex((r) => r.workOrder === workOrder)
        if (idx === -1) return
        const r = { ...glueCoatingRecords.value[idx] }
        r.glueBatchNo = batchNo
        r.glueBatchHistory = [...(r.glueBatchHistory ?? []), { batchNo, time: now }]
        glueCoatingRecords.value.splice(idx, 1, r)
    }

    function updateCoatingBatch(workOrder, batchNo) {
        const now = nowString()
        const idx = glueCoatingRecords.value.findIndex((r) => r.workOrder === workOrder)
        if (idx === -1) return
        const r = { ...glueCoatingRecords.value[idx] }
        r.coatingBatchNo = batchNo
        r.coatingBatchHistory = [...(r.coatingBatchHistory ?? []), { batchNo, time: now }]
        glueCoatingRecords.value.splice(idx, 1, r)
    }

    return {
        records, glueCoatingRecords,
        activeRecords, completedRecords,
        addRecord, startCoating, completeRecord,
        completeGlueStage, completeCoatingStage, completeByWorkOrder,
        updateGlueBatch, updateCoatingBatch,
    }
})
