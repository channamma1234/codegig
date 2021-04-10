const express=require('express');
const router=express.Router();
const db=require('../config/database');
const Gig=require('../models/Gig');
const sequelize=require('sequelize');
const Op=sequelize.Op;

//get a gig
router.get('/',(req,res)=>
Gig.findAll()
 .then(data => data.map((el)=>el.toJSON())).then(gigs=>{ res.render('gigs',{
     gigs,  
});
})
.catch(err=>console.log(err)));
//display add gig form
router.get('/add', (req, res)=>res.render('add'));
 
//add a gig
router.post('/add',(req,res)=>{
let {title, technologies, budget, description, contact_email}=req.body;
let errors= [];

//validate fields
if(!title){
    errors.push({text:'please add a title'});
}
if(!technologies){
    errors.push({text:'please add some technologies'});
}
if(!description){
    errors.push({text:'please add description'});
}
if(!contact_email){
    errors.push({text:'please add cntact email'});
}
//check for errors
if(errors.length>0){
    res.render('add', {
        errors,
        title, 
        technologies, 
        budget, 
        description, 
        contact_email
    });
}else{
    if(!budget){
        budget='unknown';
    }else{
        budget=`$${budget}`;
        }
technologies=technologies.toLowerCase().replace(/, /g, ',');
//insert into tables
Gig.create({
    title,
    technologies,
    budget,
    description,
    contact_email
})
.then(gig=>res.redirect('/gigs'))
.catch(err=>console.log(err));
}
});

// search for gig
router.get('/search', (req, res)=>{
    let { term } = req.query;
term = term.toLowerCase();

Gig.findAll({where: { technologies: { [Op.like]: '%' + term +'%' } } })
.then(data => data.map((el)=>el.toJSON())).then(gigs=>res.render('gigs',{ gigs}))
    .catch(err=>console.log(err));
});

 module.exports=router;