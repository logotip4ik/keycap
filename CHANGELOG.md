# Changelog


## v2.2.5

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.2.4...v2.2.5)

### 💅 Refactors

- More generic bcrypt hash detection ([c25eff3](https://github.com/logotip4ik/keycap/commit/c25eff3))

### 🏡 Chore

- **release:** V2.2.4 ([fef3c3d](https://github.com/logotip4ik/keycap/commit/fef3c3d))
- Apply fixes ([b37215c](https://github.com/logotip4ik/keycap/commit/b37215c))

### ❤️  Contributors

- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))
- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v2.2.4

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.2.3...v2.2.4)

### 🩹 Fixes

- Use payload subject as id for deserialization ([aba4a9d](https://github.com/logotip4ik/keycap/commit/aba4a9d))

### 💅 Refactors

- Set jti in jwt ([8a6347a](https://github.com/logotip4ik/keycap/commit/8a6347a))
- Bump hash rounds ([dc4c9d7](https://github.com/logotip4ik/keycap/commit/dc4c9d7))
- Use argon2 for password hashing and verification ([b401934](https://github.com/logotip4ik/keycap/commit/b401934))
- Ensure that user password is hashed with argon2 ([0be2184](https://github.com/logotip4ik/keycap/commit/0be2184))
- Set jwt subject as `object.id` ([ce3e1e7](https://github.com/logotip4ik/keycap/commit/ce3e1e7))

### 🏡 Chore

- **release:** V2.2.3 ([b9b4344](https://github.com/logotip4ik/keycap/commit/b9b4344))
- Add note ([5172bbe](https://github.com/logotip4ik/keycap/commit/5172bbe))
- Install argon2 ([053a141](https://github.com/logotip4ik/keycap/commit/053a141))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))

## v2.2.3

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.2.2...v2.2.3)

### 🩹 Fixes

- **ci:** Correct commit message ([f5de334](https://github.com/logotip4ik/keycap/commit/f5de334))
- **ci:** Pull before creating changelog ([498003b](https://github.com/logotip4ik/keycap/commit/498003b))

### 💅 Refactors

- Remove padding from nav on `view` route ([a5ae1f6](https://github.com/logotip4ik/keycap/commit/a5ae1f6))
- Use page validation instead of middleware ([d065c1b](https://github.com/logotip4ik/keycap/commit/d065c1b))
- Lower auth expiration ([30a9da8](https://github.com/logotip4ik/keycap/commit/30a9da8))
- Simply auth refresh plugin ([8db51d7](https://github.com/logotip4ik/keycap/commit/8db51d7))
- Remove unused constant ([a1626fe](https://github.com/logotip4ik/keycap/commit/a1626fe))

### 🏡 Chore

- **release:** V2.2.2 ([3254f51](https://github.com/logotip4ik/keycap/commit/3254f51))
- Update deps ([a7fc36f](https://github.com/logotip4ik/keycap/commit/a7fc36f))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))

## v2.2.2

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.2.1...v2.2.2)

### 💅 Refactors

- Add back link to login page ([4d9bf1a](https://github.com/logotip4ik/keycap/commit/4d9bf1a))
- Remove not needed color variable ([3d826c6](https://github.com/logotip4ik/keycap/commit/3d826c6))
- Merge login and register styles into one file ([7b54109](https://github.com/logotip4ik/keycap/commit/7b54109))
- Add outline for search item and background blur ([8ab3e27](https://github.com/logotip4ik/keycap/commit/8ab3e27))
- Do not use `rem's` in `blur` function ([e75ef02](https://github.com/logotip4ik/keycap/commit/e75ef02))
- Reuse existing array instead of creating another one ([d6ce95b](https://github.com/logotip4ik/keycap/commit/d6ce95b))
- Add note for new users how to create notes ([7923acf](https://github.com/logotip4ik/keycap/commit/7923acf))

### 🏡 Chore

- **release:** V2.2.1 ([091567b](https://github.com/logotip4ik/keycap/commit/091567b))
- Update deps ([6d201a3](https://github.com/logotip4ik/keycap/commit/6d201a3))

### 🤖 CI

- Run `git pull` before pushing back to origin ([f97b673](https://github.com/logotip4ik/keycap/commit/f97b673))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))

## v2.2.1

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.2.0...v2.2.1)

### 💅 Refactors

- Repatch tiptap with minified css ([3c38a42](https://github.com/logotip4ik/keycap/commit/3c38a42))
- Patch tiptap core with minified styles ([354a77f](https://github.com/logotip4ik/keycap/commit/354a77f))
- Patch link extension to remove linkifyjs from build ([1572f90](https://github.com/logotip4ik/keycap/commit/1572f90))
- Better scrollbars for chrome and firefox ([785cb97](https://github.com/logotip4ik/keycap/commit/785cb97))
- Append bubble menu to editor rather then body ([2676f85](https://github.com/logotip4ik/keycap/commit/2676f85))
- Remove nuxt loading indicator ([5c8e0e7](https://github.com/logotip4ik/keycap/commit/5c8e0e7))

### 🏡 Chore

- Update deps ([34a1c73](https://github.com/logotip4ik/keycap/commit/34a1c73))
- Do not use `rc` releases for tiptap editor ([380a844](https://github.com/logotip4ik/keycap/commit/380a844))
- Update deps ([46a9ba3](https://github.com/logotip4ik/keycap/commit/46a9ba3))

### 🎨 Styles

- **ci:** Move `permissions` above `on` ([2669d2d](https://github.com/logotip4ik/keycap/commit/2669d2d))

### 🤖 CI

- Use different action to push changes ([2d51f82](https://github.com/logotip4ik/keycap/commit/2d51f82))
- Update push action version ([ceeb969](https://github.com/logotip4ik/keycap/commit/ceeb969))
- Do not fail if nothing to update ([aca85ea](https://github.com/logotip4ik/keycap/commit/aca85ea))
- Do not push tags ([ec6691a](https://github.com/logotip4ik/keycap/commit/ec6691a))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v2.2.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.1.0...v2.2.0)

### 🚀 Enhancements

- More accessible toast container ([61f2d3f](https://github.com/logotip4ik/keycap/commit/61f2d3f))
- Rework authorization middleware into more generic route rules ([52b9300](https://github.com/logotip4ik/keycap/commit/52b9300))

### 🩹 Fixes

- Bump z index for fab ([a4ac543](https://github.com/logotip4ik/keycap/commit/a4ac543))
- Correctly remove scrollbar from contents ([d59b89c](https://github.com/logotip4ik/keycap/commit/d59b89c))

### 💅 Refactors

- Disable `no-dataset` rule ([5d7179f](https://github.com/logotip4ik/keycap/commit/5d7179f))
- Remove not used rule supression ([08b897e](https://github.com/logotip4ik/keycap/commit/08b897e))
- Remove not used query variable ([a48947f](https://github.com/logotip4ik/keycap/commit/a48947f))
- Remove not used variable declaration ([393e74c](https://github.com/logotip4ik/keycap/commit/393e74c))
- Try to destroy the editor on before unmount ([8f4d1ca](https://github.com/logotip4ik/keycap/commit/8f4d1ca))
- Bump a bit list paddings ([17f41b9](https://github.com/logotip4ik/keycap/commit/17f41b9))
- Remove text align plugin ([7108b06](https://github.com/logotip4ik/keycap/commit/7108b06))
- Use oauth id's to query user ([069d997](https://github.com/logotip4ik/keycap/commit/069d997))
- Use more secure cookie for state check ([852620a](https://github.com/logotip4ik/keycap/commit/852620a))
- Try get user with email as well as oauth id ([4b44031](https://github.com/logotip4ik/keycap/commit/4b44031))
- Allow only whitelisted flags to be set in form ([c1b977d](https://github.com/logotip4ik/keycap/commit/c1b977d))
- Redirect to dashboard with authenticated user ([6e5194c](https://github.com/logotip4ik/keycap/commit/6e5194c))
- Add more security ([b87ceef](https://github.com/logotip4ik/keycap/commit/b87ceef))
- Change warn to error and change message ([1f76460](https://github.com/logotip4ik/keycap/commit/1f76460))
- Use `useRuntimeConfig` with event param ([dc10fb6](https://github.com/logotip4ik/keycap/commit/dc10fb6))
- Move user check to middleware ([f3a0a94](https://github.com/logotip4ik/keycap/commit/f3a0a94))
- Use `rules.find` instead `for of` ([41b3b4f](https://github.com/logotip4ik/keycap/commit/41b3b4f))
- Do not use `?.` ([19dc74e](https://github.com/logotip4ik/keycap/commit/19dc74e))
- Move `OAuthProvider` type to `utils/index` ([ced172e](https://github.com/logotip4ik/keycap/commit/ced172e))
- Specify `get` method for webmanfest ([465bf37](https://github.com/logotip4ik/keycap/commit/465bf37))
- Move `security.txt` under `.well-known` and add alias to top level ([4a61470](https://github.com/logotip4ik/keycap/commit/4a61470))
- Set `caret-color` same as text color ([29dbd99](https://github.com/logotip4ik/keycap/commit/29dbd99))
- Set `tab-size` to 4 ([2f8f566](https://github.com/logotip4ik/keycap/commit/2f8f566))
- Better scrollbars ([2290f98](https://github.com/logotip4ik/keycap/commit/2290f98))
- Calculate icon size relative to button size ([256cac5](https://github.com/logotip4ik/keycap/commit/256cac5))
- Prevent whitespace wrapping on item path ([039ca97](https://github.com/logotip4ik/keycap/commit/039ca97))
- Set initial delay for preload toasts ([c556d71](https://github.com/logotip4ik/keycap/commit/c556d71))

### 🏡 Chore

- Add todo ([b41a1a2](https://github.com/logotip4ik/keycap/commit/b41a1a2))

### 🎨 Styles

- New lines and put br's into html ([964449b](https://github.com/logotip4ik/keycap/commit/964449b))
- Move rule functions about event handler ([e850141](https://github.com/logotip4ik/keycap/commit/e850141))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v2.1.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.0.0...v2.1.0)

### 🚀 Enhancements

- Add security txt ([8d1c950](https://github.com/logotip4ik/keycap/commit/8d1c950))
- Custom `axiom` logger ([d373158](https://github.com/logotip4ik/keycap/commit/d373158))
- Better error logging ([590f164](https://github.com/logotip4ik/keycap/commit/590f164))

### 🔥 Performance

- Use replace with regex to update note path ([7e17f06](https://github.com/logotip4ik/keycap/commit/7e17f06))

### 🩹 Fixes

- Add nitro stubs ([b2c0b79](https://github.com/logotip4ik/keycap/commit/b2c0b79))
- Use username validation from user schema file ([7ca59f7](https://github.com/logotip4ik/keycap/commit/7ca59f7))

### 💅 Refactors

- Move to top level `security.txt` and add alias to `.well-known` ([a10db7e](https://github.com/logotip4ik/keycap/commit/a10db7e))
- Remove `console.log` ([c6fa567](https://github.com/logotip4ik/keycap/commit/c6fa567))
- Use cached event handler for `security.txt` ([a435e01](https://github.com/logotip4ik/keycap/commit/a435e01))
- Set logger on each request ([9cd369c](https://github.com/logotip4ik/keycap/commit/9cd369c))
- Set info log in site webmanifest route ([6c6830b](https://github.com/logotip4ik/keycap/commit/6c6830b))
- Try to await log ([d1e492e](https://github.com/logotip4ik/keycap/commit/d1e492e))
- Add `nitro` flag to logger data ([5a5fc23](https://github.com/logotip4ik/keycap/commit/5a5fc23))
- Remove not needed prod testing ([762f056](https://github.com/logotip4ik/keycap/commit/762f056))
- Better error handling for password hashing ([8fe1a0c](https://github.com/logotip4ik/keycap/commit/8fe1a0c))
- Add test route for logging ([2160add](https://github.com/logotip4ik/keycap/commit/2160add))
- Check how long it takes to log something ([6d151fd](https://github.com/logotip4ik/keycap/commit/6d151fd))
- Also log error ([bc6bf84](https://github.com/logotip4ik/keycap/commit/bc6bf84))
- Set logging env ([e24bafd](https://github.com/logotip4ik/keycap/commit/e24bafd))
- Remove not needed test route ([ceb54fb](https://github.com/logotip4ik/keycap/commit/ceb54fb))
- Add `nuxt-vitest` to nuxt modules ([c68db0a](https://github.com/logotip4ik/keycap/commit/c68db0a))
- Remove not used query param ([c61742e](https://github.com/logotip4ik/keycap/commit/c61742e))
- Select more notes then folders ([b91fe8d](https://github.com/logotip4ik/keycap/commit/b91fe8d))
- Use `.concat` ([5af9ca9](https://github.com/logotip4ik/keycap/commit/5af9ca9))
- Use `400` code if share link is not valid ([a2bcd91](https://github.com/logotip4ik/keycap/commit/a2bcd91))
- Use `Date.now()` rather then `.getTime()` ([6e4c792](https://github.com/logotip4ik/keycap/commit/6e4c792))
- Reset `timersStack` via setting array length ([dfef229](https://github.com/logotip4ik/keycap/commit/dfef229))
- Check for oauth errors before `code` param ([297141a](https://github.com/logotip4ik/keycap/commit/297141a))

### 🏡 Chore

- Yarn add new line ([5f07397](https://github.com/logotip4ik/keycap/commit/5f07397))
- Add axiom runtime config ([455e694](https://github.com/logotip4ik/keycap/commit/455e694))
- Add side note ([817a628](https://github.com/logotip4ik/keycap/commit/817a628))
- Remove TODO's ([ed1042f](https://github.com/logotip4ik/keycap/commit/ed1042f))
- Add todos ([ea01160](https://github.com/logotip4ik/keycap/commit/ea01160))
- Add side note ([6c154c7](https://github.com/logotip4ik/keycap/commit/6c154c7))
- Remove todo ([55fc4cd](https://github.com/logotip4ik/keycap/commit/55fc4cd))
- Add note and a bit change code style ([eb15fb1](https://github.com/logotip4ik/keycap/commit/eb15fb1))

### ✅ Tests

- Use `setupFiles` instead of `globalSetup` ([6cec234](https://github.com/logotip4ik/keycap/commit/6cec234))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v2.0.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v1.2.3...v2.0.0)

### 🩹 Fixes

- ⚠️  Cannot get provider from path ([f585ced](https://github.com/logotip4ik/keycap/commit/f585ced))

#### ⚠️  Breaking Changes

- ⚠️  Cannot get provider from path ([f585ced](https://github.com/logotip4ik/keycap/commit/f585ced))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v1.2.3

[compare changes](https://github.com/logotip4ik/keycap/compare/v1.2.2...v1.2.3)

### 💅 Refactors

- Set `aria-busy` when loading ([08945c3](https://github.com/logotip4ik/keycap/commit/08945c3))
- Add more accessibility ([10d2f04](https://github.com/logotip4ik/keycap/commit/10d2f04))
- Move fab up in tab order ([697e97c](https://github.com/logotip4ik/keycap/commit/697e97c))
- Better a11y for header ([54e4065](https://github.com/logotip4ik/keycap/commit/54e4065))
- A bit better seo ([81ad10f](https://github.com/logotip4ik/keycap/commit/81ad10f))

### 🎨 Styles

- Put attributes on new lines ([30c0eef](https://github.com/logotip4ik/keycap/commit/30c0eef))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

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

