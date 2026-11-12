## Test log for v1

| What I tested | What happened | What I want instead |
|---------------|---------------|---------------------|
| Added five gaming sessions | Both charts and five bubbles displayed. Daily totals were 75, 80, and 90 minutes. | Keep correct totals and visualizations. |
| Refreshed and reopened the dashboard | Saved sessions remained. | Keep this behavior. |
| Submitted empty required fields | The browser displayed “Please fill out.” | Keep required fields and add clear guidance about allowed inputs. |
| Entered 99999 minutes | The app accepted the session. | Only accept whole numbers from 1 to 1440 minutes, checked in both the form and Express route. |
| Entered a date with year 0026 | V1 accepted it and displayed it before the 2026 dates. | Only accept real dates from January 1, 2020 through today. |
| Clicked Clear all data | The charts and bubbles emptied out. | Keep this behavior. |

# Prompt Script v2 — Final

## Goal
Build a gaming session tracker that helps players understand their time spent gaming. Improve v1 by rejecting unrealistic session lengths and incorrect dates while keeping its working cookie storage and visualizations.

## Where it lives
- This is inside my existing Express.js application.
- The app already uses express, cookie-parser, hbs, and express.urlencoded.
- Add v2 routes in app.js below the v1 routes and above /:name.
- Keep all v1 code and existing routes unchanged.
- Do not install new npm packages.
- Use separate Handlebars templates named tracker-v2.hbs and tracker-dashboard-v2.hbs.
- Give me the code with clear instructions about where each part goes.

## Data
- Each session is an object:
  { date: "2026-11-11", game: "Minecraft", minutes: 60 }
- date is a YYYY-MM-DD string.
- game is one of: Minecraft, Fortnite, Elden Ring, Red Dead Redemption 2, or Other.
- minutes is a whole number from 1 to 1440.
- Store sessions in a cookie named gamingLog_v2.
- Do not read or overwrite gamingLog_v1.
- Use maxAge: 7 * 24 * 60 * 60 * 1000.
- Use cookie options httpOnly: true, sameSite: "lax", and path: "/".
- Keep only the most recent 20 sessions, based on the order they were added.
- If the cookie is missing or is not an array, use an empty array.

## Routes (Express + cookie-parser)
- GET /tracker/v2 renders the entry form.
- The form has a date input, game dropdown, minutes input, and Add Session button.
- Show the allowed date range and minutes range beside the inputs.
- Default the date to today.
- POST /tracker/v2 validates submitted values on the server.
- Read existing sessions with req.cookies, append the valid session, keep the latest 20, and save with res.cookie.
- Redirect successful submissions to /tracker/v2/dashboard.
- Invalid submissions must show a helpful error on the form without changing the cookie.
- Preserve the submitted form values when displaying an error.
- GET /tracker/v2/dashboard reads the cookie and passes its data to the dashboard.
- POST /tracker/v2/clear deletes gamingLog_v2 using res.clearCookie with path: "/" and redirects to the dashboard.
- Clearing v2 must not clear v1.
- Each tracker page links to its dashboard, and each dashboard links back to its tracker.
- Include a dashboard link to the v1 dashboard for comparison.

## Validation
- Require all fields.
- Accept only actual calendar dates from January 1, 2020 through today.
- Calculate today using the server's local calendar date and use that same limit in the form.
- Reject impossible dates, future dates, and dates such as year 0026.
- Use date input min and max attributes, plus server-side validation.
- Accept only one of the five listed games.
- Require whole-number minutes from 1 to 1440.
- Use min="1", max="1440", and step="1" on the minutes input.
- Also reject empty values, nonnumeric values, decimals, zero, negatives, and values above 1440 on the server.

## Dashboard layout
- Use a simple dark gaming theme with readable text.
- Put the two charts side by side on wide screens and stack them on small screens.
- Put the p5 sketch in a separate panel inside the dashboard.
- Display the number of saved sessions and total minutes played.
- Include a table listing each saved session's date, game, and minutes so users can check their entries.
- Show a clear empty-state message when there are no sessions.
- Keep the Clear all data button visible.

## Chart 1 (Chart.js)
- Use a bar chart titled Gaming Minutes by Date.
- Combine sessions with the same date.
- Sort dates chronologically on the x-axis.
- Show total minutes on the y-axis, starting at zero.
- Label the axes Date and Total Minutes.
- Label the dataset Minutes Played and use purple bars.
- Derive all values from the cookie entries.

## Chart 2 (Chart.js)
- Use a doughnut chart titled Time by Game.
- Combine minutes across all sessions for each game.
- Show game names in a readable legend.
- Use these consistent colors:
  Minecraft: green (#4ade80)
  Fortnite: blue (#60a5fa)
  Elden Ring: purple (#b69cff)
  Red Dead Redemption 2: orange (#fb923c)
  Other: gray (#a1a1aa)
- Derive all values from the same cookie entries.

## p5.js sketch
- Title the section Gaming Session Bubbles.
- Draw one circle for each saved session.
- Use the same game colors as Chart 2.
- Map minutes from 1–1440 to circle diameters from 80–145 pixels.
- Explain the size mapping in a short caption.
- Arrange circles in a grid without overlapping.
- Display readable game names and minutes below each circle.
- Keep the canvas inside the dashboard and adapt its grid when the browser is resized.
- Adding a session must add a bubble.
- Clearing the cookie must remove all bubbles and show an empty-state message.

## Rules / constraints
- Use plain HTML, CSS, JavaScript, and the existing Handlebars templates.
- Do not use React or additional frameworks.
- Store data on the server using req.cookies, res.cookie, and res.clearCookie.
- Do not use localStorage or document.cookie.
- Load Chart.js and p5.js from a CDN.
- Comment every function.
- Add the comment // ----- Tracker v2 routes ----- above the v2 routes.
- Transfer cookie data safely into the dashboard's JavaScript.
- Keep both versions available for testing and comparison.