'use strict';

const fsp = require('node:fs/promises');

const pkgPath = '../package.json';
const pkg = require(pkgPath);

const deps = Object.entries(pkg.dependencies).concat(Object.entries(pkg.devDependencies));

const patchVersion_RE = /\d{1,3}\.\d{1,3}\.\d{1,3}(-\w{1,5}\.\d{1,3})?/;

async function updatePatches() {
  for (const [resolutionName, patch] of Object.entries(pkg.resolutions)) {
    const dep = deps.find(([name]) => resolutionName.includes(name));

    if (!dep) {
      continue;
    }

    const patchVersionChunk = decodeURIComponent(patch).split('#')[0];
    const [resolutionVersion] = patchVersionChunk.match(patchVersion_RE) || [];

    if (!resolutionName) {
      continue;
    }

    const normalizedDepVersion = dep[1].startsWith('^') ? dep[1].slice(1) : dep[1];

    if (resolutionVersion === normalizedDepVersion) {
      continue;
    }

    const newPatch = patch.replace(patchVersion_RE, normalizedDepVersion);

    pkg.resolutions[resolutionName] = newPatch;
  }

  const newPkg = JSON.stringify(pkg, null, 2);

  await fsp.writeFile(pkgPath, newPkg);
}

updatePatches();
