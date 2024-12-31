<template>
  <div class="crime-data-container">
    <!-- 顶部统计信息面板 -->
    <div class="statistics-panel">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card>
            <div class="stat-item">
              <h3>Total Crimes</h3>
              <div class="stat-value">{{ totalCrimes }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="stat-item">
              <h3>Highest Crime Area</h3>
              <div class="stat-value">{{ highestCrimeArea }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="stat-item">
              <h3>Average Crime Rate</h3>
              <div class="stat-value">{{ averageCrimes }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="stat-item">
              <h3>Last Updated</h3>
              <div class="stat-value">{{ lastUpdate }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 侧边栏筛选面板 -->
      <div class="filter-panel">
        <el-card>
          <div slot="header">
            <span>Data Filters</span>
          </div>
          <el-form>
            <el-form-item label="Area Search">
              <el-input v-model="searchQuery" placeholder="Search area"></el-input>
            </el-form-item>
            <el-form-item>
              <span class="crime-range-label">Crime Rate Range</span>
              <div class="range-indicators">
                <span>Current Level: {{ currentRangeLevel }}</span>
              </div>
              <el-slider
                v-model="crimeRateRange"
                range
                :min="0"
                :max="maxCrimeRate"
                :marks="sliderMarks"
                style="margin-top: 5px"
              ></el-slider>
              <div class="range-values">
                <span>{{ getCrimeRateLevel(crimeRateRange[0]) }}: {{ crimeRateRange[0] }}</span>
                <span>{{ getCrimeRateLevel(crimeRateRange[1]) }}: {{ crimeRateRange[1] }}</span>
              </div>
            </el-form-item>
            <el-form-item label="Sort By">
              <el-select v-model="sortBy" placeholder="Select sorting method">
                <el-option label="Crime Rate (High to Low)" value="crimeRate-desc"></el-option>
                <el-option label="Crime Rate (Low to High)" value="crimeRate-asc"></el-option>
                <el-option label="Area Name" value="name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="applyFilters" icon="el-icon-refresh">
                Apply Filters
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <!-- 地图容器 -->
      <div class="map-container" ref="mapContainer"></div>

      <!-- 区域详情面板 -->
      <el-drawer
        title="Area Details"
        :visible.sync="drawerVisible"
        direction="rtl"
        size="30%"
      >
        <div v-if="selectedArea" class="area-details">
          <h2>{{ selectedArea.name }}</h2>
          <div class="detail-item">
            <label>Crime Count:</label>
            <span>{{ selectedArea.crimeCount }}</span>
          </div>
          <div class="detail-item">
            <label>Compared to Average:</label>
            <span :class="{'above-average': selectedArea.aboveAverage}">
              {{ selectedArea.comparisonText }}
            </span>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import axios from 'axios'

export default {
  name: 'CrimeData',
  data() {
    return {
      map: null,
      searchQuery: '',
      crimeRateRange: [0, 100],
      sortBy: 'crimeRate-desc',
      totalCrimes: 0,
      highestCrimeArea: '',
      averageCrimes: 0,
      lastUpdate: '',
      maxCrimeRate: 100,
      drawerVisible: false,
      selectedArea: null,
      crimeData: [],
      marks: {}
    }
  },
  computed: {
    sliderMarks() {
      if (!this.maxCrimeRate) return {}
      return {
        0: 'Low',
        [Math.floor(this.maxCrimeRate / 3)]: 'Medium',
        [Math.floor(this.maxCrimeRate * 2 / 3)]: 'High'
      }
    },
    currentRangeLevel() {
      const avgValue = (this.crimeRateRange[0] + this.crimeRateRange[1]) / 2
      if (avgValue <= this.maxCrimeRate / 3) return 'Low'
      if (avgValue <= this.maxCrimeRate * 2 / 3) return 'Medium'
      return 'High'
    }
  },
  mounted() {
    this.initializeMap()
    this.loadCrimeData()
  },
  methods: {
    initializeMap() {
      this.map = L.map(this.$refs.mapContainer).setView([51.505, -0.09], 11)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map)

      // 添加图例
      const legend = L.control({ position: 'bottomright' })
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend')
        div.style.backgroundColor = 'white'
        div.style.padding = '10px'
        div.style.borderRadius = '5px'
        div.style.border = '1px solid #ccc'
        
        const grades = [0, 0.2, 0.4, 0.6, 0.8]
        let html = '<h4 style="margin:0 0 10px 0">Crime Rate</h4>'
        
        for (let i = grades.length - 1; i >= 0; i--) {
          html +=
            '<i style="background:' + this.getCrimeColor(grades[i] * this.maxCrimeRate) +
            '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7"></i> ' +
            Math.round(grades[i] * 100) + '%' +
            (grades[i + 1] ? '&ndash;' + Math.round(grades[i + 1] * 100) + '%' : '+') + '<br>'
        }
        
        div.innerHTML = html
        return div
      }
      legend.addTo(this.map)
    },
    async loadCrimeData() {
      try {
        console.log('Fetching crime data...')
        const response = await axios.get('http://localhost:3007/api/crimes')
        console.log('Received data:', response.data)
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format received')
        }
        
        this.crimeData = response.data
        this.processData()
        this.updateMap()
        
        // 显示成功消息
        this.$message.success('Successfully loaded ' + this.crimeData.length + ' areas')
      } catch (error) {
        console.error('Error loading crime data:', error)
        this.$message.error('Failed to load crime data: ' + (error.message || 'Unknown error'))
      }
    },
    processData() {
      if (!this.crimeData.length) return
      
      // 计算总体统计信息
      this.totalCrimes = this.crimeData.reduce((sum, area) => sum + area.crime_count, 0)
      this.averageCrimes = Math.round(this.totalCrimes / this.crimeData.length)
      
      // 找出最高犯罪率区域
      const maxCrimeArea = this.crimeData.reduce((max, area) => 
        area.crime_count > max.crime_count ? area : max
      , this.crimeData[0])
      this.highestCrimeArea = maxCrimeArea.neighbourhood_name
      
      // 设置最大犯罪率和滑块范围
      this.maxCrimeRate = Math.max(...this.crimeData.map(area => area.crime_count))
      this.crimeRateRange = [0, this.maxCrimeRate]
      
      // 更新时间
      this.lastUpdate = new Date().toLocaleDateString()
    },
    updateMap() {
      // 清除现有图层
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Circle) {
          this.map.removeLayer(layer)
        }
      })

      // 过滤数据
      const filteredData = this.crimeData.filter(area => {
        return area.crime_count >= this.crimeRateRange[0] && 
               area.crime_count <= this.crimeRateRange[1]
      })

      // 添加新的数据点
      filteredData.forEach(area => {
        // 减小半径系数从50到20
        const radius = Math.sqrt(area.crime_count) * 20
        const circle = L.circle([area.latitude, area.longitude], {
          color: this.getCrimeColor(area.crime_count),
          fillColor: this.getCrimeColor(area.crime_count),
          fillOpacity: 0.3, // 降低透明度
          weight: 1, // 减小边框宽度
          radius: radius
        }).addTo(this.map)

        // 添加点击事件
        circle.on('click', () => {
          this.selectedArea = {
            name: area.neighbourhood_name,
            crimeCount: area.crime_count,
            aboveAverage: area.crime_count > this.averageCrimes,
            comparisonText: this.getComparisonText(area.crime_count)
          }
          this.drawerVisible = true
        })

        // 添加悬停提示
        circle.bindTooltip(
          `${area.neighbourhood_name}<br>Crime Count: ${area.crime_count}`,
          { permanent: false }
        )
      })
    },
    getCrimeColor(count) {
      // 优化颜色区分度
      const ratio = count / this.maxCrimeRate
      if (ratio > 0.8) return '#dc3545'      // 深红色
      if (ratio > 0.6) return '#fd7e14'      // 橙色
      if (ratio > 0.4) return '#ffc107'      // 黄色
      if (ratio > 0.2) return '#28a745'      // 绿色
      return '#20c997'                        // 青绿色
    },
    getComparisonText(count) {
      const diff = count - this.averageCrimes
      const percentage = Math.round((diff / this.averageCrimes) * 100)
      return `${percentage > 0 ? 'Above' : 'Below'} average by ${Math.abs(percentage)}%`
    },
    // 添加监听器以在滑块值变化时更新地图
    watch: {
      crimeRateRange() {
        this.updateMap()
      }
    },
    applyFilters() {
      // 应用所有筛选条件
      let filteredData = [...this.crimeData]
      
      // 应用搜索筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filteredData = filteredData.filter(area => 
          area.neighbourhood_name.toLowerCase().includes(query)
        )
      }
      
      // 应用犯罪率范围筛选
      filteredData = filteredData.filter(area => 
        area.crime_count >= this.crimeRateRange[0] && 
        area.crime_count <= this.crimeRateRange[1]
      )
      
      // 应用排序
      filteredData.sort((a, b) => {
        switch(this.sortBy) {
          case 'crimeRate-desc':
            return b.crime_count - a.crime_count
          case 'crimeRate-asc':
            return a.crime_count - b.crime_count
          case 'name':
            return a.neighbourhood_name.localeCompare(b.neighbourhood_name)
          default:
            return 0
        }
      })
      
      // 更新地图显示
      this.updateMapWithData(filteredData)
    },
    
    updateMapWithData(data) {
      // 清除现有图层
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Circle) {
          this.map.removeLayer(layer)
        }
      })

      // 添加新的数据点
      data.forEach(area => {
        const radius = Math.sqrt(area.crime_count) * 20
        const circle = L.circle([area.latitude, area.longitude], {
          color: this.getCrimeColor(area.crime_count),
          fillColor: this.getCrimeColor(area.crime_count),
          fillOpacity: 0.3,
          weight: 1,
          radius: radius
        }).addTo(this.map)

        circle.on('click', () => {
          this.selectedArea = {
            name: area.neighbourhood_name,
            crimeCount: area.crime_count,
            aboveAverage: area.crime_count > this.averageCrimes,
            comparisonText: this.getComparisonText(area.crime_count)
          }
          this.drawerVisible = true
        })

        circle.bindTooltip(
          `${area.neighbourhood_name}<br>Crime Count: ${area.crime_count}`,
          { permanent: false }
        )
      })
      
      // 显示更新消息
      this.$message.success(`Displaying ${data.length} areas on the map`)
    },
    getCrimeRateLevel(value) {
      if (value <= this.maxCrimeRate / 3) return 'Low'
      if (value <= this.maxCrimeRate * 2 / 3) return 'Medium'
      return 'High'
    }
  }
}
</script>

<style scoped>
.crime-data-container {
  padding: 20px;
  height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;
}

.statistics-panel {
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.main-content {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0;
}

.filter-panel {
  width: 300px;
  overflow-y: auto;
}

.map-container {
  flex: 1;
  min-height: 500px;
  border-radius: 4px;
  overflow: hidden;
}

.area-details {
  padding: 20px;
}

.detail-item {
  margin: 10px 0;
}

.above-average {
  color: #F56C6C;
}

.el-form-item {
  margin-bottom: 20px;
}

.crime-range-label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #303133;
}

.range-indicators {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  color: #606266;
  font-size: 13px;
  background-color: #f5f7fa;
  padding: 5px;
  border-radius: 4px;
}

.range-values {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  color: #409EFF;
  font-size: 12px;
}

.range-values span {
  background-color: #ecf5ff;
  padding: 2px 8px;
  border-radius: 3px;
  border: 1px solid #d9ecff;
}

/* 自定义滑块标记样式 */
:deep(.el-slider__marks-text) {
  color: #606266;
  font-size: 12px;
  font-weight: bold;
  margin-top: 5px;
}

:deep(.el-slider__button) {
  border: 2px solid #409EFF;
}
</style> 