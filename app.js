const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");

app.get("/",(req,res)=>{
    res.send("Hello from express");
});

app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");

app.get("/home", (req,res)=>{
    res.render("home", {title:"My home page"});
})

app.get("/form", (req,res)=>{
    res.render("survey", {title:"Survey"})
});
app.use(express.static("public"));

app.get("/hello",(req,res)=>{
    res.send("hello word");
})

app.post("/form", (req,res)=>{
    //res.send("form processed")
    const animal = req.body.animal; //animal selected from form
    let votes = {
        narwhal:0,
        seal:0,
        penguin:0
    };
    if(req.cookies.votes != undefined){
        votes = req.cookies.votes
    }
    if(votes[animal]===undefined){
        votes[animal] = 0
    }

    votes[animal] = votes[animal + 1];
    res.cookie("votes", votes, {maxAge: 7 * 24 * 60 * 60 * 60 * 1000})

    res.render("response", {
        votes : votes
    })
});

app.get("/poll", (req, res) => {
    let votes = {
        football: 0,
        basketball: 0,
        baseball: 0,
        soccer: 0,
        tennis: 0
    };

    if (req.cookies.sportsVotes != undefined) {
        votes = req.cookies.sportsVotes;
    }

    res.render("poll", {
        title: "Sports Showdown",
        votes: votes
    });
});

app.post("/poll", (req, res) => {
    const sport = req.body.sport;

    let votes = {
        football: 0,
        basketball: 0,
        baseball: 0,
        soccer: 0,
        tennis: 0
    };

    if (req.cookies.sportsVotes != undefined) {
        votes = req.cookies.sportsVotes;
    }

    if (votes[sport] === undefined) {
        return res.redirect("/poll");
    }

    votes[sport] = votes[sport] + 1;

    res.cookie("sportsVotes", votes, {
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect("/poll");
});

// ----- Tracker v1 routes -----

// Show the gaming session form.
app.get("/tracker/v1", (req, res) => {
    res.render("tracker-v1", {
        title: "Gaming Tracker v1"
    });
});

// Add a gaming session and save the latest 20 entries.
app.post("/tracker/v1", (req, res) => {
    let entries = [];

    if (Array.isArray(req.cookies.gamingLog_v1)) {
        entries = req.cookies.gamingLog_v1;
    }

    const date = req.body.date;
    const game = req.body.game;
    const minutes = Number(req.body.minutes);

    const games = [
        "Minecraft",
        "Fortnite",
        "Elden Ring",
        "Red Dead Redemption 2",
        "Other"
    ];

    if (!date || !games.includes(game) ||
        !Number.isFinite(minutes) || minutes < 1) {
        return res.status(400).render("tracker-v1", {
            title: "Gaming Tracker v1",
            error: "Enter a date, choose a game, and enter at least 1 minute."
        });
    }

    entries.push({
        date: date,
        game: game,
        minutes: minutes
    });

    entries = entries.slice(-20);

    res.cookie("gamingLog_v1", entries, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        path: "/"
    });

    res.redirect("/tracker/v1/dashboard");
});

// Read saved sessions and send them to the dashboard.
app.get("/tracker/v1/dashboard", (req, res) => {
    let entries = [];

    if (Array.isArray(req.cookies.gamingLog_v1)) {
        entries = req.cookies.gamingLog_v1;
    }

    res.render("tracker-dashboard-v1", {
        title: "Gaming Dashboard v1",
        entries: entries,
        entriesJSON: JSON.stringify(entries).replace(/</g, "\\u003c")
    });
});

// Delete the gaming tracker cookie.
app.post("/tracker/v1/clear", (req, res) => {
    res.clearCookie("gamingLog_v1", {
        path: "/"
    });

    res.redirect("/tracker/v1/dashboard");
});

app.get("/:name",(req,res)=>{
    res.send("My name is: " + req.params.name);
})

//end of code
app.listen(port, ()=>{
    console.log("Server Running at http://localhost:${port}");
});