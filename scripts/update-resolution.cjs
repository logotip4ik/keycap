'use strict';

const fsp = require('node:fs/promises');
const path = require('node:path');

const pkgDir = path.join(process.cwd(), 'package.json');

const pkg = require(pkgDir);

const deps = Object.entries(pkg.dependencies).concat(Object.entries(pkg.devDependencies));

const patchVersion_RE = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}(-\w{1,5}\.[0-9]{1,3})?/;

async function updatePatches() {
  for (const [resolutionName, patch] of Object.entries(pkg.resolutions)) {
    const dep = deps.find(([name]) => resolutionName.includes(name));

    if (!dep) continue;

    const [resolutionVersion] = patch.match(patchVersion_RE);
    const normalizedDepVersion = dep[1].startsWith('^') ? dep[1].slice(1) : dep[1];

    if (resolutionVersion === normalizedDepVersion)
      continue;

    const newPatch = patch.replace(patchVersion_RE, normalizedDepVersion);

    pkg.resolutions[resolutionName] = newPatch;
  }

  const newPkg = `${JSON.stringify(pkg, null, 2)}\n`;

  await fsp.writeFile(pkgDir, newPkg);
}

updatePatches();
