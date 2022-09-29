require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const jwt = require('jsonwebtoken')


//getting all users
router.get('/', async(req,res) => {
    try{
           const user = await User.find()
           res.json(user)
    }catch(err){
        res.send('Error ' + err)
    }
})


//token verify
router.get('/authenticate', authenticateToken, (req, res) => {
    res.json("token authenticated "+req.user.email)
  })

  //authenticate function
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }


//creating a user
router.post('/', async(req,res) => {
    const user = new User(req.body)
   try{
        const a1 =  await user.save() 
        res.json(a1)
    }catch(err){
        res.send('Error ' + err)
    }
})


//login
router.post('/authenticate', async(req,res) => {
    const email =req.body.email
    const password =req.body.password
    //const users= {email:email,password:password}
    try{
        const user = await User.findOne({email:req.body.email})
        const users= {email:email,password:password,id:user._id}
        const accessToken = jwt.sign(users, process.env.ACCESS_TOKEN_SECRET)
        res.json({ accessToken: accessToken})
    }catch(err){
        res.send('Error ' + err)
    } 
})


  //follow a user 
  router.post("/follow/:id",authenticateToken,async (req, res) => {
    if (req.user.id!== req.params.id) {
      try {
        const users = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);
        if (!users.followers.includes(req.user.id)) {
          await users.updateOne({ $push: { followers: req.user.id} });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
  });

//Unfollow a User
  router.post("/unfollow/:id",authenticateToken, async (req, res) => {
    if (req.user.id !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);
        if (user.followers.includes(req.user.id)) {
          await user.updateOne({ $pull: { followers: req.user.id } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });


//view user profile
  router.get('/user',authenticateToken, async(req,res) => {
    try{
          const currentUser = await User.findById(req.user.id);
          const follower =currentUser.followers.length;
          const following =currentUser.followings.length;
          const profile={Username:currentUser.username,"Number of followers":follower,"Number of followings":following}
           res.json(profile)
    }catch(err){
        res.send('Error ' + err)
    }
})

//Create a Post
router.post("/posts",authenticateToken, async (req, res) => {
  req.body.userId=req.user.id
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    const result = {"Post-ID":savedPost._id,
                    "Title":savedPost.title,
                     "Description":savedPost.description,
                    "Created Time":savedPost.createdAt}
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/posts/:id",authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.user.id) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like a post
router.post("/like/:id",authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      res.status(200).json("The post has been liked");
    } else {
      res.status(403).json("The post is already liked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// unlike 
router.post("/unlike/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.user.id)) {
      await post.updateOne({ $pull: { likes: req.user.id } });
      res.status(200).json("The post has been disliked");
    } else {
      res.status(403).json("The post is already disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//comment
router.post("/comment/:id",authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.users.includes(req.user.id)) {
      await post.updateOne({ $push: { users: req.user.id } });
      req.body.userId=req.user.id
      req.body.postId=req.params.id
      const newComment = new Comment(req.body);
      const savedComment = await newComment.save();
      await post.updateOne({ $push: { comments: savedComment._id } });
      res.status(200).json(savedComment._id);
    } else {
      res.status(403).json("You already wrote comment");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/getpost', async(req,res) => {
  try{
         const user = await Post.find()
         res.json(user)
  }catch(err){
      res.send('Error ' + err)
  }
})


router.get('/getcomment', async(req,res) => {
  try{
         const user = await Comment.find()
         res.json(user)
  }catch(err){
      res.send('Error ' + err)
  }
})


router.get('/posts/:id', async(req,res) => {
  try{
        const post = await Post.findById(req.params.id)
        const likes =post.likes.length;
        const comments =post.comments.length;
        const postSummary={Title:post.title,
                       Description:post.description,
                      "Number of Likes":likes,
                      "Number of Comments":comments}
         res.json(postSummary)
  }catch(err){
      res.send('Error ' + err)
  }
})

router.get('/all_posts',authenticateToken, async(req,res) => {
  try{
    const allPosts = await Post
    //.find()
    .aggregate([
      { $match : { "userId" : req.user.id} },
      { $sort : { "createdAt" : -1 }},
      { 
        $lookup:
     {
       from: "comments",
       localField: "comments",
       foreignField: "_id",
       as: "comments"
     },
     
       },
       {
        $project: {"_id":0,"id":"$_id",
                     "title":1,"desc":"$description", 
                      "create_at":"$createdAt",
                      likes: {$size: "$likes"},
                       "comments.comment" :1},
       }
    ])
    // item: 1,
    //.select('createdAt date title description').sort({'timestamp': -1})
    
    //.populate({path:'comments',select:['comment']})
    res.json(allPosts)
}catch(err){
 res.send('Error ' + err)
}
})

module.exports = router