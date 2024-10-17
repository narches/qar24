const utilities = require(".")
const accountModel = require("../models/account-model")
const {body, validationResult } = require("express-validator")
const validate = {}


validate.loginRules = () => {
  return [
          // valid email is required and cannot already exist in the database
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

      //Password is required and must be string
      body("account_password") .trim().isStrongPassword({minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,})
      .withMessage("Password does not meet requirements."),

  ]

}

//Registration Data Validation Rules
validate.registrationRules = () => {
    return [
        //Name is required and must be string
        body("account_firstname") 
        .trim() 
        .escape() 
        .notEmpty() 
        .isLength({min: 1})
        .withMessage("First Name is required"),

        //Last Name is required and must be string
        body("account_lastname") 
        .trim() 
        .escape() 
        .notEmpty() 
        .isLength({min: 2})
        .withMessage("Last Name is required"),

            // valid email is required and cannot already exist in the database
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
          }
        }),

        //Password is required and must be string
        body("account_password") .trim().isStrongPassword({minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,})
        .withMessage("Password does not meet requirements."),

        //Confirm Password is required and must be string
        // body("account_confirmpassword") .trim().isString().isLength({min: 1})
        // .withMessage("Confirm Password is required"),
    ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  console.log(req.body)
    const { account_email, account_password} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
        account_password,
        
      })
      return
    }
    next()
}
  


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  console.log(req.body)
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/signup", {
        errors,
        title: "Sign Up",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
}
  

module.exports = validate