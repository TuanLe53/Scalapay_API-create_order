# Scalapay API create order integration
A simple interface built with React, Express.js, Node.js and PostgreSQL


## Screenshots

###### Homepage
![Image of homepage](https://github.com/TuanLe53/Scalapay_API-create_order/blob/main/screenshots/Screenshot%20(73).png)

###### Order
![Image of order](https://github.com/TuanLe53/Scalapay_API-create_order/blob/main/screenshots/Screenshot%20(74).png)


**Built With**

- Html
- CSS
- Javascript
- React
- Node.js
- Express.js
- PostgreSQL
- Node-postgre


## Features
- JWT Authentication and Authorization
- Allows the user to add products to order
- Makes POST request to Scalapay API to create order and redirect to Scalapay website to authorize the payment

## Installation

- Clone the github repository:

```
git clone https://github.com/TuanLe53/Scalapay_API-create_order.git
```

- Create database(using psql)

```
\i /<your_path_of_repo_directory>/database.sql
```

- Create the .env file inside backend directory

```
PORT=8000
ACCESS_TOKEN_SECRET=<your_token>
REFRESH_TOKEN_SECRET=<your_refresh_token>
DB_USER=<user>
DB_PASSWORD=<password>
DB_HOST=<host>
DB_PORT=<port>
DB_DATABASE=<your_database>
```

- Go to backend directory and install dependencies

```
npm install
```

- Go to frontend directory and install dependencies

```
npm install
```

- Start both client and server

```
npm run dev
```

- Go to http://localhost:5173/ to begin


## Testing
- Go to backend directory

```
cd .\backend\
```

- Run test

```
npm run test
```



