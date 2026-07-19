import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { startWatcher } from './watcher.js'

const server = http.createServer((req, res) => {
    const url = req.url;
    const filePath = (url === '/' ? "./public/index.html" : "./public/" + url);

    // first, determine what kind of file type is being requested
    const fileType = getMimeType(filePath);
    let fileExists = true;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log("Error occured: ", err);
            res.writeHead(404);
            res.end("404 not found");
            fileExists = false;
            return;
        }
        // successful file read, create correct headers and return file data
        res.writeHead(200, fileType);
        res.end(data);
    });

});

server.listen(3000);

startWatcher();


function getFilePath(url) {
    if (url === '/') {
        return "./index.html";
    } else {
        return url;
    }
}

const MIMES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".webp": "image/webp"
}

function getMimeType(filePath) {
    const extension = path.extname(filePath);

    if (!(extension in MIMES)) {
        return "application/octet-stream";
    }
    return MIMES[extension];
    
}