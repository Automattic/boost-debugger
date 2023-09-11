const fsPromises = require('fs/promises');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

main();

async function main() {
  if (fs.existsSync('./dist')) {
    await fsPromises.rm('./dist', { recursive: true });
  }
  await fsPromises.mkdir('./dist');
  await exec('npm run build -- --prod');
  console.log('Done');
}
