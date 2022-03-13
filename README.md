# contact-management-app

 ### Deployement of the application can be found at  https://contacts-app-zoho.herokuapp.com/

Repository can be cloned locally and run

        To install required Node modules by command: npm install 
        To run locally : node app.js
        

       

This is the contact management application created with following functionality

User Registration : Sign-up page : where the user will be allowed to enter his emailID and password along
with a secret code. This data will be validated and sent to the backend where the
data will be stored in a MongoDB Database called usersDB


Sign-in:  

where the user will be allowed to enter his emailID and password. This
data will be sent to the backend where it will be cross-checked with the data
available in the database and a proper response is returned to the frontend.
3. After sign-in the user will be presented with a form with which he can add his
contacts. redirected to MyContacts page

MyContacts:

The form that is presented to user has fields such as
a. Contact Name
b. Contact Number
c. Contact Email
d. And a Add contact button to save the contact. On clicking the button the contact
is stored in the database.


Below the contact form, the user can also see his stored contacts






Frameworks and libraries used:

 HTML,CSS ,Bootstrap
 EJS
Node js - Express
Mongoose 

Database hosted  on mongoDB Atlas
Deployed in heroku

Repository can be cloned locally and run
        To install required Node modules by command: node install 
        To run locally : node app.js
        

