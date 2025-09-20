import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const packageJsonPath = join(process.cwd(), 'package.json');
const patchVersionRE = /\d+\.\d+\.\d+(-\w{1,10}\.\d+)?/;

/** @type {import('pkg-types').PackageJson} */
const packageJson = JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf8' }));
const allDeps = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

for (const dep in packageJson.resolutions) {
  const depVersion = allDeps[dep];

  if (!depVersion) {
    continue;
  }

  const patchVersionChunk = decodeURIComponent(packageJson.resolutions[dep]).split('#')[0];
  const versionMatch = patchVersionChunk.match(patchVersionRE);
  let resolutionVersion;

  if (!versionMatch || !(resolutionVersion = versionMatch[0])) {
    console.warn(`can't resolve patch version for: ${dep}`);
    continue;
  }

  const depVersionWitoutPrefix = depVersion[0] === '^' || depVersion[0] === '~' ? depVersion.slice(1) : depVersion;

  if (depVersionWitoutPrefix === resolutionVersion) {
    continue;
  }

  packageJson.resolutions[dep] = packageJson.resolutions[dep].replace(patchVersionRE, depVersionWitoutPrefix);
  console.log(`updated ${dep} to ${depVersionWitoutPrefix}`);
}

const newPackageJson = `${JSON.stringify(packageJson, null, 2)}\n`;

writeFileSync(packageJsonPath, newPackageJson);
