# CINEKNIGHT - Cinema Ticket Booking System

## Project Overview

**CINEKNIGHT** is a modern cinema ticket booking system designed to provide users with a safe and intuitive experience for selecting cinemas and booking seats. The system integrates safety data visualisation and real-time seat reservation functionality to help users make more informed choices.

### Core Features
- Cinema recommendations based on safety data
- Real-time seat status visualisation
- Simultaneous seat selection for multiple users
- Movie information display with trailer playback
- Responsive design for multi-device access

### Tech Stack
- **Frontend:**
  - Vue.js framework
  - Element UI component library
  - SCSS for styling
  - Axios for API requests
  - Vue Router for route management

- **Backend:**
  - Node.js runtime
  - Express framework
  - RESTful API design
  - MySQL database
  - WebSocket for real-time communication

- **Development Tools:**
  - Git for version control
  - ESLint for code linting
  - npm for package management
  - Vue CLI for project scaffolding

### Key Innovations
- Integration of safety data visualisation
- Real-time seat status synchronisation
- Responsive interface design
- User-friendly interactive experience


## Installation and Setup

```bash
# Clone the repository
git clone https://github.com/rorschachwilpeng/casa0017-web-assessment.git
```

You need to open two terminal windows to run both the front-end and back-end servers simultaneously:

### Terminal 1: Back-end Setup
```bash
# Navigate to the back-end directory
cd Website/back-end

# Install dependencies
npm install

# Start the back-end server
node app.js
```

### Terminal 2: Front-end Setup
```bash
# Navigate to the front-end directory
cd Website/front-end

# Install dependencies
npm install

# Start the development server
npm run dev
```

After running both servers, you can access the application in your browser at the URL provided by the front-end development server.

## Project Structure
This project adopts a modern front-end and back-end separation architecture, enabling independent development and deployment, with the front-end built using Vue.js and the back-end powered by Node.js and Express, seamlessly connected via RESTful APIs.
### Front-End
```plaintext
front-end/
├── .editorconfig          # Editor configuration
├── .env                   # Environment variables
├── .env.development       # Development environment variables
├── .env.production        # Production environment variables
├── .env.staging           # Staging environment variables
├── .eslintignore          # ESLint ignore configuration
├── .eslintrc.js           # ESLint rules configuration
├── .gitignore             # Git ignore file configuration
├── .travis.yml            # Travis CI configuration
├── LICENSE                # License file
├── README.md              # English documentation
├── README-zh.md           # Chinese documentation
├── babel.config.js        # Babel configuration
├── build/                 # Build-related files
│   └── index.js
├── jest.config.js         # Jest test configuration
├── jsconfig.json          # JS configuration file
├── mock/                  # Mock data
│   ├── index.js
│   ├── mock-server.js
│   ├── table.js
│   ├── user.js
│   └── utils.js
├── package.json           # Project dependencies
├── postcss.config.js      # PostCSS configuration
├── public/                # Static resources
│   └── index.html         # HTML template
└── src/                   # Source code directory
    └── views/             # Page components
        ├── home/
        ├── cinema-select/
        └── seats/
```
### Back-End
```plaintext
back-end/
├── .gitignore             # Git ignore file configuration
├── README.md              # Backend project documentation
├── app.js                 # Application entry point
├── db/                    # Database configuration and connection
│   └── index.js
├── router/                # Routes directory
│   ├── user.js
│   ├── movies.js
│   ├── cinemas.js
│   ├── crimes.js
│   ├── routes.js
│   ├── seats.js
│   └── actors.js
└── package.json           # Project dependencies
```

## Key Features and Implementation
### 1. Homepage (`home/index.vue`)
The homepage provides a welcoming interface with the following key features:
- Hero section at the top
- Movie category browsing module
- "Find Cinema" quick navigation button
- Movie recommendation display area

### 2. Movie Details Page (`movie-details/index.vue`)
The movie details page displays comprehensive information about a specific movie:
- Background movie poster display
- Movie name and description
- Trailer playback feature (Play Preview)
- Detailed description section

### 3. Cinema Selection Page (`cinema-select/index.vue`)
The cinema selection page allows users to browse and filter cinemas:
- Movie selector
- Filter section
- Responsive layout design
- Cinema list display

### 4. Seat Selection System (`seats/index.vue`)
The seat selection system provides an intuitive seat booking experience:
- Cinema data loading feature
- Movie screening selection
- Seat booking functionality
- Price calculation and display
- Real-time seat status updates

Each page is designed with modularity in mind and managed through the Vue.js component system, ensuring well-structured and maintainable code.




## License
This project is licensed under the MIT License.

## Acknowledgments
This project was developed based on the [vue-admin-template](https://github.com/PanJiaChen/vue-element-admin)


