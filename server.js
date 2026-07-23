import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { startWatcher } from './watcher.js'

const script = '<script src="inject-script.js" id="inject-script"></script>';

const server = http.createServer((req, res) => {
    const url = req.url;
    let filePath;
    // routing
    if (url === '/') {
        filePath = "./public/index.html";
    } else if (url === '/inject-script.js') {
        filePath = "./inject-script.js";
    } else {
        filePath = "./public/" + url;
    }

    // first, determine what kind of file type is being requested
    const fileType = getMimeType(filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            // console.log("Error occured: ", err);
            res.writeHead(404);
            res.end("404 not found");
            return;
        }
        // successful file read, create correct headers and return file data
        res.writeHead(200, fileType);

        // inject script if html
        if (fileType === 'text/html') {
            data = data.toString().replace("</body>", `${script}</body>`);
        }
        res.end(data);
    });

});
// makeEditorFile('./public/test.css', './public/copy.css');
server.listen(3000);

// startWatcher();


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

function makeEditorFile(fileToCopy, copyName) {
    fs.copyFile(fileToCopy, copyName, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('file copied');
    });
}