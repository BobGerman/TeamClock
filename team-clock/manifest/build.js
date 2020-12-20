const AdmZip = require('adm-zip');
const zip = new AdmZip();

zip.addLocalFile('manifest/manifest.json');
zip.addLocalFile('manifest/TeamClock32.png');
zip.addLocalFile('manifest/TeamClock192.png');

zip.writeZip('manifest/TeamClock.zip');