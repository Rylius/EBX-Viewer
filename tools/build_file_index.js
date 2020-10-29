const glob = require('glob');
const fs = require('fs');
const path = require('path');

function clean(dir) {
    return dir.replace(/\/$/, '');
}

glob.sync('*/', {cwd: './static'}).forEach(directory => {
    const game = clean(directory);
    console.log(`Building file index for ${game}`);

    const data = {
        tree: {},
        files: {},
    };

    glob.sync('**/*', {cwd: './static/' + directory + '/ebx'}).forEach(file => {
        if (path.extname(file) === '.json') {
            const dir = path.dirname(file);
            if (!data.files[dir]) {
                data.files[dir] = [];
            }
            data.files[dir].push(path.basename(file));
            return;
        }

        const parts = file.split('/');
        let currentPath = '';
        let currentData = data.tree;
        // console.log(file);
        for (const part of parts) {
            currentPath += part;
            currentPath += '/';

            if (!currentData[part]) {
                currentData[part] = {};
            }

            currentData = currentData[part];
        }
    });

    // glob.sync('**/*.json', {cwd: './data/' + directory}).forEach(file => {
    //     data.push(file);
    // });

    fs.writeFileSync(`./static/${game}/files.json`, JSON.stringify(data), err => {
        if (err) {
            console.error(err);
        }
    });

});
