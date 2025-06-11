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

// Fungsi initDb tetap di sini karena berhubungan dengan startup server
const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
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
});