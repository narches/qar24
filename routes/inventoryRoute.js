// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController")
const eValidate = require("../utilities/ve-validation")
const utilities = require("../utilities")




// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to handle requests for displaying details of a specific vehicle
router.get("/detail/:id", invController.getVehicleDetails)

//Management View
router.get("/management", utilities.handleErrors(invController.buildMgt))


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








module.exports = router;