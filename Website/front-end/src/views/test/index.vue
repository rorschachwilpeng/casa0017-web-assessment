<template>
  <div class="test-connection">
    <h1>API 连接测试页面</h1>
    <div class="test-panel">
      <el-button type="primary" @click="testConnection">测试连接</el-button>
      <div class="result-panel" v-if="testResult">
        <h3>测试结果：</h3>
        <pre>{{ testResult }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'TestConnection',
  data() {
    return {
      testResult: null
    }
  },
  methods: {
    async testConnection() {
      try {
        const response = await request.get('/api/test')
        this.testResult = response
      } catch (error) {
        this.testResult = {
          error: error.message,
          details: error.response?.data || '未知错误'
        }
      }
    }
  }
}
</script>

<style scoped>
.test-connection {
  padding: 20px;
}
.test-panel {
  margin-top: 20px;
}
.result-panel {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style> 