
const bookModel = require("../models/book-model.js");
const utilities = require("../utilities");


const bookCont = {}





bookCont.buildBooking = async function(req, res, next) {
    const classificationLists = await utilities.buildClassificationList();
    let nav = await utilities.getNav()
    res.render("book/booking", {
      title: "Book Vehicle Class",
      nav,
      errors: null,
      classificationLists,
    })
}




module.exports = bookCont;