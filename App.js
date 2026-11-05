const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000; 
const path = require("path");

app.set("view engine", "hbs");

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res)=>{
    res.send("Hello from express");

});

app.get("/form", (req, res) => {
    res.render("survey", {title:"Survey"})
});

app.post("/form", (req, res) => {
    const food = req.body.food;

    let votes = {
        Burger: 0,
        Pizza: 0, 
        Pasta: 0,
        Burrito: 0
    };

    if(req.cookies.votes !== undefined){
        votes = req.cookies.votes;
    }

    if(votes[food] === undefined){
        votes[food] = 0;
    }

    votes[food] += 1;

    //settingn expiration of cookies 
    res.cookie("votes", votes, {maxAge: 7 * 24 * 60 * 60 * 1000});

    res.render("response", {
        votes: votes
    });
});

app.delete("/clear", (req, res) => {
    res.clearCookie("votes");
    res.send("Votes cleared" + "<a href='/form'>Back to form</a>");
});


app.listen(port, ()=>{
    let message = "Server running at http://localhost:${port}"
    console.log(message);
})