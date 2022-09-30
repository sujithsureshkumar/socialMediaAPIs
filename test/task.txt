let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
//let server = require("../routes/api");
//const should = require('should');

const User = require('../models/User')
const Comment = require("../models/Comment");


//Assertion Style
//
//const should=
//chai.should();
var should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);


describe('Social media API testing', () => {

describe("GET /", () => {
 
    it("It should authenticate the token", (done) => {
        let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
        
        chai.request(server)
            .get("/api/authenticate")
            .set({ Authorization: `Bearer ${token}` })
            .end((err, response) => {
                should.exist(response);
                response.should.have.status(200);
                //response.body.should.be.a('object');
                //response.body.length.should.be.eq(7);
                console.log(response.body)
            done();
            });
    });

    it("It should add new user", (done) => {
        
        let user = {
            email: "mail@petsen.com",
            password: "123456"
        }

        chai.request(server)
            .post("/api/authenticate")
            .end((err, response) => {
                should.exist(response);
                response.should.have.status(200);
                response.body.should.be.a('object');
                console.log(response.body)
            done();
            });
    });

    it("It should GET follow the user with id", (done) => {
       
        let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
         
        const id="6332a84825daa3a1121b44ae"

        chai.request(server)
            .post("/api/follow/"+id)
            .set({ Authorization: `Bearer ${token}` })
            .end((err, response) => {
                should.exist(response);
                response.should.have.status(200);
            done();
            });
    });

    it("It should GET Unfollow the user with id", (done) => {
       
        let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
         
        id="6332a84825daa3a1121b44ae"

        chai.request(server)
            .post("/api/unfollow/"+id)
            .set({ Authorization: `Bearer ${token}` })
            .end((err, response) => {
                should.exist(response);
                response.should.have.status(200);
            done();
            });
    });

    it("It should GET the user profile", (done) => {
       
        let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
        
        

        chai.request(server)
            .get("/api/user/")
            .set({ Authorization: `Bearer ${token}` })
            .end((err, response) => {
                should.exist(response);
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('Username');
                response.body.should.have.property("Number of followings");
                response.body.should.have.property("Number of followers");

            done();
            });
    });

   /* it("delete the post with post id,404 if already deleted or not his post", (done) => {
       
        let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
         
        const postId ="6333defbcc3e243847cee90a"

        chai.request(server)
            .delete("/api/posts/"+postId)
            .set({ Authorization: `Bearer ${token}` })
            .end((err, response) => {
                should.exist(response);
                response.should.have.status(200);
            done();
            });
    });*/

    it("It should POST the like post", (done) => {
       
        let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
         
        const postId ="6332d85757eec429e0a77581"

        chai.request(server)
            .post("/api/like/"+postId)
            .set({ Authorization: `Bearer ${token}` })
            .end((err, response) => {
                should.exist(response);
                response.should.have.status(200);
            done();
            });
    });

    it("It should POST the unlike post", (done) => {
       
        let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
         
        const postId ="6332d85757eec429e0a77581"

        chai.request(server)
            .post("/api/unlike/"+postId)
            .set({ Authorization: `Bearer ${token}` })
            .end((err, response) => {
                should.exist(response);
                response.should.have.status(200);
            done();
            });
    });

   /* it("return 403 error if comment is already added by the user", (done) => {
       
        let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
         
        const postId ="6332d7d884be9dff8a7ef535"
        let comments ={
            "comment" :"good"
        }

        chai.request(server)
            .post("/api/comment/"+postId)
            .set({ Authorization: `Bearer ${token}` })
            .send(comments)
            .end((err, response) => {
                should.exist(response);
                response.should.have.status(200);
            done();
            });
    });  */

    it("Get return post by id", (done) => {
       
        let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
         
        const postId ="6332d7d884be9dff8a7ef535"
        

        chai.request(server)
            .get("/api/posts/"+postId)
            .set({ Authorization: `Bearer ${token}` })
            .end((err, response) => {
                should.exist(response);
                response.should.have.status(200);
                response.body.should.have.property("Number of Comments");
                response.body.should.have.property("Number of Likes");
            done();
            });
    });

    it("Get return all post by authenticated user", (done) => {
       
        let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
        
        

        chai.request(server)
            .get("/api/all_posts")
            .set({ Authorization: `Bearer ${token}` })
            .end((err, response) => {
                should.exist(response);
                response.should.have.status(200);
            done();
            });
    });
   
    



      /* it("It should GET all the user", (done) => {
        //chai.request('http://localhost:8080')
        chai.request(server)
            .get("/api")
            .end((err, response) => {
                should.exist(response);
                //response.should.have.status(200);
                //response.body.should.be.a('object');
                response.body.length.should.be.eq(7);
                //console.log(response.body)
            done();
            });
    });*/


});


});

