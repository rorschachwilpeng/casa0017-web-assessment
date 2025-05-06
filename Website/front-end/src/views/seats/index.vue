<template>
  <div class="booking-page">
    <!-- 添加导航栏 -->
    <TheNavbar />

    <!-- 电影信息部分 -->
    <div class="movie-info-section">
      <div class="movie-basic-info">
        <div class="movie-poster">
          <img
            :src="'http://localhost:3007' + currentMovie.poster_url"
            :alt="currentMovie.name"
          >
        </div>
        <div class="movie-details">
          <h2>{{ currentMovie.name || 'Select a Movie' }}</h2>
          <p v-if="currentMovie.length">Duration: {{ currentMovie.length }} mins</p>
        </div>
      </div>

      <!-- 新增的影院和场次信息 -->
      <div class="session-info">
        <!-- 电影选择 -->
        <div class="info-item">
          <span class="label">Movie</span>
          <div class="custom-select" :class="{ 'active': isMovieDropdownOpen }">
            <div class="selected" @click="toggleDropdown('movie')">
              {{ selectedMovieId ? getMovieName(selectedMovieId) : 'Select movie' }}
              <span class="arrow">▼</span>
            </div>
            <div class="movie-details">
              <h2>{{ currentMovie.name || 'Select a Movie' }}</h2>
              <p v-if="currentMovie.length">Duration: {{ currentMovie.length }} mins</p>
            </div>
          </div>

          <!-- new cinema and session information -->
          <div class="session-info">
            <!-- movie selection -->
            <div class="info-item">
              <span class="label">Movie</span>
              <div class="custom-select" :class="{ 'active': isMovieDropdownOpen }">
                <div class="selected" @click="toggleDropdown('movie')">
                  {{ selectedMovieId ? getMovieName(selectedMovieId) : 'Select movie' }}
                  <span class="arrow">▼</span>
                </div>
                <div v-if="isMovieDropdownOpen" class="options-container">
                  <div class="options">
                    <div
                      v-for="movie in movieList"
                      :key="movie.id"
                      class="option"
                      :class="{ 'selected': selectedMovieId === movie.id }"
                      @click="selectMovie(movie)"
                    >
                      {{ movie.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="info-item">
              <span class="label">Cinema</span>
              <div class="custom-select" :class="{ 'active': isCinemaDropdownOpen }">
                <!-- loading state -->
                <div v-if="isLoading" class="loading">Loading cinemas...</div>

                <!-- error message -->
                <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

                <!-- cinema selector -->
                <template v-else>
                  <div class="selected" @click="toggleDropdown('cinema')">
                    {{ selectedCinemaName }}
                    <span class="arrow">▼</span>
                  </div>
                  <div v-show="isCinemaDropdownOpen" class="options-container">
                    <div class="options">
                      <div
                        v-for="cinema in cinemaList"
                        :key="cinema.id"
                        class="option"
                        :class="{ 'selected': selectedCinemaId === cinema.id }"
                        @click="selectCinema(cinema)"
                      >
                        {{ cinema.name }}
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- date selection -->
            <div class="info-item">
              <span class="label">Date</span>
              <div class="custom-select" :class="{ 'active': isDateDropdownOpen }">
                <div class="selected" @click="toggleDropdown('date')">
                  {{ selectedDateLabel || 'Select date' }}
                  <span class="arrow">▼</span>
                </div>
                <div v-show="isDateDropdownOpen" class="options-container">
                  <div class="options">
                    <div
                      v-for="date in availableDates"
                      :key="date.value"
                      class="option"
                      :class="{ 'selected': selectedDate === date.value }"
                      @click="selectDate(date)"
                    >
                      {{ date.label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- time selection -->
            <div class="info-item">
              <span class="label">Time</span>
              <div class="custom-select" :class="{ 'active': isTimeDropdownOpen }">
                <div class="selected" @click="toggleDropdown('time')">
                  {{ selectedTimeLabel || 'Select time' }}
                  <span class="arrow">▼</span>
                </div>
                <div v-show="isTimeDropdownOpen" class="options-container">
                  <div class="options">
                    <div
                      v-for="time in availableTimes"
                      :key="time.value"
                      class="option"
                      :class="{ 'selected': selectedTime === time.value }"
                      @click="selectTime(time)"
                    >
                      {{ time.label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- original seat selection section, unchanged -->
        <div class="seat-selection">
          <h1>Seat</h1>
          <div class="seating-container">
            <!-- screen indicator -->
            <div class="screen-indicator">
              <span>Screen</span>
            </div>

            <!-- seating layout -->
            <div class="seating-layout">
              <div v-for="row in rows" :key="row" class="seat-row">
                <div
                  v-for="col in 10"
                  :key="col"
                  class="seat"
                  :class="getSeatClass(row, col)"
                  @click="toggleSeat(row, col)"
                >
                  {{ row }}{{ col }}
                </div>
              </div>
            </div>

            <!-- seat information -->
            <div class="seat-info">
              <div class="info-row">
                <span class="info-label">TOTAL</span>
                <span class="info-value">£ {{ totalPrice.toFixed(2) }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">SEAT</span>
                <span class="info-value">{{ selectedSeatsDisplay }}</span>
              </div>
            </div>
          </div>

          <!-- bottom buttons -->
          <div class="bottom-bar">
            <button class="back-btn">Back</button>
            <button class="proceed-btn" @click="processPayment">Proceed Payment</button>
          </div>
        </div>
      </div>
    </div>

    <!-- footer -->
    <TheFooter />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #111;
  padding-top: 80px; /* leave space for fixed navigation bar */
}

.content-section {
  padding: 120px 120px;
  background-color: #111;
}

.booking-page {
  background-color: #111;
  min-height: 100vh;
  padding: 60px 20px 20px;
  color: white;
}

.movie-info-section {
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 20px;
  background-color: #1a1a1a;
  border-radius: 8px;
}

.movie-basic-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.movie-poster {
  width: 120px;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
}

.movie-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.movie-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.movie-details h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: white;
}

.movie-details p {
  margin: 0;
  color: #999;
}

.session-info {
  display: flex;
  gap: 40px;
  padding-top: 20px;
  border-top: 1px solid #333;
}

.info-item {
  margin-bottom: 20px;
}

.info-item .label {
  color: #999;
  font-size: 16px;
  margin-bottom: 8px;
  display: block;
}

.info-item .value {
  font-size: 16px;
  color: white;
}

.seat-selection {
  max-width: 1200px;
  margin: 0 auto;
}

.seat-selection {
  background-color: #111;
  min-height: 100vh;
  padding: 40px;
  color: white;
}

h1 {
  margin-bottom: 40px;
  font-size: 24px;
}

.seating-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.seating-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 auto;
}

.seat-row {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.seat {
  width: 35px;
  height: 35px;
  background-color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  color: #333;
  transition: all 0.3s ease;
}

.seat:hover:not(.seat-occupied) {
  transform: scale(1.1);
  box-shadow: 0 0 8px rgba(255,255,255,0.3);
}

.seat-occupied {
  background-color: #ff0000;
  color: white;
  cursor: not-allowed;
}

.seat-selected {
  background-color: #2196f3;
  color: white;
}

.seat-selected:hover {
  transform: scale(1.1);
  box-shadow: 0 0 8px rgba(33,150,243,0.5);
}

.screen-indicator {
  width: 400px;
  height: 40px;
  background-color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  margin-bottom: 30px;
}

.seat-info {
  width: 100%;
  max-width: 400px;
  margin-top: 40px;
  border-top: 1px solid #333;
  padding-top: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.info-label {
  color: #999;
  font-size: 14px;
}

.info-value {
  color: white;
  font-size: 16px;
}

.bottom-bar {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.back-btn {
  padding: 12px 30px;
  background-color: transparent;
  border: 1px solid #333;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.proceed-btn {
  padding: 12px 30px;
  background-color: #ff0000;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.back-btn:hover {
  border-color: #666;
}

.proceed-btn:hover {
  background-color: #d60000;
}

.select-input {
  padding: 8px 12px;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  width: 200px;
  cursor: pointer;
}

.select-input:hover {
  border-color: #666;
}

.select-input:focus {
  outline: none;
  border-color: #2196f3;
}

.select-input option {
  background-color: #333;
  color: white;
}

/* special style for time selection */
.time-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 20px;
}

/* modified style for time selection dropdown */
.time-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 20px;
}

/* style for dropdown when expanded */
.time-select:focus {
  outline: none;
  border-color: #2196f3;
}

/* style for dropdown options */
.time-select option {
  background-color: #333;
  color: white;
  padding: 8px 12px;
}

/* set style for dropdown list */
select.time-select:focus {
  height: auto;
}

/* style for container when dropdown list is expanded */
select.time-select:focus option {
  padding: 12px;
}

/* custom style for scrollbar */
select.time-select::-webkit-scrollbar {
  width: 6px;
}

select.time-select::-webkit-scrollbar-track {
  background: #333;
  border-radius: 3px;
}

select.time-select::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 3px;
}

select.time-select::-webkit-scrollbar-thumb:hover {
  background: #888;
}

/* hover and selected state for options */
.time-select option:hover,
.time-select option:focus {
  background-color: #444;
}

.time-select option:checked {
  background-color: #2196f3;
  color: white;
}

@-moz-document url-prefix() {
  /* Firefox specific style */
  .time-select {
    scrollbar-width: thin;
    scrollbar-color: #666 #333;
  }
}

.time-option {
  padding: 8px 12px;
  cursor: pointer;
}

.time-option:hover {
  background-color: #444;
}

/* modified style for select input */
.select-input {
  padding: 8px 12px;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  width: 200px;
  cursor: pointer;
}

.select-input option {
  background-color: #333;
  color: white;
  padding: 8px 12px;
}

.select-input option:checked {
  background-color: #2196f3;
  color: white;
}

.custom-select {
  position: relative;
  width: 260px;
}

.selected {
  padding: 12px 16px;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 6px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
}

.arrow {
  font-size: 12px;
  transition: transform 0.2s;
}

.custom-select.active .arrow {
  transform: rotate(180deg);
}

.options-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 6px;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 6px;
  z-index: 1000;
}

.options {
  max-height: 200px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #666 #333;
}

.option {
  padding: 14px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 16px;
}

.option:hover {
  background-color: #444;
}

.option.selected {
  background-color: #2196f3;
  color: white;
}

/* style for scrollbar */
.options::-webkit-scrollbar {
  width: 8px;
}

.options::-webkit-scrollbar-track {
  background: #333;
  border-radius: 4px;
}

.options::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 4px;
}

.options::-webkit-scrollbar-thumb:hover {
  background: #888;
}

/* selected state */
.custom-select.active .selected {
  border-color: #2196f3;
}

/* hover effect */
.selected:hover {
  background-color: #3a3a3a;
}

.loading, .error {
  padding: 8px 12px;
  color: #666;
}

.error {
  color: #ff4444;
}

.dropdown-container {
  margin-bottom: 20px;
}

.dropdown-label {
  color: #999;
  font-size: 14px;
  margin-bottom: 8px;
}

.dropdown-wrapper {
  position: relative;
  width: 100%;
  cursor: pointer;
}

.dropdown-selected {
  background: #333;
  color: #fff;
  padding: 12px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-arrow {
  color: #999;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #333;
  border-radius: 4px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-option {
  padding: 12px;
  color: #fff;
}

.dropdown-option:hover {
  background: #444;
}

.dropdown-option.selected {
  background: #505050;
}
</style>

<script>
import TheNavbar from '@/components/TheNavbar.vue'
import request from '@/utils/request'

export default {
  name: 'Seats',
  components: {
    TheNavbar
  },
  data() {
    return {
      movieInfo: {
        title: 'Movie Title',
        duration: 120,
        poster: 'movie-poster.jpg'
      },
      sessionInfo: {
        cinema: 'GSC Mid Valley',
        date: 'Jan 5, 2025',
        time: '20:30'
      },
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      seats: [],
      selectedSeats: [],
      loading: false,
      selectedCinemaId: '',
      selectedDate: '',
      selectedTime: '',
      cinemaList: [],
      isCinemaDropdownOpen: false,
      isDateDropdownOpen: false,
      isTimeDropdownOpen: false,
      isLoading: false,
      errorMessage: '',
      movieList: [],
      selectedMovieId: '',
      isMovieDropdownOpen: false,
      currentSessionId: null,
      seats: [],
      currentMovie: {
        name: '',
        poster_url: '',
        length: ''
      }
    }
  },
  computed: {
    totalPrice() {
      return this.selectedSeats.length * 10.5
    },
    selectedSeatsDisplay() {
      return this.selectedSeats.join(', ') || 'None'
    },
    availableDates() {
      const dates = []
      const today = new Date()

      for (let i = 0; i < 4; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })
        })
      }

      return dates
    },
    availableTimes() {
      const fixedTimes = [
        { time: '10:00' },
        { time: '12:00' },
        { time: '15:00' },
        { time: '17:00' },
        { time: '19:00' },
        { time: '21:00' }
      ]

      // if today, filter out past times
      if (this.selectedDate === this.availableDates[0].value) {
        const now = new Date()
        const currentHour = now.getHours()

        return fixedTimes
          .filter(slot => {
            const slotHour = parseInt(slot.time.split(':')[0])
            return slotHour > currentHour
          })
          .map(slot => ({
            value: slot.time,
            label: slot.time
          }))
      }

      // if not today, show all times
      return fixedTimes.map(slot => ({
        value: slot.time,
        label: `${slot.time} (${slot.period})`
      }))
    },
    selectedCinemaName() {
      const selectedCinema = this.cinemaList.find(cinema => cinema.id === this.selectedCinemaId)
      return selectedCinema ? selectedCinema.name : 'Select cinema'
    },
    selectedDateLabel() {
      const date = this.availableDates.find(d => d.value === this.selectedDate)
      return date ? date.label : 'Select date'
    },
    selectedTimeLabel() {
      const time = this.availableTimes.find(t => t.value === this.selectedTime)
      return time ? time.label : 'Select time'
    }
  },
  watch: {
    selectedDate() {
      this.selectedTime = ''
    },
    seats: {
      handler(newSeats) {
        console.log('Seats updated:', newSeats)
      },
      deep: true
    }
  },
  created() {
    this.loadCinemas()
    this.loadMovies()
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    async loadSeats(silent = false) {
      if (!this.currentSessionId) {
        console.log('No session ID available')
        return
      }

      if (!silent) {
        this.loading = true
      }

      try {
        const response = await request({
          url: `/api/seats?session_id=${this.currentSessionId}`,
          method: 'get',
          baseURL: 'http://localhost:3007'
        })
        console.log('Response received:', response.data)

        if (response.data && response.status === 0) {
          this.seats = response.data
          console.log('Seats loaded:', this.seats.length)
        }
      } catch (error) {
        console.error('Failed to load seats:', error)
      } finally {
        if (!silent) {
          this.loading = false
        }
      }
    },
    getSeatClass(row, col) {
      const seat = this.seats.find(s =>
        s.seat_row === row &&
        Number(s.seat_col) === Number(col)
      )

      return {
        'seat': true,
        'seat-occupied': seat && seat.status === 'occupied',
        'seat-selected': this.selectedSeats.includes(`${row}${col}`)
      }
    },
    toggleSeat(row, col) {
      if (this.isSeatOccupied(row, col)) return

      const seatId = `${row}${col}`
      const index = this.selectedSeats.indexOf(seatId)

      if (index === -1) {
        this.selectedSeats.push(seatId)
      } else {
        this.selectedSeats.splice(index, 1)
      }
    },
    isSeatOccupied(row, col) {
      const seat = this.seats.find(s =>
        s.seat_row === row &&
        Number(s.seat_col) === Number(col)
      )
      return seat?.status === 'occupied'
    },
    async processPayment() {
      if (this.selectedSeats.length === 0) {
        alert('Please select seats first')
        return
      }

      try {
        const seatsToUpdate = this.selectedSeats.map(seatId => {
          const [row, col] = [seatId.charAt(0), seatId.slice(1)]
          const seat = this.seats.find(s =>
            s.seat_row === row &&
            Number(s.seat_col) === Number(col)
          )

          if (!seat) {
            throw new Error(`Seat not found: ${row}${col}`)
          }

          return {
            id: seat.id
          }
        })

        console.log('Data to be sent:', { seats: seatsToUpdate })

        const response = await request({
          url: '/api/seats/reserve',
          method: 'post',
          data: { seats: seatsToUpdate },
          baseURL: 'http://localhost:3007',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        console.log('Raw response:', response)

        // clear selected seats
        this.selectedSeats = []

        // use new loadSeats method to update seat status
        if (this.currentSessionId) {
          await this.loadSeats(true)
          console.log('Seats updated after reservation')
        }

        if (response.data && response.data.status === 0) {
          alert('Seats reserved successfully!')
        }
      } catch (error) {
        console.error('Reservation failed:', error)
        // also update seat status when error occurs
        if (this.currentSessionId) {
          await this.loadSeats(true)
        }
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    toggleDropdown(type) {
      // first close other dropdowns
      if (type !== 'cinema') this.isCinemaDropdownOpen = false
      if (type !== 'date') this.isDateDropdownOpen = false
      if (type !== 'time') this.isTimeDropdownOpen = false
      if (type !== 'movie') this.isMovieDropdownOpen = false

      // switch current dropdown
      switch (type) {
        case 'cinema':
          this.isCinemaDropdownOpen = !this.isCinemaDropdownOpen
          break
        case 'date':
          this.isDateDropdownOpen = !this.isDateDropdownOpen
          break
        case 'time':
          this.isTimeDropdownOpen = !this.isTimeDropdownOpen
          break
        case 'movie':
          this.isMovieDropdownOpen = !this.isMovieDropdownOpen
          break
      }
    },
    selectCinema(cinema) {
      this.selectedCinemaId = cinema.id
      this.isCinemaDropdownOpen = false
      this.checkAndUpdateSession()
    },
    selectDate(date) {
      this.selectedDate = date.value
      this.isDateDropdownOpen = false
      this.checkAndUpdateSession()
    },
    async selectTime(time) {
      this.selectedTime = time.value
      this.isTimeDropdownOpen = false
      this.checkAndUpdateSession()
    },
    async fetchSessionSeats() {
      try {
        const response = await request({
          url: '/api/seats/sessions',
          method: 'post',
          data: {
            movie_id: this.selectedMovieId,
            theater_id: this.selectedCinemaId,
            date: this.selectedDate,
            time: this.selectedTime
          },
          baseURL: 'http://localhost:3007'
        })

        console.log('Raw response:', response) // view raw response

        if (response.data && response.data.status === 0) {
          // extract data from response.data
          this.seats = response.data.seats
          this.currentSessionId = response.data.session_id

          console.log('Extracted seats:', this.seats) // view extracted seat data

          this.$forceUpdate()
        }
      } catch (error) {
        console.error('Failed to fetch seats:', error)
        this.$message.error('Failed to update seat information')
      }
    },
    handleClickOutside(event) {
      const select = event.target.closest('.custom-select')
      if (!select) {
        this.isCinemaDropdownOpen = false
        this.isDateDropdownOpen = false
        this.isTimeDropdownOpen = false
        this.isMovieDropdownOpen = false
      }
    },
    async loadCinemas() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const { status, message, cinemaData } = await request.get('/api/seats/test-cinemas')

        if (status === 0 && cinemaData) {
          this.cinemaList = cinemaData
        } else {
          this.errorMessage = message || 'Failed to get cinema data'
        }
      } catch (error) {
        console.error('Failed to load cinema data:', error)
        this.errorMessage = 'Failed to load cinema data, please try again later'
      } finally {
        this.isLoading = false
      }
    },
    async loadMovies() {
      try {
        const { status, message, movieData } = await request.get('/api/seats/movies')
        if (status === 0 && movieData) {
          this.movieList = movieData
        }
      } catch (error) {
        console.error('Failed to load movie data:', error)
      }
    },
    selectMovie(movie) {
      console.log('Selected movie:', movie) // debug log
      this.selectedMovieId = movie.id
      this.isMovieDropdownOpen = false

      // update current movie information
      const selectedMovie = this.movieList.find(m => m.id === movie.id)
      if (selectedMovie) {
        this.currentMovie = {
          name: selectedMovie.name,
          poster_url: selectedMovie.poster_url,
          length: selectedMovie.length
        }
        console.log('Current movie updated:', this.currentMovie) // debug log
      }

      this.checkAndUpdateSession()
    },
    getMovieName(id) {
      const movie = this.movieList.find(m => m.id === id)
      return movie ? movie.name : ''
    },
    async reserveSeats(selectedSeats) {
      if (!this.currentSessionId) {
        this.$message.error('No valid session selected')
        return
      }

      try {
        const response = await request({
          url: '/api/seats/reserve',
          method: 'post',
          data: {
            session_id: this.currentSessionId,
            seats: selectedSeats
          }
        })

        // ... handle response ...
      } catch (error) {
        console.error('Failed to reserve seats:', error)
        this.$message.error(error.message || 'Failed to reserve seats')
      }
    },
    async checkAndUpdateSession() {
      console.log('Starting checkAndUpdateSession...')
      console.log('Current selections:', {
        movie: this.selectedMovieId,
        cinema: this.selectedCinemaId,
        date: this.selectedDate,
        time: this.selectedTime
      })

      if (this.selectedMovieId && this.selectedCinemaId && this.selectedDate && this.selectedTime) {
        try {
          console.log('Sending session request...')
          const sessionResponse = await request({
            url: '/api/seats/sessions',
            method: 'post',
            data: {
              movie_id: this.selectedMovieId,
              theater_id: this.selectedCinemaId,
              date: this.selectedDate,
              time: this.selectedTime
            },
            baseURL: 'http://localhost:3007'
          })

          console.log('Session response:', sessionResponse.data)

          if (sessionResponse.data && sessionResponse.status === 0) {
            this.currentSessionId = sessionResponse.data.session_id
            // directly use returned seat data
            this.seats = sessionResponse.data.seats
            console.log('Seats updated:', this.seats.length)
            this.$forceUpdate() // force update view
          }
        } catch (error) {
          console.error('Failed to update session:', error)
        }
      } else {
        console.log('Not all selections are made yet')
      }
    }
  }
}
</script>
