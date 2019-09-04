const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const User = require("../../models/User");

//@route  Get api/posts
//@desc   Create a post
//@access Private

router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No such ID exists" });
    }
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    //check if the post is owned by them
    // post.user is an Object, req.user.id is String
    console.log(typeof post.user, " X ", typeof req.user.id);
    if (post.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "You are not authorized" });
    }

    await post.remove();

    res.json({ msg: "Post has been removed" });
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No such ID exists" });
    }
    res.status(500).send("Server Error");
  }
});

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);

    //check if there's already a like
    if (post.likes.filter(x => x.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if there's already a like
    if (
      post.likes.filter(x => x.user.toString() === req.user.id).length === 0
    ) {
      return res.status(400).json({ msg: "You have not liked this post" });
    }

    //Get remove index
    const removeIndex = post.likes.indexOf(
      mongoose.Types.ObjectId(req.params.id)
    );
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/comments/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

router.delete("/comments/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ "comments._id": req.params.id });
    if (!post) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    console.log(post);

    //get the index of the comment
    const comIndex = post.comments.findIndex(
      x => x.id.toString() === req.params.id
    );

    //check if the comment is their's
    console.log(post.comments[comIndex], "____________");
    if (post.comments[comIndex].user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "You are not authorized" });
    }
    //remove the comment from the comments array
    post.comments.splice(comIndex, 1);

    //save
    await post.save();

    res.json({ msg: "Comment has been removed" });
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No such ID exists" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
