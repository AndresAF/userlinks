const express = require("express")
const morgan = require("morgan")
const exphbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash")
const session = require("express-session")
const MySQLStore = require("express-mysql-session");
const {database}  = require("./keys")
const passport = require("passport")



//Initializations
const app = express();
require("./lib/passport")

//Setting
app.set("port", process.env.PORT || 5000)
app.set("views", path.join(__dirname, "views"))
app.engine(".hbs", exphbs.engine ({
defaultLayout: "main",
layoutsDir: path.join(app.get("views"), "layouts"),
partialsDir: path.join(app.get("views"), "partials"),
extname: "hbs",
helpers: require("./lib/handlebars.js")
}))
app.set("view engine", ".hbs")

//Middlewares: funciones cuando un cliente hace una peticion
app.use(session({
    secret:"secret",
    resave: true,
    saveUninitialized: true,
    
    store: new MySQLStore(database)
}))
app.use(flash())
app.use(morgan("dev"))
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

//Global Variables: variables que necesita el proyecto en general
app.use((req,res,next)  => {
    app.locals.success = req.flash("success")
    app.locals.messages = req.flash("messages")
    app.locals.user = req.user
    next()
})

//Routes: URLS de nuestro servidor. que pasa cuando el usuario visita esas URLS.
app.use(require("./routes/"))
app.use(require("./routes/authentication"));
app.use("/links", require("./routes/links"));
//Public: carpeta donde entrara el codigo al que el navegador puede acceder.
app.use(express.static(path.join(__dirname, "public")))

//Starting the server: lo que inicia el servidor
app.listen(app.get("port"), () => {
console.log("Server on port", app.get("port"))
})



