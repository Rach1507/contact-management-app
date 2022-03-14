const express = require('express');
const request = require('request');
const https = require('https');
require('dotenv').config();
const ejs = require('ejs');


const app = express();
app.set('view engine', 'ejs');



app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

let emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
 let passwordRegex  = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;


// ------- mongoose

const mongoose = require('mongoose');
const {Schema} = require('mongoose');

// mongoose.connect("mongodb://localhost:27017/usersDB");
mongoose.connect("mongodb+srv://rachitha:"+process.env.password+"@cluster0.17u2f.mongodb.net/usersDB");

//---------userSchema and model


const usersSchema = new mongoose.Schema({
  //TODO required and all other const
  userEmail:{
    type:String,
    required:true
  },
  usrPwd:{
    type:String,
    required:true
  },
  secretKey:String



});

const User = mongoose.model("User",usersSchema);


//---------contactSchema and model



const contactSchema = new mongoose.Schema({

  contactEmail:String,
  contactName:{
    type:String,
    required:true
  },
  phone: {
      type:Number,
      required:true
    },
  user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }



});

const Contact = mongoose.model("contact",contactSchema);





//------- get request


app.get("/",(req,res) =>{

  res.render("signUp",{
    emailAlert : false,
    pwdAlert:false,
    userPresent:false,
    error:false,
  Title:"Contacts-Signup"
});

  // res.sendFile(__dirname + "//signUp.html");

});
app.get("/signIn",(req,res) =>{

  res.render("signIn",{
    emailFail : false,
    pwdFail:false,
    successfull:false,
    error:false,
    Title:"SignIn-Contacts"
  });

  // res.sendFile(__dirname + "//signIn.html");

});



app.get("/contacts",(req,res) =>{
  // res.sendFile(__dirname + "//myContacts.html");


  Contact.find({},(err, contacts)=>{

    if( contacts.length === 0 ) {

        res.render('myContacts', {
          allContacts: contacts,
          newContact :false,
           error:false,
             Title:" My Contacts"  });
    }

    else{

      const userContacts =[];
      contacts.forEach((contact)=>{

        if (String(currUser) === String(contact.user)) {
          userContacts.push(contact);
        }


      });


      res.render('myContacts', {
        allContacts: userContacts,
        newContact :false ,
        error:false,
      Title:" My Contacts" });
      }

      });

  });





//------- post request




app.post("/", (req,res) => {
  const email = req.body.email;

  if(!emailRegex.test(email)){


    res.render("signUp",{
      emailAlert:true,
      pwdAlert:false,
      userPresent:false,
      error:false,
      Title:"Contacts-Signup"});

  }

else{

  const password = req.body.password;

  if(!passwordRegex.test(password)){
  res.render("signUp",{
    emailAlert : false,
    pwdAlert:true,
    userPresent:false,
    error:false
  ,  Title:"Contacts-Signup"});

    // res.redirect("/");

  }
  else {

  const secretKey = req.body.secretKey;


User.find({userEmail:email},(err,user)=>{
  if (user.length == 0 ){


const user1 = new User({
  userEmail:email,
  usrPwd:password,
  secretKey:secretKey

});


user1.save((err)=>{
  if (err){
    console.log(err);
    res.render("signUp",{
      emailAlert : false,
      pwdAlert:false,
      userPresent:false,
      error:true,
      Title:"Contacts-Signup"});


    //TODO Pop up - signUp unsuccesful
  }
  else{
    console.log("Succesfully inserted the user");

    res.render("signIn",{
      emailFail : false,
      pwdFail:false,
      successfull:true,
      error:false,
      Title:"SignIn-Contacts"});

    // res.redirect("/signIn");
  }

});
}

else {


  console.log("User Already present");

    res.render("signUp",{
      emailAlert : false,
      pwdAlert:false,
      userPresent:true,
      error:false,
      Title:"Contacts-Signup"});
  // res.redirect("/");

}
});

}

}
});


app.post("/signIn",(req,response)=>{


  const currEmail = req.body.email;
  const currPwd = req.body.pwd;

  console.log(req.body.pwd);
  console.log(req.body.userEmail);

    User.find({},(err, users)=>{
console.log(users);
      if( users.length === 0 ) {
                response.render("signIn",{
                  emailFail : true,
                  pwdFail:false,
                  successfull:false,
                  error:false,
                  Title:"SignIn-Contacts"});
      }


      else


      {

        for (var i = 0; i < users.length; i++) {
          const user = users[i];
          // console.log("Checking user");
          // console.log(user.userEmail);
          // console.log(user.usrPwd);
      if (user.usrPwd === currPwd){

          console.log("successfull");
          global.currUser=user._id;
          console.log(global.currUser);


       response.redirect("/contacts");
       break;

      }
      else

    {

      console.log("unsuccessful");


  }


        }

        response.render("signIn",{
          emailFail : false,
          pwdFail:true,
          successfull:false,
          error:false,
          Title:"SignIn-Contacts"});


      }
    });



});


app.post("/addContacts", (req,res) => {


  const email = req.body.contactEmail;
  const phone = req.body.phone;
  const name = req.body.contactName;

const contact1 = new Contact({


  contactEmail:email,
  contactName:name,
  phone:phone,
  user: global.currUser


});

contact1.save((err)=>{
  if (err){
    console.log(err);
res.render('myContacts', {
  allContacts: [],
   newContact :false ,
   error:true,
     Title:" My Contacts"
 });

  }
  else{
    console.log("Succesfully inserted the contact");
    console.log(contact1);
          // res.render('myContacts', {allContacts: contacts, newContact :true ,error:false});
    res.redirect("/contacts");
  }

});

});



app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening at 3000");
});
