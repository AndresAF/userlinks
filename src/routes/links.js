const express = require("express");
const router = express.Router();
const {isLoggedIn} = require("../lib/auth")


const pool = require("../database")

router.get("/add", isLoggedIn, (req,res) => {
    res.render("links/add")
})
router.post("/add", isLoggedIn, async (req,res) => {
    
    const {title, url, description} = req.body;
    const newLink = {
        title, 
        url, 
        description,
        user_id: req.user.id
    };

    await pool.query("insert into links set ?", [newLink]);
    req.flash("success", "link saved succesfully")
    res.redirect("/links")
   
    

})

router.get("/", isLoggedIn,async (req,res) =>  {
    const links = await pool.query("SELECT * FROM links where user_id = ?", [req.user.id]);
    
    res.render("links/list", {links: links})
  
})

router.get("/delete/:id",isLoggedIn, async (req,res) => {
   const id = req.params.id
   await pool.query("delete from links where id = ?", [id])
   req.flash("success", "Link deleted successfully")
   res.redirect("/links")
})
router.get("/edit/:id", isLoggedIn, async (req,res) => {
    const {id} = req.params;

  const links = await pool.query("SELECT * FROM links WHERE id = ?", [id])

 res.render("links/edit", isLoggedIn, {links: links[0]})
console.log(links[0].id)
})
router.post("/edit/:id", isLoggedIn, async (req,res) => {
    const {id} = req.params;
    const {title, url, description} = req.body
    const newLink = {
        title,
        url,
        description
    };
    await pool.query("update links set ? where id = ?", [newLink, id])
    req.flash("success", "link edited successfully")
res.redirect("/links")

 
  
   
})
module.exports = router