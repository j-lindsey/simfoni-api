//config for your database
const dbConfig = {
    server: "localhost\\SQLEXPRESS",
    database: "SimfoniDatabase",
    user: "simfoni",
    password: "simfoni",
    options: {
      encrypt: true,
      enableArithAbort: true,
    },
  };
//connect to your database, node module export format
module.exports = dbConfig;