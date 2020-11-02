Miles' Project 4 express API readme

ERD: https://imgur.com/mVGxWYo
Wireframe: https://imgur.com/YhlNcXJ

User stories:

As a user, I want to be able to sign up, sign in, change password, and sign out.
As a user, I want to be able to create new repairs to track for my car
As a user, I want to be able to update those repairs if the date, repair type, or cost changes
As a user, I want to be able to delete repairs if they do not occur
As a user, I want to be able to index all my past and present repairs in a list.
As a user I want to be able to add mileage, price, type, and date of repairs

Technologies used in this application: JavaScript, MongoDB, Mongoose, Express

This application represents the Express API server side that is used for a car repair tracker.  Users can input their car repair's price, type, date, and car mileage in order to track repairs.  Those repairs can then be deleted, updated, or indexed.  The API stores this user data for manipulation by the user on the front end.

One issue that came up during development was that the index feature for repairs showed car repairs for all users who had ever created a repair, rather than the user themselves.  This was fixed on the back end by requiring the index feature to search for an authorized user rather than just all events entirely.

In version two, I would like this app to have the ability to track multiple cars for a single user, rather than assuming a user has a single car.  Addtionally, I wanted to spend more time on the styling for this project but got sidetracked by events in my personal life.  Version two would add more fonts, animations, and use of bootstrap.

Route Catalog:
- index all repairs for a user
- create a new repair
- update an existing repair
- delete an existing repair

Set Up/Install Instructions:
- This back end application is deployed through heroku on the back end.  It can also be downloaded and run locally but running 'npm run server' on your machine in tandem with 'grunt serve' on the front end application.



Deployed front end site: https://milescogan92.github.io/MDCProject4-client/
Deployed back end site: https://arcane-lake-50388.herokuapp.com/
