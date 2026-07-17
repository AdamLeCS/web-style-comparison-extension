import http from 'node:http';
import fs from 'node:fs';

const server = http.createServer((req, res) => {

    fs.readFile('./test.html', (err, data) => {
        if (err) {
            console.log("Error occured: ", err);
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

server.listen(3000);