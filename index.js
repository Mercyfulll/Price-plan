import pgPromise from "pg-Promise";
import express  from "express";
import {engine} from "express-handlebars";
import bodyParser from "body-parser";
import  session  from "express-session";
import flash from "express-flash";
import pricePlan from "./pricePlan.js";



var app = express()
var pgp = pgPromise()
var price = pricePlan();

var connectionString = process.env.DATABASE_URL || 'postgres://ncmlcbqz:SXVviMgE6Vt3-ssTYfVB6Wsj42Tw4t0N@trumpet.db.elephantsql.com/ncmlcbqz?ssl=true'

const db = pgp(connectionString);

app.use(express.static(('public')))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//use session to maintain data on the application
app.use(session({
    secret : 'This is a string',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// error handling function
app.use(function (req, res, next) {
    res.locals.messages = req.flash();
    next();
  })


app.get("/",function(req,res){
    
    
    // Contains a form where a user can submit a
    // usage string, press a button and get a total
    // bill for the entered string.
    // Have links to these screens:
    // ● list price plans
    // ● link user to price plan

    res.render("index")
    
})

app.post(("/calc_bill"),async function(req,res){

    // Get the total phone bill for the price plan
    // linked to the username.
    // Takes in the username & usage string.
    // {
    // username : “Yoda”,
    // usage : “call, call, call,
    // sms, call”
    // }
    let usernameHome = req.body.userName
    let str = req.body.string
    price.sortString(str)
    let pricePlanObj = await db.manyOrNone(`SELECT price_plan.plan_name
    FROM price_plan
    JOIN users ON price_plan.id = users.price_plan_id
    WHERE users.user_name = 'Mercy';
    `,[usernameHome]);
    let pricePlan = pricePlanObj[0].plan_name
    price.calculate(pricePlan)
    let total = price.getTotal()


    res.render("index",{usernameHome,total})
})

app.get(("/price_plans"), function(req,res){

    // Show all the price plans
    res.render("price_plan")
})
app.get(("/price_plans/:id"),async function(req,res){
    let allUsers = await db.manyOrNone('SELECT user_name FROM users;')

    if(allUsers.length > 0){
        req.flash('linked','The user has been linked successfully')
    }

    res.render("users", {allUsers})
})
app.post(("/price_plans"),function(req,res){
    res.render("price_plan")
})
app.get(("/link_user"), function(req,res){

    // Show screen that allows the user to select
    // a price plan to link to it. Can add or update
    // user price plans.
    res.render("link_user")
})
app.post(("/link_user"),async function(req,res){
    let user = req.body.username
    let plan = req.body.pricePlan
    let add =  await db.none('INSERT INTO users (user_name,price_plan_id) VALUES ($1,$2)',[user,price.getTableId(plan)])
    let checkUser = await db.oneOrNone('SELECT * FROM users WHERE user_name = $1',[user])
    console.log(plan)
   
    if (checkUser.length > 0){
        await db.none('UPDATE users SET price_plan_id = $1 WHERE user_name = $2',[price.getTableId(plan),user])
    // Link user to price plan - redirect back to
    // /price_plans/:id with a message saying the
    // user has been linked
    }
    else if(user === '' ){
        req.flash('error', 'Empty entry please enter username')
    }
    else{
       add
    }
    res.redirect("/price_plans/:id")
})

var PORT = process.env.PORT || 3030

app.listen(PORT,function(){
    console.log("App started on port:", PORT)
})