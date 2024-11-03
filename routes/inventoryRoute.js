// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController")
const eValidate = require("../utilities/ve-validation")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')



// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to handle requests for displaying details of a specific vehicle
router.get("/detail/:id", invController.getVehicleDetails)



//Admin Management
router.get("/admanager", invController.adminMgt);


//Vehicle Management
router.get("/vm", invController.buildMgt)


//Logout
router.get("/logout", invController.logoutAdmin);

//Admin Management
router.get('/', utilities.handleErrors(invController.adminLogin))

//Process the Admin Account Login View
router.post(
  "/admin",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(invController.loginAdmine)
)

// Deliver Add Classification View
router.get("/adclass", utilities.handleErrors(invController.buildAdclass))

router.post(
  "/adclass",
  eValidate.addclassRules(),
  eValidate.checkAdclassData,
  utilities.handleErrors(invController.addClass)
)


// Deliver Add Vehicle View
router.get("/adve", utilities.handleErrors(invController.buildAdve))

router.post(
  "/adve",
  eValidate.addveRules(),
  eValidate.checkAddveData,
  utilities.handleErrors(invController.addVehicle)
)


//Get Inventory Route
router.get("/getInventory/:classification_id", 
  // utilities.checkAccountType,
utilities.handleErrors(invController.getInventoryJSON)
)

//Update View

router.get("/edit/:inv_id", utilities.handleErrors(invController.buildUpdate))

router.post("/update/",
  eValidate.updateRules(),
  utilities.handleErrors
  (invController.updateInventory)
)


//Delete
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDelete))

router.post("/edelete",
  utilities.handleErrors
  (invController.deleteInventory)
)


router.get("/admin", utilities.handleErrors(invController.adminLogin))
//Process the Account Login View
router.post(
  "/admin",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(invController.LoginAdmine)
)



router.get("/isignup", utilities.handleErrors(invController.adminRegister))

//Process the Account Login View
router.post(
  "/isignup",
  eValidate.registrationRules(),
  utilities.handleErrors(invController.registerAdmine)
)

//Update View
router.get("/iedit", utilities.handleErrors(invController.adminUpdate))

router.post("/iupdate/",
  eValidate.updateRules(),
  utilities.handleErrors
  (invController.adminAccount)
)



// Deliver Add Classification View
router.get("/adclass", utilities.handleErrors(invController.buildAdclass))

router.post(
  "/adclass",
  eValidate.addclassRules(),
  eValidate.checkAdclassData,
  utilities.handleErrors(invController.addClass)
)


// Deliver Add Vehicle View
router.get("/adve", utilities.handleErrors(invController.buildAdve))

router.post(
  "/adve",
  eValidate.addveRules(),
  eValidate.checkAddveData,
  utilities.handleErrors(invController.addVehicle)
)


//Get Inventory Route
router.get("/getInventory/:classification_id", 
  // utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
)

//Update View

router.get("/edit/:inv_id", utilities.handleErrors(invController.buildUpdate))

router.post("/update/",
  eValidate.updateRules(),
  utilities.handleErrors
  (invController.updateInventory)
)


//Delete
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDelete))

router.post("/edelete",
  utilities.handleErrors
  (invController.deleteInventory)
)


router.get("/admin", utilities.handleErrors(invController.adminLogin))
//Process the Account Login View
router.post(
  "/admin",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(invController.LoginAdmine)
)




//Admin Management
router.get('/', utilities.handleErrors(invController.adminLogin))

//Process the Admin Account Login View

router.post(
  "/admin",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(invController.loginAdmine)
)


module.exports = router;