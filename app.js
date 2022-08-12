const express = require('express');
const fs = require('fs')
const MarkdownIt = require('markdown-it'),
md = new MarkdownIt();
const mustacheExpress = require('mustache-express');
const app = express();
const path = require("path");

let files  = [];

app.engine('html', mustacheExpress());   

app.set('view engine', 'html');  
app.set('views', __dirname);

app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

//Get all md files
throughDirectory("content");

//Create a route for each md file
files.forEach(function(filePath){
    let path = filePath.replace('content', '').replace('index.md','')
     app.get(path, function (req, res) {
            fs.readFile('./' + filePath, 'utf8', (err, content) => {
               if (err){
                throw (err)
               }

                let htmlContent = md.render(content)
                res.render('template', {content: htmlContent});

            });
        });

})

app.listen(3000, function () {
    console.log('listening on port ', 3000);
});
 
//function to get all the md filepaths in a folder. 
function throughDirectory(directory) {
    fs.readdirSync(directory).forEach(File => {
        const absolute = path.join(directory, File);
        if (fs.statSync(absolute).isDirectory()) return throughDirectory(absolute);
        else return files.push(absolute);
    });
}

module.exports = app;