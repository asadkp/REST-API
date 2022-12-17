
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true
});

const articleSchema = mongoose.Schema ({
    title: String,
    content: String
});

const Article = mongoose.model("article", articleSchema);

app.route("/articles/:id")
    .get((req, res)=> {
        const titleSearch = req.params.id;
        Article.findOne({title: titleSearch}, (err, result)=> {
            if(err) {
                res.send(err);
            } else {
                res.send(result)
            }
        })
    })
    .put((req, res)=>{
        Article.replaceOne({title: req.params.id}, req.body, (err)=>{
            if(err){
                res.send(err)
            } else {
                res.send("Success")
            }
        })
    })
    .patch((req, res)=>{
        Article.updateOne({title: req.params.id}, req.body, (err)=>{
            if(err){
                res.send(err)
            } else {
                res.send("Success")
            }
        })
    })
    .delete((req, res)=>{
        Article.deleteOne({title: req.params.id}, (err)=>{
            if(err){
                res.send(err)
            } else {
                res.send("success")
            }
        })
    })

app.route("/articles")
    .get((req, res)=> {
        Article.find({}, (err, foundArticles)=>{
            if(foundArticles){
                res.send(foundArticles)
            }
        })
    })
    .post((req, res)=> {
        const newTitle = req.body.title;
        const newcontent = req.body.content;
        const newArticle = new Article ({
            title: newTitle,
            content: newcontent
        })
        newArticle.save();
    })
    .delete((req, res)=> {
        const newTitle = req.body.title;
        Article.deleteMany((err) => {
            if(err){
                res.send(err);
            } else {
                res.send("Success")
            }
        })
    });


// app.get("/articles/:id", (req, res)=> {
//     Article.find({req.params.id}, (err, foundArticles)=>{
//         if(foundArticles){
//             res.send(foundArticles)
//         }
//     })
// })

app.listen(3000, ()=>{
    console.log("App is running on port 3000");
})