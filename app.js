//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const { identity } = require("lodash");

const homeStartingContent = "Welcome to my Blog Website. To write a blog ";
const aboutContent =
  "I am a 3rd year student at GGSIPU, New Delhi. I am currently pursuing B.Tech. in Computer Science with an inclination towards web development.";
const contactContent = "Email: kshitijkumar176@gmail.com";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  // const requestedTitle = _.lowerCase(req.params.postName);

  // posts.forEach(function (post) {
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content,
  //     });
  //   }
  // });

  const requestedPostId = req.params.postId;

  // let deleteRecord = false;

  // var onClicked = function () {
  //   console.log("clicked me");
  //   deleteRecord = true;
  // };
  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      id: post._id,
      title: post.title,
      content: post.content,
    });
  });

  //   deleteRecord &&
  //     mongoose
  //       .model("Post")
  //       .remove({ _id: requestedPostId }, function (err, response) {
  //         if (!err) {
  //           res.redirect("/");
  //         }
  //       });
  //   // Post.deleteOne(
  //   //   { _id: requestedPostId, onClicked: onClicked },
  //   //   function (err, response) {
  //   //     if (err) {
  //   //       response.render("delete");
  //   //     } else {
  //   //       console.log(err);
  //   //     }
  //   //   }
  //   // );
  //   deleteRecord = false;
});

app.get("/post/delete/:id", function (req, res) {
  const postToDeleteId = req.params.id;

  Post.deleteOne({ _id: postToDeleteId }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully");
});
