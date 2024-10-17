const bcrypt = require("bcryptjs")
const accountModel = require("../models/account-model");
const utilities = require("../utilities")
const jwt = require("jsonwebtoken")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "Login")
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver Sign Up view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "Register")
  res.render("account/signup", {
    title: "Register",
    nav,
    errors: null,
  })
}



/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
      // Check if email already exists

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
      req.flash("notice", 'Error processing the registration.')
      res.status(500).render("account/signup", {
        title: "Registration",
        nav,
        errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `${account_firstname}, Your account has been created, Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/signup", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}



  
module.exports = {buildLogin, buildRegister, registerAccount}
