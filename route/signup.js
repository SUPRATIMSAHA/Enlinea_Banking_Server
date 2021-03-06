const express= require('express');
const users= require('../database').users;
const account_status= require('../database').account_status;
const route= express.Router();

route.post('/getin',(req,res)=>{
    users.create({
        username: req.body.username,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_id: null,
        mobile_number: null,
        DOB: null,
        gender: null,
        profile_picture: '000.jpg'
    }).then((created_user)=>{
        if(created_user){

            account_status.create({
                username: req.body.username,
                status: "active"
            }).then((status_details)=>{
                res.send(created_user);
            }).catch((err)=>{
                console.log(err);
                res.send(undefined);
            })

        } else {
            res.send(undefined);
        }
    }).catch((err)=>{
        res.send(undefined);
    })

})


module.exports= {
    route
};