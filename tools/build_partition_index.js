const glob = require('glob');
const fs = require('fs');
const path = require('path');

function clean(dir) {
    return dir.replace(/\/$/, '');
}

glob.sync('*/', {cwd: './static'}).forEach(directory => {
    const game = clean(directory);
    console.log(`Building partition index for ${game}`);

    const data = {};

    glob.sync('**/*', {cwd: './static/' + directory + '/ebx'}).forEach(file => {
        if (path.extname(file) !== '.json') {
            return;
        }

        const json = JSON.parse(fs.readFileSync(`./static/${directory}/ebx/${file}`, 'utf8'));
        if (!json || !json.$guid) {
            return;
        }
        data[json.$guid.toUpperCase()] = file.substring(0, file.length - 5);
    });

    fs.writeFileSync(`./static/${game}/partitions.json`, JSON.stringify(data), err => {
        if (err) {
            console.error(err);
        }
    });
});
