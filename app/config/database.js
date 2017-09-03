module.exports = {
  database: "authdb", // name of the database
  user: "postgres", // name of the user account
  password: "demo1234", // password of the user account
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};
