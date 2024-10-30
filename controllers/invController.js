const invModel = require("../models/inventory-model");
const utilities = require("../utilities");
require("dotenv").config()

const invCont = {}

/* ***************************
Build inventory by classification view
 *************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  });
}

// Build Detail View
invCont.getVehicleDetails = async function (req, res, next) {
  const vehicle_id = req.params.id
  const data = await invModel.getVehicleDetails(vehicle_id)
  const detail = await utilities.buildVehicleDetailsHTML(data)
  let nav = await utilities.getNav()
  const vehicleName = data.inv_make + '' + data.inv_model
  res.render("./inventory/detail", {
    title: vehicleName + " Vehicles",
    nav,
    detail,
  });
}

invCont.buildMgt = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ****************************************
Deliver Classification View
**************************************** */
invCont.buildAdclass = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/adclass", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}



//Classification List
invCont.buildAdve = async function (req, res, next) {
  const classificationList = await utilities.buildClassificationList();
    let nav = await utilities.getNav();
  res.render("./inventory/adve",{
    title: "Add New Vehicle",
    nav,
    errors: null,
    classificationList,
  })
}


invCont.addClass = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const addResult = await invModel.addClass(
    classification_name
  )

  if (addResult) {
    req.flash(
      "notice",
      ` A new class of vehicle has been added`
    )
    res.status(201).render("inventory/adclass", {
      title: "Add Classification Name",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the addition of new class name failed.")
    res.status(501).render("inventory/adclass", {
      title: "Add Classification Name",
      nav,
      errors:null,
    })
  }
}


//Register Vehicle
invCont.addVehicle = async function (req, res) {
  let nav = await utilities.getNav();

  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
    
  } = req.body;

  const veResult = await invModel.addVehicle (
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );

  if (veResult) {
    req.flash("notice", 'New Vehicle Created!')
    const classificationList = await utilities.buildClassificationList();
    res.status(201).render("inventory/adve", {
      title: "Add New Vehicle",
      nav,
      classificationList,
    })
  } else {
    req.flash("notice", 'Sorry, there was an error processing the addition of a new vehicle.')
    const classificationList = await utilities.buildClassificationList();
    res.status(501).render("inventory/adve", {
      title: "Add New Vehicle",
      nav,
      classificationList,
    })
  }
} 


module.exports = invCont;
