const express = require("express");
const cors = require("cors");
const path = require("path");

/**
 * Create Express application instance
 */
const app = express();

/**
 * Configure global middleware
 */
// Enable CORS
app.use(cors());

// Parse application/json request body
app.use(express.json());

// Parse application/x-www-form-urlencoded request body
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Configure static file service
const publicPath = path.join(__dirname, 'public');
console.log('Static files path:', publicPath); // Debug: Print static files path
app.use(express.static(publicPath));

/**
 * Register route modules
 */
const userRouter = require("./router/user");
const moviesRouter = require('./router/movies');
const cinemasRouter = require('./router/cinemas');
const crimesRouter = require('./router/crimes');
const routesRouter = require('./router/routes');
const seatsRouter = require('./router/seats');
const actorsRouter = require('./router/actors');

app.use("/api", userRouter);
app.use('/api', moviesRouter);
app.use('/api', cinemasRouter);
app.use('/api/crimes', crimesRouter);
app.use('/api/routes', routesRouter);
app.use('/api', seatsRouter);
app.use('/api/actors', actorsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    status: 1,
    message: 'Internal Server Error',
    error: err.message
  });
});

/**
 * Start server
 */
const PORT = 3007;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Registered routes:');
  console.log('/api/movies/:id - Get movie details');
  console.log('/api/movies/:id/reviews - Get movie reviews');
});

