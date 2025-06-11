const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { graphqlHTTP } = require("express-graphql");

// Impor schema dan resolver dari file terpisah
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();
const PORT = 5004;

app.use(cors());
app.use(express.json());

const logDatabaseConfig = () => {
  console.log('\n=== Database Configuration ===');
  console.log(`DB_HOST: ${process.env.DB_HOST || 'Not set (default: payment-db)'}`);
  console.log(`DB_USER: ${process.env.DB_USER || 'Not set (default: root)'}`);
  console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD || 'Not set (default: root)'}`);
  console.log(`DB_NAME: ${process.env.DB_NAME || 'Not set (default: eai_project)'}`);
  console.log('\nActual Configuration Used:');
  console.log(JSON.stringify(DB_CONFIG, null, 2));
  console.log('===========================\n');
};

// Fungsi initDb tetap di sini karena berhubungan dengan startup server
const DB_CONFIG = {
  host: process.env.DB_HOST || "payment-db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "eai_project",
};


const initDb = async () => {
    // ... (kode initDb Anda sama seperti sebelumnya)
};

// Setup endpoint GraphQL dengan schema dan resolver yang diimpor
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

app.listen(PORT, async () => {
  await initDb();
  console.log(
    `🚀 PaymentService (GraphQL) berjalan di http://localhost:${PORT}/graphql`
  );
  logDatabaseConfig();
});