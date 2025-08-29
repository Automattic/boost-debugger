const fs = require('fs-extra');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

main();

async function main() {
  // Build the extension first
  await exec('npm run build:prod');

  // Create Firefox build directory
  const firefoxDir = 'build-firefox';
  if (fs.existsSync(firefoxDir)) {
    await fs.rm(firefoxDir, { recursive: true });
  }
  await fs.mkdir(firefoxDir);

  // Copy all files
  const filesToCopy = ['_locales', 'dist', 'images', 'public'];
  for (const filename of filesToCopy) {
    if (fs.existsSync(filename)) {
      await fs.copy(filename, `${firefoxDir}/${filename}`);
    }
  }

  // Read original manifest and convert to Firefox V2
  const manifest = await fs.readJSON('manifest.json');
  const firefoxManifest = {
    manifest_version: 2,
    name: manifest.name,
    description: manifest.description,
    version: manifest.version,
    default_locale: manifest.default_locale,
    icons: manifest.icons,
    background: {
      scripts: [manifest.background.service_worker || "dist/background.js"],
      persistent: false
    },
    permissions: [
      ...manifest.permissions,
      ...(manifest.host_permissions || [])
    ],
    content_scripts: manifest.content_scripts,
    browser_action: {
      default_popup: manifest.action?.default_popup,
      default_icon: manifest.action?.default_icon
    },
    options_ui: manifest.options_ui
  };

  // Write Firefox manifest
  await fs.writeJSON(`${firefoxDir}/manifest.json`, firefoxManifest, { spaces: 2 });
  
  console.log('✅ Firefox build created in build-firefox/ directory');
  console.log('📁 Load build-firefox/ directory in Firefox');
}
