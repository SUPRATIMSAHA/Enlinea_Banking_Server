const express= require('express');
const db= require('../database').db;
const users= require('../database').users;
const friends= require('../database').friends;
const notification= require('../database').notification;
const path= require('path');
const route= express.Router();

route.post('/status',(req,res)=>{

    if(req.user && req.user.message != "deactivated"){

        friends.findOne({
            where: {
                username: req.user.username,
                requested_user: req.body.username
            }
        }).then((user)=>{
            
            if(!user){
                console.log('requested user for friend request status, not found');
                res.send(undefined); //if no friend request has been sent yet
            }

            console.log('requested user for friend request status, found');
            res.send(user); // sending friend request status such as pending or accepted
        })

    } else {
        res.sendFile(path.join(__dirname,'..','public','login','login.html'));
    }
})

route.post('/request',(req,res)=>{

    if(req.user && req.user.message != "deactivated"){

        friends.create({
            username: req.user.username,
            requested_user: req.body.username,
            status: pending
        }).then((user)=>{
            if (!user){
                res.send(undefined);
            }

            console.log('friend request successfully sent');
            console.log('sending notification to requested user');

            //send notification to requested user
            notification.create({
                username: req.body.username,
                from: req.user.username,
                subject: "Friend Request",
                msg: `<a href="/friend_request/accept/${req.user.username}">Accept</a> or <a href="/friend_request/reject/${req.user.username}">Reject</a>`
            })

            //use socket to send live notification to online users
            //code here

            res.send(user);

        }).catch((err)=>{

            console.log(err);
            res.send(undefined);
        })

    } else {
        res.sendFile(path.join(__dirname,'..','public','login','login.html'));
    }
})

route.get('/accept/:username',(req,res)=>{
    if(req.user && req.user.message != "deactivated"){

        console.log('accepting friend request if possbile');
        friends.findOne({
            where: {
                username: req.params.username,
                requested_user: req.user.username
            }
        }).then((user)=>{

            if(!user){
                console.log('No friend request');
                res.redirect('back');
            }

            if(user.status=="pending"){
                
                friends.update({
                    status: "accepted"
                }, {
                    where: {
                        username: req.params.username,
                        requested_user: req.user.username
                    }
                }).catch((err)=>{
                    console.log(err);
                    res.redirect('back');
                })
            }

            res.redirect('back');
        })

    } else {
        res.sendFile(path.join(__dirname,'..','public','login','login.html'));
    }
})


route.get('/reject/:username',(req,res)=>{
    if(req.user && req.user.message != "deactivated"){

        console.log('rejecting friend request if possible');
        friends.findOne({
            where: {
                username: req.params.username,
                requested_user: req.user.username
            }
        }).then((user)=>{

            if(!user){
                console.log('No friend request');
                res.redirect('back');
            }

            if(user.status=="pending"){
                
                friends.destroy({
                    where: {
                        username: req.params.username,
                        requested_user: req.user.username
                    }
                }).catch((err)=>{
                    console.log(err);
                    res.redirect('back');
                })
            }

            res.redirect('back');
        })

    } else {
        res.sendFile(path.join(__dirname,'..','public','login','login.html'));
    }
})


module.exports={
    route
}