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

app.get("/:name",(req,res)=>{
    res.send("My name is: " + req.params.name);
})

//end of code
app.listen(port, ()=>{
    console.log("Server Running at http://localhost:${port}");
});