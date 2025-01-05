<template>
  <div class="app-container">
    <!-- 顶部过滤器 -->
    <div class="filter-section">
      <el-form :inline="true" class="filter-form">
        <el-form-item label="Time Range">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="to"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item label="Crime Type">
          <el-select v-model="selectedCrimeType" placeholder="Select Crime Type" @change="handleCrimeTypeChange">
            <el-option
              v-for="type in crimeTypes"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="applyFilters">Apply Filters</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧统计信息 -->
      <div class="stats-panel">
        <h3>Crime Statistics</h3>
        <div class="stats-cards">
          <el-card class="stats-card">
            <div class="stats-value">{{ totalCrimes }}</div>
            <div class="stats-label">Total Crimes</div>
          </el-card>
          <el-card class="stats-card">
            <div class="stats-value">{{ avgCrimesPerDay }}</div>
            <div class="stats-label">Average per Day</div>
          </el-card>
          <el-card class="stats-card">
            <div class="stats-value">{{ highestCrimeArea }}</div>
            <div class="stats-label">Highest Crime Area</div>
          </el-card>
        </div>

        <!-- 犯罪类型分布图表 -->
        <div class="crime-chart">
          <h4>Crime Type Distribution</h4>
          <div id="crimeTypeChart" style="height: 300px;"></div>
        </div>

        <!-- 时间趋势图表 -->
        <div class="trend-chart">
          <h4>Crime Trend</h4>
          <div id="crimeTrendChart" style="height: 300px;"></div>
        </div>
      </div>

      <!-- 右侧地图 -->
      <div class="map-container">
        <div id="crimeMap"></div>
        <div class="map-controls">
          <el-button-group>
            <el-button size="small" @click="toggleHeatmap">Toggle Heatmap</el-button>
            <el-button size="small" @click="toggleClusters">Toggle Clusters</el-button>
          </el-button-group>
        </div>
      </div>
    </div>

    <!-- 底部数据表格 -->
    <div class="data-table">
      <h3>Detailed Crime Data</h3>
      <el-table
        :data="crimeData"
        style="width: 100%"
        height="400"
        border
      >
        <el-table-column
          prop="date"
          label="Date"
          width="180"
        />
        <el-table-column
          prop="type"
          label="Type"
          width="180"
        />
        <el-table-column
          prop="location"
          label="Location"
        />
        <el-table-column
          prop="description"
          label="Description"
        />
        <el-table-column
          prop="severity"
          label="Severity"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag :type="getSeverityType(scope.row.severity)">
              {{ scope.row.severity }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import * as echarts from 'echarts'
import request from '@/utils/request'

// 修复 Leaflet 图标路径问题
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: 'CrimeData',
  data() {
    return {
      dateRange: [],
      selectedCrimeType: '',
      crimeTypes: ['Theft', 'Assault', 'Burglary', 'Robbery', 'Vandalism'],
      crimeData: [],
      map: null,
      heatmapLayer: null,
      clusterLayer: null,
      showHeatmap: true,
      showClusters: false,
      totalCrimes: 0,
      avgCrimesPerDay: 0,
      highestCrimeArea: '',
      crimeTypeChart: null,
      crimeTrendChart: null
    }
  },
  mounted() {
    this.initMap()
    this.initCharts()
    this.fetchCrimeData()
  },
  methods: {
    initMap() {
      // 初始化地图，以伦敦为中心
      this.map = L.map('crimeMap').setView([51.5074, -0.1278], 13)
      
      // 添加地图图层
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map)
    },

    initCharts() {
      // 初始化犯罪类型分布图表
      this.crimeTypeChart = echarts.init(document.getElementById('crimeTypeChart'))
      
      // 初始化时间趋势图表
      this.crimeTrendChart = echarts.init(document.getElementById('crimeTrendChart'))
      
      // 设置图表响应式
      window.addEventListener('resize', () => {
        this.crimeTypeChart.resize()
        this.crimeTrendChart.resize()
      })
    },

    async fetchCrimeData() {
      try {
        const response = await request({
          url: '/api/crimes',
          method: 'get',
          params: {
            startDate: this.dateRange[0],
            endDate: this.dateRange[1],
            crimeType: this.selectedCrimeType
          }
        })

        if (response && response.data) {
          this.crimeData = response.data
          this.updateStatistics()
          this.updateMap()
          this.updateCharts()
        }
      } catch (error) {
        console.error('Failed to fetch crime data:', error)
        this.$message.error('Failed to load crime data')
      }
    },

    updateStatistics() {
      // 更新统计数据
      this.totalCrimes = this.crimeData.length
      this.avgCrimesPerDay = Math.round(this.totalCrimes / 30) // 假设是30天的数据
      
      // 计算犯罪最多的区域
      const areaCounts = {}
      this.crimeData.forEach(crime => {
        areaCounts[crime.location] = (areaCounts[crime.location] || 0) + 1
      })
      this.highestCrimeArea = Object.entries(areaCounts)
        .sort(([,a], [,b]) => b - a)[0][0]
    },

    updateMap() {
      // 清除现有图层
      if (this.heatmapLayer) {
        this.map.removeLayer(this.heatmapLayer)
      }
      if (this.clusterLayer) {
        this.map.removeLayer(this.clusterLayer)
      }

      // 添加热力图层
      if (this.showHeatmap) {
        const heatData = this.crimeData.map(crime => [
          crime.latitude,
          crime.longitude,
          1 // 权重
        ])
        this.heatmapLayer = L.heatLayer(heatData, {
          radius: 25,
          blur: 15,
          maxZoom: 10
        }).addTo(this.map)
      }

      // 添加聚合图层
      if (this.showClusters) {
        this.clusterLayer = L.markerClusterGroup()
        this.crimeData.forEach(crime => {
          const marker = L.marker([crime.latitude, crime.longitude])
            .bindPopup(`
              <h4>${crime.type}</h4>
              <p>Date: ${crime.date}</p>
              <p>Location: ${crime.location}</p>
              <p>Severity: ${crime.severity}</p>
            `)
          this.clusterLayer.addLayer(marker)
        })
        this.map.addLayer(this.clusterLayer)
      }
    },

    updateCharts() {
      // 更新犯罪类型分布图表
      const typeData = {}
      this.crimeData.forEach(crime => {
        typeData[crime.type] = (typeData[crime.type] || 0) + 1
      })

      const typeChartOption = {
        title: {
          text: 'Crime Type Distribution'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [{
          type: 'pie',
          radius: '65%',
          data: Object.entries(typeData).map(([name, value]) => ({
            name,
            value
          }))
        }]
      }
      this.crimeTypeChart.setOption(typeChartOption)

      // 更新时间趋势图表
      const trendData = {}
      this.crimeData.forEach(crime => {
        const date = crime.date.split(' ')[0]
        trendData[date] = (trendData[date] || 0) + 1
      })

      const trendChartOption = {
        title: {
          text: 'Crime Trend'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: Object.keys(trendData)
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'line',
          data: Object.values(trendData),
          smooth: true
        }]
      }
      this.crimeTrendChart.setOption(trendChartOption)
    },

    handleDateChange() {
      this.fetchCrimeData()
    },

    handleCrimeTypeChange() {
      this.fetchCrimeData()
    },

    applyFilters() {
      this.fetchCrimeData()
    },

    toggleHeatmap() {
      this.showHeatmap = !this.showHeatmap
      this.updateMap()
    },

    toggleClusters() {
      this.showClusters = !this.showClusters
      this.updateMap()
    },

    getSeverityType(severity) {
      const types = {
        'High': 'danger',
        'Medium': 'warning',
        'Low': 'success'
      }
      return types[severity] || 'info'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.main-content {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stats-panel {
  flex: 0 0 400px;
  
  h3 {
    margin-top: 0;
    margin-bottom: 20px;
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.stats-card {
  text-align: center;
  
  .stats-value {
    font-size: 24px;
    font-weight: bold;
    color: #409EFF;
  }
  
  .stats-label {
    font-size: 14px;
    color: #666;
  }
}

.crime-chart,
.trend-chart {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  margin-bottom: 20px;
  
  h4 {
    margin-top: 0;
    margin-bottom: 15px;
  }
}

.map-container {
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  
  #crimeMap {
    height: 600px;
    border-radius: 4px;
  }
  
  .map-controls {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1000;
  }
}

.data-table {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  
  h3 {
    margin-top: 0;
    margin-bottom: 20px;
  }
}
</style> 