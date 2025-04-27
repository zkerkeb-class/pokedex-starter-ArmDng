# Pokédex React Application

A modern React application for exploring Pokémon, with authentication, search functionality, and a Pokémon battle game.

Link of the video of presentation :
```
https://www.youtube.com/watch?v=ofAj-8pQBZQ
```

## Features

- **User Authentication**: Login and registration system
- **Pokémon Directory**: Browse and search through the Pokémon collection
- **Filtering**: Filter Pokémon by types and other criteria
- **Detailed Information**: View comprehensive details about each Pokémon
- **Pokémon Battle Game**: Interactive game where you can:
  - Select your Pokémon
  - Collect resources
  - Battle other Pokémon
  - Win by eliminating opponents or collecting required resources

## Technologies Used

- React
- Vite (for fast development and building)
- React Router for navigation
- Context API for state management
- CSS for styling
- REST API integration

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ArmDng/pokedex-starter-ArmDng.git
   cd pokedex-starter-ArmDng
    ```

2. Install depedencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```plaintext
    MONGODB_URI=mongodb://localhost:27017/pokedex
    JWT_SECRET=your_jwt_secret_key
    FRONTEND_URL=http://localhost:5173
    ```

4. Start the server:
    ```bash
    npm start
    ```
