const { body, validationResult } = require("express-validator");
const utilities = require(".");
const invModel = require("../models/inventory-model.js");
const validates = {};

// Classification name validation rules
validates.addclassRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification Name is required")
      .custom(async (classification_name) => {
        const classExists = await invModel.checkExistingName(classification_name);
        if (classExists) {
          throw new Error("Classification name exists. Please add a different classification name");
        }
      }),
  ];
};

// Vehicle addition validation rules
validates.addveRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification Name is required"),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Vehicle Make is required and must be at least 3 characters long"),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Vehicle Model is required and must be at least 3 characters long"),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Vehicle Description is required and must be at least 3 characters"),

    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Image Path is required"),

    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Thumbnail Path is required"),

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("Price must be a valid number"),

    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Year is required")
      .isInt({ min: 1886, max: new Date().getFullYear() })
      .withMessage("Year must be a valid 4-digit number within realistic bounds"),

    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Miles is required")
      .isNumeric()
      .withMessage("Miles must be a number"),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle color is required"),
  ];
};

// Error checking for classification addition
validates.checkAdclassData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("inventory/adclass", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

// Error checking for vehicle addition
validates.checkAddveData = async (req, res, next) => {
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("inventory/adve", {
      errors: errors.mapped(),
      title: "Add New Vehicle",
      nav,
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
    });
    return;
  }
  next();
};

module.exports = validates;
