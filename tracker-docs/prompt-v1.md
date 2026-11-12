# Prompt Script v1

## Goal
Build a gaming session tracker for someone who wants to see how much time they spend playing different games. Let users log sessions and view their gaming habits on a dashboard.

## Where it lives
- This is part of my existing Express.js app.
- My app already uses express, cookie-parser, hbs, and express.urlencoded.
- Put the routes in app.js before my /:name route.
- Use Handlebars templates inside views.
- Do not change my existing routes or add new npm packages.
- Give me the code and tell me exactly where each part goes.

## Data
- Each entry has these fields:
  { date: "2026-11-11", game: "Minecraft", minutes: 60 }
- date is a date string, game is a category string, and minutes is a number.
- Game choices: Minecraft, Fortnite, Elden Ring, Red Dead Redemption 2, and Other.
- Use the cookie name gamingLog_v1.
- Keep the cookie for seven days with maxAge: 7 * 24 * 60 * 60 * 1000.
- Keep only the most recent 20 entries to limit cookie size.

## Routes (Express + cookie-parser)
- GET /tracker/v1 shows the gaming session form.
- The form has a date input, a game dropdown, a minutes number input, and an Add Session button.
- POST /tracker/v1 reads existing entries with req.cookies, adds the submitted entry, saves the array with res.cookie, and redirects to the dashboard.
- GET /tracker/v1/dashboard reads the cookie and displays two charts and a p5.js sketch.
- Put the charts next to each other on wide screens and stack them on small screens.
- Put the sketch in its own section inside the dashboard.
- A Clear all data button submits to POST /tracker/v1/clear.
- That route uses res.clearCookie and redirects to the dashboard.
- The tracker links to the dashboard, and the dashboard links back to the tracker.

## Chart 1 (Chart.js)
- Use a bar chart showing total minutes played on each date.
- Combine sessions that have the same date.
- Put dates on the x-axis in chronological order.
- Put total minutes on the y-axis, starting at zero.
- Title: Gaming Minutes by Date.
- Use purple bars and label the dataset Minutes Played.

## Chart 2 (Chart.js)
- Use a doughnut chart showing total minutes played per game.
- Combine all sessions for the same game.
- Title: Time by Game.
- Show game names in the legend.
- Use green for Minecraft, blue for Fortnite, purple for Elden Ring, orange for Red Dead Redemption 2, and gray for Other.

## p5.js sketch
- Title the section Gaming Session Bubbles.
- Draw one circle for each saved session.
- More minutes should make a larger circle.
- Use the same game colors as the doughnut chart.
- Arrange circles in a grid inside the canvas.
- Put the game name and minutes inside each circle.
- Keep the canvas inside the dashboard layout.
- Adding or clearing sessions must change the sketch.

## Rules / constraints
- Use plain HTML, CSS, and JavaScript with the existing Handlebars templates.
- Do not use React or add frameworks.
- Store data in cookies using cookie-parser on the Express server.
- Do not use localStorage or document.cookie.
- Load Chart.js and p5.js from a CDN.
- Comment every function.
- Add a comment above the routes: // ----- Tracker v1 routes -----
- Require all form fields and set the minutes input minimum to 1.
- Show an empty-state message when there are no sessions.
- Include the Clear all data button.
- Use a simple dark gaming theme with readable text.