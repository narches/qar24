const bcrypt = require("bcryptjs")
const accountModel = require("../models/account-model")
const utilities = require("../utilities")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
Deliver login view
**************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice")
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
Deliver Sign Up view
**************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice")
  res.render("account/signup", {
    title: "Register",
    nav,
    errors: null,
  })
}


//Account Management
async function buildAMgt(req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "You're logged in")
  res.render("account/amanager", {
    title: "Account Management",
    nav,
    errors: null,
  })
}



/* ****************************************
Process Registration
**************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body


  let hashedPassword
  try {
    //regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
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


/* ****************************************
Process login request
 ************************************* */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
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
      return res.redirect("/amanager")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}





/* ***************************
Build edit Account view
 *************************** */
async function accountUpdate (req, res, next) {
  let nav = await utilities.getNav()
  const itemData = await accountModel.getAccountByEmail(account_email)
  res.render("/account/edit", {
    title:
    nav,
    errors: null,
    account_id: itemData.account_id,
    account_firstname: itemData.account_firstname,
    account_lastname: itemData.account_lastname,
    account_email: itemData.account_email
  })
}



/* ***************************
 Update Account Data
*************************** */
async function updateAccount (req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body
  const aupdateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (aupdateResult) {
    const itemName = aupdateResult.account_firstname + " " + aupdateResult.account_firstname
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("account/aupdate", {
    nav,
    account_id,
    account_firstname,
    account_lastname,
    account_email
    })
  }
}




module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildAMgt, accountUpdate, updateAccount }
