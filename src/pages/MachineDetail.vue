<template>
    <div class="page">
        <div v-if="!machine" class="center-msg">機台資料不存在</div>
        <template v-else>
            <!-- Header -->
            <div class="header">
                <button class="back-btn" @click="goBack"><ArrowLeft :size="20" /></button>
                <div>
                    <div class="machine-name-row">
                        <div class="machine-name">{{ machine.name }}</div>
                        <div class="status-pill" :class="statusCfg.cls">
                            <component :is="statusCfg.icon" :size="16" /><span>{{ statusCfg.text }}</span>
                        </div>
                    </div>
                    <div class="machine-sub">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {{ machine.location }}
                        <span class="machine-sub-sep">·</span>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        {{ machine.category }}
                    </div>
                </div>
            </div>

            <!-- Active Work Order -->
            <div class="wo-card">
                <div class="wo-col"><div class="wo-label">當前工單</div><div class="wo-val fw-500">{{ activeRecord?.workOrder ?? '-' }}</div></div>
                <div class="wo-col"><div class="wo-label">操作人員</div><div class="wo-val">{{ activeRecord?.operator ?? '-' }}</div></div>
                <div class="wo-col"><div class="wo-label">開工時間</div><div class="wo-val">{{ activeRecord?.startTime ?? '-' }}</div></div>
                <div v-if="activeRecord?.glueBatchNo" class="wo-col"><div class="wo-label">膠料批號</div><div class="wo-val">{{ activeRecord.glueBatchNo }}</div></div>
                <div v-if="activeRecord?.coatingBatchNo" class="wo-col"><div class="wo-label">塗佈批號</div><div class="wo-val">{{ activeRecord.coatingBatchNo }}</div></div>
            </div>

            <!-- Coating Machine 2 Tabs -->
            <q-tabs v-if="machineId === 'C006'" v-model="activeTab" active-color="primary" indicator-color="primary" align="left" narrow-indicator class="q-mb-md tab-bar">
                <q-tab name="device" label="設備" />
                <q-tab name="temperature" label="溫度" />
            </q-tabs>

            <!-- Coating Machine 2 Specialized Dashboard -->
            <template v-if="machineId === 'C006'">
                <div v-if="activeTab === 'device'" class="coating-dashboard">
                <!-- Card 1: 電壓表 -->
                <div class="coating-card">
                    <div class="card-header">
                        <Zap :size="16" class="header-icon yellow-icon" />
                        <span>電壓表(CP01)</span>
                    </div>
                    <div class="card-body">
                        <table class="voltage-table">
                            <thead>
                                <tr>
                                    <th align="left">序列</th>
                                    <th align="right">電壓(Vac)</th>
                                    <th align="right">電流(A)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td align="left">
                                        <span class="status-dot dot-r"></span>
                                        R 相
                                    </td>
                                    <td align="right" class="val">390.2</td>
                                    <td align="right" class="val">3.2</td>
                                </tr>
                                <tr>
                                    <td align="left">
                                        <span class="status-dot dot-s"></span>
                                        S 相
                                    </td>
                                    <td align="right" class="val">397.6</td>
                                    <td align="right" class="val">5.8</td>
                                </tr>
                                <tr>
                                    <td align="left">
                                        <span class="status-dot dot-t"></span>
                                        T 相
                                    </td>
                                    <td align="right" class="val">392.8</td>
                                    <td align="right" class="val">4.9</td>
                                </tr>
                                <tr class="total-row">
                                    <td align="left">總功率</td>
                                    <td colspan="2" align="right" class="val">
                                        27 <span class="unit">Kw</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Card 2: 各段傳動速度 -->
                <div class="coating-card">
                    <div class="card-header">
                        <Gauge :size="16" class="header-icon" />
                        <span>各段傳動速度(MPM)</span>
                    </div>
                    <div class="card-body speed-body">
                        <div class="speed-grid">
                            <div class="speed-col">
                                <div class="speed-item">
                                    <span class="item-label">主爐傳動軸 1</span>
                                    <span class="item-val">0.0 <span class="unit">MPM</span></span>
                                </div>
                                <div class="speed-item">
                                    <span class="item-label">主爐傳動軸 3</span>
                                    <span class="item-val">0.0 <span class="unit">MPM</span></span>
                                </div>
                                <div class="speed-item">
                                    <span class="item-label">底膠塗佈爐傳動</span>
                                    <span class="item-val">0.0 <span class="unit">MPM</span></span>
                                </div>
                                <div class="speed-item">
                                    <span class="item-label">引料軸 3</span>
                                    <span class="item-val">0.0 <span class="unit">MPM</span></span>
                                </div>
                                <div class="speed-item">
                                    <span class="item-label">上膠前驅動 2</span>
                                    <span class="item-val">0.0 <span class="unit">MPM</span></span>
                                </div>
                                <div class="speed-item">
                                    <span class="item-label">打底段傳動軸</span>
                                    <span class="item-val">0.0 <span class="unit">MPM</span></span>
                                </div>
                                <div class="speed-item">
                                    <span class="item-label">收卷軸 A</span>
                                    <span class="item-val">0.0 <span class="unit">MPM</span></span>
                                </div>
                            </div>
                            <div class="speed-col">
                                <div class="speed-item">
                                    <span class="item-label">主爐傳動軸 2</span>
                                    <span class="item-val">0.0 <span class="unit">MPM</span></span>
                                </div>
                                <div class="speed-item">
                                    <span class="item-label">回棒塗佈輪</span>
                                    <span class="item-val">
                                        0.0 <span class="unit">Kg</span> 0.0 <span class="unit">MPM</span>
                                    </span>
                                </div>
                                <div class="speed-item">
                                    <span class="item-label">主爐冷風相傳動</span>
                                    <span class="item-val">0.0 <span class="unit">MPM</span></span>
                                </div>
                                <div class="speed-item">
                                    <span class="item-label">引料軸 4</span>
                                    <span class="item-val">0.0 <span class="unit">MPM</span></span>
                                </div>
                                <div class="speed-item">
                                    <span class="item-label">上膠前驅動 3</span>
                                    <span class="item-val">0.0 <span class="unit">MPM</span></span>
                                </div>
                                <div class="speed-item">
                                    <span class="item-label">烘箱主傳動軸</span>
                                    <span class="item-val">0.0 <span class="unit">MPM</span></span>
                                </div>
                                <div class="speed-item">
                                    <span class="item-label">收卷軸 B</span>
                                    <span class="item-val">0.0 <span class="unit">MPM</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 3: 系統張力與控制 -->
                <div class="coating-card">
                    <div class="card-header">
                        <Activity :size="16" class="header-icon" />
                        <span>系統張力與控制(N/mm)</span>
                    </div>
                    <div class="card-body tension-body">
                        <div class="tension-list">
                            <div class="tension-item" v-for="(item, idx) in tensionItems" :key="idx">
                                <span class="item-num">0.0</span>
                                <span class="unit">{{ item.unit }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab: 溫度 -->
            <div v-else-if="activeTab === 'temperature'" class="coating-temp-panel">
                    <div class="temp-table-card">
                        <table class="temp-data-table">
                            <thead>
                                <tr>
                                    <th class="col-name" align="left">傳動馬達名稱</th>
                                    <th align="center">異常碼</th>
                                    <th align="center">傳動狀態</th>
                                    <th align="right">速度顯示</th>
                                    <th align="right">電流(A)</th>
                                    <th align="right">張力(kg)</th>
                                    <th align="right">比例(%)</th>
                                    <th align="right">張力(kg)</th>
                                    <th align="right">舞動輪(%)</th>
                                    <th align="right">長度(M)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, idx) in tempTableData" :key="idx">
                                    <td class="col-name" align="left">
                                        <span class="motor-dot"></span>
                                        {{ row.name }}
                                    </td>
                                    <td align="center">
                                        <span class="err-badge">{{ row.errCode }}</span>
                                    </td>
                                    <td align="center">
                                        <span class="status-capsule">
                                            <span class="status-inner-dot"></span>
                                            {{ row.status }}
                                        </span>
                                    </td>
                                    <td align="right" class="val-white">{{ row.speed }}</td>
                                    <td align="right" class="val-white">{{ row.current }}</td>
                                    <td align="right" class="val-white">{{ row.tension1 }}</td>
                                    <td align="right" class="val-white">{{ row.ratio }}</td>
                                    <td align="right" class="val-white">{{ row.tension2 }}</td>
                                    <td align="right" :class="getDanceWheelClass(row.danceWheel)">
                                        {{ row.danceWheel }}
                                    </td>
                                    <td align="right" class="val-white">{{ row.length }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>

            <!-- Lamination Machine Specialized Dashboard -->
            <template v-else-if="machineId === 'L001'">
                <!-- Lamination Tabs -->
                <q-tabs v-model="activeLamTab" active-color="primary" indicator-color="primary" align="left" narrow-indicator class="q-mb-md tab-bar">
                    <q-tab name="main_1" label="主控控制 1" />
                    <q-tab name="main_2" label="主控控制 2" />
                    <q-tab name="main_3" label="主控控制 3" />
                    <q-tab name="heat" label="電熱控制" />
                </q-tabs>

                <!-- Tab: 主控控制 1 -->
                <div v-if="activeLamTab === 'main_1'" class="lam-panel">
                    <div class="lam-grid-top">
                        <!-- 放捲單元 -->
                        <div class="lam-card">
                            <div class="card-header justify-between">
                                <span>放捲 單元</span>
                                <div>
                                    <span class="lam-badge yellow">A</span>
                                    <span class="lam-badge red">下</span>
                                    <span class="lam-badge green">載入</span>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="lam-row">
                                    <span class="lam-label">預設直徑</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">280</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">實際直徑</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">364</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">生產張力</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-green">10.0</span>
                                        <span class="unit">kg</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">舞輪位置</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">46</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="capsule-row mt-auto">
                                    <span class="lam-label">放捲 單元</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">2</span>
                                        <span class="unit">m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 表面處理 & 烘箱 -->
                        <div class="lam-card">
                            <div class="card-header justify-between">
                                <span>表面處理 & 烘箱</span>
                                <span class="lam-badge orange status-badge">加熱中</span>
                            </div>
                            <div class="card-body">
                                <div class="lam-row">
                                    <span class="lam-label">差速設定</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-green">-1.0</span>
                                        <span class="unit">%</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">舞輪位置</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-green">52</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">電熱開關</span>
                                    <div class="lam-value-box">
                                        <span class="switch-badge green">ON</span>
                                    </div>
                                </div>
                                <div class="capsule-container mt-auto">
                                    <div class="lam-row">
                                        <span class="lam-label">溫度設定值</span>
                                        <div class="lam-value-box">
                                            <span class="lam-val dark-green">110</span>
                                            <span class="unit">℃</span>
                                        </div>
                                    </div>
                                    <div class="lam-row-divider"></div>
                                    <div class="lam-row">
                                        <span class="lam-label">溫度實際值</span>
                                        <div class="lam-value-box">
                                            <span class="lam-val dark-green">19</span>
                                            <span class="unit">℃</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 三合一 單元 -->
                        <div class="lam-card">
                            <div class="card-header justify-between">
                                <span>三合一 單元</span>
                                <div>
                                    <span class="lam-badge yellow">B</span>
                                    <span class="lam-badge red">下</span>
                                    <span class="lam-badge green">載入</span>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="lam-row">
                                    <span class="lam-label">預設直徑</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">350</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">實際直徑</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">350</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">生產張力</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-green">7.0</span>
                                        <span class="unit">kg</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">舞輪位置</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">-76</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="capsule-row mt-auto">
                                    <span class="lam-label">放捲 米數</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">2</span>
                                        <span class="unit">m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 修邊輪1 單元 -->
                        <div class="lam-card">
                            <div class="card-header">
                                <span>修邊輪1 單元</span>
                            </div>
                            <div class="card-body">
                                <div class="lam-row">
                                    <span class="lam-label">差速設定</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">12.0</span>
                                        <span class="unit">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 導出輪單元 -->
                        <div class="lam-card">
                            <div class="card-header">
                                <span>導出輪單元</span>
                            </div>
                            <div class="card-body">
                                <div class="lam-row">
                                    <span class="lam-label">導出生產張力</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">15</span>
                                        <span class="unit">kg</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">導出張力顯示</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">0</span>
                                        <span class="unit">kg</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lam-grid-bottom q-mt-md">
                        <!-- 主線控制 設定 -->
                        <div class="lam-card">
                            <div class="card-header">主線控制 設定</div>
                            <div class="card-body">
                                <div class="lam-row">
                                    <span class="lam-label">生產線速設定</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">20</span>
                                        <span class="unit">m/min</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">慢速線速設定</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">5</span>
                                        <span class="unit">m/min</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">實際運行線速</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">0</span>
                                        <span class="unit">m/min</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 右側整合大容器 -->
                        <div class="lam-card lam-combined-card">
                            <div class="card-body combined-body">
                                <!-- 押出機 A_100mm -->
                                <div class="lam-card lam-card-flat">
                                    <div class="card-header justify-between">
                                        <span>押出機 A_100mm</span>
                                        <span class="lam-badge cyan status-badge">手動運轉中</span>
                                    </div>
                                    <div class="card-body">
                                        <div class="lam-row">
                                            <span class="lam-label">厚度設定</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val dark-green">12.0</span>
                                                <span class="unit">μm</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">轉速</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">32</span>
                                                <span class="unit">rpm</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">手動轉速</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">32</span>
                                                <span class="unit">rpm</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 操作鏈盤 -->
                                <div class="lam-card lam-card-flat">
                                    <div class="card-header">操作鏈盤</div>
                                    <div class="card-body">
                                        <div class="chain-grid">
                                            <div class="chain-col">
                                                <div class="lam-row">
                                                    <span class="lam-label">冷凍入水 1</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">20</span>
                                                        <span class="unit">℃</span>
                                                    </div>
                                                </div>
                                                <div class="lam-row">
                                                    <span class="lam-label">冷凍出水 1</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">22</span>
                                                        <span class="unit">℃</span>
                                                    </div>
                                                </div>
                                                <div class="lam-row">
                                                    <span class="lam-label">淋膜高度 A</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">144</span>
                                                        <span class="unit">mm</span>
                                                    </div>
                                                </div>
                                                <div class="lam-row">
                                                    <span class="lam-label">A-電流值</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">64</span>
                                                        <span class="unit">A</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="chain-col">
                                                <div class="lam-row">
                                                    <span class="lam-label">A-換網壓力</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">208</span>
                                                        <span class="unit">bar</span>
                                                    </div>
                                                </div>
                                                <div class="lam-row">
                                                    <span class="lam-label">A-彎頭壓力</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val dark-white">0</span>
                                                        <span class="unit">bar</span>
                                                    </div>
                                                </div>
                                                <div class="lam-row">
                                                    <span class="lam-label">A-融膠溫度</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">336</span>
                                                        <span class="unit">℃</span>
                                                    </div>
                                                </div>
                                                <div class="lam-row">
                                                    <span class="lam-label">A-入料座</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">31</span>
                                                        <span class="unit">℃</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: 主控控制 2 -->
                <div v-else-if="activeLamTab === 'main_2'" class="lam-panel">
                    <div class="lam-grid-top">
                        <!-- 表面處理 & 烘箱 -->
                        <div class="lam-card">
                            <div class="card-header justify-between">
                                <span>表面處理 & 烘箱</span>
                                <span class="lam-badge orange status-badge">加熱中</span>
                            </div>
                            <div class="card-body">
                                <div class="lam-row">
                                    <span class="lam-label">差速設定</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-green">-1.0</span>
                                        <span class="unit">%</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">舞輪位置</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-green">52</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">電熱開關</span>
                                    <div class="lam-value-box">
                                        <span class="switch-badge green">ON</span>
                                    </div>
                                </div>
                                <div class="capsule-container mt-auto">
                                    <div class="lam-row">
                                        <span class="lam-label">溫度設定值</span>
                                        <div class="lam-value-box">
                                            <span class="lam-val dark-green">110</span>
                                            <span class="unit">℃</span>
                                        </div>
                                    </div>
                                    <div class="lam-row-divider"></div>
                                    <div class="lam-row">
                                        <span class="lam-label">溫度實際值</span>
                                        <div class="lam-value-box">
                                            <span class="lam-val dark-green">19</span>
                                            <span class="unit">℃</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 三合一 單元 -->
                        <div class="lam-card">
                            <div class="card-header justify-between">
                                <span>三合一 單元</span>
                                <div>
                                    <span class="lam-badge yellow">B</span>
                                    <span class="lam-badge red">下</span>
                                    <span class="lam-badge green">載入</span>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="lam-row">
                                    <span class="lam-label">預設直徑</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">350</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">實際直徑</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">350</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">生產張力</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-green">7.0</span>
                                        <span class="unit">kg</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">舞輪位置</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">-76</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="capsule-row mt-auto">
                                    <span class="lam-label">放捲 米數</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">2</span>
                                        <span class="unit">m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 冷卻輪1 & 冷卻輪2 -->
                        <div class="lam-card">
                            <div class="card-body">
                                <div class="capsule-row title-row">
                                    <span>冷卻輪1 & 冷卻輪2</span>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">冷卻2 生產張力</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">12.0</span>
                                        <span class="unit">kg</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">冷卻2 舞輪位置</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">18</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="capsule-row title-row q-mt-sm">
                                    <span>修邊輪1 & 修邊輪2</span>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">修邊1 差速設定</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">12.0</span>
                                        <span class="unit">%</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">修邊2 差速設定</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">0</span>
                                        <span class="unit">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 導出輪單元 -->
                        <div class="lam-card">
                            <div class="card-header">
                                <span>導出輪單元</span>
                            </div>
                            <div class="card-body">
                                <div class="lam-row">
                                    <span class="lam-label">導出生產張力</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">15</span>
                                        <span class="unit">kg</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">導出張力顯示</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">0</span>
                                        <span class="unit">kg</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 收卷單元 -->
                        <div class="lam-card">
                            <div class="card-header justify-between">
                                <span>收卷單元</span>
                                <div>
                                    <span class="lam-badge yellow">B</span>
                                    <span class="lam-badge red">下</span>
                                    <span class="lam-badge green">載入</span>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="lam-row">
                                    <span class="lam-label">預設直徑</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">170</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">實際直徑</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">170</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">生產張力</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">15.0</span>
                                        <span class="unit">kg</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">舞輪位置</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">32</span>
                                        <span class="unit">mm</span>
                                    </div>
                                </div>
                                <div class="capsule-row mt-auto">
                                    <span class="lam-label">收捲 米數</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">2</span>
                                        <span class="unit">m</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lam-grid-bottom q-mt-md">
                        <!-- 主線控制 設定 -->
                        <div class="lam-card">
                            <div class="card-header">主線控制 設定</div>
                            <div class="card-body">
                                <div class="lam-row">
                                    <span class="lam-label">生產線速設定</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">20</span>
                                        <span class="unit">m/min</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">慢速線速設定</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val green-bg">5</span>
                                        <span class="unit">m/min</span>
                                    </div>
                                </div>
                                <div class="lam-row">
                                    <span class="lam-label">實際運行線速</span>
                                    <div class="lam-value-box">
                                        <span class="lam-val dark-white">0</span>
                                        <span class="unit">m/min</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 右側整合大容器 -->
                        <div class="lam-card lam-combined-card">
                            <div class="card-body combined-body">
                                <!-- 押出機 A_100mm -->
                                <div class="lam-card lam-card-flat">
                                    <div class="card-header justify-between">
                                        <span>押出機 A_100mm</span>
                                        <span class="lam-badge red status-badge">停止 | 手動</span>
                                    </div>
                                    <div class="card-body">
                                        <div class="lam-row">
                                            <span class="lam-label">攪拌時間</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">15</span>
                                                <span class="unit">s</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">下料時間</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">15</span>
                                                <span class="unit">s</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">厚度設定</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val dark-green">9.0</span>
                                                <span class="unit">μm</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">轉速</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val dark-white">0</span>
                                                <span class="unit">rpm</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">手動轉速</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">3</span>
                                                <span class="unit">rpm</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 操作鏈盤 -->
                                <div class="lam-card lam-card-flat">
                                    <div class="card-header">操作鏈盤</div>
                                    <div class="card-body">
                                        <div class="chain-grid">
                                            <div class="chain-col">
                                                <div class="lam-row">
                                                    <span class="lam-label">冷凍入水 1</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">20</span>
                                                        <span class="unit">℃</span>
                                                    </div>
                                                </div>
                                                <div class="lam-row">
                                                    <span class="lam-label">冷凍出水 1</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">22</span>
                                                        <span class="unit">℃</span>
                                                    </div>
                                                </div>
                                                <div class="lam-row">
                                                    <span class="lam-label">淋膜高度 A</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">144</span>
                                                        <span class="unit">mm</span>
                                                    </div>
                                                </div>
                                                <div class="lam-row">
                                                    <span class="lam-label">A-電流值</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">64</span>
                                                        <span class="unit">A</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="chain-col">
                                                <div class="lam-row">
                                                    <span class="lam-label">A-換網壓力</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">208</span>
                                                        <span class="unit">bar</span>
                                                    </div>
                                                </div>
                                                <div class="lam-row">
                                                    <span class="lam-label">A-彎頭壓力</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val dark-white">0</span>
                                                        <span class="unit">bar</span>
                                                    </div>
                                                </div>
                                                <div class="lam-row">
                                                    <span class="lam-label">A-融膠溫度</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">336</span>
                                                        <span class="unit">℃</span>
                                                    </div>
                                                </div>
                                                <div class="lam-row">
                                                    <span class="lam-label">A-入料座</span>
                                                    <div class="lam-value-box">
                                                        <span class="lam-val green-bg">31</span>
                                                        <span class="unit">℃</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: 主控控制 3 -->
                <div v-else-if="activeLamTab === 'main_3'" class="lam-panel">
                    <div class="lam-grid-twin">
                        <!-- 押出機 A (100mm) -->
                        <div class="lam-card">
                            <div class="card-header justify-between">
                                <span>押出機 A (100mm)</span>
                                <span class="lam-badge cyan status-badge">手動運轉中</span>
                            </div>
                            <div class="card-body">
                                <div class="chain-grid">
                                    <div class="chain-col">
                                        <div class="lam-row">
                                            <span class="lam-label">手動設定</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">32</span>
                                                <span class="unit">rpm</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">換網壓力</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">208</span>
                                                <span class="unit">℃</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">厚度設定</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">12.0</span>
                                                <span class="unit">pm</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">實際轉速</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">32</span>
                                                <span class="unit">r.p.m</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">原料比重</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">0.92</span>
                                                <span class="unit">%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chain-col">
                                        <div class="lam-row">
                                            <span class="lam-label">熔膠溫度</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">336</span>
                                                <span class="unit">℃</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">彎頭壓力</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val dark-white">0</span>
                                                <span class="unit">bar</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">寬度設定</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">1250</span>
                                                <span class="unit">mm</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">押出生產量</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">96.0</span>
                                                <span class="unit">kg/hr</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">螺桿轉比</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">3.00</span>
                                                <span class="unit">ratio</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="chain-bottom-row">
                                    <div class="bottom-item">
                                        <span class="lam-label">手動慢速</span>
                                        <div class="lam-value-box">
                                            <span class="lam-val green-bg">5</span>
                                        </div>
                                    </div>
                                    <div class="bottom-item">
                                        <span class="lam-label">手動下限</span>
                                        <div class="lam-value-box">
                                            <span class="lam-val green-bg">3</span>
                                        </div>
                                    </div>
                                    <div class="bottom-item">
                                        <span class="lam-label">加速設定</span>
                                        <div class="lam-value-box">
                                            <span class="lam-val green-bg">2</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 押出機 B (100mm) -->
                        <div class="lam-card">
                            <div class="card-header justify-between">
                                <span>押出機 B (100mm)</span>
                                <span class="lam-badge cyan status-badge">手動運轉中</span>
                            </div>
                            <div class="card-body">
                                <div class="chain-grid">
                                    <div class="chain-col">
                                        <div class="lam-row">
                                            <span class="lam-label">手動設定</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">32</span>
                                                <span class="unit">rpm</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">換網壓力</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">208</span>
                                                <span class="unit">℃</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">厚度設定</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">12.0</span>
                                                <span class="unit">pm</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">實際轉速</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">32</span>
                                                <span class="unit">r.p.m</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">原料比重</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">0.92</span>
                                                <span class="unit">%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chain-col">
                                        <div class="lam-row">
                                            <span class="lam-label">熔膠溫度</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">336</span>
                                                <span class="unit">℃</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">彎頭壓力</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val dark-white">0</span>
                                                <span class="unit">bar</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">寬度設定</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">1250</span>
                                                <span class="unit">mm</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">押出生產量</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">96.0</span>
                                                <span class="unit">kg/hr</span>
                                            </div>
                                        </div>
                                        <div class="lam-row">
                                            <span class="lam-label">螺桿轉比</span>
                                            <div class="lam-value-box">
                                                <span class="lam-val green-bg">3.00</span>
                                                <span class="unit">ratio</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: 電熱控制 -->
                <div v-else-if="activeLamTab === 'heat'" class="lam-panel">
                    <div class="heat-twin-grid">
                        <!-- 電熱控制A -->
                        <div class="heat-ctrl-section">
                            <div class="heat-ctrl-title">電熱控制A</div>
                            <div class="heat-sub-grid">
                                <!-- 模頭 A -->
                                <div class="lam-card">
                                    <div class="card-header justify-between">
                                        <span>模頭</span>
                                        <div>
                                            <span class="lam-badge yellow">+5</span>
                                            <button class="heat-btn edit-btn">修改</button>
                                            <button class="heat-btn apply-btn">套用</button>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="heat-list">
                                            <div v-for="i in 9" :key="'mold-a-'+i" class="heat-row">
                                                <span class="heat-label">模頭 {{ 10 - i }}</span>
                                                <div class="heat-vals">
                                                    <span class="heat-val-real">59.5</span>
                                                    <span class="lam-val dark-white">330</span>
                                                    <span class="lam-val dark-red">330</span>
                                                    <span class="unit">℃</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 押出機 A -->
                                <div class="lam-card">
                                    <div class="card-header justify-between">
                                        <span>押出機</span>
                                        <div>
                                            <span class="lam-badge yellow">-5</span>
                                            <button class="heat-btn edit-btn">修改</button>
                                            <button class="heat-btn apply-btn">套用</button>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="heat-list">
                                            <div class="heat-row" v-for="(v, index) in [
                                                {n:'輸料桶 1', r:210, s:210},
                                                {n:'輸料桶 2', r:260, s:260},
                                                {n:'輸料桶 3', r:310, s:310},
                                                {n:'輸料桶 4', r:330, s:330},
                                                {n:'輸料桶 5', r:330, s:330},
                                                {n:'換網', r:330, s:330},
                                                {n:'彎頭 1', r:330, s:330},
                                                {n:'彎頭 2', r:330, s:330}
                                            ]" :key="'extr-a-'+index">
                                                <span class="heat-label">{{ v.n }}</span>
                                                <div class="heat-vals">
                                                    <span class="heat-val-real">{{ v.r }}.0</span>
                                                    <span class="lam-val dark-white">{{ v.s }}</span>
                                                    <span class="lam-val dark-red">{{ v.s }}</span>
                                                    <span class="unit">℃</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 電熱控制B -->
                        <div class="heat-ctrl-section">
                            <div class="heat-ctrl-title">電熱控制B</div>
                            <div class="heat-sub-grid">
                                <!-- 模頭 B -->
                                <div class="lam-card">
                                    <div class="card-header justify-between">
                                        <span>模頭</span>
                                        <div>
                                            <span class="lam-badge yellow">+5</span>
                                            <button class="heat-btn edit-btn">修改</button>
                                            <button class="heat-btn apply-btn">套用</button>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="heat-list">
                                            <div v-for="i in 9" :key="'mold-b-'+i" class="heat-row">
                                                <span class="heat-label">模頭 {{ 10 - i }}</span>
                                                <div class="heat-vals">
                                                    <span class="heat-val-real">59.5</span>
                                                    <span class="lam-val dark-white">330</span>
                                                    <span class="lam-val dark-red">330</span>
                                                    <span class="unit">℃</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 押出機 B -->
                                <div class="lam-card">
                                    <div class="card-header justify-between">
                                        <span>押出機</span>
                                        <div>
                                            <span class="lam-badge yellow">-5</span>
                                            <button class="heat-btn edit-btn">修改</button>
                                            <button class="heat-btn apply-btn">套用</button>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="heat-list">
                                            <div class="heat-row" v-for="(v, index) in [
                                                {n:'輸料桶 1', r:210, s:210},
                                                {n:'輸料桶 2', r:260, s:260},
                                                {n:'輸料桶 3', r:310, s:310},
                                                {n:'輸料桶 4', r:330, s:330},
                                                {n:'輸料桶 5', r:330, s:330},
                                                {n:'換網', r:330, s:330},
                                                {n:'彎頭 1', r:330, s:330},
                                                {n:'彎頭 2', r:330, s:330}
                                            ]" :key="'extr-b-'+index">
                                                <span class="heat-label">{{ v.n }}</span>
                                                <div class="heat-vals">
                                                    <span class="heat-val-real">{{ v.r }}.0</span>
                                                    <span class="lam-val dark-white">{{ v.s }}</span>
                                                    <span class="lam-val dark-red">{{ v.s }}</span>
                                                    <span class="unit">℃</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 電熱控制最底下的時間控制 -->
                    <div class="heat-bottom-row q-mt-md">
                        <!-- 預設時間 A -->
                        <div class="lam-card">
                            <div class="card-header heat-time-header"><Calendar :size="14" />&nbsp;預設時間</div>
                            <div class="card-body">
                                <div class="time-row">
                                    <button class="time-btn green">預熱</button>
                                    <div class="time-box green-theme">
                                        <div class="time-unit">
                                            <span class="tu-label">月</span>
                                            <span class="tu-val">1</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">日</span>
                                            <span class="tu-val">8</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">時</span>
                                            <span class="tu-val">19</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">分</span>
                                            <span class="tu-val">30</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="time-row">
                                    <button class="time-btn red">生產</button>
                                    <div class="time-box red-theme">
                                        <div class="time-unit">
                                            <span class="tu-label">月</span>
                                            <span class="tu-val">2</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">日</span>
                                            <span class="tu-val">9</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">時</span>
                                            <span class="tu-val">11</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">分</span>
                                            <span class="tu-val">22</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 加熱計時器 A -->
                        <div class="lam-card">
                            <div class="card-header heat-time-header"><Timer :size="14" />&nbsp;加熱計時器</div>
                            <div class="card-body">
                                <div class="time-row">
                                    <button class="timer-btn green">生產溫度加熱計時</button>
                                    <div class="time-box green-theme">
                                        <div class="time-unit">
                                            <span class="tu-label">時</span>
                                            <span class="tu-val">0</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">分</span>
                                            <span class="tu-val">0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="time-row">
                                    <button class="timer-btn red">生產溫度加熱時間</button>
                                    <div class="time-box red-theme">
                                        <div class="time-unit">
                                            <span class="tu-label">時</span>
                                            <span class="tu-val">0</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">分</span>
                                            <span class="tu-val">0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 預設時間 B -->
                        <div class="lam-card">
                            <div class="card-header heat-time-header"><Calendar :size="14" />&nbsp;預設時間</div>
                            <div class="card-body">
                                <div class="time-row">
                                    <button class="time-btn green">預熱</button>
                                    <div class="time-box green-theme">
                                        <div class="time-unit">
                                            <span class="tu-label">月</span>
                                            <span class="tu-val">1</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">日</span>
                                            <span class="tu-val">8</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">時</span>
                                            <span class="tu-val">19</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">分</span>
                                            <span class="tu-val">30</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="time-row">
                                    <button class="time-btn red">生產</button>
                                    <div class="time-box red-theme">
                                        <div class="time-unit">
                                            <span class="tu-label">月</span>
                                            <span class="tu-val">2</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">日</span>
                                            <span class="tu-val">9</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">時</span>
                                            <span class="tu-val">11</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">分</span>
                                            <span class="tu-val">22</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 加熱計時器 B -->
                        <div class="lam-card">
                            <div class="card-header heat-time-header"><Timer :size="14" />&nbsp;加熱計時器</div>
                            <div class="card-body">
                                <div class="time-row">
                                    <button class="timer-btn green">生產溫度加熱計時</button>
                                    <div class="time-box green-theme">
                                        <div class="time-unit">
                                            <span class="tu-label">時</span>
                                            <span class="tu-val">0</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">分</span>
                                            <span class="tu-val">0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="time-row">
                                    <button class="timer-btn red">生產溫度加熱時間</button>
                                    <div class="time-box red-theme">
                                        <div class="time-unit">
                                            <span class="tu-label">時</span>
                                            <span class="tu-val">0</span>
                                        </div>
                                        <div class="time-unit">
                                            <span class="tu-label">分</span>
                                            <span class="tu-val">0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Cutting Machine E-11 Dashboard -->
            <template v-else-if="machineId === 'P002' || machineId === 'P004'">
                <div class="cut-dashboard">
                    <!-- Top Row: Params + Data Settings -->
                    <div class="cut-top-row">
                        <!-- Left: 參數設定 -->
                        <div class="cut-card">
                            <div class="cut-card-header">
                                <SlidersHorizontal :size="14" />
                                <span>參數設定</span>
                            </div>
                            <div class="cut-params-body">
                                <div class="cut-params-grid">
                                    <div class="cut-param-item" v-for="p in cutParamData" :key="p.label">
                                        <div class="cut-param-label">{{ p.label }}</div>
                                        <div class="cut-param-val-row">
                                            <span class="cut-val">{{ p.value }}</span>
                                            <span class="cut-unit">{{ p.unit }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="cut-counter-row">
                                    <div class="cut-counter-left">
                                        <div class="cut-counter-icon"><Activity :size="16" /></div>
                                        <div>
                                            <div class="cut-param-label">目前切卷軸數</div>
                                            <div class="cut-param-val-row">
                                                <span class="cut-val">223</span>
                                                <span class="cut-unit">軸</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button class="cut-clear-btn">
                                        <Trash2 :size="12" /> 切卷軸數清除
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Right: 資料設定 -->
                        <div class="cut-card">
                            <div class="cut-card-header">
                                <FileText :size="14" />
                                <span>資料設定</span>
                            </div>
                            <div class="cut-table-body">
                                <table class="cut-table">
                                    <thead>
                                        <tr>
                                            <th>切割模式</th>
                                            <th>數量設定</th>
                                            <th>切割尺寸</th>
                                            <th>預備速度</th>
                                            <th>切斷速度</th>
                                            <th>末端速度</th>
                                            <th>切割角度</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, idx) in cutModeData" :key="idx">
                                            <td><span class="cut-mode-num">{{ idx + 1 }}</span></td>
                                            <td><span class="cut-cell-box">{{ row.qty }}</span></td>
                                            <td><span class="cut-cell-box">{{ row.size }}</span></td>
                                            <td><span class="cut-cell-box">{{ row.prepSpeed }}</span></td>
                                            <td><span class="cut-cell-box">{{ row.cutSpeed }}</span></td>
                                            <td><span class="cut-cell-box">{{ row.endSpeed }}</span></td>
                                            <td><span class="cut-cell-box cut-cell-red">{{ row.angle }}</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Row: Spray + Motor -->
                    <div class="cut-bottom-row">
                        <!-- Left: 噴水設定 -->
                        <div class="cut-card">
                            <div class="cut-card-header">
                                <Droplets :size="14" />
                                <span>噴水設定</span>
                            </div>
                            <div class="cut-spray-body">
                                <div class="cut-spray-metrics">
                                    <div class="cut-spray-item">
                                        <div class="cut-param-label">噴水延遲時間</div>
                                        <div class="cut-param-val-row">
                                            <span class="cut-val">0.1</span>
                                            <span class="cut-unit">mm</span>
                                        </div>
                                    </div>
                                    <div class="cut-spray-item">
                                        <div class="cut-param-label">噴水開啟次數</div>
                                        <div class="cut-param-val-row">
                                            <span class="cut-val">1</span>
                                            <span class="cut-unit">次</span>
                                        </div>
                                    </div>
                                    <div class="cut-spray-item">
                                        <div class="cut-param-label">噴水開啟時間</div>
                                        <div class="cut-param-val-row">
                                            <span class="cut-val">1.2</span>
                                            <span class="cut-unit">Sec</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="cut-spray-toggle-row">
                                    <span class="cut-param-label">噴水開關</span>
                                    <div class="cut-toggle-pill" :class="{ 'cut-pill-on': cutSprayOn }" @click="cutSprayOn = !cutSprayOn">
                                        <div class="cut-pill-thumb"></div>
                                        <span class="cut-pill-label cut-pill-off-label">OFF</span>
                                        <span class="cut-pill-label cut-pill-on-label">ON</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right: 馬達轉向選擇 -->
                        <div class="cut-card">
                            <div class="cut-card-header">
                                <Cpu :size="14" />
                                <span>馬達轉向選擇</span>
                            </div>
                            <div class="cut-motor-body">
                                <div class="cut-motor-group">
                                    <div class="cut-motor-group-title">主軸轉向選擇</div>
                                    <div class="cut-motor-items">
                                        <div class="cut-radio-item"
                                            :class="{ 'cut-radio-active': cutMotorSpindle === 'forward' }"
                                            @click="cutMotorSpindle = 'forward'">
                                            <span class="cut-radio-circle" :class="{ active: cutMotorSpindle === 'forward' }"></span>
                                            <span>主軸正轉</span>
                                        </div>
                                        <div class="cut-radio-item"
                                            :class="{ 'cut-radio-active': cutMotorSpindle === 'reverse' }"
                                            @click="cutMotorSpindle = 'reverse'">
                                            <span class="cut-radio-circle" :class="{ active: cutMotorSpindle === 'reverse' }"></span>
                                            <span>主軸反轉</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="cut-motor-group">
                                    <div class="cut-motor-group-title">圓刀轉向選擇</div>
                                    <div class="cut-motor-items">
                                        <div class="cut-radio-item"
                                            :class="{ 'cut-radio-active': cutMotorRound === 'forward' }"
                                            @click="cutMotorRound = 'forward'">
                                            <span class="cut-radio-circle" :class="{ active: cutMotorRound === 'forward' }"></span>
                                            <span>圓刀正轉</span>
                                        </div>
                                        <div class="cut-radio-item"
                                            :class="{ 'cut-radio-active': cutMotorRound === 'reverse' }"
                                            @click="cutMotorRound = 'reverse'">
                                            <span class="cut-radio-circle" :class="{ active: cutMotorRound === 'reverse' }"></span>
                                            <span>圓刀反轉</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Rewinder (P003) Dashboard -->
            <template v-else-if="machineId === 'P003'">
                <div style="width: 50%">
                <div class="cut-card">
                    <div class="cut-card-header">
                        <SlidersHorizontal :size="14" />
                        <span>參數設定</span>
                    </div>
                    <div class="cut-params-body">
                        <div class="cut-params-grid">
                            <div class="rew-param-item" v-for="p in rewParamData" :key="p.label">
                                <div class="cut-param-label">{{ p.label }}</div>
                                <div class="rew-val-row">
                                    <span class="cut-val">{{ p.value }}</span>
                                    <span class="cut-unit">{{ p.unit }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="cut-counter-row">
                            <div class="cut-counter-left">
                                <div class="cut-counter-icon"><Infinity :size="16" /></div>
                                <div>
                                    <div class="cut-param-label">現在計數長度</div>
                                    <div class="cut-param-val-row" style="justify-content:flex-start">
                                        <span class="cut-val">24.93</span>
                                        <span class="cut-unit">m</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </template>

            <!-- 薄膜斷裁機 (CV004) Dashboard -->
            <template v-else-if="machineId === 'CV004'">
                <div class="slit-dashboard">
                    <!-- Col 1: 生產與米數 -->
                    <div class="slit-card">
                        <div class="slit-card-header"><Gauge :size="14" /><span>生產與米數</span></div>
                        <div class="slit-card-body">
                            <div class="slit-speed-box">
                                <div class="slit-box-label">現在生產速度</div>
                                <div><span class="slit-big-val">19.7</span></div>
                                <div class="slit-speed-unit">M/min</div>
                                <div class="slit-progress-track"><div class="slit-progress-bar" style="width:65%"></div></div>
                            </div>
                            <div class="slit-row-item">
                                <span class="slit-row-label">自動加速設定</span>
                                <div class="slit-row-val"><span class="slit-rv-num">20</span><span class="slit-rv-unit">M/min</span></div>
                            </div>
                            <div class="slit-row-item">
                                <span class="slit-row-label">紙管直徑</span>
                                <div class="slit-row-val"><span class="slit-rv-num">96.0</span><span class="slit-rv-unit">mm</span></div>
                            </div>
                            <div class="slit-mini-grid">
                                <div class="slit-mini-item">
                                    <div class="slit-box-label">現在米數</div>
                                    <div class="slit-mini-val"><span class="slit-big-val">324</span><span class="slit-rv-unit">M</span></div>
                                </div>
                                <div class="slit-mini-item">
                                    <div class="slit-box-label">米數設定</div>
                                    <div class="slit-mini-val"><span class="slit-big-val">310</span><span class="slit-rv-unit">M</span></div>
                                </div>
                            </div>
                            <div class="slit-completion-row">
                                <div>
                                    <div class="slit-box-label">目前完成比例</div>
                                    <div class="slit-mini-val"><span class="slit-big-val">104.5</span><span class="slit-rv-unit">%</span></div>
                                </div>
                                <button class="slit-reset-btn">米數重置</button>
                            </div>
                        </div>
                    </div>

                    <!-- Col 2: 放料控制 -->
                    <div class="slit-card">
                        <div class="slit-card-header"><span>放料控制</span></div>
                        <div class="slit-card-body">
                            <div class="slit-tension-section">
                                <div class="slit-tension-label">現在張力設定</div>
                                <div class="slit-tension-ctrl">
                                    <button class="slit-arrow-btn"><ChevronLeft :size="16" /></button>
                                    <div class="slit-tension-display">
                                        <span class="slit-tension-num">75</span>
                                        <span class="slit-tension-unit">N</span>
                                    </div>
                                    <button class="slit-arrow-btn"><ChevronRight :size="16" /></button>
                                </div>
                            </div>
                            <div class="slit-row-item">
                                <span class="slit-row-label">放料直徑</span>
                                <div class="slit-row-val"><span class="slit-rv-num">234.0</span><span class="slit-rv-unit">mm</span></div>
                            </div>
                            <div class="slit-row-item">
                                <span class="slit-row-label">煞車輸出</span>
                                <div class="slit-row-val"><span class="slit-rv-num">10.0</span><span class="slit-rv-unit">%</span></div>
                            </div>
                            <div class="slit-spacer"></div>
                            <div class="slit-toggle-row">
                                <span class="slit-row-label">放料夾饃</span>
                                <div class="cut-toggle-pill" :class="{ 'cut-pill-on': slitFeedClamp }" @click="slitFeedClamp = !slitFeedClamp">
                                    <div class="cut-pill-thumb"></div>
                                    <span class="cut-pill-label cut-pill-off-label">OFF</span>
                                    <span class="cut-pill-label cut-pill-on-label">ON</span>
                                </div>
                            </div>
                            <div class="slit-toggle-row">
                                <span class="slit-row-label">放料控制</span>
                                <div class="cut-toggle-pill" :class="{ 'cut-pill-on': slitFeedCtrl }" @click="slitFeedCtrl = !slitFeedCtrl">
                                    <div class="cut-pill-thumb"></div>
                                    <span class="cut-pill-label cut-pill-off-label">OFF</span>
                                    <span class="cut-pill-label cut-pill-on-label">ON</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Col 3: 上收捲軸 -->
                    <div class="slit-card">
                        <div class="slit-card-header"><span>上收捲軸</span></div>
                        <div class="slit-card-body">
                            <div class="slit-tension-section">
                                <div class="slit-tension-label">現在張力設定</div>
                                <div class="slit-tension-ctrl">
                                    <button class="slit-arrow-btn"><ChevronLeft :size="16" /></button>
                                    <div class="slit-tension-display">
                                        <span class="slit-tension-num">110</span>
                                        <span class="slit-tension-unit">N/M</span>
                                    </div>
                                    <button class="slit-arrow-btn"><ChevronRight :size="16" /></button>
                                </div>
                            </div>
                            <div class="slit-row-item">
                                <span class="slit-row-label">上收捲直徑</span>
                                <div class="slit-row-val"><span class="slit-rv-num">182.7</span><span class="slit-rv-unit">mm</span></div>
                            </div>
                            <div class="slit-stability-box">
                                <div class="slit-stability-row">
                                    <span class="slit-row-label">即時張力穩定度</span>
                                    <div class="slit-row-val"><span class="slit-rv-num">99.2</span><span class="slit-rv-unit">%</span></div>
                                </div>
                                <div class="slit-bar-chart slit-bar-cyan">
                                    <div class="slit-bar" v-for="(h, i) in slitUpperBars" :key="i" :style="{ height: h + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Col 4: 下收捲軸 -->
                    <div class="slit-card">
                        <div class="slit-card-header"><span>下收捲軸</span></div>
                        <div class="slit-card-body">
                            <div class="slit-tension-section">
                                <div class="slit-tension-label">現在張力設定</div>
                                <div class="slit-tension-ctrl">
                                    <button class="slit-arrow-btn"><ChevronLeft :size="16" /></button>
                                    <div class="slit-tension-display">
                                        <span class="slit-tension-num">100</span>
                                        <span class="slit-tension-unit">N/M</span>
                                    </div>
                                    <button class="slit-arrow-btn"><ChevronRight :size="16" /></button>
                                </div>
                            </div>
                            <div class="slit-row-item">
                                <span class="slit-row-label">下收捲直徑</span>
                                <div class="slit-row-val"><span class="slit-rv-num">182.7</span><span class="slit-rv-unit">mm</span></div>
                            </div>
                            <div class="slit-stability-box">
                                <div class="slit-stability-row">
                                    <span class="slit-row-label">即時張力穩定度</span>
                                    <div class="slit-row-val"><span class="slit-rv-num">98.5</span><span class="slit-rv-unit">%</span></div>
                                </div>
                                <div class="slit-bar-chart slit-bar-purple">
                                    <div class="slit-bar" v-for="(h, i) in slitLowerBars" :key="i" :style="{ height: h + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- 製膠攪拌機 (R001) RTO Dashboard -->
            <template v-else-if="machineId === 'R001'">
                <div class="rto-wrap">
                    <div class="rto-canvas">
                        <img :src="rtoGlueImg" class="rto-bg-img" />

                        <!-- Status Group A -->
                        <div class="rto-status-group" style="left:-0.7%;top:15.0%">
                            <div class="rto-status-card rto-status-card-top">
                                <div class="rto-status-row"><span>A驅線機1</span><span class="rto-dot rto-dot-off"></span></div>
                                <div class="rto-status-row"><span>A驅線機2</span><span class="rto-dot rto-dot-off"></span></div>
                            </div>
                            <div class="rto-status-card rto-status-card-bottom">
                                <div class="rto-status-sep">10RT冷凍機</div>
                                <div class="rto-status-row"><span>CC-01(A)</span><span class="rto-dot rto-dot-on"></span></div>
                                <div class="rto-status-row"><span>運轉中</span><span class="rto-dot rto-dot-on"></span></div>
                            </div>
                        </div>

                        <!-- Status Group B -->
                        <div class="rto-status-group" style="left:-0.7%;top:50.8%">
                            <div class="rto-status-card rto-status-card-top">
                                <div class="rto-status-row"><span>B驅線機1</span><span class="rto-dot rto-dot-off"></span></div>
                                <div class="rto-status-row"><span>B驅線機2</span><span class="rto-dot rto-dot-off"></span></div>
                            </div>
                            <div class="rto-status-card rto-status-card-bottom">
                                <div class="rto-status-sep">10RT冷凍機</div>
                                <div class="rto-status-row"><span>CC-01(B)</span><span class="rto-dot rto-dot-on"></span></div>
                                <div class="rto-status-row"><span>運轉中</span><span class="rto-dot rto-dot-on"></span></div>
                            </div>
                        </div>

                        <!-- TIC-05 -->
                        <div class="rto-tic-box" style="left:27.8%;top:15.0%">
                            <div class="rto-tic-title">TIC-05</div>
                            <div class="rto-tic-row"><span class="rto-tic-val">0.0</span><span class="rto-tic-unit">°C</span></div>
                            <div class="rto-tic-row"><span class="rto-tic-val">0.0</span><span class="rto-tic-unit">bar</span></div>
                            <div class="rto-tic-row rto-tic-running"><span>運轉中</span><span class="rto-dot rto-dot-on"></span></div>
                        </div>

                        <!-- TIC-06 -->
                        <div class="rto-tic-box" style="left:26.1%;top:58%">
                            <div class="rto-tic-title">TIC-06</div>
                            <div class="rto-tic-row"><span class="rto-tic-val">0.0</span><span class="rto-tic-unit">°C</span></div>
                        </div>

                        <!-- TIC-04 -->
                        <div class="rto-tic-box" style="left:38.5%;top:57.5%">
                            <div class="rto-tic-title">TIC-04</div>
                            <div class="rto-tic-row"><span class="rto-tic-val">0.0</span><span class="rto-tic-unit">°C</span></div>
                            <div class="rto-tic-row"><span class="rto-tic-val">0.0</span><span class="rto-tic-unit">bar</span></div>
                            <div class="rto-tic-row rto-tic-running"><span>運轉中</span><span class="rto-dot rto-dot-on"></span></div>
                        </div>

                        <!-- TIC-11 -->
                        <div class="rto-tic-box rto-tic-wide" style="left:55.4%;top:34.5%">
                            <div class="rto-tic-title">TIC-11</div>
                            <div class="rto-tic-row"><span class="rto-tic-val">0.0</span><span class="rto-tic-unit">°C</span></div>
                            <div class="rto-tic-sub">馬達扭矩</div>
                            <div class="rto-tic-row"><span class="rto-tic-val rto-torque-val">0.00</span><span class="rto-tic-unit">N.m</span></div>
                        </div>

                        <!-- TIC-21 -->
                        <div class="rto-tic-box rto-tic-wide" style="left:70.4%;top:34.5%;">
                            <div class="rto-tic-title">TIC-21</div>
                            <div class="rto-tic-row"><span class="rto-tic-val">0.0</span><span class="rto-tic-unit">°C</span></div>
                            <div class="rto-tic-sub">馬達扭矩</div>
                            <div class="rto-tic-row"><span class="rto-tic-val rto-torque-val">0.00</span><span class="rto-tic-unit">N.m</span></div>
                        </div>

                        <!-- TIC-31 -->
                        <div class="rto-tic-box rto-tic-wide" style="left:85.4%;top:34.5%;">
                            <div class="rto-tic-title">TIC-31</div>
                            <div class="rto-tic-row"><span class="rto-tic-val">0.0</span><span class="rto-tic-unit">°C</span></div>
                            <div class="rto-tic-sub">馬達扭矩</div>
                            <div class="rto-tic-row"><span class="rto-tic-val rto-torque-val">0.00</span><span class="rto-tic-unit">N.m</span></div>
                        </div>

                        <!-- Tank status boxes -->
                        <div class="rto-tank-box" style="left:53.8%;top:63%">
                            <div class="rto-tank-title">R-11 3KL SUS槽</div>
                            <div class="rto-tank-row"><span>馬達速</span><span class="rto-dot rto-dot-on"></span></div>
                        </div>
                        <div class="rto-tank-box" style="left:69.2%;top:63%">
                            <div class="rto-tank-title">R-21 2KL SUS槽</div>
                            <div class="rto-tank-row"><span>馬達速</span><span class="rto-dot rto-dot-off"></span></div>
                        </div>
                        <div class="rto-tank-box" style="left:84.4%;top:63%">
                            <div class="rto-tank-title">R-31 1KL SUS槽</div>
                            <div class="rto-tank-row"><span>馬達速</span><span class="rto-dot rto-dot-off"></span></div>
                        </div>

                        <!-- Speed boxes -->
                        <div class="rto-speed-box" style="left:53.8%;top:74.8%">
                            <div class="rto-speed-label">3KL槽轉速</div>
                            <div class="rto-speed-val-row"><span class="rto-speed-val">0.00</span><span class="rto-speed-unit">m/s</span></div>
                        </div>
                        <div class="rto-speed-box" style="left:69.2%;top:74.8%">
                            <div class="rto-speed-label">2KL槽轉速</div>
                            <div class="rto-speed-val-row"><span class="rto-speed-val">0.00</span><span class="rto-speed-unit">m/s</span></div>
                        </div>
                        <div class="rto-speed-box" style="left:84.4%;top:74.8%">
                            <div class="rto-speed-label">1KL槽轉速</div>
                            <div class="rto-speed-val-row"><span class="rto-speed-val">0.00</span><span class="rto-speed-unit">m/s</span></div>
                        </div>
                        <!-- SVG removed: background image used instead -->
                        <svg class="rto-svg" viewBox="0 0 1400 720" xmlns="http://www.w3.org/2000/svg" style="display:none">
                            <defs>
                                <linearGradient id="rto-tank-g" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stop-color="#374151"/>
                                    <stop offset="40%" stop-color="#9ca3af"/>
                                    <stop offset="100%" stop-color="#1f2937"/>
                                </linearGradient>
                                <linearGradient id="rto-hex-g" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stop-color="#064e3b"/>
                                    <stop offset="50%" stop-color="#065f46"/>
                                    <stop offset="100%" stop-color="#064e3b"/>
                                </linearGradient>
                            </defs>

                            <!-- ===== RED PIPES ===== -->
                            <line x1="185" y1="140" x2="1380" y2="140" stroke="#dc2626" stroke-width="10"/>
                            <line x1="320" y1="140" x2="320" y2="515" stroke="#dc2626" stroke-width="10"/>
                            <line x1="178" y1="232" x2="320" y2="232" stroke="#dc2626" stroke-width="10"/>
                            <line x1="178" y1="502" x2="320" y2="502" stroke="#dc2626" stroke-width="10"/>
                            <!-- TIC-05 to top pipe -->
                            <line x1="490" y1="128" x2="490" y2="140" stroke="#dc2626" stroke-width="10"/>
                            <!-- Center right: CV-04 → CV-05 area -->
                            <line x1="668" y1="140" x2="668" y2="272" stroke="#dc2626" stroke-width="10"/>
                            <line x1="668" y1="302" x2="668" y2="460" stroke="#dc2626" stroke-width="10"/>
                            <line x1="668" y1="490" x2="668" y2="558" stroke="#dc2626" stroke-width="9"/>
                            <!-- HX bottom to top pipe -->
                            <line x1="820" y1="118" x2="820" y2="140" stroke="#dc2626" stroke-width="10"/>
                            <line x1="1042" y1="118" x2="1042" y2="140" stroke="#dc2626" stroke-width="10"/>
                            <line x1="1264" y1="118" x2="1264" y2="140" stroke="#dc2626" stroke-width="10"/>
                            <!-- Col feeds down from top pipe through CV valves -->
                            <line x1="820" y1="140" x2="820" y2="222" stroke="#dc2626" stroke-width="10"/>
                            <line x1="820" y1="252" x2="820" y2="368" stroke="#dc2626" stroke-width="8"/>
                            <line x1="858" y1="368" x2="858" y2="398" stroke="#dc2626" stroke-width="8"/>
                            <line x1="1042" y1="140" x2="1042" y2="222" stroke="#dc2626" stroke-width="10"/>
                            <line x1="1042" y1="252" x2="1042" y2="368" stroke="#dc2626" stroke-width="8"/>
                            <line x1="1078" y1="368" x2="1078" y2="398" stroke="#dc2626" stroke-width="8"/>
                            <line x1="1264" y1="140" x2="1264" y2="222" stroke="#dc2626" stroke-width="10"/>
                            <line x1="1264" y1="252" x2="1264" y2="368" stroke="#dc2626" stroke-width="8"/>
                            <line x1="1298" y1="368" x2="1298" y2="398" stroke="#dc2626" stroke-width="8"/>

                            <!-- ===== BLUE PIPES ===== -->
                            <line x1="720" y1="558" x2="1385" y2="558" stroke="#3b82f6" stroke-width="10"/>
                            <line x1="392" y1="472" x2="720" y2="472" stroke="#3b82f6" stroke-width="10"/>
                            <line x1="720" y1="472" x2="720" y2="558" stroke="#3b82f6" stroke-width="10"/>
                            <line x1="868" y1="558" x2="868" y2="548" stroke="#3b82f6" stroke-width="10"/>
                            <line x1="1088" y1="558" x2="1088" y2="548" stroke="#3b82f6" stroke-width="10"/>
                            <line x1="1308" y1="558" x2="1308" y2="548" stroke="#3b82f6" stroke-width="10"/>

                            <!-- ===== HEAT EXCHANGERS ===== -->
                            <rect x="740" y="38" width="162" height="80" rx="40" fill="url(#rto-hex-g)" stroke="#065f46" stroke-width="2"/>
                            <ellipse cx="740" cy="78" rx="22" ry="40" fill="#065f46" stroke="#065f46"/>
                            <ellipse cx="902" cy="78" rx="22" ry="40" fill="#064e3b" stroke="#065f46"/>
                            <text x="821" y="83" text-anchor="middle" fill="#d1fae5" font-size="14" font-family="ui-sans-serif,sans-serif" font-weight="500">M-11</text>

                            <rect x="962" y="38" width="162" height="80" rx="40" fill="url(#rto-hex-g)" stroke="#065f46" stroke-width="2"/>
                            <ellipse cx="962" cy="78" rx="22" ry="40" fill="#065f46" stroke="#065f46"/>
                            <ellipse cx="1124" cy="78" rx="22" ry="40" fill="#064e3b" stroke="#065f46"/>
                            <text x="1043" y="83" text-anchor="middle" fill="#d1fae5" font-size="14" font-family="ui-sans-serif,sans-serif" font-weight="500">M-21</text>

                            <rect x="1184" y="38" width="162" height="80" rx="40" fill="url(#rto-hex-g)" stroke="#065f46" stroke-width="2"/>
                            <ellipse cx="1184" cy="78" rx="22" ry="40" fill="#065f46" stroke="#065f46"/>
                            <ellipse cx="1346" cy="78" rx="22" ry="40" fill="#064e3b" stroke="#065f46"/>
                            <text x="1265" y="83" text-anchor="middle" fill="#d1fae5" font-size="14" font-family="ui-sans-serif,sans-serif" font-weight="500">M-31</text>

                            <!-- ===== VALVES (diamonds) ===== -->
                            <polygon points="668,270 684,287 668,304 652,287" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
                            <text x="690" y="291" fill="#93c5fd" font-size="12" font-family="ui-sans-serif,sans-serif">CV-04</text>
                            <polygon points="668,458 684,475 668,492 652,475" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
                            <text x="690" y="479" fill="#93c5fd" font-size="12" font-family="ui-sans-serif,sans-serif">CV-05</text>

                            <polygon points="820,220 836,237 820,254 804,237" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
                            <text x="842" y="241" fill="#93c5fd" font-size="12" font-family="ui-sans-serif,sans-serif">CV-11</text>
                            <polygon points="858,350 874,367 858,384 842,367" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
                            <text x="800" y="371" fill="#93c5fd" font-size="12" font-family="ui-sans-serif,sans-serif">CV-12</text>

                            <polygon points="1042,220 1058,237 1042,254 1026,237" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
                            <text x="1064" y="241" fill="#93c5fd" font-size="12" font-family="ui-sans-serif,sans-serif">CV-21</text>
                            <polygon points="1078,350 1094,367 1078,384 1062,367" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
                            <text x="1020" y="371" fill="#93c5fd" font-size="12" font-family="ui-sans-serif,sans-serif">CV-22</text>

                            <polygon points="1264,220 1280,237 1264,254 1248,237" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
                            <text x="1286" y="241" fill="#93c5fd" font-size="12" font-family="ui-sans-serif,sans-serif">CV-31</text>
                            <polygon points="1298,350 1314,367 1298,384 1282,367" fill="#1e3a5f" stroke="#3b82f6" stroke-width="2"/>
                            <text x="1240" y="371" fill="#93c5fd" font-size="12" font-family="ui-sans-serif,sans-serif">CV-32</text>

                            <!-- ===== PUMPS ===== -->
                            <circle cx="310" cy="232" r="34" fill="#1a2e4a" stroke="#3b82f6" stroke-width="2"/>
                            <circle cx="310" cy="232" r="20" fill="none" stroke="#60a5fa" stroke-width="1.5"/>
                            <line x1="310" y1="212" x2="325" y2="247" stroke="#60a5fa" stroke-width="2"/>
                            <line x1="310" y1="212" x2="295" y2="247" stroke="#60a5fa" stroke-width="2"/>
                            <line x1="290" y1="232" x2="330" y2="232" stroke="#60a5fa" stroke-width="1.5"/>
                            <text x="310" y="280" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="ui-sans-serif,sans-serif">P-02(A)</text>

                            <circle cx="310" cy="502" r="34" fill="#1a2e4a" stroke="#3b82f6" stroke-width="2"/>
                            <circle cx="310" cy="502" r="20" fill="none" stroke="#60a5fa" stroke-width="1.5"/>
                            <line x1="310" y1="482" x2="325" y2="517" stroke="#60a5fa" stroke-width="2"/>
                            <line x1="310" y1="482" x2="295" y2="517" stroke="#60a5fa" stroke-width="2"/>
                            <line x1="290" y1="502" x2="330" y2="502" stroke="#60a5fa" stroke-width="1.5"/>
                            <text x="310" y="550" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="ui-sans-serif,sans-serif">P-02(B)</text>

                            <!-- P-02 label -->
                            <text x="490" y="296" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="ui-sans-serif,sans-serif">P-02</text>

                            <!-- P-01 pump (bottom center) -->
                            <circle cx="668" cy="540" r="24" fill="#1a2e4a" stroke="#3b82f6" stroke-width="2"/>
                            <circle cx="668" cy="540" r="13" fill="none" stroke="#60a5fa" stroke-width="1.5"/>
                            <line x1="668" y1="527" x2="678" y2="552" stroke="#60a5fa" stroke-width="2"/>
                            <line x1="668" y1="527" x2="658" y2="552" stroke="#60a5fa" stroke-width="2"/>
                            <text x="668" y="578" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="ui-sans-serif,sans-serif">P-01</text>

                            <!-- ===== MAIN CENTRE TANK ===== -->
                            <rect x="392" y="388" width="192" height="178" fill="url(#rto-tank-g)" stroke="#4b5563" stroke-width="2"/>
                            <ellipse cx="488" cy="388" rx="96" ry="20" fill="#9ca3af" stroke="#4b5563" stroke-width="2"/>
                            <ellipse cx="488" cy="566" rx="96" ry="20" fill="#374151" stroke="#4b5563" stroke-width="2"/>

                            <!-- ===== COLUMN VESSELS ===== -->
                            <!-- R-11 -->
                            <rect x="762" y="398" width="122" height="150" fill="url(#rto-tank-g)" stroke="#4b5563" stroke-width="2"/>
                            <ellipse cx="823" cy="398" rx="61" ry="14" fill="#9ca3af" stroke="#4b5563" stroke-width="2"/>
                            <ellipse cx="823" cy="548" rx="61" ry="14" fill="#374151" stroke="#4b5563" stroke-width="2"/>
                            <text x="823" y="434" text-anchor="middle" fill="#e2e8f0" font-size="13" font-family="ui-sans-serif,sans-serif">R-11 3KL SUS槽</text>
                            <text x="762" y="468" fill="#94a3b8" font-size="12" font-family="ui-sans-serif,sans-serif">  馬達速</text>
                            <circle cx="868" cy="464" r="7" fill="#22c55e" stroke="#16a34a" stroke-width="1"/>

                            <!-- R-21 -->
                            <rect x="984" y="398" width="122" height="150" fill="url(#rto-tank-g)" stroke="#4b5563" stroke-width="2"/>
                            <ellipse cx="1045" cy="398" rx="61" ry="14" fill="#9ca3af" stroke="#4b5563" stroke-width="2"/>
                            <ellipse cx="1045" cy="548" rx="61" ry="14" fill="#374151" stroke="#4b5563" stroke-width="2"/>
                            <text x="1045" y="434" text-anchor="middle" fill="#e2e8f0" font-size="13" font-family="ui-sans-serif,sans-serif">R-21 2KL SUS槽</text>
                            <text x="984" y="468" fill="#94a3b8" font-size="12" font-family="ui-sans-serif,sans-serif">  馬達速</text>
                            <circle cx="1090" cy="464" r="7" fill="#475569" stroke="#334155" stroke-width="1"/>

                            <!-- R-31 -->
                            <rect x="1204" y="398" width="122" height="150" fill="url(#rto-tank-g)" stroke="#4b5563" stroke-width="2"/>
                            <ellipse cx="1265" cy="398" rx="61" ry="14" fill="#9ca3af" stroke="#4b5563" stroke-width="2"/>
                            <ellipse cx="1265" cy="548" rx="61" ry="14" fill="#374151" stroke="#4b5563" stroke-width="2"/>
                            <text x="1265" y="434" text-anchor="middle" fill="#e2e8f0" font-size="13" font-family="ui-sans-serif,sans-serif">R-31 1KL SUS槽</text>
                            <text x="1204" y="468" fill="#94a3b8" font-size="12" font-family="ui-sans-serif,sans-serif">  馬達速</text>
                            <circle cx="1308" cy="464" r="7" fill="#475569" stroke="#334155" stroke-width="1"/>
                        </svg>

                    </div>
                </div>
            </template>

            <!-- RTO PLC (F003) Dashboard -->
            <template v-else-if="machineId === 'F003'">
                <div class="plc-wrap">
                    <div class="plc-canvas">
                        <img :src="rtoPLCImg" class="rto-bg-img" />

                        <!-- Top standalone chips (left two pipe inlets) -->
                        <div class="plc-chip" style="left:17%;top:-1.3%"><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>
                        <div class="plc-chip" style="left:27.5%;top:-1.3%"><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>

                        <!-- Center top chip -->
                        <div class="plc-chip" style="left:52%;top:-2%"><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>

                        <!-- 熱交換入口 (right top) -->
                        <div class="plc-inline" style="left:85.3%;top:9.5%"><span class="plc-label">熱交換入口</span><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>

                        <!-- 燃燒室 A (left) -->
                        <div class="plc-box" style="left:22.8%;top:10.5%">
                            <div class="plc-box-title">燃燒室 A</div>
                            <div class="plc-box-row"><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>
                        </div>

                        <!-- 燃燒室 A (center) -->
                        <div class="plc-box" style="left:48.5%;top:11.5%">
                            <div class="plc-box-title">燃燒室 A</div>
                            <div class="plc-box-row"><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>
                        </div>

                        <!-- Left column stacked readings -->
                        <div class="plc-inline" style="left:22.5%;top:30%"><span class="plc-label">蓄熱 A上</span><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>
                        <div class="plc-inline" style="left:22.5%;top:38%"><span class="plc-label">蓄熱 A中</span><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>
                        <div class="plc-inline" style="left:22.5%;top:46%"><span class="plc-label">蓄熱 A下</span><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>
                        <div class="plc-inline" style="left:22.5%;top:54%"><span class="plc-label">斜管溫度</span><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>
                        <div class="plc-inline" style="left:22.5%;top:62%"><span class="plc-label">RTO入口</span><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>

                        <!-- CMM flow (bottom left) -->
                        <div class="plc-chip" style="left:13%;top:72.3%"><span class="plc-val">0.0</span><span class="plc-unit">CMM</span></div>

                        <!-- Center column stacked readings -->
                        <div class="plc-inline" style="left:54%;top:30%"><span class="plc-label">蓄熱 B上</span><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>
                        <div class="plc-inline" style="left:54%;top:38%"><span class="plc-label">蓄熱 B中</span><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>
                        <div class="plc-inline" style="left:54%;top:46%"><span class="plc-label">蓄熱 B下</span><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>
                        <div class="plc-inline" style="left:54%;top:54%"><span class="plc-label">斜管溫度</span><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>
                        <div class="plc-inline" style="left:54%;top:62%"><span class="plc-label">RTO入口</span><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>

                        <!-- 煤油溫度 (right) -->
                        <div class="plc-inline" style="left:86.2%;top:41.6%"><span class="plc-label">煤油溫度</span><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>

                        <!-- 熱交換出口 (right center) -->
                        <div class="plc-inline" style="left:79.9%;top:59.2%"><span class="plc-label">熱交換出口</span><span class="plc-val">0.0</span><span class="plc-unit">°C</span></div>
                    </div>
                </div>
            </template>

            <!-- C002: 塗佈機1 -->
            <template v-else-if="machineId === 'C002'">
                <q-tabs v-model="activeC002Tab" active-color="primary" indicator-color="primary" align="left" narrow-indicator class="q-mb-md tab-bar">
                    <q-tab name="line" label="塗佈線" />
                    <q-tab name="status" label="機台狀態" />
                </q-tabs>

                <div v-if="activeC002Tab === 'line'" class="cm-wrap">
                    <div class="cm-canvas">
                        <img :src="coatingMachineImg" class="cm-bg-img" />

                        <!-- 後放料-2 -->
                        <div class="cm-card" style="left:10.4%;top:2.8%;width:25%">
                            <div class="cm-card-title">後放料-2</div>
                            <div class="cm-card-body">
                                <div class="cm-grid-cell">
                                    <span class="cm-label">現在速度</span>
                                    <div class="cm-cell-row"><div class="cm-box">16.3</div><span class="cm-unit">米/分</span></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <span class="cm-label">張力</span>
                                    <div class="cm-cell-row"><div class="cm-box cm-box-blue">16.0</div><span class="cm-unit">米/分</span></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <div class="cm-label-group">
                                        <span class="cm-axis-head">A軸</span>
                                        <span class="cm-label">現在計米數</span>
                                    </div>
                                    <div class="cm-cell-row"><div class="cm-box cm-box-green">1104.7</div><span class="cm-unit">米</span></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <div class="cm-label-group">
                                        <span class="cm-axis-head cm-axis-head-inactive">B軸</span>
                                        <span class="cm-label">現在計米數</span>
                                    </div>
                                    <div class="cm-cell-row"><div class="cm-box">2969.8</div><span class="cm-unit">米</span></div>
                                </div>
                            </div>
                        </div>

                        <!-- 前放料-1 -->
                        <div class="cm-card" style="left:40%;top:2.8%;width:25%">
                            <div class="cm-card-title">前放料-1</div>
                            <div class="cm-card-body">
                                <div class="cm-grid-cell">
                                    <span class="cm-label">現在速度</span>
                                    <div class="cm-cell-row"><div class="cm-box">16.3</div><span class="cm-unit">米/分</span></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <span class="cm-label">張力</span>
                                    <div class="cm-cell-row"><div class="cm-box cm-box-blue">16.0</div><span class="cm-unit">米/分</span></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <div class="cm-label-group">
                                        <span class="cm-axis-head">A軸</span>
                                        <span class="cm-label">現在計米數</span>
                                    </div>
                                    <div class="cm-cell-row"><div class="cm-box">3736.4</div><span class="cm-unit">米</span></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <div class="cm-label-group">
                                        <span class="cm-axis-head">B軸</span>
                                        <span class="cm-label">現在計米數</span>
                                    </div>
                                    <div class="cm-cell-row"><div class="cm-box cm-box-green">420.6</div><span class="cm-unit">米</span></div>
                                </div>
                            </div>
                        </div>

                        <!-- 膠台 -->
                        <div class="cm-card" style="left:68.7%;top:0.8%;width:26%">
                            <div class="cm-card-title">膠台</div>
                            <div class="cm-card-body">
                                <div class="cm-grid-cell cm-grid-cell-full">
                                    <span class="cm-label">主機現在速度</span>
                                    <div class="cm-cell-row"><div class="cm-box">16.3</div><span class="cm-unit">米/分</span></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <span class="cm-label">定位(左)</span>
                                    <div class="cm-cell-row"><div class="cm-box">50</div></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <span class="cm-label">定位(右)</span>
                                    <div class="cm-cell-row"><div class="cm-box">0</div></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <span class="cm-label">位移計(左)</span>
                                    <div class="cm-cell-row"><div class="cm-box">126</div></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <span class="cm-label">位移計(右)</span>
                                    <div class="cm-cell-row"><div class="cm-box">1287</div></div>
                                </div>
                            </div>
                        </div>

                        <!-- 收卷-2 -->
                        <div class="cm-card" style="left:16%;top:51.5%;width:25%">
                            <div class="cm-card-title">收卷-2</div>
                            <div class="cm-card-body">
                                <div class="cm-grid-cell">
                                    <span class="cm-label">現在速度</span>
                                    <div class="cm-cell-row"><div class="cm-box">16.3</div><span class="cm-unit">米/分</span></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <span class="cm-label">張力</span>
                                    <div class="cm-cell-row"><div class="cm-box cm-box-blue">16.0</div><span class="cm-unit">米/分</span></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <div class="cm-label-group">
                                        <span class="cm-axis-head">A軸</span>
                                        <span class="cm-label">現在計米數</span>
                                    </div>
                                    <div class="cm-cell-row"><div class="cm-box cm-box-green">1104.2</div><span class="cm-unit">米</span></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <div class="cm-label-group">
                                        <span class="cm-axis-head cm-axis-head-inactive">B軸</span>
                                        <span class="cm-label">現在計米數</span>
                                    </div>
                                    <div class="cm-cell-row"><div class="cm-box">1160.3</div><span class="cm-unit">米</span></div>
                                </div>
                            </div>
                        </div>

                        <!-- 收卷-1 -->
                        <div class="cm-card" style="left:42%;top:51.5%;width:25%">
                            <div class="cm-card-title">收卷-1</div>
                            <div class="cm-card-body">
                                <div class="cm-grid-cell">
                                    <span class="cm-label">現在速度</span>
                                    <div class="cm-cell-row"><div class="cm-box">16.3</div><span class="cm-unit">米/分</span></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <span class="cm-label">張力</span>
                                    <div class="cm-cell-row"><div class="cm-box cm-box-blue">16.0</div><span class="cm-unit">米/分</span></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <div class="cm-label-group">
                                        <span class="cm-axis-head">A軸</span>
                                        <span class="cm-label">現在計米數</span>
                                    </div>
                                    <div class="cm-cell-row"><div class="cm-box">939.1</div><span class="cm-unit">米</span></div>
                                </div>
                                <div class="cm-grid-cell">
                                    <div class="cm-label-group">
                                        <span class="cm-axis-head">B軸</span>
                                        <span class="cm-label">現在計米數</span>
                                    </div>
                                    <div class="cm-cell-row"><div class="cm-box cm-box-green">1537.3</div><span class="cm-unit">米</span></div>
                                </div>
                            </div>
                        </div>

                        <!-- MG塗佈 -->
                        <div class="cm-card cm-card-full" style="left:21.4%;top:69.5%;width:78%">
                            <div class="cm-card-title">MG塗佈</div>
                            <div class="cm-mg-body">
                                <div class="cm-row cm-mg-row">
                                    <span class="cm-label">塗佈比例</span><div class="cm-box">0.450</div>
                                    <span class="cm-label cm-label-gap">微凸輪</span><div class="cm-box">5.0</div><span class="cm-unit">米/分</span>
                                    <span class="cm-label cm-label-gap">主機速度</span><div class="cm-box">16.3</div>
                                    <span class="cm-label cm-label-gap">微凸輪速度</span><div class="cm-box">0.0</div>
                                    <span class="cm-label cm-label-gap">塗佈比例</span>
                                    <div class="cm-pill"><span class="cm-pill-opt cm-pill-active">單動</span><span class="cm-pill-opt">連動</span></div>
                                    <span class="cm-label cm-label-gap">膠盤升降</span>
                                    <div class="cm-pill"><span class="cm-pill-opt cm-pill-active">上升</span><span class="cm-pill-opt">下降</span></div>
                                    <span class="cm-label cm-label-gap">MG座上升</span>
                                    <div class="cm-pill"><span class="cm-pill-opt cm-pill-active">上升</span><span class="cm-pill-opt">下降</span></div>
                                </div>
                                <div class="cm-row cm-mg-row">
                                    <span class="cm-label">壓輪一</span>
                                    <div class="cm-pill"><span class="cm-pill-opt cm-pill-active">上升</span><span class="cm-pill-opt">下降</span></div>
                                    <span class="cm-label cm-label-gap">壓輪二</span>
                                    <div class="cm-pill"><span class="cm-pill-opt cm-pill-active">上升</span><span class="cm-pill-opt">下降</span></div>
                                    <span class="cm-label cm-label-gap">刮刀座</span>
                                    <div class="cm-pill"><span class="cm-pill-opt">後退</span><span class="cm-pill-opt cm-pill-active">前進</span></div>
                                    <span class="cm-label cm-label-gap">刮刀</span>
                                    <div class="cm-pill"><span class="cm-pill-opt cm-pill-active">上升</span><span class="cm-pill-opt">下降</span></div>
                                    <span class="cm-label cm-label-gap">打膠</span>
                                    <div class="cm-pill"><span class="cm-pill-opt">OFF</span><span class="cm-pill-opt cm-pill-active">ON</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else-if="activeC002Tab === 'status'" class="c002-status-wrap">
                    <!-- Left: Tension table -->
                    <div class="c002-table-card">
                        <table class="c002-table">
                            <thead>
                                <tr>
                                    <th class="c002-th-label"></th>
                                    <th>放料</th>
                                    <th>上膠</th>
                                    <th>烘箱</th>
                                    <th>引出</th>
                                    <th>收料</th>
                                    <th>貼模放料</th>
                                    <th>折模收料</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in tensionRows" :key="row.label">
                                    <td class="c002-row-label">{{ row.label }}</td>
                                    <td v-for="(val, ci) in row.vals" :key="ci" class="c002-val">
                                        <div v-if="val !== null" class="c002-box">{{ val }}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Right: Fan/Temp table -->
                    <div class="c002-table-card">
                        <table class="c002-table">
                            <thead>
                                <tr>
                                    <th class="c002-th-label"></th>
                                    <th colspan="4" class="c002-group-header">風機</th>
                                    <th colspan="2" class="c002-group-header">溫度</th>
                                    <th class="c002-group-header">加熱</th>
                                </tr>
                                <tr>
                                    <th class="c002-th-label"></th>
                                    <th>現在值Hz</th>
                                    <th>設定值Hz</th>
                                    <th>運轉/停止</th>
                                    <th>電流值A</th>
                                    <th>現在值°C</th>
                                    <th>設定值°C</th>
                                    <th>運轉/停止</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in fanRows" :key="row.label">
                                    <td class="c002-row-label">{{ row.label }}</td>
                                    <td class="c002-val"><div class="c002-box">{{ row.fanHz }}</div></td>
                                    <td class="c002-val"><div class="c002-box">{{ row.fanSetHz }}</div></td>
                                    <td class="c002-val c002-val-toggle">
                                        <span :class="row.fanOn ? 'c002-on' : 'c002-on-off'">ON</span>
                                        <span :class="row.fanOn ? 'c002-off' : 'c002-off-red'">OFF</span>
                                    </td>
                                    <td class="c002-val"><div class="c002-box">{{ row.current }}</div></td>
                                    <td class="c002-val">
                                        <template v-if="!row.concLabel"><div class="c002-box">{{ row.tempNow }}</div></template>
                                    </td>
                                    <td class="c002-val c002-val-right">
                                        <template v-if="row.concLabel">
                                            <span class="c002-conc-label">{{ row.concLabel }}</span>
                                        </template>
                                        <template v-else><div class="c002-box">{{ row.tempSet }}</div></template>
                                    </td>
                                    <td class="c002-val c002-val-toggle">
                                        <template v-if="row.concVal !== undefined">
                                            <div class="c002-box">{{ row.concVal }}<span class="c002-unit">%</span></div>
                                        </template>
                                        <template v-else>
                                            <span :class="row.heatOn ? 'c002-on' : 'c002-on-off'">ON</span>
                                            <span :class="row.heatOn ? 'c002-off' : 'c002-off-red'">OFF</span>
                                        </template>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>

            <!-- Standard Points Grid -->
            <template v-else>
                <div v-if="machine.points.length === 0" class="no-data-msg">暫無資料</div>
                <div v-else class="points-grid">
                    <div v-for="(p, i) in machine.points" :key="i" class="point-card">
                        <div class="point-header">
                            <span class="point-name">{{ p.name }}</span>
                            <span class="status-dot" :class="'dot-' + p.status" />
                        </div>
                        <div class="point-value">{{ pointNumber(p) }} <span class="point-value-unit">{{ p.unit }}</span></div>
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Activity, Play, Pause, PowerOff, Zap, Gauge, Calendar, Timer, SlidersHorizontal, FileText, Droplets, ShowerHead, Cpu, Infinity, ChevronLeft, ChevronRight, Trash2 } from 'lucide-vue-next'
import rtoGlueImg from '../assets/detail_page/glue- making.png'
import rtoPLCImg from '../assets/detail_page/RTO_PLC.png'
import coatingMachineImg from '../assets/detail_page/coating_machine.png'
import { useWorkRecordsStore } from '@/stores/workRecords.js'

const route = useRoute()
const router = useRouter()
const store = useWorkRecordsStore()

const machineId = computed(() => route.params.machineId)
const fromCategory = window.history.state?.fromCategory

const mockData = {
    R001: { name: '製膠攪拌機', location: 'C棟1F', category: '製膠', status: 'running', communicationStatus: 'normal', points: [{ name: '溫度1', value: '78.5°C', unit: '°C', status: 'normal' },{ name: '溫度2', value: '82.1°C', unit: '°C', status: 'normal' },{ name: '壓力', value: '3.2 bar', unit: 'bar', status: 'normal' },{ name: '轉速', value: '1250 rpm', unit: 'rpm', status: 'normal' },{ name: '電流', value: '45.2 A', unit: 'A', status: 'normal' },{ name: '振動', value: '0.8 mm/s', unit: 'mm/s', status: 'normal' }] },
    C001: { name: '調膠1', location: 'D棟1樓', category: '塗佈', status: 'running', communicationStatus: 'normal', points: [{ name: '溫度', value: '72.3°C', unit: '°C', status: 'normal' }] },
    C003: { name: '調膠2', location: 'D棟1樓', category: '塗佈', status: 'standby', communicationStatus: 'normal', points: [{ name: '溫度', value: '70.1°C', unit: '°C', status: 'normal' }] },
    C004: { name: '調膠3', location: 'E棟1樓', category: '塗佈', status: 'running', communicationStatus: 'normal', points: [{ name: '溫度', value: '73.5°C', unit: '°C', status: 'normal' }] },
    C005: { name: '調膠4', location: 'E棟1樓', category: '塗佈', status: 'standby', communicationStatus: 'normal', points: [{ name: '溫度', value: '68.9°C', unit: '°C', status: 'normal' }] },
    C002: { name: '塗佈機1', location: 'D棟1樓', category: '塗佈', status: 'standby', communicationStatus: 'normal', points: [{ name: '塗佈溫度', value: '65.3°C', unit: '°C', status: 'normal' },{ name: '烘箱溫度', value: '120.5°C', unit: '°C', status: 'normal' },{ name: '張力', value: '15.2 N', unit: 'N', status: 'warning' },{ name: '速度', value: '80 m/min', unit: 'm/min', status: 'normal' },{ name: '塗佈厚度', value: '25.5 μm', unit: 'μm', status: 'normal' },{ name: '電流', value: '28.7 A', unit: 'A', status: 'normal' }] },
    C006: { name: '塗佈機2', location: 'E棟1樓', category: '塗佈', status: 'running', communicationStatus: 'normal', points: [{ name: '塗佈溫度', value: '67.1°C', unit: '°C', status: 'normal' },{ name: '烘箱溫度', value: '122.0°C', unit: '°C', status: 'normal' },{ name: '張力', value: '16.0 N', unit: 'N', status: 'normal' },{ name: '速度', value: '85 m/min', unit: 'm/min', status: 'normal' },{ name: '塗佈厚度', value: '26.0 μm', unit: 'μm', status: 'normal' },{ name: '電流', value: '29.5 A', unit: 'A', status: 'normal' }] },
    P001: { name: '熱切分條機 (E-17)', location: 'B棟3樓', category: '本業加工', status: 'running', communicationStatus: 'normal', points: [{ name: '米數', value: '1250 m', unit: 'm', status: 'normal' },{ name: '溫度', value: '185.0°C', unit: '°C', status: 'normal' },{ name: '張力', value: '22.8 N', unit: 'N', status: 'normal' },{ name: '轉速', value: '45 m/min', unit: 'm/min', status: 'normal' }] },
    P002: { name: '裁切設備 (E-11)', location: 'B棟3樓', category: '本業加工', status: 'standby', communicationStatus: 'normal', points: [{ name: '刀具溫度', value: '28.2°C', unit: '°C', status: 'normal' },{ name: '裁切速度', value: '0 m/min', unit: 'm/min', status: 'normal' },{ name: '氣壓', value: '6.0 bar', unit: 'bar', status: 'normal' },{ name: '電流', value: '2.1 A', unit: 'A', status: 'normal' }] },
    P004: { name: '裁切設備 (E-12)', location: 'B棟3樓', category: '本業加工', status: 'running', communicationStatus: 'normal', points: [{ name: '刀具溫度', value: '29.5°C', unit: '°C', status: 'normal' },{ name: '裁切速度', value: '12 m/min', unit: 'm/min', status: 'normal' },{ name: '氣壓', value: '6.2 bar', unit: 'bar', status: 'normal' },{ name: '電流', value: '8.4 A', unit: 'A', status: 'normal' }] },
    P003: { name: '複捲設備', location: 'B棟3樓', category: '本業加工', status: 'stopped', communicationStatus: 'error', points: [{ name: '捲取張力', value: '—', unit: 'N', status: 'error' },{ name: '捲取速度', value: '0 m/min', unit: 'm/min', status: 'normal' },{ name: '電流', value: '0 A', unit: 'A', status: 'normal' },{ name: '通訊狀態', value: '失聯', unit: '', status: 'error' }] },
    CV001: { name: '分條機 (G-01)', location: 'B棟4樓', category: 'COVER加工', status: 'running', communicationStatus: 'normal', points: [{ name: '米數', value: '860 m', unit: 'm', status: 'normal' },{ name: '轉速', value: '60 m/min', unit: 'm/min', status: 'normal' },{ name: '張力', value: '18.5 N', unit: 'N', status: 'normal' }] },
    CV005: { name: '分條機 (G-02)', location: 'B棟4樓', category: 'COVER加工', status: 'standby', communicationStatus: 'normal', points: [{ name: '米數', value: '0 m', unit: 'm', status: 'normal' },{ name: '轉速', value: '0 m/min', unit: 'm/min', status: 'normal' },{ name: '張力', value: '0 N', unit: 'N', status: 'normal' }] },
    CV006: { name: '分條機 (G-03)', location: 'B棟4樓', category: 'COVER加工', status: 'running', communicationStatus: 'normal', points: [{ name: '米數', value: '742 m', unit: 'm', status: 'normal' },{ name: '轉速', value: '58 m/min', unit: 'm/min', status: 'normal' },{ name: '張力', value: '17.8 N', unit: 'N', status: 'normal' }] },
    CV002: { name: '貼合機1', location: 'B棟4樓', category: 'COVER加工', status: 'standby', communicationStatus: 'normal', points: [{ name: '米數', value: '0 m', unit: 'm', status: 'normal' },{ name: '轉速', value: '0 m/min', unit: 'm/min', status: 'normal' },{ name: '張力', value: '0 N', unit: 'N', status: 'normal' }] },
    CV007: { name: '貼合機2', location: 'B棟4樓', category: 'COVER加工', status: 'running', communicationStatus: 'normal', points: [{ name: '米數', value: '315 m', unit: 'm', status: 'normal' },{ name: '轉速', value: '15 m/min', unit: 'm/min', status: 'normal' },{ name: '張力', value: '12.3 N', unit: 'N', status: 'normal' }] },
    CV004: { name: '薄膜斷裁機', location: 'B棟4樓', category: 'COVER加工', status: 'stopped', communicationStatus: 'normal', points: [{ name: '裁切溫度', value: '28.0°C', unit: '°C', status: 'normal' },{ name: '裁切速度', value: '0 m/min', unit: 'm/min', status: 'normal' },{ name: '氣壓', value: '5.8 bar', unit: 'bar', status: 'normal' },{ name: '電流', value: '0.5 A', unit: 'A', status: 'normal' }] },
    L001: { name: '淋膜機', location: 'B棟1F', category: '淋膜', status: 'running', communicationStatus: 'normal', points: [{ name: '淋膜溫度', value: '168.0°C', unit: '°C', status: 'normal' },{ name: '淋膜速度', value: '75 m/min', unit: 'm/min', status: 'normal' },{ name: '膜厚', value: '18.2 μm', unit: 'μm', status: 'normal' },{ name: '張力', value: '20.1 N', unit: 'N', status: 'normal' },{ name: '電流', value: '52.6 A', unit: 'A', status: 'normal' },{ name: '冷卻水溫', value: '18.5°C', unit: '°C', status: 'normal' }] },
    L002: { name: '薄膜複捲機', location: 'B棟1F', category: '淋膜', status: 'standby', communicationStatus: 'normal', points: [] },
    F001: { name: '廠務設備', location: '-', category: '廠務', status: 'running', communicationStatus: 'normal', points: [{ name: 'DI/O接點', value: '正常', unit: '', status: 'normal' }] },
    F002: { name: '主鍋爐溫度', location: '-', category: '廠務', status: 'running', communicationStatus: 'normal', points: [{ name: '溫度1', value: '185.5°C', unit: '°C', status: 'normal' },{ name: '溫度2', value: '172.3°C', unit: '°C', status: 'normal' },{ name: '溫度3', value: '168.0°C', unit: '°C', status: 'normal' }] },
    F003: { name: 'RTO PLC', location: '-', category: '廠務', status: 'running', communicationStatus: 'normal', points: [{ name: '爐膛溫度', value: '820.0°C', unit: '°C', status: 'normal' },{ name: '風量', value: '3500 m³/h', unit: 'm³/h', status: 'normal' },{ name: '廢氣濃度', value: '85 ppm', unit: 'ppm', status: 'normal' },{ name: '熱回收效率', value: '94.5 %', unit: '%', status: 'normal' },{ name: '電流', value: '62.8 A', unit: 'A', status: 'normal' }] },
    AQ001: { name: '空氣品質1', location: '-', category: '廠務', status: 'running', communicationStatus: 'normal', points: [] },
    AQ002: { name: '空氣品質2', location: '-', category: '廠務', status: 'running', communicationStatus: 'normal', points: [] },
}

const machine = computed(() => mockData[machineId.value])
const activeRecord = computed(() => store.activeRecords.find(r => r.machineId === machineId.value))

/* Strip the trailing unit from a point value string (e.g. '1250 m' → '1250') */
function pointNumber(p) {
    if (!p.unit) return p.value
    return p.value.endsWith(p.unit) ? p.value.slice(0, -p.unit.length).trim() : p.value
}

const statusConfig = {
    running: { text: '運轉中', icon: Play, cls: 'status-running' },
    standby: { text: '待機', icon: Pause, cls: 'status-standby' },
    stopped: { text: '停機', icon: PowerOff, cls: 'status-stopped' },
}
const statusCfg = computed(() => machine.value ? statusConfig[machine.value.status] : statusConfig.stopped)

const tensionItems = [
    { val: '0.0', unit: 'MPM' },
    { val: '0.0', unit: 'Kg' },
    { val: '0.0', unit: '%' },
    { val: '0.0', unit: 'MPM' },
    { val: '0.0', unit: 'Kg' },
    { val: '0.0', unit: '%' },
    { val: '0.0', unit: 'MPM' },
    { val: '0.0', unit: 'Kg' },
    { val: '0.0', unit: '%' }
]

const activeTab = ref('device')

const tempTableData = [
    { name: '捲出2B', errCode: '2', status: '準備', speed: '42.5', current: '9.0', tension1: '9.0', ratio: '-', tension2: '1.2', danceWheel: '-91.8', length: '411' },
    { name: '引料輪1', errCode: '2', status: '準備', speed: '42.5', current: '9.0', tension1: '-', ratio: '-', tension2: '-', danceWheel: '-', length: '411' },
    { name: '背膠塗佈爐傳動', errCode: '2', status: '準備', speed: '42.5', current: '9.0', tension1: '10.0', ratio: '-', tension2: '1.5', danceWheel: '97.8', length: '411' },
    { name: '底膠徒步爐傳動', errCode: '2', status: '準備', speed: '42.5', current: '9.0', tension1: '-', ratio: '100.0', tension2: '-', danceWheel: '-58.4', length: '411' },
    { name: '引料輪2', errCode: '2', status: '準備', speed: '42.5', current: '9.0', tension1: '-', ratio: '100.0', tension2: '-', danceWheel: '-', length: '411' },
    { name: '回棒塗佈輪', errCode: '2', status: '準備', speed: '42.5', current: '9.0', tension1: '10.0', ratio: '-', tension2: '0.4', danceWheel: '-', length: '411' },
    { name: '主爐傳動軸1', errCode: '2', status: '準備', speed: '42.5', current: '9.0', tension1: '-', ratio: '100.0', tension2: '-', danceWheel: '-', length: '411' },
    { name: '主爐傳動軸2', errCode: '2', status: '準備', speed: '42.5', current: '9.0', tension1: '-', ratio: '99.7', tension2: '-', danceWheel: '-', length: '411' },
    { name: '主爐傳動軸3', errCode: '2', status: '準備', speed: '42.5', current: '9.0', tension1: '9.0', ratio: '99.8', tension2: '-', danceWheel: '-', length: '411' },
    { name: '主爐冷風箱傳動', errCode: '2', status: '準備', speed: '42.5', current: '9.0', tension1: '-', ratio: '100.0', tension2: '1.1', danceWheel: '-', length: '411' }
]

function getDanceWheelClass(val) {
    if (val === '-') return 'val-white opacity-muted'
    if (val.startsWith('-')) return 'val-red'
    return 'val-green'
}

const activeLamTab = ref('main_1')
const activeC002Tab = ref('line')

const tensionRows = [
    { label: '目標張力kg',    vals: [17.2, 20,   21,   20,   27.6, 4.5,  30.1] },
    { label: '總張力kg',      vals: [18.2, 17.5, 21.1, 20.1, 266,  4.7,  -1  ] },
    { label: '操作側張力kg',  vals: [12.7, 9.8,  11.6, 11.6, 14.1, 2.4,  0.1 ] },
    { label: '傳動側張力kg',  vals: [5.5,  7.6,  9.4,  8.6,  12.6, 2.3,  0   ] },
    { label: '現在輸出%',     vals: [28.2, null, null, null, 45.1, 12.8, 26  ] },
    { label: '現在直徑',      vals: [null, null, null, null, 51,   null, 0   ] },
    { label: '張力遞減率',    vals: [null, null, null, null, 1.6,  null, 16  ] },
    { label: '自動張力設定值',vals: [null, 20,   21,   20,   null, null, null] },
]

const fanRows = [
    { label: '烘箱1 排風', fanHz: 60, fanSetHz: 60, current: 134.4, tempNow: 6.54, tempSet: 6.5,  fanOn: true,  heatOn: true  },
    { label: '烘箱2 排風', fanHz: 45, fanSetHz: 45, current: 83,    tempNow: 8,    tempSet: 8,    fanOn: true,  heatOn: true  },
    { label: '烘箱3 排風', fanHz: 20, fanSetHz: 20, current: 41.7,  tempNow: 8.96, tempSet: 9,    fanOn: true,  heatOn: false },
    { label: '烘箱4 排風', fanHz: 20, fanSetHz: 20, current: 40.7,  tempNow: 10.02,tempSet: 10,   fanOn: true,  heatOn: false },
    { label: '烘箱5 排風', fanHz: 20, fanSetHz: 20, current: 41.9,  tempNow: 9.39, tempSet: 9.5,  fanOn: false, heatOn: false },
    { label: '烘箱1 送風', fanHz: 45, fanSetHz: 45, current: 102.9, concLabel: '烘箱1 溶液濃度', concVal: 13, fanOn: true  },
    { label: '烘箱2 送風', fanHz: 45, fanSetHz: 45, current: 102.6, concLabel: '烘箱2 溶液濃度', concVal: 5,  fanOn: true  },
    { label: '烘箱3 送風', fanHz: 60, fanSetHz: 60, current: 122.9, concLabel: '烘箱3 溶液濃度', concVal: 2,  fanOn: true  },
    { label: '烘箱4 送風', fanHz: 60, fanSetHz: 60, current: 122.2, concLabel: '烘箱4 溶液濃度', concVal: 0,  fanOn: true  },
    { label: '烘箱5 送風', fanHz: 30, fanSetHz: 30, current: 59.5,  concLabel: '烘箱5 溶液濃度', concVal: 0,  fanOn: false },
]

const slitFeedClamp = ref(true)
const slitFeedCtrl = ref(true)
const slitUpperBars = [45, 70, 90, 60, 100, 75, 55, 85, 65, 95, 80, 50, 70, 100, 60, 85, 75, 55]
const slitLowerBars = [55, 80, 65, 95, 50, 85, 70, 45, 90, 60, 80, 95, 55, 75, 85, 65, 90, 70]

const rewParamData = [
    { label: '第1輪張力設定', value: '13.00', unit: 'kgf' },
    { label: '長度設定', value: '50.00', unit: 'm' },
    { label: '煞車張力', value: '18.0', unit: 'kgf' },
    { label: '運轉速度', value: '0.0', unit: 'mm' },
]

const cutSprayOn = ref(false)
const cutMotorSpindle = ref('reverse')
const cutMotorRound = ref('forward')

const cutParamData = [
    { label: '材料厚度', value: '43.04', unit: 'mm' },
    { label: '切斷點', value: '176.00', unit: 'mm' },
    { label: '主軸轉速', value: '450', unit: 'RPM' },
    { label: '接觸距離', value: '6.00', unit: 'mm' },
    { label: '手動進刀速度', value: '40.0', unit: 'mm/s' },
    { label: '圓刀轉速', value: '450', unit: 'RPM' },
    { label: '紙管厚度', value: '3.00', unit: 'mm' },
    { label: '進刀停留圈數', value: '8', unit: '圈' },
]

const cutModeData = [
    { qty: 1, size: '4.00', prepSpeed: '5.0', cutSpeed: '5.0', endSpeed: '5.0', angle: '-1.0' },
    { qty: 2, size: '630.00', prepSpeed: '5.0', cutSpeed: '5.0', endSpeed: '5.0', angle: '-1.0' },
    { qty: 0, size: '13.00', prepSpeed: '5.0', cutSpeed: '5.0', endSpeed: '5.0', angle: '-1.0' },
    { qty: 0, size: '21.00', prepSpeed: '5.0', cutSpeed: '5.0', endSpeed: '5.0', angle: '-1.0' },
    { qty: 0, size: '25.00', prepSpeed: '5.0', cutSpeed: '5.0', endSpeed: '5.0', angle: '-1.0' },
]

function goBack() {
    router.push({ path: '/', state: { tab: fromCategory } })
}
</script>

<style scoped>
.page { padding: 24px; }
.center-msg { display: flex; align-items: center; justify-content: center; height: 192px; color: var(--c-muted-fg); }
.header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.back-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: none; background: none; cursor: pointer; border-radius: var(--radius); color: var(--c-fg); transition: background-color 0.2s; }
.back-btn:hover { background: var(--c-secondary); }
.machine-name { font-size: 20px; font-weight: 500; color: var(--c-fg); }
.machine-sub { font-size: 14px; color: var(--c-muted-fg); display: flex; align-items: center; gap: 4px; }
.machine-sub-sep { margin: 0 2px; }
.machine-name-row { display: flex; align-items: center; gap: 16px; margin-bottom: 4px; }
.status-pill { display: flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: var(--radius); font-size: 14px; }
.status-running { background: rgba(34,197,94,0.2); color: var(--c-green); }
.status-standby { background: rgba(234,179,8,0.2); color: var(--c-yellow); }
.status-stopped { background: rgba(239,68,68,0.2); color: var(--c-red); }
.wo-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius); padding: 18px 24px; margin-bottom: 24px; display: flex; flex-wrap: wrap; gap: 24px 64px; font-size: 14px; }
.wo-col { display: flex; flex-direction: column; }
.wo-label { font-size: 14px; color: var(--c-muted-fg); margin-bottom: 2px; }
.wo-val { font-size: 16px; color: var(--c-fg); }
.fw-500 { font-weight: 500; }
/* C002 塗佈線 */
.cm-wrap { width: 100%; }
.cm-canvas { position: relative; width: 100%; aspect-ratio: 4812 / 2800; }
.cm-bg-img { position: absolute; top: 20%; left: 15%; width: 70%; object-fit: fill; border-radius: var(--radius); }
.cm-card { position: absolute; background: #2A3A68; border: 1.5px solid #3a5a8a; border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; }
.cm-card-title { font-size: 15px; font-weight: 600; color: #ffffff; background: #011335; padding: 7px 14px; border-bottom: 1px solid #3a5a8a; }
.cm-card-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.cm-grid-cell { display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 14px; border-bottom: 1px solid #2e4a72; }
.cm-grid-cell:nth-last-child(-n+2) { border-bottom: none; }
.cm-grid-cell-full { grid-column: 1 / -1; justify-content: flex-start; gap: 12px; }
.cm-cell-row { display: flex; align-items: center; gap: 6px; }
.cm-label-group { display: flex; flex-direction: column; gap: 2px; }
.cm-label { font-size: 16px; color: #b0c4d8; white-space: nowrap; }
.cm-axis-head { font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 2px; }
.cm-axis-head-active { color: #4dd0e1; }
.cm-axis-head-inactive { color: #7a99b8; }
.cm-unit { font-size: 12px; color: #7a99b8; white-space: nowrap; }
.cm-box { background: #ffffff; color: #1e293b; font-family: monospace; font-size: 16px; font-weight: 600; padding: 3px 10px; border-radius: 3px; min-width: 56px; text-align: right; white-space: nowrap; border: 1px solid #94a3b8; }
.cm-box-blue { color: #3b82f6; }
.cm-box-green { background: #16a34a; color: #ffffff; border-color: #16a34a; }
.cm-mg-body { display: flex; flex-direction: column; gap: 8px; padding: 10px 14px; grid-column: 1 / -1; }
.cm-mg-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.cm-label-gap { margin-left: 10px; }
.cm-pill { display: inline-flex; background: #0f1e3d; border-radius: 20px; padding: 2px; border: 1px solid #2e4a72; }
.cm-pill-opt { padding: 3px 12px; border-radius: 16px; font-size: 14px; font-weight: 600; color: #6b7280; white-space: nowrap; }
.cm-pill-active { background: #16a34a; color: #ffffff; }
.no-data-msg { color: var(--c-muted-fg); font-size: 15px; padding: 32px 0; text-align: center; }
/* C002 塗佈機1 */
.c002-status-wrap { display: flex; gap: 16px; align-items: flex-start; overflow-x: auto; }
.c002-table-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius); overflow: hidden; width: calc(50% - 8px); flex-shrink: 0; }
.c002-table { border-collapse: collapse; width: 100%; }
.c002-table th { background: #1a2a4a; color: #ffffff; padding: 8px 12px; text-align: center; font-weight: 600; font-size: 16px; border: 1px solid rgba(255,255,255,0.12); white-space: nowrap; }
.c002-table td { padding: 5px 10px; border: 1px solid var(--c-border); text-align: center; color: var(--c-fg); white-space: nowrap; }
.c002-th-label { min-width: 110px; }
.c002-group-header { font-size: 16px; font-weight: 600; }
.c002-row-label { text-align: left !important; font-size: 16px; color: var(--c-muted-fg); background: rgba(0,0,0,0.05); }
.c002-val { min-width: 60px; padding: 4px 6px; }
.c002-val-toggle { text-align: center; }
.c002-val-right { text-align: right; }
.c002-box { background: #e8edf2; border: 1px solid #b0bec5; color: #1e293b; font-family: monospace; font-size: 20px; font-weight: 500; text-align: right; padding: 3px 8px; border-radius: 2px; }
.body--dark .c002-box { background: #ffffff; border-color: #94a3b8; color: #1e293b; }
.c002-on  { background: #16a34a; color: #ffffff; border-radius: 3px; padding: 2px 6px; font-size: 13px; font-weight: 600; }
.c002-off { background: #4b5563; color: #9ca3af; border-radius: 3px; padding: 2px 6px; font-size: 13px; font-weight: 600; }
.c002-on-off  { background: #374151; color: #6b7280; border-radius: 3px; padding: 2px 6px; font-size: 13px; font-weight: 600; }
.c002-off-red { background: #dc2626; color: #ffffff; border-radius: 3px; padding: 2px 6px; font-size: 13px; font-weight: 600; }
.c002-conc-label { font-size: 16px; color: #ffffff; }
.c002-unit { font-size: 14px; color: #64748b; margin-left: 2px; }
.points-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
.point-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius); padding: 16px; transition: border-color 0.2s; }
.point-card:hover { border-color: color-mix(in srgb, var(--c-primary) 50%, transparent); }
.point-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; }
.point-name { font-size: 16px; color: var(--c-muted-fg); }
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.dot-normal { background: var(--c-green); }
.dot-warning { background: var(--c-yellow); }
.dot-error { background: var(--c-red); }
.point-value { font-size: 24px; font-weight: 500; color: var(--c-card-fg); }
.point-value-unit { font-size: 16px; color: var(--c-muted-fg); font-weight: 400; }
.diagram-placeholder { margin-top: 24px; background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius); padding: 32px; text-align: center; color: var(--c-muted-fg); }
.diagram-title { font-weight: 500; margin: 16px 0 4px; }
.diagram-desc { font-size: 14px; }

@media (max-width: 768px) {
    .points-grid { grid-template-columns: 1fr; }
}

/* Coating Dashboard Styling */
.coating-dashboard {
    display: grid;
    grid-template-columns: 1fr 1.8fr 1fr;
    gap: 16px;
    margin-top: 24px;
    align-items: stretch;
}

.coating-card {
    --coat-bg: var(--c-card);
    --coat-border: var(--c-card-border);
    --coat-text: var(--c-fg);
    --coat-muted: var(--c-muted-fg);
    --coat-val-color: var(--c-val-green);
    --coat-row-border: var(--c-row-border);
    --coat-panel-header: var(--c-coat-header);
    
    background: var(--coat-bg);
    border: 1px solid var(--coat-border);
    border-radius: var(--radius);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.card-header {
    background: var(--coat-panel-header);
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--coat-text);
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid var(--coat-border);
}

.header-icon {
    color: var(--coat-text);
    opacity: 0.8;
}

.yellow-icon {
    color: var(--c-yellow);
    opacity: 1;
}

.card-body {
    padding: 16px;
    flex: 1;
    color: var(--coat-text);
    display: flex;
    flex-direction: column;
}

/* Voltage Table Styles */
.voltage-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 16px;
}

.voltage-table th {
    color: var(--coat-muted);
    font-weight: normal;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--coat-row-border);
}

.voltage-table td {
    padding: 12px 0;
    border-bottom: 1px solid var(--coat-row-border);
}

.voltage-table tbody tr:last-child td {
    border-bottom: none;
}

.voltage-table .status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
    vertical-align: middle;
}

.dot-r { background: var(--c-red); }
.dot-s { background: var(--c-yellow); }
.dot-t { background: var(--c-blue); }

.voltage-table .val, .speed-item .item-val, .tension-item .item-val {
    color: var(--coat-val-color);
    font-weight: 600;
    font-family: monospace, ui-monospace;
}

.voltage-table .unit, .speed-item .unit, .tension-item .unit {
    color: var(--coat-muted);
    font-size: 11px;
    font-weight: normal;
}
.voltage-table .unit, .speed-item .unit { margin-left: 2px; }
.tension-item .unit { margin-left: 8px; }

.voltage-table .total-row td {
    font-weight: 500;
    padding-top: 16px;
}

/* Speed Grid Styles */
.speed-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    flex: 1;
}

.speed-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.speed-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 16px;
    border-bottom: 1px solid var(--coat-row-border);
}

.speed-col .speed-item:last-child {
    border-bottom: none;
}

.speed-item .item-label {
    color: var(--coat-text);
}

/* Tension List Styles */
.tension-list {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.tension-item {
    display: grid;
    grid-template-columns: 60px 40px;
    justify-content: end;
    align-items: center;
    padding: 8px 0;
    font-size: 16px;
    border-bottom: 1px solid var(--coat-row-border);
}
.tension-item .item-num {
    color: var(--coat-val-color);
    font-weight: 600;
    font-family: monospace, ui-monospace;
    text-align: right;
}

.tension-list .tension-item:last-child {
    border-bottom: none;
}

@media (max-width: 1200px) {
    .coating-dashboard {
        grid-template-columns: 1fr;
    }
    .speed-grid {
        grid-template-columns: 1fr;
        gap: 0;
    }
}

/* Coating Temperature Panel Styles */
.coating-temp-panel {
    --tbl-bg: var(--c-card);
    --tbl-border: var(--c-border);
    --tbl-text: var(--c-fg);
    --tbl-header-name: #0284c7;
    --tbl-header-other: var(--c-fg);
    --tbl-row-border: rgba(0, 0, 0, 0.05);
    --tbl-motor-dot: #0284c7;
    --tbl-val-color: var(--c-fg);
    --tbl-val-red: #dc2626;
    --tbl-val-green: #16a34a;
    margin-top: 24px;
}



.temp-table-card {
    background: var(--tbl-bg);
    border: 1px solid var(--tbl-border);
    border-radius: var(--radius);
    padding: 24px;
    overflow-x: auto;
}

.temp-data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 16px;
    color: var(--tbl-text);
}

.temp-data-table th {
    padding: 12px 16px;
    font-weight: 500;
    border-bottom: 2px solid;
    border-image: linear-gradient(to right, #00c2ff 12%, #eeb000 12%) 1;
}

.temp-data-table th.col-name {
    color: var(--tbl-header-name);
}

.temp-data-table th:not(.col-name) {
    color: var(--tbl-header-other);
}

.temp-data-table td {
    padding: 14px 16px;
    border-bottom: 1px solid var(--tbl-row-border);
    vertical-align: middle;
}

.temp-data-table tbody tr:last-child td {
    border-bottom: none;
}

.motor-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--tbl-motor-dot);
    margin-right: 8px;
    vertical-align: middle;
}

.err-badge {
    display: inline-block;
    border: 1px solid var(--c-yellow);
    color: var(--tbl-text);
    padding: 2px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-weight: bold;
    font-size: 12px;
    background: rgba(238, 176, 0, 0.05);
}

.status-capsule {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--c-green);
    color: var(--c-green);
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    background: rgba(0, 201, 81, 0.05);
}

.status-inner-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--c-green);
}

.val-white {
    color: var(--tbl-val-color);
    font-family: monospace, ui-monospace;
    font-weight: 500;
}

.val-red {
    color: var(--tbl-val-red);
    font-family: monospace, ui-monospace;
    font-weight: 600;
}

.val-green {
    color: var(--tbl-val-green);
    font-family: monospace, ui-monospace;
    font-weight: 600;
}

.opacity-muted {
    opacity: 0.4;
}

/* Lamination Panels Styling */
.lam-panel {
    margin-top: 24px;
}

.lam-card {
    --lam-bg: var(--c-card);
    --lam-border: var(--c-card-border);
    --lam-text: var(--c-fg);
    --lam-muted: var(--c-muted-fg);
    --lam-row-border: var(--c-row-border);
    --lam-panel-header: var(--c-lam-header);
    --capsule-bg: var(--c-capsule-bg);
    
    background: var(--lam-bg);
    border: 1px solid var(--lam-border);
    border-radius: var(--radius);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.lam-card.lam-card-flat {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

.lam-card .card-header {
    background: var(--lam-panel-header);
    margin: 8px 8px 4px 8px;
    padding: 6px 8px;
    border-radius: 6px;
    border-bottom: none;
    min-height: 34px;
    font-size: 13px;
    display: flex;
    align-items: center;
    font-weight: bold;
}

.lam-card .card-body {
    padding: 8px 16px 16px 16px;
}

.lam-card .card-body > *:has(+ .mt-auto) {
    margin-bottom: 64px;
}

.lam-card .capsule-row,
.lam-card .capsule-container {
    margin-left: -8px !important;
    margin-right: -8px !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
}

.lam-card .card-body > .capsule-row:last-child,
.lam-card .card-body > .capsule-container:last-child {
    margin-bottom: -8px !important;
}

.lam-capsule-card .card-body {
    padding: 12px 8px 8px 8px;
}

.lam-capsule-card .capsule-row {
    padding-left: 8px;
    padding-right: 8px;
}

.capsule-container {
    background: var(--capsule-bg);
    padding: 0 12px;
    border-radius: 6px;
}
.capsule-container .lam-row-divider {
    margin: 0;
}
.capsule-container .lam-row {
    padding: 8px 0;
}
.capsule-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--capsule-bg);
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 8px;
    min-height: 42px;
    font-size: 16px;
}
.capsule-row:last-child {
    margin-bottom: 0;
}
.capsule-row.title-row {
    font-weight: bold;
    justify-content: flex-start;
    font-size: 13px;
    color: var(--lam-text);
}

/* Lamination Badges */
.lam-badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    margin-left: 4px;
    vertical-align: middle;
    line-height: 1.2;
}
.lam-badge.yellow { background: var(--c-yellow); color: #000; }
.lam-badge.red { background: var(--c-red); color: #fff; }
.lam-badge.green { background: var(--c-green); color: #fff; }
.lam-badge.orange { background: var(--c-orange); color: #fff; }
.lam-badge.cyan { background: var(--c-cyan); color: #fff; }

.switch-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    color: #fff;
}
.switch-badge.green { background: #10b981; }

.lam-row-divider {
    height: 1px;
    background: var(--lam-row-border);
    margin: 12px 0;
}

.lam-section-title {
    font-size: 12px;
    font-weight: bold;
    color: var(--lam-muted);
    margin: 12px 0 6px 0;
}

/* Lamination rows */
.lam-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
    font-size: 16px;
}
.lam-label {
    color: var(--lam-text);
}

.chain-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
}
.chain-col {
    display: flex;
    flex-direction: column;
}

.lam-grid-twin {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}
@media (max-width: 992px) {
    .lam-grid-twin {
        grid-template-columns: 1fr;
    }
}

.gap-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
}
.row-flex-mini {
    display: flex;
    align-items: center;
    gap: 4px;
}
.mini-label {
    font-size: 12px;
    color: var(--lam-text);
}

/* Heat Control Styles */
.heat-twin-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
}
@media (max-width: 992px) {
    .heat-twin-grid {
        grid-template-columns: 1fr;
    }
}
.heat-ctrl-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.heat-ctrl-title {
    font-size: 13px;
    font-weight: bold;
    color: var(--c-fg);
    background: var(--c-lam-header);
    padding: 6px 12px;
    border-radius: 6px;
    min-height: 34px;
    display: flex;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
.heat-sub-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}
@media (max-width: 768px) {
    .heat-sub-grid {
        grid-template-columns: 1fr;
    }
}
.heat-sub-grid .lam-card .card-header {
    font-size: 13px;
}
.heat-btn {
    border: none;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    cursor: pointer;
    margin-left: 4px;
    line-height: 1.2;
    vertical-align: middle;
}
.edit-btn {
    background: rgba(6, 182, 212, 0.08) !important;
    border: 1px solid #06b6d4 !important;
    color: #06b6d4 !important;
    transition: background-color 0.2s, border-color 0.2s;
}
.edit-btn:hover {
    background: rgba(6, 182, 212, 0.15) !important;
}
.apply-btn {
    background: #24966C !important;
    color: #ffffff !important;
    border: none !important;
    transition: opacity 0.2s;
}
.apply-btn:hover {
    opacity: 0.9 !important;
}
.heat-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.heat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    font-size: 16px;
    border-bottom: 1px solid var(--lam-row-border);
}
.heat-row:last-child {
    border-bottom: none;
}
.heat-label {
    color: var(--lam-text);
}
.heat-vals {
    display: flex;
    align-items: center;
    gap: 6px;
}
.heat-val-real {
    color: #dc2626;
    font-family: monospace;
    font-weight: bold;
    font-size: 16px;
}

.heat-bottom-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}
.heat-time-header {
    background: transparent !important;
    margin: 0 12px !important;
    border-radius: 0 !important;
    border-bottom: 1px solid rgba(59, 130, 246, 0.45) !important;
    padding: 8px 0 !important;
}
@media (max-width: 1200px) {
    .heat-bottom-row {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (max-width: 768px) {
    .heat-bottom-row {
        grid-template-columns: 1fr;
    }
}

/* Lamination Top and Bottom Grid */
.lam-grid-top {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    align-items: stretch;
}
.lam-grid-bottom {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 16px;
    align-items: stretch;
    margin-top: 16px !important;
}
.lam-combined-card {
    background: var(--lam-bg);
    border: 1px solid var(--lam-border);
}
.lam-combined-card .combined-body {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 16px;
    padding: 0 !important;
}
@media (max-width: 1200px) {
    .lam-combined-card .combined-body {
        grid-template-columns: 1fr;
    }
}
@media (max-width: 1200px) {
    .lam-grid-top {
        grid-template-columns: repeat(2, 1fr);
    }
    .lam-grid-bottom {
        grid-template-columns: 1fr;
    }
}
@media (max-width: 768px) {
    .lam-grid-top {
        grid-template-columns: 1fr;
    }
}

/* Lamination values styles */
.lam-value-box {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    width: 110px; /* Unified box width to ensure alignment */
    gap: 8px;
}
.lam-val {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: monospace, ui-monospace;
    font-weight: bold;
    width: 72px; /* Fixed value box width for neat alignment */
    text-align: center;
    font-size: 16px;
    line-height: 1.4;

    background: var(--c-lam-val-bg);
    border: 1px solid var(--c-lam-val-border);
}

.lam-value-box .unit {
    width: 25px; /* Fixed unit width so all units align vertically */
    text-align: left;
    color: var(--lam-text);
    font-size: 16px;
    opacity: 0.8;
}

.lam-val.dark-green, .lam-val.green-bg { color: var(--c-val-green); }
.lam-val.dark-white { color: var(--c-lam-val-fg); }
.lam-val.dark-yellow { color: #eeb000; }
.lam-val.dark-red {
    background: rgba(220, 38, 38, 0.08);
    border: 1px solid rgba(220, 38, 38, 0.2);
    color: #dc2626;
}



/* Time controls bottom styles */
.time-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}
.time-row:last-child {
    margin-bottom: 0;
}
.time-btn, .timer-btn {
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    min-width: 64px;
    text-align: center;
}
.time-btn.green, .timer-btn.green { background: #24966C !important; color: #ffffff !important; border: none !important; }
.time-btn.red, .timer-btn.red { background: #ef4444 !important; color: #ffffff !important; border: none !important; }
.time-box {
    display: flex;
    align-items: center;
    gap: 4px;
}
.time-unit {
    display: inline-flex;
    flex-direction: column;
    border-radius: 4px;
    border: 1px solid var(--c-border);
    overflow: hidden;
    min-width: 32px;
    text-align: center;
}
.tu-label {
    background: var(--c-lam-header);
    color: var(--c-muted-fg);
    font-size: 10px;
    font-weight: bold;
    padding: 1px 0;
    border-bottom: 1px solid var(--c-border);
    line-height: 1.2;
}
.tu-val {
    background: var(--c-input-bg);
    color: var(--c-fg);
    font-family: monospace;
    font-weight: bold;
    font-size: 16px;
    padding: 2px 0;
    line-height: 1.2;
}
.green-theme .time-unit {
    border: 1px solid #24966C !important;
}
.green-theme .tu-label {
    background: #24966C !important;
    color: #ffffff !important;
    border-bottom: 1px solid #24966C !important;
}
.green-theme .tu-val {
    color: #24966C;
}
.red-theme .time-unit {
    border: 1px solid #ef4444 !important;
}
.red-theme .tu-label {
    background: #ef4444 !important;
    color: #ffffff !important;
    border-bottom: 1px solid #ef4444 !important;
}
.red-theme .tu-val {
    color: #ef4444;
}


.mt-auto {
    margin-top: auto;
}
.tab-bar {
    margin-bottom: 12px !important;
}
.chain-bottom-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 64px;
    margin-top: 0;
}
.bottom-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    padding: 4px 0;
}
@media (max-width: 768px) {
    .chain-bottom-row {
        grid-template-columns: 1fr;
        gap: 0;
    }
}

/* ─── Cutting Machine (P002) Dashboard ─── */
.cut-dashboard { display: flex; flex-direction: column; gap: 16px; }
.cut-top-row { display: grid; grid-template-columns: 1fr 2fr; gap: 16px; }
.cut-bottom-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.cut-card {
    background: var(--c-card);
    border: 1px solid var(--c-card-border);
    border-radius: var(--radius);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.cut-card-header {
    background: var(--c-lam-header);
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 500;
    color: var(--c-fg);
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid var(--c-card-border);
}
.cut-params-body {
    padding: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.cut-params-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.cut-param-item {
    background: var(--c-lam-val-bg);
    border: 1px solid var(--c-lam-val-border);
    border-radius: 6px;
    padding: 8px 10px;
    text-align: center;
}
.cut-param-label {
    font-size: 16px;
    color: var(--c-fg);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}
.cut-param-val-row { display: flex; align-items: baseline; justify-content: center; gap: 4px; }
.cut-val {
    font-size: 18px;
    font-weight: 600;
    color: var(--c-val-green);
    font-variant-numeric: tabular-nums;
}
.cut-unit { font-size: 12px; color: var(--c-muted-fg); }
.cut-counter-row {
    background: var(--c-lam-val-bg);
    border: 1px solid var(--c-lam-val-border);
    border-radius: 6px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.cut-counter-left { display: flex; align-items: center; gap: 10px; }
.cut-counter-icon {
    color: var(--c-val-green);
    display: flex;
    align-items: center;
    background: rgba(0, 201, 81, 0.1);
    border-radius: 6px;
    padding: 6px;
}
.cut-clear-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 6px;
    color: var(--c-red);
    font-size: 12px;
    padding: 6px 10px;
    cursor: pointer;
    white-space: nowrap;
}
.cut-clear-btn:hover { background: rgba(239, 68, 68, 0.2); }
.cut-table-body { padding: 12px; flex: 1; overflow-x: auto; }
.cut-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.cut-table th {
    text-align: center;
    padding: 8px 10px;
    color: var(--c-muted-fg);
    font-weight: 500;
    font-size: 12px;
    border-bottom: 1px solid var(--c-card-border);
    white-space: nowrap;
}
.cut-table td {
    text-align: center;
    padding: 8px 6px;
    border-bottom: 1px solid var(--c-row-border);
}
.cut-mode-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 2px solid var(--c-blue);
    color: var(--c-blue);
    font-size: 12px;
    font-weight: 600;
}
.cut-cell-box {
    display: inline-block;
    min-width: 58px;
    padding: 4px 8px;
    background: var(--c-lam-val-bg);
    border: 1px solid var(--c-lam-val-border);
    border-radius: 4px;
    color: var(--c-lam-val-fg);
    font-size: 16px;
    text-align: center;
    font-variant-numeric: tabular-nums;
}
.cut-cell-red {
    background: rgba(239, 68, 68, 0.12) !important;
    border-color: rgba(239, 68, 68, 0.35) !important;
    color: var(--c-red) !important;
}
.cut-spray-body { padding: 12px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.cut-spray-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.cut-spray-item {
    background: var(--c-lam-val-bg);
    border: 1px solid var(--c-lam-val-border);
    border-radius: 6px;
    padding: 10px 12px;
    text-align: center;
}
.cut-spray-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--c-lam-val-bg);
    border: 1px solid var(--c-lam-val-border);
    border-radius: 6px;
    padding: 10px 14px;
}
.cut-toggle-pill {
    position: relative;
    display: flex;
    align-items: center;
    width: 100px;
    height: 34px;
    border-radius: 17px;
    background: #e53935;
    cursor: pointer;
    user-select: none;
    transition: background 0.3s;
    flex-shrink: 0;
}
.cut-toggle-pill.cut-pill-on {
    background: #00c951;
}
.cut-pill-thumb {
    position: absolute;
    left: 4px;
    width: 48px;
    height: 26px;
    border-radius: 13px;
    background: #ffffff;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
}
.cut-toggle-pill.cut-pill-on .cut-pill-thumb {
    left: calc(100% - 52px);
}
.cut-pill-label {
    position: absolute;
    font-size: 12px;
    font-weight: 700;
    z-index: 2;
    pointer-events: none;
    transition: color 0.2s;
}
.cut-pill-off-label {
    left: 13px;
    color: #8b0000;
}
.cut-pill-on-label {
    right: 13px;
    color: rgba(255,255,255,0.75);
}
.cut-toggle-pill.cut-pill-on .cut-pill-off-label {
    color: rgba(255,255,255,0.75);
}
.cut-toggle-pill.cut-pill-on .cut-pill-on-label {
    color: #005c25;
}
.cut-motor-body {
    padding: 12px;
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}
.cut-motor-group {
    background: var(--c-lam-val-bg);
    border: 1px solid var(--c-lam-val-border);
    border-radius: 8px;
    overflow: hidden;
}
.cut-motor-group-title {
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 500;
    color: var(--c-fg);
    text-align: center;
    border-bottom: 1px solid var(--c-lam-val-border);
    background: var(--c-coat-header);
}
.cut-motor-items {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.cut-radio-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 6px;
    background: var(--c-lam-val-bg);
    border: 1px solid var(--c-lam-val-border);
    color: var(--c-muted-fg);
    font-size: 16px;
    cursor: pointer;
}
.cut-radio-active {
    background: rgba(234, 179, 8, 0.12);
    border-color: rgba(234, 179, 8, 0.35);
    color: var(--c-yellow);
}
.cut-radio-circle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid currentColor;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.cut-radio-circle.active::after {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--c-yellow);
}
@media (max-width: 1024px) {
    .cut-top-row { grid-template-columns: 1fr; }
    .cut-bottom-row { grid-template-columns: 1fr; }
}
:global(.body--dark) .cut-dashboard {
    --c-lam-val-bg: #162040;
}

/* ─── 薄膜斷裁機 (CV004) Dashboard ─── */
.slit-dashboard { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.slit-card { background: var(--c-card); border: 1px solid var(--c-card-border); border-radius: var(--radius); display: flex; flex-direction: column; overflow: hidden; min-height: 520px; }
.slit-card-header { background: var(--c-lam-header); padding: 10px 14px; font-size: 13px; font-weight: 500; color: var(--c-fg); display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--c-card-border); }
.slit-card-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.slit-speed-box { background: var(--c-lam-val-bg); border: 1px solid var(--c-lam-val-border); border-radius: 6px; padding: 10px 12px; text-align: center; }
.slit-box-label { font-size: 16px; color: var(--c-fg); margin-bottom: 4px; }
.slit-big-val { font-size: 28px; font-weight: 700; color: var(--c-val-green); font-variant-numeric: tabular-nums; }
.slit-speed-unit { font-size: 13px; color: var(--c-muted-fg); margin-top: 2px; }
.slit-progress-track { height: 6px; background: rgba(128,128,128,0.2); border-radius: 3px; margin-top: 8px; overflow: hidden; }
.slit-progress-bar { height: 100%; background: var(--c-green); border-radius: 3px; }
.slit-row-item { display: flex; align-items: center; justify-content: space-between; background: var(--c-lam-val-bg); border: 1px solid var(--c-lam-val-border); border-radius: 6px; padding: 8px 12px; }
.slit-row-label { font-size: 16px; color: var(--c-fg); }
.slit-row-val { display: flex; align-items: baseline; gap: 8px; }
.slit-rv-num { font-size: 16px; font-weight: 600; color: var(--c-val-green); font-variant-numeric: tabular-nums; }
.slit-rv-unit { font-size: 12px; color: var(--c-muted-fg); }
.slit-mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.slit-mini-item { background: var(--c-lam-val-bg); border: 1px solid var(--c-lam-val-border); border-radius: 6px; padding: 8px 12px; }
.slit-mini-val { display: flex; align-items: baseline; gap: 8px; margin-top: 4px; }
.slit-completion-row { display: flex; align-items: center; justify-content: space-between; background: var(--c-lam-val-bg); border: 1px solid var(--c-lam-val-border); border-radius: 6px; padding: 10px 12px; margin-top: auto; }
.slit-reset-btn { display: inline-flex; align-items: center; gap: 6px; background: rgba(234, 88, 12, 0.15); border: 1px solid rgba(234, 88, 12, 0.4); border-radius: 6px; color: var(--c-orange); font-size: 12px; padding: 5px 12px; cursor: pointer; white-space: nowrap; font-weight: 500; }
.slit-tension-section { background: var(--c-lam-val-bg); border: 1px solid var(--c-lam-val-border); border-radius: 6px; padding: 10px 12px; }
.slit-tension-label { font-size: 16px; color: var(--c-fg); text-align: center; margin-bottom: 10px; }
.slit-tension-ctrl { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.slit-arrow-btn { width: 34px; height: 34px; border-radius: 6px; background: var(--c-blue); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.slit-arrow-btn:hover { background: color-mix(in srgb, var(--c-blue) 80%, white); }
.slit-tension-display { flex: 1; display: flex; flex-direction: column; align-items: center; line-height: 1.1; }
.slit-tension-num { font-size: 28px; font-weight: 700; color: var(--c-val-green); font-variant-numeric: tabular-nums; }
.slit-tension-unit { font-size: 12px; color: var(--c-muted-fg); margin-top: 8px; }
.slit-toggle-row { display: flex; align-items: center; justify-content: space-between; background: var(--c-lam-val-bg); border: 1px solid var(--c-lam-val-border); border-radius: 6px; padding: 8px 12px; }
.slit-spacer { flex: 1; }
.slit-mini-val .slit-big-val,
.slit-completion-row .slit-big-val { font-size: 16px; }
.slit-stability-box { background: var(--c-lam-val-bg); border: 1px solid var(--c-lam-val-border); border-radius: 6px; overflow: hidden; }
.slit-stability-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-bottom: 1px solid var(--c-lam-val-border); }
.slit-bar-chart { display: flex; align-items: flex-end; gap: 3px; height: 60px; padding: 6px 8px; }
.slit-bar { flex: 1; border-radius: 2px 2px 0 0; }
.slit-bar-cyan .slit-bar { background: #00c2ff; }
.slit-bar-purple .slit-bar { background: #a855f7; }
@media (max-width: 1200px) { .slit-dashboard { grid-template-columns: repeat(2, 1fr); } }
:global(.body--dark) .slit-dashboard { --c-lam-val-bg: #162040; }

/* ─── Rewinder (P003) ─── */
.rew-param-item {
    background: var(--c-lam-val-bg);
    border: 1px solid var(--c-lam-val-border);
    border-radius: 6px;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 72px;
}
.rew-val-row { display: flex; align-items: baseline; justify-content: center; gap: 4px; }

/* ─── RTO Diagram (R001) ─── */
.rto-wrap { width: 100%; }
.rto-canvas { position: relative; width: 100%; aspect-ratio: 3588 / 1675; }
.rto-bg-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: fill; border-radius: var(--radius); }

.rto-status-group {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 155px;
}
.rto-status-card {
    background: var(--c-card);
    border: 1px solid var(--c-card-border);
    padding: 10px 14px;
    font-size: 16px;
    color: var(--c-fg);
}
.rto-status-card-top {
    border-radius: 6px 6px 0 0;
    border-bottom: none;
}
.rto-status-card-bottom {
    border-radius: 0 0 6px 6px;
    border-top: 1px solid var(--c-card-border);
}
.rto-status-row { display: flex; justify-content: space-between; align-items: center; padding: 3px 0; }
.rto-status-sep {
    font-size: 16px;
    font-weight: 600;
    color: var(--c-fg);
    text-align: center;
    padding: 4px 0;
    border-bottom: 1px solid var(--c-card-border);
    margin-bottom: 4px;
}
.rto-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.rto-dot-on  { background: #22c55e; box-shadow: 0 0 5px #22c55e88; }
.rto-dot-off { background: #475569; border: 1px solid #64748b; }

.rto-tic-box {
    position: absolute;
    background: var(--c-card);
    border: 1px solid var(--c-card-border);
    border-radius: 6px;
    padding: 8px 12px;
    min-width: 110px;
    font-size: 13px;
    color: var(--c-fg);
}
.rto-tic-wide { min-width: 130px; }
.rto-tic-title {
    color: var(--c-fg);
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    margin-bottom: 6px;
    padding-bottom: 5px;
    border-bottom: 1px solid var(--c-card-border);
}
.rto-tic-row { display: flex; justify-content: space-between; align-items: baseline; padding: 2px 0; }
.rto-tic-running { align-items: center; font-size: 16px; }
.rto-tic-val { color: #22c55e; font-family: monospace; font-weight: 700; font-size: 16px; }
.rto-torque-val { font-size: 18px; }
.rto-tic-unit { color: var(--c-muted-fg); font-size: 14px; }
.rto-tic-sub {
    color: var(--c-fg);
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    padding: 5px 0 4px;
    border-bottom: 1px solid var(--c-card-border);
    margin-top: 8px;
    margin-bottom: 2px;
}

.rto-speed-box {
    position: absolute;
    background: var(--c-card);
    border: 1px solid var(--c-card-border);
    border-radius: 5px;
    padding: 6px 12px;
    width: 144px;
}
.rto-tank-box {
    position: absolute;
    background: var(--c-card);
    border: 1px solid var(--c-card-border);
    border-radius: 6px;
    padding: 8px 12px;
    min-width: 130px;
}
.rto-tank-title {
    color: var(--c-fg);
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 5px;
    margin-bottom: 5px;
    border-bottom: 1px solid var(--c-card-border);
}
.rto-tank-row { display: flex; justify-content: space-between; align-items: center; font-size: 16px; color: var(--c-fg); padding: 2px 0; }

.rto-speed-label {
    color: var(--c-fg);
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--c-card-border);
    margin-bottom: 4px;
}
.rto-speed-val-row { display: flex; justify-content: space-between; align-items: baseline; }
.rto-speed-val { color: #22c55e; font-family: monospace; font-weight: 700; font-size: 16px; }
.rto-speed-unit { color: var(--c-muted-fg); font-size: 14px; }

/* ─── RTO PLC (F003) Dashboard ─── */
.plc-wrap { width: 100%; }
.plc-canvas { position: relative; width: 100%; aspect-ratio: 4808 / 2226; }

/* small chip: just value + unit */
.plc-chip {
    position: absolute;
    background: var(--c-card);
    border: 1px solid var(--c-card-border);
    border-radius: 5px;
    padding: 4px 10px;
    display: flex;
    align-items: baseline;
    gap: 4px;
}

/* inline card: label + value + unit on one row */
.plc-inline {
    position: absolute;
    background: var(--c-card);
    border: 1px solid var(--c-card-border);
    border-radius: 5px;
    padding: 4px 10px;
    display: flex;
    align-items: baseline;
    gap: 6px;
    white-space: nowrap;
}

/* two-line box: title + value row */
.plc-box {
    position: absolute;
    background: var(--c-card);
    border: 1px solid var(--c-card-border);
    border-radius: 6px;
    padding: 6px 12px;
    min-width: 110px;
    text-align: center;
}
.plc-box-title {
    color: var(--c-fg);
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 4px;
    margin-bottom: 4px;
    border-bottom: 1px solid var(--c-card-border);
}
.plc-box-row { display: flex; justify-content: center; align-items: baseline; gap: 4px; }

.plc-label { color: var(--c-fg); font-size: 16px; margin-right: 8px; }
.plc-val { color: #22c55e; font-family: monospace; font-weight: 700; font-size: 16px; }
.plc-unit { color: var(--c-muted-fg); font-size: 13px; }
</style>

<style>
/* PLC dark mode overrides */
.body--dark .plc-chip,
.body--dark .plc-inline,
.body--dark .plc-box { border-color: rgba(255,255,255,0.3); }
.body--dark .plc-box-title { color: #ffffff; border-bottom-color: rgba(255,255,255,0.35); }

/* RTO dark mode overrides */
.body--dark .rto-status-card { border-color: rgba(255,255,255,0.3); }
.body--dark .rto-status-card-bottom { border-top-color: rgba(255,255,255,0.15); }
.body--dark .rto-status-sep { color: #ffffff; border-bottom-color: rgba(255,255,255,0.35); }
.body--dark .rto-tic-box { border-color: rgba(255,255,255,0.3); }
.body--dark .rto-tic-title { color: #ffffff; border-bottom-color: rgba(255,255,255,0.35); }
.body--dark .rto-tic-sub { color: #ffffff; border-bottom-color: rgba(255,255,255,0.35); }
.body--dark .rto-speed-box { border-color: rgba(255,255,255,0.3); }
.body--dark .rto-speed-label { color: #ffffff; border-bottom-color: rgba(255,255,255,0.35); }
.body--dark .rto-tank-box { border-color: rgba(255,255,255,0.3); }
.body--dark .rto-tank-title { color: #ffffff; border-bottom-color: rgba(255,255,255,0.35); }

.body--dark .coating-temp-panel {
    --tbl-bg: #091a30;
    --tbl-border: #1a365d;
    --tbl-text: #ffffff;
    --tbl-header-name: #00c2ff;
    --tbl-header-other: #ffffff;
    --tbl-row-border: rgba(255, 255, 255, 0.08);
    --tbl-motor-dot: #00c2ff;
    --tbl-val-color: #ffffff;
    --tbl-val-red: #ef4444;
    --tbl-val-green: #00c951;
}

.body--dark .time-unit {
    border: 1px solid var(--theme-color);
}
.body--dark .green-theme .time-unit {
    --theme-color: #24966C;
}
.body--dark .red-theme .time-unit {
    --theme-color: #ef4444;
}
.body--dark .tu-label {
    background: var(--theme-color) !important;
    color: #ffffff !important;
    border-bottom: 1px solid var(--theme-color) !important;
}
.body--dark .tu-val {
    background: #05101f !important;
}
.body--dark .green-theme .tu-val {
    color: #17FFAA !important;
}
.body--dark .red-theme .tu-val {
    color: #eeb000 !important;
}


.body--dark .lam-badge.status-badge.red { background: rgba(239, 68, 68, 0.15) !important; color: #ef4444 !important; }
.body--dark .lam-badge.status-badge.orange { background: rgba(249, 115, 22, 0.15) !important; color: #f97316 !important; }
.body--dark .lam-badge.status-badge.cyan { background: rgba(6, 182, 212, 0.15) !important; color: #06b6d4 !important; }

.body--dark .heat-val-real {
    color: #ef4444 !important;
}

.body--dark .lam-val.dark-red {
    background: rgba(239, 68, 68, 0.15) !important;
    border: 1px solid rgba(239, 68, 68, 0.3) !important;
    color: #ef4444 !important;
}

.body--dark .time-btn.green, .body--dark .timer-btn.green {
    background: #24966C !important;
    color: #ffffff !important;
    border: none !important;
}

.body--dark .time-btn.red, .body--dark .timer-btn.red {
    background: #ef4444 !important;
    color: #ffffff !important;
    border: none !important;
}

.body--dark .edit-btn {
    background: rgba(6, 182, 212, 0.08) !important;
    border: 1px solid #06b6d4 !important;
    color: #06b6d4 !important;
}

.body--dark .edit-btn:hover {
    background: rgba(6, 182, 212, 0.15) !important;
}

.body--dark .apply-btn {
    background: #24966C !important;
    color: #ffffff !important;
    border: none !important;
}

.body--dark .apply-btn:hover {
    opacity: 0.9 !important;
}
</style>
