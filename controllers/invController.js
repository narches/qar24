
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");


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






//Management View
invCont.buildMgt = async function(req, res, next) {
  const classificationLists = await utilities.buildClassificationList();
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationLists,
  })
}


/* ****************************************
Deliver Admin Account Mgt view
**************************************** */
invCont.adminMgt = async function(req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "Logged in as Admin")
  res.render("inventory/admanager", {
    title: "Account Management",
    nav,
    errors: null,
  })
}



/* ****************************************
Deliver Admin login view
**************************************** */
invCont.adminLogin = async function(req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "Login as Admin")
  res.render("inventory/admin", {
    title: "Admin",
    nav,
    errors: null,
  })
}



/* ****************************************
Process Admin login request
 ************************************* */
invCont.loginAdmine = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await invModel.getaAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("inv/admin", {
      title: "Admin",
      nav,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/inv/admanager")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("./inv/admin", {
        title: "Admin",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


//Admin Register
invCont.adminRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "Register Admin Account")
  res.render("./inventory/isignup", {
    title: "Register Admin",
    nav,
    errors: null,
  })
}


/* ***************************
Build edit aAccount view
 *************************** */
invCont.adminUpdate = async function (req, res, next) {
  let nav = await utilities.getNav()
  const itemData = await invModel.getaAccountByEmail(account_email)
  res.render("/inv/iedit", {
    title:
    nav,
    errors: null,
    account_id: itemData.account_id,
    account_firstname: itemData.account_firstname,
    account_lastname: itemData.account_lastname,
    account_email: itemData.account_email
  })
}

/* ****************************************
Process Registration
**************************************** */
invCont.registerAdmine = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
    //regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
      req.flash("notice", 'Error processing the registration.')
      res.status(500).render("/inv/isignup", {
        title: "Registration",
        nav,
        errors: null,
    })
  }

  const regResult = await invModel.registerAdmin(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `${account_firstname}, Your Admin account has been created, Please log in.`
    )
    res.status(201).render("/inv/admin", {
      title: "Admin",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("/inv/isignup", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
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
  const classificationLists = await utilities.buildClassificationList();
  let nav = await utilities.getNav();
  res.render("./inventory/adve",{
    title: "Add New Vehicle",
    nav,
    errors: null,
    classificationLists,
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
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    
  } = req.body;

  const veResult = await invModel.addVehicle (
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (veResult) {
    req.flash("notice", 'New Vehicle Created!')
    const classificationLists = await utilities.buildClassificationList();
    res.status(201).render("inventory/adve", {
      title: "Add New Vehicle",
      nav,
      classificationLists: classificationLists,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  } else {
    req.flash("notice", 'Sorry, there was an error processing the addition of a new vehicle.')
    const classificationLists = await utilities.buildClassificationList();
    res.status(501).render("inventory/adve", {
      title: "Add New Vehicle",
      nav,
      classificationList: classificationLists,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
} 


/* ***************************
Return Inventory by Classification As JSON
 *************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}



/* ***************************
Build edit inventory view
 *************************** */
invCont.buildUpdate = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationLists = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit", {
    title: "Edit " + itemName,
    nav,
    classificationLists: classificationLists,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}



/* ***************************
 Update Inventory Data
*************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
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
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/vm")
  } else {
    const classificationLists = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/update", {
    title: "Edit " + itemName,
    nav,
    classificationLists: classificationLists,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}



/* ***************************
 Build Delete inventory view
 *************************** */
invCont.buildDelete = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationLists = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete", {
    title: " Delete " + itemName,
    nav,
    classificationLists: classificationLists,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ***************************
Update Delete Data
*************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const deleteResult = await invModel.deleteInventory(
    inv_id,  
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
  )

  if (deleteResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/management")
  } else {
    const classificationLists = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edelete", {
    title: "Edit " + itemName,
    nav,
    classificationLists: classificationLists,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}



/* ****************************************
Process Admin logout request
**************************************** */
invCont.logoutAdmin = function (req, res) {
  // Clear the JWT cookie
  res.clearCookie("jwt");
  
  // Optional: Flash a logout success message
  req.flash("notice", "You have successfully logged out.");
  
  // Redirect to the login page (or any other page)
  res.redirect("/");
}



module.exports = invCont;