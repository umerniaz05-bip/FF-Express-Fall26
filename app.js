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
// ----- Tracker v2 routes -----

const gamingV2Games = [
    "Minecraft",
    "Fortnite",
    "Elden Ring",
    "Red Dead Redemption 2",
    "Other"
];

// Get today's date using the server's local calendar.
function gamingV2Today() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}

// Prepare the form, including saved input values and dropdown selection.
function gamingV2Form(values, error) {
    const gameOptions = [];

    for (let i = 0; i < gamingV2Games.length; i++) {
        gameOptions.push({
            name: gamingV2Games[i],
            selected: gamingV2Games[i] === values.game
        });
    }

    return {
        title: "Gaming Tracker v2",
        today: gamingV2Today(),
        date: values.date,
        minutes: values.minutes,
        gameOptions: gameOptions,
        error: error
    };
}

// Check that a date is real and within the allowed range.
function gamingV2ValidDate(date) {
    if (typeof date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsed = new Date(date + "T00:00:00Z");

    if (Number.isNaN(parsed.getTime())) {
        return false;
    }

    return parsed.toISOString().slice(0, 10) === date &&
        date >= "2020-01-01" &&
        date <= gamingV2Today();
}

// Read valid saved sessions, keeping at most 20.
function gamingV2ReadEntries(req) {
    const saved = req.cookies.gamingLog_v2;
    const entries = [];

    if (!Array.isArray(saved)) {
        return entries;
    }

    for (let i = 0; i < saved.length; i++) {
        const entry = saved[i];

        if (entry &&
            gamingV2ValidDate(entry.date) &&
            gamingV2Games.includes(entry.game) &&
            Number.isInteger(entry.minutes) &&
            entry.minutes >= 1 &&
            entry.minutes <= 1440) {
            entries.push(entry);
        }
    }

    return entries.slice(-20);
}

// Show the form with today's date selected.
app.get("/tracker/v2", (req, res) => {
    res.render("tracker-v2", gamingV2Form({
        date: gamingV2Today(),
        game: "",
        minutes: ""
    }, ""));
});

// Validate a session and save it in the separate v2 cookie.
app.post("/tracker/v2", (req, res) => {
    const values = {
        date: req.body.date,
        game: req.body.game,
        minutes: req.body.minutes
    };

    const minutes = Number(values.minutes);
    let error = "";

    if (!gamingV2ValidDate(values.date)) {
        error = "Choose a real date from January 1, 2020 through today.";
    } else if (!gamingV2Games.includes(values.game)) {
        error = "Choose a game from the list.";
    } else if (typeof values.minutes !== "string" ||
        values.minutes.trim() === "" ||
        !Number.isInteger(minutes) ||
        minutes < 1 ||
        minutes > 1440) {
        error = "Minutes must be a whole number from 1 to 1440.";
    }

    if (error) {
        return res.status(400).render(
            "tracker-v2",
            gamingV2Form(values, error)
        );
    }

    let entries = gamingV2ReadEntries(req);

    entries.push({
        date: values.date,
        game: values.game,
        minutes: minutes
    });

    entries = entries.slice(-20);

    res.cookie("gamingLog_v2", entries, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        path: "/"
    });

    res.redirect("/tracker/v2/dashboard");
});

// Send saved sessions and summary totals to the dashboard.
app.get("/tracker/v2/dashboard", (req, res) => {
    const entries = gamingV2ReadEntries(req);
    let totalMinutes = 0;

    for (let i = 0; i < entries.length; i++) {
        totalMinutes += entries[i].minutes;
    }

    res.render("tracker-dashboard-v2", {
        title: "Gaming Dashboard v2",
        entries: entries,
        sessionCount: entries.length,
        totalMinutes: totalMinutes,
        entriesJSON: JSON.stringify(entries).replace(/</g, "\\u003c")
    });
});

// Clear only v2's cookie and return to its empty dashboard.
app.post("/tracker/v2/clear", (req, res) => {
    res.clearCookie("gamingLog_v2", {
        path: "/"
    });

    res.redirect("/tracker/v2/dashboard");
});

app.get("/:name",(req,res)=>{
    res.send("My name is: " + req.params.name);
})

//end of code
app.listen(port, ()=>{
    console.log("Server Running at http://localhost:${port}");
});