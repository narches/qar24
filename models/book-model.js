
const pool = require("../database")



/* *****************************
Register new Booking account
**************************** */
async function createBooking(book_name, classification_id, start_date, end_date){
    try {
      const sql = "INSERT INTO account (book_name, classification_id, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *"
      return await pool.query(sql, [book_name, classification_id, start_date, end_date]);
    } catch (error) {
      return error.message
    }
}

module.exports = createBooking;