

const utilities = require(".");
const { body, validationResult } = require("express-validator");
const balidates = {}

// Classification name validation rules
balidates.addBooking = () => {
  return [
    body("book_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Name is required and must be at least 3 characters long"),

    body("classification_id")
      .trim()
      .isInt()
      .notEmpty()
      .withMessage("Classification Name is required"),

    body("start_date")
      .trim()
      .notEmpty()
      .withMessage("Start Date is required.")
      .isDate({ format: 'MM-DD-YYYY', strictMode: true })
      .withMessage("Start Date must be in the format YYYY-MM-DD.")
      .custom((value) => {
        const startDate = new Date(value);
        const currentDate = new Date();
  
        if (startDate < currentDate) {
          throw new Error("Start Date cannot be in the past.");
        }
        return true;
      }),

    body("end_date")
      .trim()
      .notEmpty()
      .withMessage("End Date is required.")
      .isDate({ format: 'MM-DD-YYYY', strictMode: true })
      .withMessage("End Date must be in the format YYYY-MM-DD.")
      .custom((value, { req }) => {
        const endDate = new Date(value);
        const startDate = new Date(req.body.start_date);
  
        if (endDate < startDate) {
          throw new Error("End Date cannot be before the Start Date.");
        }
        return true;
      })
  ];
}


//Check data and return errors or continue to registration
balidates.checkBook = async (req, res, next) => {
    const { book_name, classification_id, start_date, end_date } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("/book/", {
        errors,
        title: "Sign Up",
        nav,
        book_name,
        classification_id,
        start_date,
        end_date
      })
      return
    }
    next()
}

module.exports = balidates;
