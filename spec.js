const request = require('supertest');
const assert = require('Chai').assert;
const fs = require('fs');
const MarkdownIt = require('markdown-it'),
md = new MarkdownIt();
const path = require("path");

const base_url = 'http://localhost:3000';

//Get all updated files for testing
let files = [];
function throughDirectory(directory) {
    fs.readdirSync(directory).forEach(File => {
        const absolute = path.join(directory, File);
        if (fs.statSync(absolute).isDirectory()) return throughDirectory(absolute);
        else return files.push(absolute);
    });
}
throughDirectory('content');
let testPath = files[1].replace('content','').replace('index.md');

describe('server response', function () {

      it('should return 200 status', function() {
      return request(base_url)
        .get('/about-page')
        .then(function(response){
            assert.equal(response.status, 200)
        })
    });

    it('should return 404 for missing routes', function() {
        return request(base_url)
        .get('/incorrect')
        .then(function(response){
            assert.equal(response.status, 404)
        })
    });

    it('should return correct body', function() {
        return request(base_url)
        .get(testPath)
        .then(function(response){
            fs.readFile(files[1], 'utf8', function(err, content){
                assert.equal(response.body, content)
            });
            
        })
    });
});

