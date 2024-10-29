const pool = require("../database/")

/* ***************************
Get all classification data
 *************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
  Get all inventory items and classification_name by classification_id
 *************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

async function getVehicleDetails(vehicleId) {
      try{
          const query = 'SELECT * FROM public.inventory WHERE inv_id = $1';
          const values = [vehicleId];
          const data = await pool.query(query, values);
          return data.rows[0]; // Assuming inv_id is unique, returning the first row
        } catch (error) {
          console.error("getVehicleDetails error " + error);
        }
};

//Checking if classification name already exists
async function checkExistingName(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const name = await pool.query(sql, [classification_name])
    return name.rowCount
  } catch (error) {
    return error.message
  }
}



//Add new class name
async function addClass(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message
  }
}


//Adding New Vehicle
async function addVehicle( inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql,
      [
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    ]);
  } catch (error) {
    return error.message
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleDetails, checkExistingName, addClass, addVehicle};