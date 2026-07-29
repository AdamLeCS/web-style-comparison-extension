import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { startWatcher } from './watcher.js'
import express from 'express';

const script = '<script src="inject-script.js" id="inject-script"></script>';
const mainHtmlPath = "./public/index.html";

const server = http.createServer((req, res) => {
    const url = req.url;
    let filePath;
    // routing
    if (url === '/') {
        filePath = "./public/index.html";
    } else if (url === '/inject-script.js') {
        filePath = './inject-script.js';
    } else if (url === '/create-css-copy' && req.method === 'POST') {
        // handle frontend requests here
        // these req methods are like event listeners, just waiting for data to come or the end signal to be sent
        let body = "";
        req.on('data', chunk => { // req.on data is for getting the input chunk by chunk
            body += chunk;
        });
        req.on('end', async () => { // runs when the data stream has completed
            const data = JSON.parse(body);
            const responseData = await createCSSCopies(data.htmlFilePath);
            console.log(responseData);
            res.writeHead(200);

            res.end(JSON.stringify(responseData));
        });
        return;
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

// create a backend app using express for frontend and backend connections

/*
const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/create-css-copy", async (req, res) => {
    try {
        // get the file names as a js object after copying files
        const result = await createCSSCopies(req.body.htmlFilePath);
        res.json(result); // send the js object as json response
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to copy css files"
        });
    }
}); */

async function createCSSCopies(htmlFilePath) {
    // read the file into a variable
    const mainHtmlFile = await fs.promises.readFile(htmlFilePath, "utf8");
    
    // use a regex to get the css relative file path from the html file
    const cssRelativePath = mainHtmlFile.match(/href="([^"']+)"/);

    // with that, you can comebine the path of the html file directory with the relative css path
    // to get the path to the css file
    const cssFilePath = path.resolve(path.dirname(htmlFilePath), cssRelativePath[1]);
    
    // create the name of the copied file
    const extension = path.extname(cssFilePath);
    const baseName = path.basename(cssFilePath, extension);
    const cssOriginalFileName = `${baseName}${extension}`;
    const cssCopyFileName = `${baseName}2${extension}`;

    // create new file
    await fs.promises.copyFile(cssFilePath, cssCopyFileName);

    return {
        original: cssOriginalFileName,
        copy: cssCopyFileName
    }
}

