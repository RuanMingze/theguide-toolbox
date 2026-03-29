const fs = require('fs');
const path = require('path');

// Auto-generated version compatibility patch for next-on-pages
const packageJsonPath = path.join(__dirname, '..', 'node_modules', '@cloudflare', 'next-on-pages', 'package.json');

try {
  let content = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(content);
  
  // Modify the Next.js version constraint in peerDependencies
  if (packageJson.peerDependencies && packageJson.peerDependencies.next) {
    packageJson.peerDependencies.next = '>=14.3.0';
    console.log('Successfully updated Next.js version constraint in peerDependencies to >=14.3.0');
  }
  
  // Write the changes back to the file
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, '\t'), 'utf8');
  console.log('Compatibility patch for @cloudflare/next-on-pages applied successfully');
} catch (e) {
  console.error('Failed to apply patch: ', e.message);
}