<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" @click="handleCreate">
        Add Movie
      </el-button>
    </div>

    <!-- Movie List Table -->
    <el-table
      v-loading="listLoading"
      :data="moviesList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.movie_id }}
        </template>
      </el-table-column>
      
      <el-table-column label="Movie Name">
        <template slot-scope="scope">
          {{ scope.row.movie_name }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            Edit
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Add/Edit Dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form ref="movieForm" :model="movieForm" :rules="rules" label-width="100px">
        <el-form-item label="Movie Name" prop="movie_name">
          <el-input v-model="movieForm.movie_name" placeholder="Please enter movie name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'Movies',
  data() {
    return {
      moviesList: [],
      listLoading: true,
      dialogVisible: false,
      dialogTitle: '',
      movieForm: {
        movie_id: undefined,
        movie_name: ''
      },
      rules: {
        movie_name: [
          { required: true, message: 'Please enter movie name', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // Get movie list
    async fetchData() {
      this.listLoading = true
      try {
        const response = await request({
          url: '/api/movies',
          method: 'get'
        })
        this.moviesList = response.data
        this.listLoading = false
      } catch (error) {
        console.error('Failed to get movie list:', error)
        this.listLoading = false
      }
    },

    // Handle create button click
    handleCreate() {
      this.dialogTitle = 'Add Movie'
      this.movieForm = {
        movie_id: undefined,
        movie_name: ''
      }
      this.dialogVisible = true
    },

    // Handle edit button click
    handleEdit(row) {
      this.dialogTitle = 'Edit Movie'
      this.movieForm = Object.assign({}, row)
      this.dialogVisible = true
    },

    // Handle delete button click
    async handleDelete(row) {
      try {
        await this.$confirm('Are you sure you want to delete this movie?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
        
        await request({
          url: `/api/movies/${row.movie_id}`,
          method: 'delete'
        })
        
        this.$message({
          type: 'success',
          message: 'Delete successful!'
        })
        
        this.fetchData()
      } catch (error) {
        console.error('Delete failed:', error)
      }
    },

    // Submit form
    async submitForm() {
      this.$refs.movieForm.validate(async (valid) => {
        if (valid) {
          try {
            const isEdit = !!this.movieForm.movie_id
            console.log('Submitting form:', {
              isEdit,
              movieId: this.movieForm.movie_id,
              movieName: this.movieForm.movie_name
            })

            const response = await request({
              url: isEdit ? 
                `http://localhost:3007/api/movies/${this.movieForm.movie_id}` : 
                'http://localhost:3007/api/movies',
              method: isEdit ? 'put' : 'post',
              data: {
                movie_name: this.movieForm.movie_name
              },
              headers: {
                'Content-Type': 'application/json'
              },
              timeout: 30000 // 增加超时时间到30秒
            })

            console.log('Submit response:', response)

            this.$message({
              type: 'success',
              message: isEdit ? 'Update successful!' : 'Add successful!'
            })

            this.dialogVisible = false
            this.fetchData()
          } catch (error) {
            console.error('Submit failed:', {
              error: error.message,
              response: error.response?.data,
              status: error.response?.status,
              config: error.config
            })
            
            let errorMessage = 'Operation failed'
            if (error.message.includes('timeout')) {
              errorMessage = 'Request timeout. Please check if the backend server is running.'
            } else if (error.response?.data?.message) {
              errorMessage = error.response.data.message
            }
            
            this.$message({
              type: 'error',
              message: errorMessage
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}
.filter-item {
  margin-bottom: 10px;
}
</style> 