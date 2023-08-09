# Changelog


## v1.2.2

[compare changes](https://github.com/logotip4ik/keycap/compare/v1.2.1...v1.2.2)

### 🏡 Chore

- Update deps ([b6bf221](https://github.com/logotip4ik/keycap/commit/b6bf221))
- Allow empty values for yaml values ([815a6b8](https://github.com/logotip4ik/keycap/commit/815a6b8))

### 🤖 CI

- Use personal access token also for commiting changes ([9195069](https://github.com/logotip4ik/keycap/commit/9195069))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v1.2.1

[compare changes](https://github.com/logotip4ik/keycap/compare/v1.2.0...v1.2.1)

### 🩹 Fixes

- Move `usernameRE` to `utils/index` to drop bundle size ([2a16d91](https://github.com/logotip4ik/keycap/commit/2a16d91))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v1.2.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v1.1.2...v1.2.0)

### 🚀 Enhancements

- Username validator and better RE ([207f00f](https://github.com/logotip4ik/keycap/commit/207f00f))
- Social user validator ([0ad52a7](https://github.com/logotip4ik/keycap/commit/0ad52a7))

### 🩹 Fixes

- Remove not needed char and escape dash ([060978e](https://github.com/logotip4ik/keycap/commit/060978e))
- Typo in validator name ([fea0d16](https://github.com/logotip4ik/keycap/commit/fea0d16))
- Correct function name in tests ([a8b1080](https://github.com/logotip4ik/keycap/commit/a8b1080))

### 💅 Refactors

- Do not use variable for isr duration ([72376c1](https://github.com/logotip4ik/keycap/commit/72376c1))
- Better empty note indication ([102d124](https://github.com/logotip4ik/keycap/commit/102d124))
- Randomly choose note on error ([234ee70](https://github.com/logotip4ik/keycap/commit/234ee70))
- Even better error messages and styles ([d44596a](https://github.com/logotip4ik/keycap/commit/d44596a))
- Use `decomment` for comment removal ([b718f3c](https://github.com/logotip4ik/keycap/commit/b718f3c))
- Set interactive widget to only resize-visuals ([50cdb84](https://github.com/logotip4ik/keycap/commit/50cdb84))
- Remove not needed checks, callbacks and lower debounce delay ([f0a14bf](https://github.com/logotip4ik/keycap/commit/f0a14bf))
- Add after search callback to open first result if user pressed enter before search resolves ([9fa908e](https://github.com/logotip4ik/keycap/commit/9fa908e))
- Use dedicated field for viewport meta tag ([f1ec13e](https://github.com/logotip4ik/keycap/commit/f1ec13e))
- Split username check into cached and non cached functions ([86f03d9](https://github.com/logotip4ik/keycap/commit/86f03d9))
- Use username RE from server utils ([a9c273c](https://github.com/logotip4ik/keycap/commit/a9c273c))
- Do not preoptimize things that we do not use ([2074740](https://github.com/logotip4ik/keycap/commit/2074740))
- Remove sonar eslint plugin ([3ce2c03](https://github.com/logotip4ik/keycap/commit/3ce2c03))
- Remove not used rule supression ([4dd6c04](https://github.com/logotip4ik/keycap/commit/4dd6c04))
- Add function for checking common oauth errors ([231970a](https://github.com/logotip4ik/keycap/commit/231970a))
- Use validators and similar functions ([536464f](https://github.com/logotip4ik/keycap/commit/536464f))
- Throw instead of returning an error ([9b39eef](https://github.com/logotip4ik/keycap/commit/9b39eef))
- Use `assertNoOAuthErrors` ([ee0c1be](https://github.com/logotip4ik/keycap/commit/ee0c1be))

### 🏡 Chore

- Update deps ([7c23f9c](https://github.com/logotip4ik/keycap/commit/7c23f9c))
- Update deps ([07e3b8f](https://github.com/logotip4ik/keycap/commit/07e3b8f))
- Regenerate lock file ([fa17140](https://github.com/logotip4ik/keycap/commit/fa17140))
- Remove non existent import dir ([3cca6c3](https://github.com/logotip4ik/keycap/commit/3cca6c3))
- Add server size counter ([97f9c39](https://github.com/logotip4ik/keycap/commit/97f9c39))

### 🤖 CI

- Additional permissions for release and update deps workflows ([f0ada3a](https://github.com/logotip4ik/keycap/commit/f0ada3a))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))

## v1.1.2

[compare changes](https://github.com/logotip4ik/keycap/compare/v1.1.1...v1.1.2)

### 🩹 Fixes

- Enable tls for redis driver ([3832251](https://github.com/logotip4ik/keycap/commit/3832251))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v1.1.1

[compare changes](https://github.com/logotip4ik/keycap/compare/v1.1.0...v1.1.1)

### 💅 Refactors

- Force array type to be generic by default ([b333b46](https://github.com/logotip4ik/keycap/commit/b333b46))
- Select input contents on link input ([9b86df6](https://github.com/logotip4ik/keycap/commit/9b86df6))

### 🎨 Styles

- Run lint:fix ([56c3e01](https://github.com/logotip4ik/keycap/commit/56c3e01))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v1.1.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v1.0.2...v1.1.0)

### 🚀 Enhancements

- Production cache driver ([2407cc5](https://github.com/logotip4ik/keycap/commit/2407cc5))

### 🔥 Performance

- Remove pointer events from pseudo elements ([872af23](https://github.com/logotip4ik/keycap/commit/872af23))

### 🩹 Fixes

- Add back postinstall script ([7c56edf](https://github.com/logotip4ik/keycap/commit/7c56edf))
- Always write icon definitions ([da4fe6a](https://github.com/logotip4ik/keycap/commit/da4fe6a))

### 💅 Refactors

- Use more generic `isCI` check for terser ([647ecfe](https://github.com/logotip4ik/keycap/commit/647ecfe))
- Import oauth providers from `#components` ([025ba2e](https://github.com/logotip4ik/keycap/commit/025ba2e))
- Build custom nuxt loader to make icons from svgs ([859dcce](https://github.com/logotip4ik/keycap/commit/859dcce))
- Use lazy icons ([71ab559](https://github.com/logotip4ik/keycap/commit/71ab559))
- Show website version in `api/info` route ([6af6591](https://github.com/logotip4ik/keycap/commit/6af6591))

### 🏡 Chore

- Remove postinstall script ([2a97665](https://github.com/logotip4ik/keycap/commit/2a97665))

### 🎨 Styles

- Move nitro options closer to vite's ([232febe](https://github.com/logotip4ik/keycap/commit/232febe))

### 🤖 CI

- More appropriate name for job ([6da1a78](https://github.com/logotip4ik/keycap/commit/6da1a78))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v1.0.2

[compare changes](https://github.com/logotip4ik/keycap/compare/v1.0.1...v1.0.2)

### 🩹 Fixes

- Add more specificity for social button styles ([1fabdc0](https://github.com/logotip4ik/keycap/commit/1fabdc0))

### 💅 Refactors

- Set version in build info ([20be151](https://github.com/logotip4ik/keycap/commit/20be151))
- Mention website version in index page ([a2051bc](https://github.com/logotip4ik/keycap/commit/a2051bc))

### 🎨 Styles

- Yarn added new line ([91c2cfc](https://github.com/logotip4ik/keycap/commit/91c2cfc))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v1.0.1

[compare changes](https://github.com/logotip4ik/keycap/compare/v0.1.0...v1.0.1)

### 🏡 Chore

- Bump package version ([b19f915](https://github.com/logotip4ik/keycap/commit/b19f915))
- Disable automatic deployments on master and enable `autoJobCancelation` ([de50d93](https://github.com/logotip4ik/keycap/commit/de50d93))

### 🤖 CI

- Push changes to github after changelogen ([fc6f178](https://github.com/logotip4ik/keycap/commit/fc6f178))
- Use force push after changelogen ([270f18c](https://github.com/logotip4ik/keycap/commit/270f18c))
- Revert do not use force option ([08a5645](https://github.com/logotip4ik/keycap/commit/08a5645))
- Use plain `git push` to push changes ([b5af9a0](https://github.com/logotip4ik/keycap/commit/b5af9a0))
- Correct workflow name ([c560fcd](https://github.com/logotip4ik/keycap/commit/c560fcd))
- Use just push action to push changelogen changes ([b1625b7](https://github.com/logotip4ik/keycap/commit/b1625b7))
- Fix indentation ([aa651b0](https://github.com/logotip4ik/keycap/commit/aa651b0))
- Set github token ([3f4c5e6](https://github.com/logotip4ik/keycap/commit/3f4c5e6))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

