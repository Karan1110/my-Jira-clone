const { Client } = require("pg");
const config  = require("config")
const winston = require("winston");
const debug = require("debug")("seed")

const client = new Client({
  connectionString:
    "postgres://unqgsqcj:PwOgL9DnYvPXdz5K_h6Wqddr_C4gGybz@mahmud.db.elephantsql.com/unqgsqcj",
  ssl: {
    rejectUnauthorized: false,
  },
})

client
  .connect()
  .then(() => {
    winston.info("Connected to DB")
  })
  .catch((ex) => {
    debug(ex)
  });

  (async function func() { await client.query(`
CREATE OR REPLACE FUNCTION create_benefit(
    IN req_name varchar
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO benefits(name)
        VALUES (name)

        RETURNING * INTO result INTO result
   END
   $$



   CREATE OR REPLACE FUNCTION update_benefit(
    IN req_name varchar
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE benefits
   SET name = req_name
   
   RETURNING * INTO result INTO result
   END
   $$


  CREATE OR REPLACE FUNCTION delete_benefit(
      IN req_name varchar
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM benefits
  WHERE id  = user_id
   END
   $$

   `,
    []
  )
})();
