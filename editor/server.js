var http = require('http');
var fs = require('fs');
var path = require('path');

var extensions = {
        "js":"text/javascript",
        "css":"text/css",
        "png":"image/png",
        "gif":"image/gif",
        "htm":"text/html",
        "html":"text/html",
        "jpg":"image/jpg",                    
        "jpeg":"image/jpg",                           
        "pdf":"application/pdf",                        
        "mp3":"audio/mp3",           
        "zip":"application/zip",          
        "rar":"application/rar"
};
 
http.createServer(function (request, response) {
     
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';
    console.log('REQUEST',filePath);
    
    var extname = path.extname(filePath).replace('.','');
    
    var contentType = extensions[extname] || 'text/html';
     
    fs.exists(filePath, function(exists) {
     
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
     
}).listen(7112);
 
console.log('Server running at http://127.0.0.1:7112/');
