/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const { ObjectId, MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("project");
const coll = db.collection("books");
module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    const allBooks = await coll.find().toArray();
    res.json(allBooks);
    return;
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      const generateId = new ObjectId().toString();
      if(!title){
        res.send("missing required field title")
        return;
      }
      const doc = {
        comments: [],
        title: title,
        _id: generateId,
        commentcount: 0,
      }
      try{
      const result = coll.insertOne(doc);
      console.log(result)
      return res.json({
        comments: [],
        _id: generateId,
        title: title,
        commentcount: 0
      })
      }catch(e){
        console.error(e);
        res.send("error")
        return;
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
    try{
      const deleteAll = await coll.drop();
      res.send("complete delete successful")
      return;
    }catch(e){
     console.error(e);
     res.send("could not delete")
     return;
    }});



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const allBook = await coll.findOne({ _id: bookid });
      if(allBook){
     console.log(allBook)
     res.json({
       _id: allBook._id,
       title: allBook.title,
       comments: allBook.comments,
       commentcount: allBook.comments.length,
     })
     return;
      }else{
        res.json("no book exists")
        return;
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      const searchBook = await coll.findOne({_id: bookid});

      if(!comment){
        res.send("missing required field comment")
      }else{

      if(searchBook){
      searchBook.comments.push(comment)
      console.log(searchBook.comments)
      const savedBook = await coll.updateOne({_id: bookid}, {
        $set: {
          comments: searchBook.comments,
          commentcount: searchBook.comments.length,
        }
      })
      console.log(savedBook)

      res.json({
        _id: searchBook._id,
        title: searchBook.title,
        comments: searchBook.comments,
        commentcount: searchBook.comments.length,
      });
      return;
      }else{
        res.send("no book exists")
        return;
      }}
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      const allBook = await coll.findOne({ _id: bookid });
      if(allBook){
      const removeBook = await coll.deleteOne({_id: bookid})
      res.send("delete successful")
      return;
      }else {
        res.send("no book exists")
        return;
      }
    });
  
};