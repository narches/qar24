// Needed Resources 
const express = require("express");
const router = new express.Router();
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');
const utilities = require('../utilities');


// Deliver Login View
router.get('/login', utilities.handleErrors(accountController.buildLogin))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)

)

//Deliver SignUp View
router.get('/signup',  utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
    "/signup",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Deliver Account Login View
router.get("/", utilities.handleErrors(accountController.buildLogin))



//Update View
router.get("/aedit", utilities.handleErrors(accountController.accountUpdate))

router.post("/update/",
  regValidate.updateRules(),
  utilities.handleErrors
  (accountController.updateAccount)
)



// Deliver Account Management View
router.get("/amanager", utilities.handleErrors(accountController.buildAMgt))


module.exports = router;