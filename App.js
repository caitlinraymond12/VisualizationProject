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
// Version 1 Paths

// Main landing page
app.get("/tracker/v1/home", (req, res) => {
    res.sendFile(path.join(__dirname, "public/tracker/v1/index.html"));
});

// Dashboard page
app.get("/tracker/v1/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public/tracker/v1/dashboard.html"));
});

// Save hobby entry
app.post("/tracker/v1/form", (req, res) => {
    const hobby = req.body.hobby;
    const minutes = Number(req.body.minutes);
    const dayOfWeek = req.body.dayOfWeek;

    const validHobbies = [
        "Gym",
        "Rock Climbing",
        "Reading",
        "Scrolling",
        "Video Games",
        "Being With Friends"
    ];

    const validDays = [
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    ];

    if (!validHobbies.includes(hobby) ||
        !Number.isInteger(minutes) ||
        minutes <= 0 ||
        !validDays.includes(dayOfWeek)) {
        return res.status(400).json({ error: "Invalid entry" });
    }

    let hobbies = req.cookies.hobbies_v1 || [];

    hobbies.push({
        hobby: hobby,
        minutes: minutes,
        dayOfWeek: dayOfWeek
    });

    res.cookie("hobbies_v1", hobbies, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    });

    res.json({ success: true, hobbies: hobbies });
});

// Retrieve hobby data
app.get("/tracker/v1/data", (req, res) => {
    const hobbies = req.cookies.hobbies_v1 || [];
    res.json(hobbies);
});

// Clear hobby data
app.delete("/tracker/v1/clear", (req, res) => {
    res.clearCookie("hobbies_v1");
    res.json({ success: true });
});

// --------------------------------------------- //


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