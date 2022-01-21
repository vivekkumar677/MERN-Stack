const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from stirng to objectId for the _id.
const objectId = require("mongodb").ObjectId;

// This section will help you to get a list of all the records.
recordRoutes.route("./record").get(function(req, res){
    let db_connect = dbo.getDb("employees");
    db_connect
    .collection("records")
    .find({})
    .toArray(function(err, result){
        if(err) throw err;
        res.json(result);
    });
});

// This will help you to get single record by id
recordRoutes.route("/record:/id").get(function(req, res){
    let db_connect = dbo.getDb();
    let myquery = {_id: ObjectId(req.params.id)};
    db_connect
    .collection("records")
    .findOne(myquery, function(err, result){
        if(err) throw err;
        res.json(result);
    });
});

// This section will help you to create new record.
recordRoutes.route("/record/add").post(function(req, response){
    let db_connect = dbo.getDb();
    let myObj = {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
    };
    db_connect
    .collection("records")
    .insertOne(myObj, function(err, res){
        if(err) throw err;
        response.json(res);
    });
});

// This section will help you to update a record by id.
recordRoutes.route("/update/:id").post(function(req, response){
    let db_connect = dbo.getDb();
    let myquery = {_id:ObjectId(req.params.id)};
    let newValues = {
        $set:{
            name: req.body.name,
            position: req.body.position,
            level: req.body.level,
        },
    };
    db_connect
    .collection("records")
    .updateOne(myquery, newValues, function(err, res){
        if(err) throw err;
        console.log(res);
    });
});

// This section will help you to delete the record.
recordRoutes.route("/:id").delete((req, response)=>{
    let db_connect = dbo.getDb();
    let myquery = {_id: ObjectId(req.params.id)};
    db_connect
    .collection("records")
    .deleteOne(myquery, function(err, obj){
        if(err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
});

module.exports = recordRoutes;