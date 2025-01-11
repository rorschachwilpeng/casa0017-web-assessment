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
      @row-click="handleRowClick"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column label="Movie Name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="Category" width="120">
        <template slot-scope="scope">
          {{ scope.row.category }}
        </template>
      </el-table-column>

      <el-table-column label="Director" width="150">
        <template slot-scope="scope">
          {{ scope.row.director }}
        </template>
      </el-table-column>

      <el-table-column label="Rating" width="100">
        <template slot-scope="scope">
          {{ scope.row.rating }}%
        </template>
      </el-table-column>

      <el-table-column label="Length" width="100">
        <template slot-scope="scope">
          {{ scope.row.length }}
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
      <el-form ref="movieForm" :model="movieForm" :rules="rules" label-width="120px">
        <el-form-item label="Movie Name" prop="name">
          <el-input v-model="movieForm.name" placeholder="Please enter movie name" />
        </el-form-item>

        <el-form-item label="Category" prop="category">
          <el-select v-model="movieForm.category" placeholder="Select category">
            <el-option
              v-for="item in categories"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Director" prop="director">
          <el-input v-model="movieForm.director" placeholder="Please enter director name" />
        </el-form-item>

        <el-form-item label="Cast" prop="cast">
          <el-input type="textarea" v-model="movieForm.cast" placeholder="Please enter cast members" />
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input type="textarea" v-model="movieForm.description" placeholder="Please enter short description" />
        </el-form-item>

        <el-form-item label="Plot Summary" prop="plot_summary">
          <el-input type="textarea" v-model="movieForm.plot_summary" placeholder="Please enter detailed plot summary" />
        </el-form-item>

        <el-form-item label="Rating" prop="rating">
          <el-input-number v-model="movieForm.rating" :min="0" :max="100" />
        </el-form-item>

        <el-form-item label="Length" prop="length">
          <el-input v-model="movieForm.length" placeholder="e.g. 2h 30m" />
        </el-form-item>

        <el-form-item label="Poster URL" prop="poster_url">
          <el-input v-model="movieForm.poster_url" placeholder="Please enter poster URL" />
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
      categories: ['Drama', 'Comedy', 'Action', 'Horror', 'Romance'],
      movieForm: {
        id: undefined,
        name: '',
        category: '',
        director: '',
        cast: '',
        description: '',
        plot_summary: '',
        rating: 0,
        length: '',
        poster_url: ''
      },
      rules: {
        name: [
          { required: true, message: 'Please enter movie name', trigger: 'blur' }
        ],
        category: [
          { required: true, message: 'Please select category', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      try {
        const response = await request({
          url: '/api/movies',
          method: 'get'
        })
        console.log('API Response:', response)
        if (response && response.data) {
          this.moviesList = response.data
        } else {
          this.moviesList = []
          this.$message.warning('No movies data received')
        }
      } catch (error) {
        console.error('Failed to get movie list:', error)
        this.$message.error('Failed to load movies')
        this.moviesList = []
      } finally {
        this.listLoading = false
      }
    },

    handleCreate() {
      this.dialogTitle = 'Add Movie'
      this.movieForm = {
        id: undefined,
        name: '',
        category: '',
        director: '',
        cast: '',
        description: '',
        plot_summary: '',
        rating: 0,
        length: '',
        poster_url: '/posters/default.jpg'
      }
      this.$nextTick(() => {
        this.$refs.movieForm.clearValidate()
      })
      this.dialogVisible = true
    },

    handleEdit(row) {
      this.dialogTitle = 'Edit Movie'
      this.movieForm = JSON.parse(JSON.stringify({
        id: row.id,
        name: row.name,
        category: row.category,
        director: row.director || '',
        cast: row.cast || '',
        description: row.description || '',
        plot_summary: row.plot_summary || '',
        rating: row.rating || 0,
        length: row.length || '',
        poster_url: row.poster_url || '/posters/default.jpg'
      }))
      this.$nextTick(() => {
        this.$refs.movieForm.clearValidate()
      })
      this.dialogVisible = true
    },

    async handleDelete(row) {
      try {
        await this.$confirm('Are you sure you want to delete this movie?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })

        const response = await request({
          url: `/api/movies/${row.id}`,
          method: 'delete'
        })

        if (response.status === 0) {
          this.$message({
            type: 'success',
            message: 'Delete successful!'
          })
          await this.fetchData()
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        console.error('Delete failed:', error)
        this.$message({
          type: 'error',
          message: error.message || 'Delete failed'
        })
      }
    },

    async submitForm() {
      this.$refs.movieForm.validate(async (valid) => {
        if (valid) {
          try {
            const isEdit = !!this.movieForm.id
            const submitData = {
              ...this.movieForm,
              rating: Number(this.movieForm.rating)
            }

            console.log('Submitting form data:', submitData)

            // 直接使用完整的URL
            const baseURL = 'http://localhost:3007'
            const url = isEdit ? `/api/movies/${this.movieForm.id}` : '/api/movies'

            console.log('Full Request URL:', baseURL + url)
            console.log('Request Method:', isEdit ? 'put' : 'post')

            const response = await request({
              url,
              method: isEdit ? 'put' : 'post',
              data: submitData,
              baseURL,
              headers: {
                'Content-Type': 'application/json'
              }
            })

            console.log('Server response:', response)

            if (response && response.status === 0) {
              this.$message({
                type: 'success',
                message: isEdit ? 'Update successful!' : 'Add successful!'
              })
              this.dialogVisible = false
              await this.fetchData()
            } else {
              throw new Error(response ? response.message : 'Operation failed')
            }
          } catch (error) {
            console.error('Submit failed:', error)
            console.error('Error details:', {
              message: error.message,
              response: error.response,
              config: error.config
            })
            this.$message({
              type: 'error',
              message: error.response?.data?.message || error.message || 'Operation failed'
            })
          }
        } else {
          console.log('Form validation failed')
          return false
        }
      })
    },

    handleRowClick(row) {
      this.$router.push(`/movie-details/${row.id}`)
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
.el-table {
  cursor: pointer;
}
</style>
