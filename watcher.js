import fs from 'node:fs';

// create file watchers for public directory
export function startWatcher() {
    let timerId;
    fs.watch('./public', (eventType, filename) => {
        clearTimeout(timerId);

        timerId = setTimeout(() => {
            if (eventType === 'change') {
                console.log(filename + " was changed");
            }
        }, 100);
    });
}
