# NC News API

## Summary

NC News is a backend API that serves a news database. The project is built with Node.js, Express, and PostgreSQL. It allows users to interact with news articles, topics, users, and comments through various API endpoints.

## Hosted Version

You can access the hosted version of the API [here](https://nc-news-sarali.onrender.com).

## Getting Started

### 1. Clone the repository

To get started, clone the repository to your local machine.


### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) and [PostgreSQL](https://www.postgresql.org/) installed. 


### 3. Create the `.env` files

You will need two `.env` files for different environments: `.env.development` and `.env.test`.

- **.env.development**  
  Create a `.env.development` file in the root of your project and add the following line:
PGDATABASE=nc_news

- **.env.test**  
Similarly, create a `.env.test` file and add the following line:
PGDATABASE=nc_news_test


### 4. Setup the Databases

You need to set up the local databases. Run the following command to do this:
npm run setup-dbs


This will set up the required tables and schemas for the project.

### 5. Seed the Local Database

After setting up the databases, seed the development database with initial data by running:
npm run seed-dev


### 6. Run Tests

To ensure everything is working properly, run the tests with:
npm test (or npm t)


### 7. Start the Development Server

Finally, start the development server by running:
npm start


This will launch the server, and you can begin interacting with the API.

## Minimum Requirements

- **Node.js**: v14 or higher
- **PostgreSQL**: v12 or higher