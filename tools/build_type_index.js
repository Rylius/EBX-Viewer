const fs = require('fs');
const path = require('path');

const yamlSafeLoad = require('js-yaml').safeLoad;

const output = {
    links: {
        fb: 'https://docs.veniceunleashed.net/vext/ref/fb/%s/',
        shared: 'https://docs.veniceunleashed.net/vext/ref/shared/type/%s/',
    },
    types: {},
};

function parseDir(dir, source) {
    fs.readdirSync(dir).forEach(file => {
        const yaml = yamlSafeLoad(fs.readFileSync(`${dir}/${file}`, 'utf8'));

        output.types[yaml.name] = source;
    });
}

parseDir('./data/vu-docs/types/fb/', 'fb');
parseDir('./data/vu-docs/types/shared/type/', 'shared');

fs.writeFileSync('./data/types.json', JSON.stringify(output));
