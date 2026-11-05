# Prompt Script v2

## Test log for v1
| What I tested | What happened | What I want instead |
|---------------|---------------|---------------------|
| Adding in data | Text describing my entry appeared below the form | Form data should be sent to dashboard only and should not appear elsewhere in app.|

## Tests Passed for v1

- Cannot put a negative unit of time
- Cannot put alphabetic characters in minutes completed 
- Cannot leave any of the three fields blank
- Data is persistant following a refresh  

## Goal
I want to create a dashboard that shows how much time I spend on each of my hobbies per day. This application is just for me, and will have 6 of my main hobbies hard coded for me to choose from when tracking. I will be able to log what I have done each day and a dashboard to visually display the collected data.

## Where it lives
- It's part of an existing Express.js app that already uses cookie-parser
- Pages go in public/tracker/v2/ and are served with express.static
- Cookie routes go in the main Express file, App.js, with my other routes
- Every route URL must start with /tracker/v2/
- Do NOT change my other routes or add new npm packages
- Add one route for the main landing page within public/tracker/v2/home
- Add one route for the dashboard in public/tracker/v2/dashboard
- There is an existing example that takes in votes and uses cookies in the `app.post("/form", (req, res)` route. 

## Data
- One entry has three fields: hobby, minutes completed, and day of week.    
- What one entry looks like (fields + types), e.g.
  { hobby: "Rock Climbing", minutes: 60, dayOfWeek: "Monday" }
- Cookie name:  "hobbies_v2"
- The cookie will expire after one week
- There are 6 hobbies to choose from: Gym, Rock Climbing, Reading, Scrolling, Video Games, and Being With Friends. 

## Routes (Express + cookie-parser)
- Save route: The URL is `app.post("/tracker/v2/form")`. It takes the submitted hobby using `const hobby = req.body.hobby;`, retrieves the existing hobbies from req.cookies if available, adds the new entry, and saves the updated array using `res.cookie()`. It then renders a response page to display the updated data. An example can be seen in App.js and the corresponding views.

- Data route: The URL is `app.get("/tracker/v2/data")`. It retrieves the hobbies stored in the cookie using req.cookies and sends the array back as JSON using `res.json()`.

- Clear route: The URL is `app.delete("/tracker/v2/clear")`. It will delete the cookies using `res.clearCookie(hobby);`


## Pages

The color scheme for the full application should be light blue and white. Pretty but not too much color. 

### index.html

This will be the place to submit the form. Will have three fields, one for the hobby, one for minutes completed, and one for the day of the week the activity was completed. When the user submits, they remain on this page, but the data gets sent to dashboard.html. The user can click "Dashboard" to see dashboard, or "Clear All" to clear all their responses. The form should be centered to the screen and responsive to the browser. 

The user will have to include hobby, time spent on hobby, and day of week completed. Make all of these dropdown selections. For time, include increments of 15 minutes up to 120. Also make this editable directly by the user so they can enter their own custom number. 

### dashboard.html

This page will contains two Chart.js charts, and one p5.js sketch. The details for these components will be detailed below. Gets its data from the data route with fetch(). The graphs should not be so large that they cannot fit on the page easily with the user. They should be small enough that the user can see the whole thing. 

When in full screen, put both charts next to each other. When screen in minimized, stack them on top of one another. 


## Chart 1 (Chart.js)
Type: Stacked Bar Chart 
X-axis: Day of Week (starting with Sunday going to Saturday)
Y-axis: Minutes spent 
Colors: Each hobby will get its own color. Make these colors light and pastel.

The purpose of this chart is to simply show how much time is dedicated to each hobby each day, and to visually show this breakdown. 

## Chart 2 (Chart.js)
Type: Doughnut
Colors: Each hobby will get its own color
Use the same colors for each hobby as was used in the previous chart.

This chart will show the percentage of total time spend on hobbieswas spent on each hobby.


## p5.js sketch
For the p5.js sketch, draw a field of flowers. There will be one flower for each hobby, using the same colors as the charts above for each hobby. The flowers will grow as more time is spent on the hobby. 

## Rules / constraints
- Plain HTML, CSS, and JavaScript
- Store data in cookies using cookie-parser on the server (NOT localStorage, NOT document.cookie)
- Load Chart.js and p5.js from a CDN
- Include a "Clear all data" button
- Make UI very simple, do not add any extra words or phrases. 
- Keep overall implementation very simple - it should follow the example shown in App.js and its corresponding pages in /views. 
- Only files that should be added should be in public/tracker/v2
- Should add routes to existing App.js below v1 section
- Should add a css folder, a js folder, a dashbaord.html and an index.html.
- When the user inputs their data, it should only be sent to the dashboard to be displayed. It should not be displayed as text elsewhere in the application.  