const AdmZip = require('adm-zip');
const zip = new AdmZip();

// Configure the specified environment path
const dotenv = require('dotenv');
let envFile = '.env';
if (process.argv.length >= 3) {
    envFile = process.argv[2];
}
console.log(`Reading manifest values from ${envFile}`)
const result = dotenv.config({ path: envFile });

const fs = require('fs');
fs.readFile('manifest/manifest.template.json', 'utf-8', (err, data) => {
    if (err) throw err;

    Object.keys(process.env).forEach((key) => {
        if (key.indexOf('REACT_APP_MANIFEST_') === 0) {
            let shortKey = key.replace('REACT_APP_MANIFEST_','');
            data = data.split(`<${shortKey}>`).join(process.env[key]);
            console.log (`Inserted ${shortKey} value of ${process.env[key]}`);
        }
    });
    
    const packageName = process.env["REACT_APP_MANIFEST_NAME"] || "TeamClock";
    const icon32 = process.env["REACT_APP_MANIFEST_ICON_32"] || "TeamClock32.png";
    const icon192 = process.env["REACT_APP_MANIFEST_ICON_192"] || "TeamClock192.png";
    fs.writeFile('manifest/manifest.json', data, 'utf-8', (err, data) => {
        if (err) throw err;
        zip.addLocalFile(`manifest/manifest.json`);
        zip.addLocalFile(`manifest/${icon32}`);
        zip.addLocalFile(`manifest/${icon192}`);

        zip.writeZip(`manifest/${packageName}.zip`);
        console.log(`Created app package manifest/${packageName}.zip`);
    });
});


