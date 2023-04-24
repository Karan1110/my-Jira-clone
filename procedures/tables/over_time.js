const { Client } = require("pg")
const winston = require("winston")
const debug = require("debug")("seed")

const client = new Client({
  connectionString:
    "postgres://gbpaytdx:bhl8nviSImZ0Xwk0w9xPbRl11VpOaqax@lallah.db.elephantsql.com/gbpaytdx",
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

await client.query(`
CREATE OR REPLACE FUNCTION create_over_time(
    IN req_employee_id INTEGER,
    IN req_"from" VARCHAR,
    IN req_ IN req_"to" INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO over_times(employee_id,"from","to")
        VALUES (req_employee_id,req_"from",req_"to")

        RETURNING * INTO result
   END
   $$

   CREATE OR REPLACE FUNCTION update_over_time(
    IN req_employee_id INTEGER,
    IN req_"from" VARCHAR, 
    IN req_"to" INTEGER
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE over_times
   SET employee_id = req_employee_id,
   "from" = req_"from",
   "to" = req_"to"
   
   RETURNING * INTO result
   END
   $$


   CREATE OR REPLACE FUNCTION delete_over_time(
    IN b_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM over_times
  WHERE id  = b_id
   END
   $$

   `,
    []
);