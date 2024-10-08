/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
    chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        
        // Check if there are any books in the array
        if (res.body.length > 0) {
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
        } else {
          console.warn('No books found in the response');
        }
        
        done();
      });
  });
  
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: 'a'})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, '_id')
          assert.property(res.body, 'title')
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200)
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
         .get('/api/books')
         .end((err, res) => {
           assert.equal(res.status, 200)
           assert.isArray(res.body)
           done();
      });      
    })
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .post('/api/books')
        .send({title: 'a'})
        .end((res, err) => {
       chai.request(server)
       .get('/api/books/6701720c9124758de63f7dad')
       .end((err, res) => {
        assert.equal(res.body, "no book exists")
        done();
       })})
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .post('/api/books')
        .send({title: 'a'})
        .end((err, res) => {
        chai.request(server)
       .get(`/api/books/${res.body._id}`)
        assert.equal(res.status, 200)
        done();
       })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post(`/api/books`)
        .send({title: 'a'})
        .end((err, res) => {
          chai.request(server)
          .post(`/api/books/${res.body._id}`)
          .send({comment: 'a', _id: res.body_id})
          .end((err, res) => {
          assert.property(res.body, '_id')
          assert.property(res.body, 'title')
          assert.equal(res.body.title, "a")
          done();
        })})
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post('/api/books/6701720c9124758de63f7dab')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200)
          done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/6701720c9124758de63f7dad')
        .send({comment: 'a'})
        .end((err, res) => {
          assert.equal(res.status, 200)
          done();
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .post('/api/books')
        .send({title: 'a'})
        .end((err, res) => {
          chai.request(server)
          .delete(`/api/books/${res.body._id}`)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'delete successful')
            done();
          })
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .post('/api/books')
        .send({title: 'a'})
        .end((err, res) => {
        chai.request(server)
        .delete('/api/books/507f191e810c19729de860e8')
        .end((err, res) => {
          assert.equal(res.text, "no book exists")
          done();
        })
        })
      });

    });

  });

});