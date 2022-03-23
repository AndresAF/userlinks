const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../database")
const bcrypt = ("bcryptjs")
const helpers = require("./helpers")

passport.use("local.signin", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true,

}, 
async (req, username,password, done) => {
    console.log(req.body)
  const rows = await pool.query("select * from users  where username = ?", [username])
  console.log(rows)
 if(rows.length > 0 ){
     const user = rows[0]
     const validPassword = await helpers.matchPassword(password, user.password)
     if(validPassword === true){
         done(null,user,req.flash("success","Welcome " + user.username))
     }
     else{
         done(null,false, req.flash("messages","Incorrect Password"))
     }
 }
 else{
     done(null, false, req.flash("messages","Username Does Not Exist"))
 }
}))

passport.use("local.signup", new LocalStrategy ({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true, 
  },  async (req,username,password, done) => {
      const {fullname} = req.body
      const newUser = {
          username,
          password,
          fullname
      };
      newUser.password = await helpers.encryptPassword(password);
    
  const result = await  pool.query("INSERT INTO users  set ?", [newUser]);
  newUser.id = result.insertId
  return done(null,newUser)
 
  }))

 passport.serializeUser((user, done) => {
done(null,user.id)
 })

 passport.deserializeUser(async (id,done) => {
  const rows = await  pool.query("select * from users where id = ?", [id]);
  return done(null,rows[0])
 })
