# Movie API Project

## Environment Setup

1. After cloning the project, copy the environment variable template:
   ```bash
   cp .env.example .env
   ```

2. Fill in your database configuration in the `.env` file

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   node app.js
   ```

## API Endpoints

- GET /api/movies - Get all movies
- GET /api/movies/:id - Get a single movie by ID
- POST /api/movies - Add a new movie
- PUT /api/movies/:id - Update a movie
- DELETE /api/movies/:id - Delete a movie

## API Documentation

### Get All Movies
- Method: GET
- Endpoint: `/api/movies`
- Response:
  ```json
  {
    "status": 0,
    "message": "Success",
    "data": [
      {
        "movie_id": 1,
        "movie_name": "Movie Title"
      }
    ]
  }
  ```

### Add New Movie
- Method: POST
- Endpoint: `/api/movies`
- Body:
  ```json
  {
    "movie_name": "Movie Title"
  }
  ```
- Response:
  ```json
  {
    "status": 0,
    "message": "Movie added successfully",
    "data": {
      "id": 1,
      "movie_name": "Movie Title"
    }
  }
  ``` 