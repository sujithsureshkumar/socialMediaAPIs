let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
const User = require('../models/User')
const Comment = require("../models/Comment");
const Post = require("../models/Post");
var should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

describe("GET /", () => {
    let token;
    let postId;

    before("User account Creation", (done) => {
        
        let newUser = {
            username:"sujithsuresh",
            email: "sujithsuresh@gmail.com",
            password: "sujith"
        }

        chai.request(server)
            .post("/api")
            .send(newUser)
            .end((err, response) => {
                should.exist(response);
                response.should.have.status(200);
                response.body.should.be.a('object');
                console.log(response.body)
            done();
            });
    });
    
    before("User successfully login", (done) => {
        
        let user = {
            email: "sujithsuresh@gmail.com",
            password: "sujith"
        }

        chai.request(server)
            .post("/api/authenticate")
            .send(user)
            .end((err, response) => {
                should.exist(response);
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('accessToken');
                console.log(response.body)
                token =response.body.accessToken
                console.log(token)
            done();
            });
    });

 
    it("user makes a successfull post", (done) => {
       
        // let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
         
         const post={
            "title":"Hai I am sujith",
            "description":"hai,please like my post"
            }
 
         chai.request(server)
             .post("/api/posts")
             .set({ Authorization: `Bearer ${token}` })
             .send(post)
             .end((err, response) => {
                 should.exist(response);
                 response.should.have.status(200);
                 console.log(response.body)
                 postId=response.body['Post-ID']
                 console.log(postId)
             done();
             });
     });

     it("user trying a post with tittle field missing-failed", (done) => {
       
        // let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
         
         const post={
            "description":"hai, sujith please like my post"
            }
 
         chai.request(server)
             .post("/api/posts")
             .set({ Authorization: `Bearer ${token}` })
             .send(post)
             .end((err, response) => {
                 should.exist(response);
                 response.should.have.status(500);
             done();
             });
     });

     it("user make a successfull comment", (done) => {
       
        // let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
         
        const comments ={
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
     });

     it("user trying a comment with comment field missing-failed", (done) => {
       
        // let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
         
        
 
         chai.request(server)
             .post("/api/comment"+postId)
             .set({ Authorization: `Bearer ${token}` })
             .end((err, response) => {
                 should.exist(response);
                 response.should.have.status(404);
             done();
             });
     });


     it("Get return all post by authenticated user", (done) => {
       
        // let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
         
         
 
         chai.request(server)
             .get("/api/all_posts")
             .set({ Authorization: `Bearer ${token}` })
             .end((err, response) => {
                 should.exist(response);
                 response.should.have.status(200);
                 //console.log(response.body)
             done();
             });
     });


     it("Missing JWT token ,User acess fail", (done) => {
       
        // let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmplZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiJzYW5qIiwiaWQiOiI2MzMzZGVmYmNjM2UyNDM4NDdjZWU5MGEiLCJpYXQiOjE2NjQzNDQ5NzV9.0PBgp3T-atk_OYzsn5QOW3T7dlXO9fcuL85pS8sS9zQ";
         chai.request(server)
             .get("/api/all_posts")
             .end((err, response) => {
                 should.exist(response);
                 response.should.have.status(401);
                 //console.log(response.body)
             done();
             });
     });
});