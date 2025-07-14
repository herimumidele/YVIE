const fs = require('fs');

// Read the routes file
let content = fs.readFileSync('server/routes.ts', 'utf8');

// Replace all instances of req.user.claims.sub with req.user.id
content = content.replace(/req\.user\.claims\.sub/g, 'req.user.id');

// Write back the file
fs.writeFileSync('server/routes.ts', content);

console.log('Fixed all authentication references in routes.ts');