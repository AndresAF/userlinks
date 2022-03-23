const express = require("express");
const router = express.Router();
const passport = require("passport")
const {isLoggedIn, isNotLoggedIn} = require("../lib/auth")
router.get("/signup", (req,res) => {
res.render("auth/signup")
})

router.post("/signup", isNotLoggedIn, passport.authenticate("local.signup", {
   
        successRedirect: "/profile",
        failureRedirect: "/",
        failureFlash: true
}))
router.get("/profile", isLoggedIn, (req,res) => {
    res.render("profile")
})
router.get("/signin", isNotLoggedIn, (req,res) => {
    res.render("auth/signin")
})
router.post("/signin", isNotLoggedIn, passport.authenticate("local.signin", {
    successRedirect: "/profile", 
    failureRedirect: "/signin",
    failureFlash: true
}))
router.get("/log-out", (req,res) => {
    req.logOut();
    res.redirect("/signin")
})
router.get("/", isNotLoggedIn, (req, res) => {
    res.render("auth/signin")})
    
module.exports = router