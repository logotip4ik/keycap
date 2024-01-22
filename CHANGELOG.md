# Changelog


## v3.9.5

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.9.4...v3.9.5)

### 🩹 Fixes

- Use correct env variable for cors origin ([8f8a5c63](https://github.com/logotip4ik/keycap/commit/8f8a5c63))
- Correct error value ([c002ea6d](https://github.com/logotip4ik/keycap/commit/c002ea6d))
- Don't remove state cookie until user finished authentication process ([4546d202](https://github.com/logotip4ik/keycap/commit/4546d202))

### 💅 Refactors

- Use object filed to specify message ([afd843a5](https://github.com/logotip4ik/keycap/commit/afd843a5))
- Simplify log function ([35d3a8ba](https://github.com/logotip4ik/keycap/commit/35d3a8ba))
- Type what error values could be ([017b03e5](https://github.com/logotip4ik/keycap/commit/017b03e5))
- Send all validation errors if validation failed ([cd993d7d](https://github.com/logotip4ik/keycap/commit/cd993d7d))
- Delete oauth state cookie in validator ([39e6a550](https://github.com/logotip4ik/keycap/commit/39e6a550))
- Automatically send oauth redirect and delete state cookie at the end of authentication ([b13bc3a6](https://github.com/logotip4ik/keycap/commit/b13bc3a6))
- Simplify toast styles ([1a155c72](https://github.com/logotip4ik/keycap/commit/1a155c72))
- Use function for getting correct element width ([a6980a9c](https://github.com/logotip4ik/keycap/commit/a6980a9c))

### 🏡 Chore

- **release:** V3.9.4 ([3438fea6](https://github.com/logotip4ik/keycap/commit/3438fea6))
- Provide env example ([312ecec8](https://github.com/logotip4ik/keycap/commit/312ecec8))
- Add origin header to vary ([51c6f18d](https://github.com/logotip4ik/keycap/commit/51c6f18d))
- Return no content at preflight requests ([d21af449](https://github.com/logotip4ik/keycap/commit/d21af449))
- Remove default proxing through service worker ([88f80d81](https://github.com/logotip4ik/keycap/commit/88f80d81))
- Add `skeleton` class to contents list skeleton element ([e37ff3cb](https://github.com/logotip4ik/keycap/commit/e37ff3cb))
- Update deps ([7f266c32](https://github.com/logotip4ik/keycap/commit/7f266c32))
- Add missing patch file ([e3ec5835](https://github.com/logotip4ik/keycap/commit/e3ec5835))
- Remove not needed unenv property ([27ad78ea](https://github.com/logotip4ik/keycap/commit/27ad78ea))
- Fix typo ([26e0c706](https://github.com/logotip4ik/keycap/commit/26e0c706))
- Add error expectation ([563b1401](https://github.com/logotip4ik/keycap/commit/563b1401))
- Specify provider name in provider config ([8aa3f931](https://github.com/logotip4ik/keycap/commit/8aa3f931))
- Only trim start of the input ([45f53642](https://github.com/logotip4ik/keycap/commit/45f53642))
- Remove not needed vitest module injection ([2eb25bdd](https://github.com/logotip4ik/keycap/commit/2eb25bdd))

### ❤️ Contributors

- Bogdan Kostyuk <bogdankostyuk12@gmail.com>

## v3.9.4

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.9.3...v3.9.4)

### 💅 Refactors

- Export simular component into backdrop ([d48c4d32](https://github.com/logotip4ik/keycap/commit/d48c4d32))
- Export modal element into component ([745005bb](https://github.com/logotip4ik/keycap/commit/745005bb))
- Make search list separate component ([112b5630](https://github.com/logotip4ik/keycap/commit/112b5630))
- More precise response types ([f8b3d5da](https://github.com/logotip4ik/keycap/commit/f8b3d5da))
- More precise folder response types ([76b4b335](https://github.com/logotip4ik/keycap/commit/76b4b335))
- Hide contents sidebar after creation on small screens ([c2d52c69](https://github.com/logotip4ik/keycap/commit/c2d52c69))
- Specify correct component names to preload ([7b71a41f](https://github.com/logotip4ik/keycap/commit/7b71a41f))
- Allow skipping throttling when updating note ([32bbe7c7](https://github.com/logotip4ik/keycap/commit/32bbe7c7))
- Rename siteOrigin to site ([66e1922f](https://github.com/logotip4ik/keycap/commit/66e1922f))
- Use different mod key for safari ([bb515abe](https://github.com/logotip4ik/keycap/commit/bb515abe))
- Remove `check` prefix from device utils functions ([f4f580fa](https://github.com/logotip4ik/keycap/commit/f4f580fa))
- Auto import parseDuration function and replace it in build time ([91f02696](https://github.com/logotip4ik/keycap/commit/91f02696))
- Rename KModal to WorkspaceModal ([c21e399a](https://github.com/logotip4ik/keycap/commit/c21e399a))
- Use string templates to transform number into string ([93db6d89](https://github.com/logotip4ik/keycap/commit/93db6d89))
- Remove not needed variable and client function call ([9858ec64](https://github.com/logotip4ik/keycap/commit/9858ec64))

### 📖 Documentation

- Update motivation text ([26c00863](https://github.com/logotip4ik/keycap/commit/26c00863))

### 🏡 Chore

- **release:** V3.9.3 ([ec0082d7](https://github.com/logotip4ik/keycap/commit/ec0082d7))
- Allow undefined to be target value ([bd7520fa](https://github.com/logotip4ik/keycap/commit/bd7520fa))
- Use close function directly ([1297b93a](https://github.com/logotip4ik/keycap/commit/1297b93a))
- Use else instead of else-if ([42de04ab](https://github.com/logotip4ik/keycap/commit/42de04ab))
- Enable nuxt app manifest ([66c0741a](https://github.com/logotip4ik/keycap/commit/66c0741a))
- Fix oxlint pedantic warnings ([931a2b66](https://github.com/logotip4ik/keycap/commit/931a2b66))
- Focus editor after creating item ([03b5f243](https://github.com/logotip4ik/keycap/commit/03b5f243))
- Remove todo ([ee0064ee](https://github.com/logotip4ik/keycap/commit/ee0064ee))
- Add small enter and speed up leave anim search animaton ([2f9d00d7](https://github.com/logotip4ik/keycap/commit/2f9d00d7))
- Reset result state to idle with empty use query ([2709b291](https://github.com/logotip4ik/keycap/commit/2709b291))
- Rename function ([352cfc86](https://github.com/logotip4ik/keycap/commit/352cfc86))
- Patch to latest nuxt version ([f7e159c3](https://github.com/logotip4ik/keycap/commit/f7e159c3))
- Remove link extension from dependecies ([a3afc2f8](https://github.com/logotip4ik/keycap/commit/a3afc2f8))
- Update deps ([ec85c534](https://github.com/logotip4ik/keycap/commit/ec85c534))
- Enable cached checks for dev server ([3ebdd436](https://github.com/logotip4ik/keycap/commit/3ebdd436))
- Fix some of oxlint warnings ([76cce390](https://github.com/logotip4ik/keycap/commit/76cce390))
- Try sending error when update note failed ([0553974a](https://github.com/logotip4ik/keycap/commit/0553974a))
- Allow editor marking update event as forced ([f2c2de11](https://github.com/logotip4ik/keycap/commit/f2c2de11))
- Do not minify server in local build ([e8bc1f6e](https://github.com/logotip4ik/keycap/commit/e8bc1f6e))
- Always use imports presets ([6b4fca9e](https://github.com/logotip4ik/keycap/commit/6b4fca9e))
- Remove todo ([e353483f](https://github.com/logotip4ik/keycap/commit/e353483f))
- Rename regex constants ([ca1a7fe5](https://github.com/logotip4ik/keycap/commit/ca1a7fe5))
- Remove user-agent detection testing ([83ade918](https://github.com/logotip4ik/keycap/commit/83ade918))
- Do not use optional chainning for parseDuration ([90dd0bc0](https://github.com/logotip4ik/keycap/commit/90dd0bc0))
- Use server seo meta ([2968a03e](https://github.com/logotip4ik/keycap/commit/2968a03e))
- Remove not needed unhead addons plugin ([c3d3a3fe](https://github.com/logotip4ik/keycap/commit/c3d3a3fe))

### 🎨 Styles

- Remove double space ([9363a921](https://github.com/logotip4ik/keycap/commit/9363a921))
- Move js target closer to js minification option ([311f298b](https://github.com/logotip4ik/keycap/commit/311f298b))

### ❤️ Contributors

- Bogdan Kostyuk <bogdankostyuk12@gmail.com>

## v3.9.3

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.9.2...v3.9.3)

### 🩹 Fixes

- Use same serialize options for deletion ([216a9da2](https://github.com/logotip4ik/keycap/commit/216a9da2))

### 🏡 Chore

- **release:** V3.9.2 ([6dcff5af](https://github.com/logotip4ik/keycap/commit/6dcff5af))
- Add proper link validation for rendering ([2fa51f56](https://github.com/logotip4ik/keycap/commit/2fa51f56))
- Rename function ([2d70acdf](https://github.com/logotip4ik/keycap/commit/2d70acdf))
- Make logout a post route" ([c79f5c6c](https://github.com/logotip4ik/keycap/commit/c79f5c6c))
- Make logout a form with post request" ([98da452a](https://github.com/logotip4ik/keycap/commit/98da452a))

### ❤️ Contributors

- Bogdan Kostyuk <bogdankostyuk12@gmail.com>

## v3.9.2

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.9.1...v3.9.2)

### 🏡 Chore

- **release:** V3.9.1 ([e4abf317](https://github.com/logotip4ik/keycap/commit/e4abf317))
- Handle arrow up and down key on list ([036917de](https://github.com/logotip4ik/keycap/commit/036917de))
- Fix typo ([9c81a1fe](https://github.com/logotip4ik/keycap/commit/9c81a1fe))
- Try refreshing note content after cached page show ([34c0d235](https://github.com/logotip4ik/keycap/commit/34c0d235))
- Make logout a post route ([9bab35f1](https://github.com/logotip4ik/keycap/commit/9bab35f1))
- Make logout a form with post request ([a17b0efc](https://github.com/logotip4ik/keycap/commit/a17b0efc))
- Put logo closer to text ([d4aa15f3](https://github.com/logotip4ik/keycap/commit/d4aa15f3))

### ❤️ Contributors

- Bogdan Kostyuk <bogdankostyuk12@gmail.com>

## v3.9.1

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.9.0...v3.9.1)

### 🩹 Fixes

- Correct endpoint for ingesting data ([fc46179b](https://github.com/logotip4ik/keycap/commit/fc46179b))

### 🏡 Chore

- **release:** V3.9.0 ([2de7fd5b](https://github.com/logotip4ik/keycap/commit/2de7fd5b))
- Fix typo ([5c0a863d](https://github.com/logotip4ik/keycap/commit/5c0a863d))

### ❤️ Contributors

- Bogdan Kostyuk <bogdankostyuk12@gmail.com>

## v3.9.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.8.0...v3.9.0)

### 🚀 Enhancements

- Export function for creating keys ([be93b709](https://github.com/logotip4ik/keycap/commit/be93b709))

### 🩹 Fixes

- Infer arguments types for correct return type ([c3eb98a9](https://github.com/logotip4ik/keycap/commit/c3eb98a9))
- Remove path resolving from node modules ([a7552048](https://github.com/logotip4ik/keycap/commit/a7552048))
- Replace `NODE_ENV` with string rather then value ([26728713](https://github.com/logotip4ik/keycap/commit/26728713))
- Chop last slash from path ([6664c753](https://github.com/logotip4ik/keycap/commit/6664c753))
- Reset history after closing document ([f9c5c6ba](https://github.com/logotip4ik/keycap/commit/f9c5c6ba))
- Add formatter animation ([eb929ba2](https://github.com/logotip4ik/keycap/commit/eb929ba2))
- Actually use cache-network strategy for assets ([cd90fedf](https://github.com/logotip4ik/keycap/commit/cd90fedf))

### 💅 Refactors

- Create object instead of classes ([46903940](https://github.com/logotip4ik/keycap/commit/46903940))
- Use custom link extension ([67720770](https://github.com/logotip4ik/keycap/commit/67720770))
- Better selection and focus management ([185475f2](https://github.com/logotip4ik/keycap/commit/185475f2))
- Use link extension methods to create links ([92d1c1fd](https://github.com/logotip4ik/keycap/commit/92d1c1fd))
- Inner links ([de650cf1](https://github.com/logotip4ik/keycap/commit/de650cf1))
- Accept sidebar as string rather then ref ([e1f3fd93](https://github.com/logotip4ik/keycap/commit/e1f3fd93))
- Rewrite pasted inner link with note or folder name ([19ffdd2f](https://github.com/logotip4ik/keycap/commit/19ffdd2f))
- Use forof loops ([2ab1b682](https://github.com/logotip4ik/keycap/commit/2ab1b682))
- Retain selection even after adding/removing link ([78bcdf07](https://github.com/logotip4ik/keycap/commit/78bcdf07))
- Also reset selection after shortcut ([86c18ac7](https://github.com/logotip4ik/keycap/commit/86c18ac7))
- Add global shortcut to focus editor ([71acca4e](https://github.com/logotip4ik/keycap/commit/71acca4e))
- Make shortcuts a server component ([3fe35cc4](https://github.com/logotip4ik/keycap/commit/3fe35cc4))
- Custom paste handler for link ([55dfc504](https://github.com/logotip4ik/keycap/commit/55dfc504))
- Use `replaceRangeWith` instead of manual deleting and inserting ([9c5cc7ae](https://github.com/logotip4ik/keycap/commit/9c5cc7ae))
- Custom bubble menu plugin ([bf1823c1](https://github.com/logotip4ik/keycap/commit/bf1823c1))
- Use floating ui instead of popper ([20a2adac](https://github.com/logotip4ik/keycap/commit/20a2adac))
- Do not handle errors in items helpers ([9b36908c](https://github.com/logotip4ik/keycap/commit/9b36908c))
- Catch and log error when creating item ([1f6b96ce](https://github.com/logotip4ik/keycap/commit/1f6b96ce))
- Remove not needed code ([9354bf42](https://github.com/logotip4ik/keycap/commit/9354bf42))

### 🏡 Chore

- **release:** V3.8.0 ([9028edf1](https://github.com/logotip4ik/keycap/commit/9028edf1))
- Remove expect error directive ([5a0c53e2](https://github.com/logotip4ik/keycap/commit/5a0c53e2))
- Split password hashing functions and imports into separate file ([be1ead81](https://github.com/logotip4ik/keycap/commit/be1ead81))
- Better origin mismatch check ([7b9b53ac](https://github.com/logotip4ik/keycap/commit/7b9b53ac))
- Rename client plugin to match server name ([4073740d](https://github.com/logotip4ik/keycap/commit/4073740d))
- Use middleware to redirect to dashboard ([5a6999b3](https://github.com/logotip4ik/keycap/commit/5a6999b3))
- Disable auth.client plugin for plugins ([ac248fe7](https://github.com/logotip4ik/keycap/commit/ac248fe7))
- Ignore some folders to boost perf ([6ffe26c7](https://github.com/logotip4ik/keycap/commit/6ffe26c7))
- Update path for hashPassword function ([e87ce79a](https://github.com/logotip4ik/keycap/commit/e87ce79a))
- Remove patch from `rad-event-listener` ([d34a2586](https://github.com/logotip4ik/keycap/commit/d34a2586))
- Use `invokeArrayFns` from `@vue/shared` ([fdcef866](https://github.com/logotip4ik/keycap/commit/fdcef866))
- Use `import.meta.client` instead of `onMounted` hook ([e75999b4](https://github.com/logotip4ik/keycap/commit/e75999b4))
- Import and use `isArray` function from `@vue/shared` ([593179ef](https://github.com/logotip4ik/keycap/commit/593179ef))
- Enable back minification ([87cbf200](https://github.com/logotip4ik/keycap/commit/87cbf200))
- Reuse function for getting folder path ([80ab8ab8](https://github.com/logotip4ik/keycap/commit/80ab8ab8))
- Statically replace `NODE_ENV` ([71dde8a9](https://github.com/logotip4ik/keycap/commit/71dde8a9))
- Make keys generation function auto-importable for nitro ([244e90f1](https://github.com/logotip4ik/keycap/commit/244e90f1))
- Use `createKey` function to generate ids ([2ecc2932](https://github.com/logotip4ik/keycap/commit/2ecc2932))
- Merge and export nitro and nuxt  typescript config ([b65946db](https://github.com/logotip4ik/keycap/commit/b65946db))
- Exclude more not needed folders ([8ea15d01](https://github.com/logotip4ik/keycap/commit/8ea15d01))
- Use `resolve` from pathe ([0e462848](https://github.com/logotip4ik/keycap/commit/0e462848))
- Use regexp to validate share link ([8f443010](https://github.com/logotip4ik/keycap/commit/8f443010))
- Move toaster out of folder ([35eccc69](https://github.com/logotip4ik/keycap/commit/35eccc69))
- Rename function ([c203eca0](https://github.com/logotip4ik/keycap/commit/c203eca0))
- Little pref gains by not using classes ([e2e3866b](https://github.com/logotip4ik/keycap/commit/e2e3866b))
- Auto import toast types ([11fb70c8](https://github.com/logotip4ik/keycap/commit/11fb70c8))
- Use `extend` and `remove` functions from vue/shared ([0cb64d3a](https://github.com/logotip4ik/keycap/commit/0cb64d3a))
- Disable mocking node modules in client side ([cb78ad7b](https://github.com/logotip4ik/keycap/commit/cb78ad7b))
- Allow hydration promise to be reassigned with falsy types ([8334f238](https://github.com/logotip4ik/keycap/commit/8334f238))
- Delete hydration promise after first await ([2e2dd563](https://github.com/logotip4ik/keycap/commit/2e2dd563))
- Another batch of folders to ignore ([5e8f314e](https://github.com/logotip4ik/keycap/commit/5e8f314e))
- Use `execa` instead of `simple-git` ([f3058640](https://github.com/logotip4ik/keycap/commit/f3058640))
- Move tiptap file to tiptap subfolder ([784f54e6](https://github.com/logotip4ik/keycap/commit/784f54e6))
- Add tiptap subfolder to autoimport ([641e67ee](https://github.com/logotip4ik/keycap/commit/641e67ee))
- Unwatch node modules and data folders ([9ad570fc](https://github.com/logotip4ik/keycap/commit/9ad570fc))
- Another batch of files to ignore ([57dcfda3](https://github.com/logotip4ik/keycap/commit/57dcfda3))
- Align mocks with new link extension ([9c76956e](https://github.com/logotip4ik/keycap/commit/9c76956e))
- Lower max history depth ([394db729](https://github.com/logotip4ik/keycap/commit/394db729))
- Style inner links differently ([7f5cb8c4](https://github.com/logotip4ik/keycap/commit/7f5cb8c4))
- Add additional check for user workspace ([bfa170af](https://github.com/logotip4ik/keycap/commit/bfa170af))
- Tell vue that shortcuts will not change ([4ab80e03](https://github.com/logotip4ik/keycap/commit/4ab80e03))
- Add note to function ([f10d7000](https://github.com/logotip4ik/keycap/commit/f10d7000))
- Align mocks with link extension ([cf926cbc](https://github.com/logotip4ik/keycap/commit/cf926cbc))
- Update deps ([101e4185](https://github.com/logotip4ik/keycap/commit/101e4185))
- Unwatch only git objects ([04ba0400](https://github.com/logotip4ik/keycap/commit/04ba0400))
- Clear editor content on unmount ([f96a363e](https://github.com/logotip4ik/keycap/commit/f96a363e))
- Patch nuxt to remove `ohash` from client bundle ([604b0d33](https://github.com/logotip4ik/keycap/commit/604b0d33))
- Remove transition delay ([f27dd344](https://github.com/logotip4ik/keycap/commit/f27dd344))
- Install floating-ui/dom ([7b470ac4](https://github.com/logotip4ik/keycap/commit/7b470ac4))
- Add flip middleware for bubble menu ([b0d76892](https://github.com/logotip4ik/keycap/commit/b0d76892))
- Install enum for matching prisma errors ([64beccb1](https://github.com/logotip4ik/keycap/commit/64beccb1))
- Auto import PrismaError enum ([c6cbf0ac](https://github.com/logotip4ik/keycap/commit/c6cbf0ac))
- Add function mocks for bubble menu plugin ([486b7a9f](https://github.com/logotip4ik/keycap/commit/486b7a9f))
- Add message if unique constrain failed ([4bde91be](https://github.com/logotip4ik/keycap/commit/4bde91be))
- Pass error message via `message` prop ([b9fd4ad3](https://github.com/logotip4ik/keycap/commit/b9fd4ad3))
- Provide error message for some error codes ([fe09045e](https://github.com/logotip4ik/keycap/commit/fe09045e))
- Handle item-helpers functions errors ([942a1983](https://github.com/logotip4ik/keycap/commit/942a1983))
- Export error message into separate variable ([ec62bbe8](https://github.com/logotip4ik/keycap/commit/ec62bbe8))
- Show correct error message in login and register page ([0c69fbd7](https://github.com/logotip4ik/keycap/commit/0c69fbd7))
- Resolve workbox-window to esm version ([42493fce](https://github.com/logotip4ik/keycap/commit/42493fce))
- Update hash function in patch to use triple equals ([7a317a25](https://github.com/logotip4ik/keycap/commit/7a317a25))
- Directly compare with `undefined` ([23c2b75e](https://github.com/logotip4ik/keycap/commit/23c2b75e))
- Optimize legibility ([95e9104c](https://github.com/logotip4ik/keycap/commit/95e9104c))

### 🎨 Styles

- Add empty line at the end ([8bea26f1](https://github.com/logotip4ik/keycap/commit/8bea26f1))
- Format with eslint ([d2e71dcd](https://github.com/logotip4ik/keycap/commit/d2e71dcd))
- Move floating imports closer to each other ([9e85e880](https://github.com/logotip4ik/keycap/commit/9e85e880))
- Remove duplicate whitespace ([50c9e29e](https://github.com/logotip4ik/keycap/commit/50c9e29e))

### 🤖 CI

- Bump the actions/setup-node ([#17](https://github.com/logotip4ik/keycap/pull/17))

### ❤️ Contributors

- Bogdan Kostyuk <bogdankostyuk12@gmail.com>

## v3.8.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.7.4...v3.8.0)

### 🚀 Enhancements

- `getHydrationPromise` util ([f191cfb8](https://github.com/logotip4ik/keycap/commit/f191cfb8))

### 🩹 Fixes

- Do not refocus to last element if small screen ([6f1ea080](https://github.com/logotip4ik/keycap/commit/6f1ea080))
- Remove content saving before unmounting ([46348704](https://github.com/logotip4ik/keycap/commit/46348704))
- Show note editor skeleton with initial request ([c0510a2d](https://github.com/logotip4ik/keycap/commit/c0510a2d))
- Content was not updated with navigation right after key press ([fbee007c](https://github.com/logotip4ik/keycap/commit/fbee007c))
- Correct input size ([9196fa59](https://github.com/logotip4ik/keycap/commit/9196fa59))
- Set and return note only after hydration ([8d559476](https://github.com/logotip4ik/keycap/commit/8d559476))
- Set and return folder only after hydration ([335802d3](https://github.com/logotip4ik/keycap/commit/335802d3))
- Remove chokidar error of permission denied ([99268f2c](https://github.com/logotip4ik/keycap/commit/99268f2c))

### 💅 Refactors

- Simplify note update logic ([4903a6cd](https://github.com/logotip4ik/keycap/commit/4903a6cd))
- Bump throttling timeout ([6a2dbbde](https://github.com/logotip4ik/keycap/commit/6a2dbbde))
- Use new `future` config to specify bundler resolution ([301e06c1](https://github.com/logotip4ik/keycap/commit/301e06c1))
- Do not return ref to toasts instance ([8fb993be](https://github.com/logotip4ik/keycap/commit/8fb993be))
- Simplify and remove not used code from tiptap ([4bc143a1](https://github.com/logotip4ik/keycap/commit/4bc143a1))
- Optimize list transition styles ([b877fe4d](https://github.com/logotip4ik/keycap/commit/b877fe4d))
- Export transition with fade effect to component ([86d9d312](https://github.com/logotip4ik/keycap/commit/86d9d312))
- Use fade transition component ([38c87fb6](https://github.com/logotip4ik/keycap/commit/38c87fb6))
- Export similar error handling code to function ([ff0e8e9f](https://github.com/logotip4ik/keycap/commit/ff0e8e9f))
- Create wrapper for list transition group ([9376b362](https://github.com/logotip4ik/keycap/commit/9376b362))
- Use list transition wrapper ([c4ff4a49](https://github.com/logotip4ik/keycap/commit/c4ff4a49))
- Put sidebar into `visible` state on bigger screens after close button click ([4821e319](https://github.com/logotip4ik/keycap/commit/4821e319))

### 🏡 Chore

- **release:** V3.7.4 ([a9b0cff9](https://github.com/logotip4ik/keycap/commit/a9b0cff9))
- Simplify tinykeys composable ([837d5faf](https://github.com/logotip4ik/keycap/commit/837d5faf))
- Remove not needed check ([94924213](https://github.com/logotip4ik/keycap/commit/94924213))
- Remove comment ([6b2c1e56](https://github.com/logotip4ik/keycap/commit/6b2c1e56))
- Better function name ([45a3ec8a](https://github.com/logotip4ik/keycap/commit/45a3ec8a))
- Hint vscode to use workspace typescript ([f1446315](https://github.com/logotip4ik/keycap/commit/f1446315))
- Use `v-show` instead of `v-if` ([b64b4f81](https://github.com/logotip4ik/keycap/commit/b64b4f81))
- Remove `will-change` rule ([fcbbd314](https://github.com/logotip4ik/keycap/commit/fcbbd314))
- Remove appear from page component ([45d29be1](https://github.com/logotip4ik/keycap/commit/45d29be1))
- Bump delay before showing skeleton ([a53aa29a](https://github.com/logotip4ik/keycap/commit/a53aa29a))
- Update nuxt and vue ([1a168dd6](https://github.com/logotip4ik/keycap/commit/1a168dd6))
- Remove vite resolution ([b0a2ead8](https://github.com/logotip4ik/keycap/commit/b0a2ead8))
- Rely on nuxt to make initial fetch ([534206b0](https://github.com/logotip4ik/keycap/commit/534206b0))
- Use already precomputed note path ([e50d5fb1](https://github.com/logotip4ik/keycap/commit/e50d5fb1))
- Export `withEditor` function from tiptap ([483d7d28](https://github.com/logotip4ik/keycap/commit/483d7d28))
- Use default rules for curly braces ([14bbe2ea](https://github.com/logotip4ik/keycap/commit/14bbe2ea))
- Minor changes ([47500bcc](https://github.com/logotip4ik/keycap/commit/47500bcc))
- Do not return anything from stub function ([20a0c582](https://github.com/logotip4ik/keycap/commit/20a0c582))
- Use `statusCode` instead of `status` ([0623cb7a](https://github.com/logotip4ik/keycap/commit/0623cb7a))
- Apply eslint rule ([e5a1b3c3](https://github.com/logotip4ik/keycap/commit/e5a1b3c3))
- Make contents list skeleton a bit prettier ([a04dcd9d](https://github.com/logotip4ik/keycap/commit/a04dcd9d))
- Use list transition for contents herader crumbs ([fddee8a0](https://github.com/logotip4ik/keycap/commit/fddee8a0))
- Update vue ([3a9ba585](https://github.com/logotip4ik/keycap/commit/3a9ba585))
- Disable vue options api ([f27f5b1c](https://github.com/logotip4ik/keycap/commit/f27f5b1c))
- Remove comments from transition root ([38f0ef64](https://github.com/logotip4ik/keycap/commit/38f0ef64))
- Add vim files to gitignore ([5173581e](https://github.com/logotip4ik/keycap/commit/5173581e))
- Move list style to separate file ([b3635d25](https://github.com/logotip4ik/keycap/commit/b3635d25))
- Remove vue 3.4.0 resolution ([d27dff5f](https://github.com/logotip4ik/keycap/commit/d27dff5f))
- Use `mouse` events to track `leave` ([e4e1c1e8](https://github.com/logotip4ik/keycap/commit/e4e1c1e8))
- Add bombardier binary to gitignore ([4cdd5c53](https://github.com/logotip4ik/keycap/commit/4cdd5c53))
- Hoist static array ([a0be175e](https://github.com/logotip4ik/keycap/commit/a0be175e))
- Remove not needed `v-bind="$attrs"` ([8387d5c4](https://github.com/logotip4ik/keycap/commit/8387d5c4))
- Put `yet` in the end of sentence ([a0e84530](https://github.com/logotip4ik/keycap/commit/a0e84530))
- Update deps ([97435409](https://github.com/logotip4ik/keycap/commit/97435409))
- Update deps ([508d7ece](https://github.com/logotip4ik/keycap/commit/508d7ece))

### 🎨 Styles

- Oneline callback function ([51e8eee0](https://github.com/logotip4ik/keycap/commit/51e8eee0))

### ❤️ Contributors

- Bogdan Kostyuk <bogdankostyuk12@gmail.com>

## v3.7.4

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.7.3...v3.7.4)

### 🩹 Fixes

- Throw only if id is not defined ([dec35025](https://github.com/logotip4ik/keycap/commit/dec35025))
- Do not pre encode id ([0dd8badd](https://github.com/logotip4ik/keycap/commit/0dd8badd))

### 💅 Refactors

- Simplify search handling ([b39d76de](https://github.com/logotip4ik/keycap/commit/b39d76de))
- Use `sendNoContent` instead of `{ ok: true }` ([c1624f5a](https://github.com/logotip4ik/keycap/commit/c1624f5a))

### 🏡 Chore

- **release:** V3.7.3 ([00f2c3ec](https://github.com/logotip4ik/keycap/commit/00f2c3ec))
- Remove unused validator ([141626d3](https://github.com/logotip4ik/keycap/commit/141626d3))
- Use uncrypto to generate randomUUID ([1d37401e](https://github.com/logotip4ik/keycap/commit/1d37401e))
- Remove not needed global interface ([2233ca62](https://github.com/logotip4ik/keycap/commit/2233ca62))
- Correctly type oauth users ([bbda6859](https://github.com/logotip4ik/keycap/commit/bbda6859))
- Import `randomUUID` from `uncrypto` ([581c3974](https://github.com/logotip4ik/keycap/commit/581c3974))
- Simplify error checking ([793ce8ec](https://github.com/logotip4ik/keycap/commit/793ce8ec))
- Better cors handling ([1fa7ebf8](https://github.com/logotip4ik/keycap/commit/1fa7ebf8))
- Remove async route rules ([8d21bb50](https://github.com/logotip4ik/keycap/commit/8d21bb50))
- Do not proceed with oauth if user is defined ([03bc5948](https://github.com/logotip4ik/keycap/commit/03bc5948))
- Add alias to root folder endpoint ([23dfc687](https://github.com/logotip4ik/keycap/commit/23dfc687))
- Do not use `NuxtLink` for toolbox footer links ([9705c4ba](https://github.com/logotip4ik/keycap/commit/9705c4ba))

### ❤️ Contributors

- Bogdan Kostyuk <bogdankostyuk12@gmail.com>

## v3.7.3

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.7.2...v3.7.3)

### 🩹 Fixes

- Correct type for fuzzy item ([564bc8bf](https://github.com/logotip4ik/keycap/commit/564bc8bf))
- Allow item name spanning full width ([0e132014](https://github.com/logotip4ik/keycap/commit/0e132014))
- Use unknown as offline storage base return type ([9972b20b](https://github.com/logotip4ik/keycap/commit/9972b20b))
- Separate rules overwrite and ignores sections ([2450c53f](https://github.com/logotip4ik/keycap/commit/2450c53f))

### 🏡 Chore

- **release:** V3.7.2 ([59b1b2b7](https://github.com/logotip4ik/keycap/commit/59b1b2b7))
- Remove unused package ([f061b612](https://github.com/logotip4ik/keycap/commit/f061b612))
- Patch nuxt module to correctly insert treeshake comments ([7f54a7b4](https://github.com/logotip4ik/keycap/commit/7f54a7b4))
- Add created items to fuzzy worker rather then refreshing it ([4300c59b](https://github.com/logotip4ik/keycap/commit/4300c59b))
- Minor comment fixes ([820a3af9](https://github.com/logotip4ik/keycap/commit/820a3af9))
- Update deps ([ab6371b7](https://github.com/logotip4ik/keycap/commit/ab6371b7))
- Fix typo ([7dedeb1a](https://github.com/logotip4ik/keycap/commit/7dedeb1a))
- Enchance seo ([6afcd611](https://github.com/logotip4ik/keycap/commit/6afcd611))
- Use same title for twitter og and site ([cf9977b3](https://github.com/logotip4ik/keycap/commit/cf9977b3))
- Better og url resolution ([baa0a305](https://github.com/logotip4ik/keycap/commit/baa0a305))
- Add twitter author prop ([9014a886](https://github.com/logotip4ik/keycap/commit/9014a886))
- Use server head in server only block ([3a78bf34](https://github.com/logotip4ik/keycap/commit/3a78bf34))
- Use static import for font url resolution ([58599f0b](https://github.com/logotip4ik/keycap/commit/58599f0b))
- Use jpg image as og image ([660eae4b](https://github.com/logotip4ik/keycap/commit/660eae4b))
- Allow prefetching and preloading icons components ([84f16e27](https://github.com/logotip4ik/keycap/commit/84f16e27))
- Add loading indication for creating new item ([07affaf6](https://github.com/logotip4ik/keycap/commit/07affaf6))
- Show toast if something went wrong ([0e16e80d](https://github.com/logotip4ik/keycap/commit/0e16e80d))
- Remove dev error with window being undefined ([a5df925f](https://github.com/logotip4ik/keycap/commit/a5df925f))
- Do not allow use of defineEmits ([426c67f8](https://github.com/logotip4ik/keycap/commit/426c67f8))
- Reduce use of `any` ([b8b01c54](https://github.com/logotip4ik/keycap/commit/b8b01c54))
- Remove unused error supression ([ad685d4e](https://github.com/logotip4ik/keycap/commit/ad685d4e))
- Update eslint and node types ([154d5668](https://github.com/logotip4ik/keycap/commit/154d5668))

### ❤️ Contributors

- Bogdan Kostyuk <bogdankostyuk12@gmail.com>

## v3.7.2

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.7.1...v3.7.2)

### 🩹 Fixes

- Do handle focus trapping also for small screens ([5a8a3d8](https://github.com/logotip4ik/keycap/commit/5a8a3d8))
- All fuzzy worker functions should return promises ([1fccf23](https://github.com/logotip4ik/keycap/commit/1fccf23))
- Exclude data folder from tests ([a7a8d9d](https://github.com/logotip4ik/keycap/commit/a7a8d9d))
- Restore creating item after reassigning folder ([d1fcee2](https://github.com/logotip4ik/keycap/commit/d1fcee2))

### 💅 Refactors

- Remove not needed variable ([e90c2f7](https://github.com/logotip4ik/keycap/commit/e90c2f7))
- Typesafe fuzzy worker functions ([1188d47](https://github.com/logotip4ik/keycap/commit/1188d47))
- Extract folder path to computed ([0c1d48c](https://github.com/logotip4ik/keycap/commit/0c1d48c))
- Include types from root for workers ([5603643](https://github.com/logotip4ik/keycap/commit/5603643))
- Rename and move nitro setup to stub-nitro ([b21d36e](https://github.com/logotip4ik/keycap/commit/b21d36e))
- Use vitest default exclude variable ([6b1cc66](https://github.com/logotip4ik/keycap/commit/6b1cc66))
- Simplify new shortcut function ([deea5b5](https://github.com/logotip4ik/keycap/commit/deea5b5))
- Add link to log out ([d5a25b0](https://github.com/logotip4ik/keycap/commit/d5a25b0))
- Add route handler for deleting auth cookie ([4aea67e](https://github.com/logotip4ik/keycap/commit/4aea67e))
- Custom is fallback ref ([5153710](https://github.com/logotip4ik/keycap/commit/5153710))

### 🏡 Chore

- **release:** V3.7.1 ([f3967e2](https://github.com/logotip4ik/keycap/commit/f3967e2))
- Install comlink for dev only envs ([1fd6b23](https://github.com/logotip4ik/keycap/commit/1fd6b23))
- Make sure node env set to production when building ([eab8db5](https://github.com/logotip4ik/keycap/commit/eab8db5))
- Patch command score to use esm named export ([5112930](https://github.com/logotip4ik/keycap/commit/5112930))
- Fix oxlint's pedantic warnings ([203bac6](https://github.com/logotip4ik/keycap/commit/203bac6))
- Don't use concat on string ([f2fa312](https://github.com/logotip4ik/keycap/commit/f2fa312))
- Update deps ([3692941](https://github.com/logotip4ik/keycap/commit/3692941))
- Clear watcher after call ([f00fec6](https://github.com/logotip4ik/keycap/commit/f00fec6))
- Remove not needed wait for nextTick ([7eda064](https://github.com/logotip4ik/keycap/commit/7eda064))
- Migrate to vite 5 ([e7dbf7e](https://github.com/logotip4ik/keycap/commit/e7dbf7e))
- Tweak sucrase options ([f1947e9](https://github.com/logotip4ik/keycap/commit/f1947e9))
- Apply build config for nitro as well ([488219b](https://github.com/logotip4ik/keycap/commit/488219b))
- Enable tree shaking for nitro ([b834cf2](https://github.com/logotip4ik/keycap/commit/b834cf2))
- Remove not needed output options ([01011b3](https://github.com/logotip4ik/keycap/commit/01011b3))
- Add data folder to ignore ([04f6957](https://github.com/logotip4ik/keycap/commit/04f6957))
- Add data folder to vite server and fs ignore ([c8885a3](https://github.com/logotip4ik/keycap/commit/c8885a3))

### 🎨 Styles

- Invert if-else statement ([303290f](https://github.com/logotip4ik/keycap/commit/303290f))
- Move comment to correct line ([e1b8025](https://github.com/logotip4ik/keycap/commit/e1b8025))
- Remove redundant whitespace ([efc3921](https://github.com/logotip4ik/keycap/commit/efc3921))

### ❤️ Contributors

- Bogdan Kostyuk <bogdankostyuk12@gmail.com>

## v3.7.1

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.7.0...v3.7.1)

### 🩹 Fixes

- Correct transition name ([297926e](https://github.com/logotip4ik/keycap/commit/297926e))
- Do not update editor contents if user is typing ([a46f6b4](https://github.com/logotip4ik/keycap/commit/a46f6b4))

### 💅 Refactors

- Move toolbox utils section into folder ([2f43186](https://github.com/logotip4ik/keycap/commit/2f43186))
- Make button height same as contents list item ([b4e0347](https://github.com/logotip4ik/keycap/commit/b4e0347))
- Allow components as utils ([8a27984](https://github.com/logotip4ik/keycap/commit/8a27984))
- Move item details button to separate component ([651d82e](https://github.com/logotip4ik/keycap/commit/651d82e))
- Move open search button into separate component ([9398711](https://github.com/logotip4ik/keycap/commit/9398711))
- Use only components for utils ([87acbb1](https://github.com/logotip4ik/keycap/commit/87acbb1))
- Move utils buttons under their own folder ([20730be](https://github.com/logotip4ik/keycap/commit/20730be))
- Hide toolbox sidebar if needed ([b6c5c4d](https://github.com/logotip4ik/keycap/commit/b6c5c4d))
- Rename function and lower debounce time ([1634dad](https://github.com/logotip4ik/keycap/commit/1634dad))
- Return `isTyping` ref to user ([ff68c61](https://github.com/logotip4ik/keycap/commit/ff68c61))
- Enable relation joins for prisma ([0c5212e](https://github.com/logotip4ik/keycap/commit/0c5212e))
- Use `coincident` instead of `comlink` ([#15](https://github.com/logotip4ik/keycap/pull/15))
- Do not create new object on each function call ([c61d384](https://github.com/logotip4ik/keycap/commit/c61d384))

### 🏡 Chore

- **release:** V3.7.0 ([23ce41b](https://github.com/logotip4ik/keycap/commit/23ce41b))
- Remove not used patch file ([5166635](https://github.com/logotip4ik/keycap/commit/5166635))
- Update deps ([c342180](https://github.com/logotip4ik/keycap/commit/c342180))
- Remove nonexistant files ([a88d420](https://github.com/logotip4ik/keycap/commit/a88d420))
- Remove comment ([17e7dfd](https://github.com/logotip4ik/keycap/commit/17e7dfd))
- Fix typo ([4166e22](https://github.com/logotip4ik/keycap/commit/4166e22))

### 🎨 Styles

- Add empty line and break import ([b93f400](https://github.com/logotip4ik/keycap/commit/b93f400))
- Remove not needed type imports ([867d8b6](https://github.com/logotip4ik/keycap/commit/867d8b6))

### ❤️ Contributors

- Bogdan Kostyuk <bogdankostyuk12@gmail.com>

## v3.7.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.6.0...v3.7.0)

### 🚀 Enhancements

- Tiptap composable ([#13](https://github.com/logotip4ik/keycap/pull/13))

### 🩹 Fixes

- Explicitly import transliterate funcion ([ad35080](https://github.com/logotip4ik/keycap/commit/ad35080))

### 💅 Refactors

- Rename function to match its actions ([a8396a0](https://github.com/logotip4ik/keycap/commit/a8396a0))
- Add from english transliteration ([239d744](https://github.com/logotip4ik/keycap/commit/239d744))
- Use different transliteration based on first letter ([5afd3c6](https://github.com/logotip4ik/keycap/commit/5afd3c6))
- Add back `.data` accessor to get error status message ([8ea66d3](https://github.com/logotip4ik/keycap/commit/8ea66d3))
- Do not run auth plugin on island context ([c908a7b](https://github.com/logotip4ik/keycap/commit/c908a7b))
- Do not stringify bigint ([fb29135](https://github.com/logotip4ik/keycap/commit/fb29135))
- Do not refetch items too early ([14af612](https://github.com/logotip4ik/keycap/commit/14af612))
- Remove off call when seen an error ([cbec9a1](https://github.com/logotip4ik/keycap/commit/cbec9a1))
- Remove v-once directive from welcome component ([5ccbcee](https://github.com/logotip4ik/keycap/commit/5ccbcee))
- Use dynamic `Component` to render formatter wrapper ([56848c0](https://github.com/logotip4ik/keycap/commit/56848c0))
- Use PascalCase naming for built-in components ([781a208](https://github.com/logotip4ik/keycap/commit/781a208))
- Use PascalCase folder naming ([b02eaff](https://github.com/logotip4ik/keycap/commit/b02eaff))
- Correct typings for web workers ([08f7ac6](https://github.com/logotip4ik/keycap/commit/08f7ac6))

### 🏡 Chore

- **release:** V3.6.0 ([169b670](https://github.com/logotip4ik/keycap/commit/169b670))
- Update package manager ([4513127](https://github.com/logotip4ik/keycap/commit/4513127))
- Experimental bun dockerfile for production ([ef7ae9d](https://github.com/logotip4ik/keycap/commit/ef7ae9d))
- Completely comment out not used code ([bb79ab6](https://github.com/logotip4ik/keycap/commit/bb79ab6))
- Update deps ([cd9903a](https://github.com/logotip4ik/keycap/commit/cd9903a))
- Hide node_modules and some `.` folders ([4dc5390](https://github.com/logotip4ik/keycap/commit/4dc5390))
- Add reference to store types ([425a286](https://github.com/logotip4ik/keycap/commit/425a286))

### ❤️ Contributors

- Bogdan Kostyuk <bogdankostyuk12@gmail.com>

## v3.6.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.5.0...v3.6.0)

### 🚀 Enhancements

- `sr-only` helper class ([64cd4dc](https://github.com/logotip4ik/keycap/commit/64cd4dc))
- Provide wrapper composabels for injections ([55dc459](https://github.com/logotip4ik/keycap/commit/55dc459))

### 🩹 Fixes

- Prevent focus traping on small screens ([b0de5fc](https://github.com/logotip4ik/keycap/commit/b0de5fc))
- Remove not needed and broken type import ([3bd3877](https://github.com/logotip4ik/keycap/commit/3bd3877))
- Use `?` to check if offsetParent exists ([3b03c7c](https://github.com/logotip4ik/keycap/commit/3b03c7c))
- Pwa could be undefined ([592d1d0](https://github.com/logotip4ik/keycap/commit/592d1d0))
- Correctly store item ([ef199a7](https://github.com/logotip4ik/keycap/commit/ef199a7))

### 💅 Refactors

- Do not await async data in item details modal ([0cf7039](https://github.com/logotip4ik/keycap/commit/0cf7039))
- Move prisma related type imports to type files ([5d8c7c3](https://github.com/logotip4ik/keycap/commit/5d8c7c3))
- Mark tiptap packages to optimization ([e594e97](https://github.com/logotip4ik/keycap/commit/e594e97))
- Make spacing even ([4e62653](https://github.com/logotip4ik/keycap/commit/4e62653))
- Remove not needed width rule ([022b7ac](https://github.com/logotip4ik/keycap/commit/022b7ac))
- Remove not needed class ([f230f9d](https://github.com/logotip4ik/keycap/commit/f230f9d))
- Move list transitions classes to user page styles ([99810ce](https://github.com/logotip4ik/keycap/commit/99810ce))
- Use existing `hidden` type for hidden input ([96eca31](https://github.com/logotip4ik/keycap/commit/96eca31))
- Hide sidebar after creating or renaming action ([248525d](https://github.com/logotip4ik/keycap/commit/248525d))
- Bump back editor font size ([116ea08](https://github.com/logotip4ik/keycap/commit/116ea08))
- Inline props interface into defineProps function ([8ce459b](https://github.com/logotip4ik/keycap/commit/8ce459b))
- Use composable to get small screen injection ([d93b8c8](https://github.com/logotip4ik/keycap/commit/d93b8c8))
- Correct object type ([1ac606c](https://github.com/logotip4ik/keycap/commit/1ac606c))
- Rework oauth options setting ([7c51497](https://github.com/logotip4ik/keycap/commit/7c51497))
- Move `assertNoOAuthErrors` to separate oauth validation file ([4b49baf](https://github.com/logotip4ik/keycap/commit/4b49baf))
- Add config to each provider and `URL` to set query ([fc75592](https://github.com/logotip4ik/keycap/commit/fc75592))
- Add little border smoothing for blockquote ([f9e86ce](https://github.com/logotip4ik/keycap/commit/f9e86ce))
- Replace lru-cache-nano with hashlru in deps optimizations ([f209e57](https://github.com/logotip4ik/keycap/commit/f209e57))
- Migrate to hashlru ([3b65502](https://github.com/logotip4ik/keycap/commit/3b65502))
- Do not use `path` prop for reference ([260caae](https://github.com/logotip4ik/keycap/commit/260caae))
- Use files instead of include ([6e71e69](https://github.com/logotip4ik/keycap/commit/6e71e69))

### 🏡 Chore

- **release:** V3.5.0 ([691cb61](https://github.com/logotip4ik/keycap/commit/691cb61))
- Add static replacement for `process.browser` ([d69a1bf](https://github.com/logotip4ik/keycap/commit/d69a1bf))
- Add .vercelignore ([73b529f](https://github.com/logotip4ik/keycap/commit/73b529f))
- Update deps ([4a63cb2](https://github.com/logotip4ik/keycap/commit/4a63cb2))
- Use latest vue ([8a4b8e6](https://github.com/logotip4ik/keycap/commit/8a4b8e6))
- Install hashlru and remove lru-cache-nano ([2e7df89](https://github.com/logotip4ik/keycap/commit/2e7df89))
- Patch command-score with types file ([c006a80](https://github.com/logotip4ik/keycap/commit/c006a80))
- Patch hashlru to use esm modules ([497b818](https://github.com/logotip4ik/keycap/commit/497b818))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v3.5.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.4.0...v3.5.0)

### 🚀 Enhancements

- Basic `toEnglish` transliteration ([1769fa1](https://github.com/logotip4ik/keycap/commit/1769fa1))
- Try searching with transliterated query if no results found ([ea5b5c5](https://github.com/logotip4ik/keycap/commit/ea5b5c5))
- `useFocusTrap` composable ([56d4ce9](https://github.com/logotip4ik/keycap/commit/56d4ce9))
- Add `isEnabled` option ([e147247](https://github.com/logotip4ik/keycap/commit/e147247))
- Sucrase server transpiler ([#12](https://github.com/logotip4ik/keycap/pull/12))
- Add build time config variables ([dc399a5](https://github.com/logotip4ik/keycap/commit/dc399a5))

### 🩹 Fixes

- Try to open contents sidebar on menu new action ([5b68cbd](https://github.com/logotip4ik/keycap/commit/5b68cbd))
- Do not proceed after if check ([ef74321](https://github.com/logotip4ik/keycap/commit/ef74321))
- Allow tabbing back with `shift` key ([0b12d12](https://github.com/logotip4ik/keycap/commit/0b12d12))
- Do not query hidden elements ([f148e8a](https://github.com/logotip4ik/keycap/commit/f148e8a))
- Do not watch for subtree mutations ([f99dfd6](https://github.com/logotip4ik/keycap/commit/f99dfd6))
- Correct path for headers config import ([1be24b0](https://github.com/logotip4ik/keycap/commit/1be24b0))

### 💅 Refactors

- Remove not needed rollup hint ([4627f01](https://github.com/logotip4ik/keycap/commit/4627f01))
- Rename SerializedNote type to NoteWithContents and use Serialize type instead of manually converting bigint to string ([ca014dc](https://github.com/logotip4ik/keycap/commit/ca014dc))
- Declare new type instead of extending interface from type ([5f4c833](https://github.com/logotip4ik/keycap/commit/5f4c833))
- Shorten path to empty note ([cca645c](https://github.com/logotip4ik/keycap/commit/cca645c))
- Use `v-show` rather then `v-if` for toolbox util button ([827d826](https://github.com/logotip4ik/keycap/commit/827d826))
- Try preloading `focus-trap-js`  when idle ([08be86c](https://github.com/logotip4ik/keycap/commit/08be86c))
- Rename function paramater ([91a8eb4](https://github.com/logotip4ik/keycap/commit/91a8eb4))
- Remove duplicated prettify type helper declaration ([9cb6004](https://github.com/logotip4ik/keycap/commit/9cb6004))
- Hoist path resolution out of asyncData handler ([cda3126](https://github.com/logotip4ik/keycap/commit/cda3126))
- Rename function name to something more meaningfull ([11965d1](https://github.com/logotip4ik/keycap/commit/11965d1))
- Hoist DateTimeFormat out of function scope ([354f37f](https://github.com/logotip4ik/keycap/commit/354f37f))
- Reuse already declared item path ([5515e4c](https://github.com/logotip4ik/keycap/commit/5515e4c))
- Add v-once to item details skeleton preloader ([a8fcb8f](https://github.com/logotip4ik/keycap/commit/a8fcb8f))
- Move returned arrow function to outer scope ([305c25d](https://github.com/logotip4ik/keycap/commit/305c25d))
- Rename `useToast` to `useToaster` ([20f5989](https://github.com/logotip4ik/keycap/commit/20f5989))
- Remove not used composable ([53d55c0](https://github.com/logotip4ik/keycap/commit/53d55c0))
- Move some index markup to server components ([0f68bd0](https://github.com/logotip4ik/keycap/commit/0f68bd0))
- Use custom `useFocusTrap` composable instead of `focus-trap-js` package ([2df652e](https://github.com/logotip4ik/keycap/commit/2df652e))
- Exclude some code from server bundle ([4448c8f](https://github.com/logotip4ik/keycap/commit/4448c8f))
- Remove not needed `filter(Boolean)` ([ed65691](https://github.com/logotip4ik/keycap/commit/ed65691))
- Use `false` value to tree shake vitest ([408baa8](https://github.com/logotip4ik/keycap/commit/408baa8))
- Also use `false` value as `import.meta.vitest` replacement ([737f983](https://github.com/logotip4ik/keycap/commit/737f983))
- Reduce `querySelectorAll` calls ([5a9c1e3](https://github.com/logotip4ik/keycap/commit/5a9c1e3))
- Invert if check and handle refocus only for first and last elements ([cd93343](https://github.com/logotip4ik/keycap/commit/cd93343))
- Remove initial focus handling from sidebars ([b3baf8f](https://github.com/logotip4ik/keycap/commit/b3baf8f))
- Remove not needed focus handling ([7945cb1](https://github.com/logotip4ik/keycap/commit/7945cb1))
- Set scheduled to true by default and also watch for isEnabled ([ff34a2b](https://github.com/logotip4ik/keycap/commit/ff34a2b))
- Separate initial focus handling into another watcher ([44040b5](https://github.com/logotip4ik/keycap/commit/44040b5))
- Remove not needed `isEnabled` option ([19e0ebb](https://github.com/logotip4ik/keycap/commit/19e0ebb))
- Use reactivity to simulate `isEnabled` option prop ([f6a3581](https://github.com/logotip4ik/keycap/commit/f6a3581))
- Reset `scheduled` and `cachedEls` in stop function ([7a8e5b4](https://github.com/logotip4ik/keycap/commit/7a8e5b4))
- Remove `lastFocusedEl` handling and add note ([edff3f5](https://github.com/logotip4ik/keycap/commit/edff3f5))
- Also clear `off` and `observer` ([8e60d6d](https://github.com/logotip4ik/keycap/commit/8e60d6d))
- Handle last focused el only when current el is not defined ([c53b530](https://github.com/logotip4ik/keycap/commit/c53b530))
- Rename function name to something more meaningfull ([ad0733f](https://github.com/logotip4ik/keycap/commit/ad0733f))
- Split `toasts` and create toast class instead of plain object ([7b53ec7](https://github.com/logotip4ik/keycap/commit/7b53ec7))
- Rename animation functions ([4d250bc](https://github.com/logotip4ik/keycap/commit/4d250bc))
- Remove not valid entry name ([16a6a43](https://github.com/logotip4ik/keycap/commit/16a6a43))
- Store prevContainerWidth in number rather than string ([7f50467](https://github.com/logotip4ik/keycap/commit/7f50467))
- Animate only when width diff is large enough ([3ab0206](https://github.com/logotip4ik/keycap/commit/3ab0206))
- Create config folder and move `headers.config` file into it ([1d3a2ce](https://github.com/logotip4ik/keycap/commit/1d3a2ce))

### 🏡 Chore

- **release:** V3.4.0 ([1539116](https://github.com/logotip4ik/keycap/commit/1539116))
- Add note ([b384086](https://github.com/logotip4ik/keycap/commit/b384086))
- Remove note ([469999c](https://github.com/logotip4ik/keycap/commit/469999c))
- Add note ([cabb6be](https://github.com/logotip4ik/keycap/commit/cabb6be))
- Add todo ([de3dac9](https://github.com/logotip4ik/keycap/commit/de3dac9))
- Add more packages to optimizer ([d674c68](https://github.com/logotip4ik/keycap/commit/d674c68))
- Remove note ([743c9cb](https://github.com/logotip4ik/keycap/commit/743c9cb))
- Remove not needed `async` ([1e98da3](https://github.com/logotip4ik/keycap/commit/1e98da3))
- Remove not used package ([917ea45](https://github.com/logotip4ik/keycap/commit/917ea45))
- Exclude migrations from vscode search ([9c1a2db](https://github.com/logotip4ik/keycap/commit/9c1a2db))
- Remove comment ([8e25f77](https://github.com/logotip4ik/keycap/commit/8e25f77))
- Add note ([450a0a8](https://github.com/logotip4ik/keycap/commit/450a0a8))
- Add toasts folder to auto import ([cfd42d4](https://github.com/logotip4ik/keycap/commit/cfd42d4))
- Update deps ([ba83177](https://github.com/logotip4ik/keycap/commit/ba83177))

### 🎨 Styles

- Hoist itemDetailsEl ref declaration higher then asyncData ([61193c4](https://github.com/logotip4ik/keycap/commit/61193c4))
- Merge imports ([59a7fb8](https://github.com/logotip4ik/keycap/commit/59a7fb8))
- Do not use `.?` for function call ([86988c9](https://github.com/logotip4ik/keycap/commit/86988c9))
- Use import aliases ([fe3974e](https://github.com/logotip4ik/keycap/commit/fe3974e))
- Remove not needed question mark ([a381171](https://github.com/logotip4ik/keycap/commit/a381171))

### ❤️ Contributors

- Bogdan Kostyuk ([@logotip4ik](http://github.com/logotip4ik))

## v3.4.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.3.0...v3.4.0)

### 🚀 Enhancements

- Footer component for shared note page ([56550e8](https://github.com/logotip4ik/keycap/commit/56550e8))
- Add autofix ci to fix linting issues on push and pr's ([5074044](https://github.com/logotip4ik/keycap/commit/5074044))

### 🩹 Fixes

- Check if `path` property is in item ([ba27e33](https://github.com/logotip4ik/keycap/commit/ba27e33))
- Get correct folder reference for item creation ([4435b6d](https://github.com/logotip4ik/keycap/commit/4435b6d))

### 💅 Refactors

- Change og:description for shared note path ([95c05a1](https://github.com/logotip4ik/keycap/commit/95c05a1))
- Do not scale up font size in note editor ([fe54cf6](https://github.com/logotip4ik/keycap/commit/fe54cf6))
- Better font size resets ([7f531b4](https://github.com/logotip4ik/keycap/commit/7f531b4))
- Remove caching from ua parsing ([ccbf2c3](https://github.com/logotip4ik/keycap/commit/ccbf2c3))
- Do not provide not used variable ([2420687](https://github.com/logotip4ik/keycap/commit/2420687))
- Put view page header into server component ([c65ffd7](https://github.com/logotip4ik/keycap/commit/c65ffd7))
- Move `view` components to under `pages` folder ([4651419](https://github.com/logotip4ik/keycap/commit/4651419))
- Remove bottom padding from note editor ([67ebb80](https://github.com/logotip4ik/keycap/commit/67ebb80))
- Push footer to the bottom of the page ([eb7f77e](https://github.com/logotip4ik/keycap/commit/eb7f77e))
- Do not push empty message too low ([1f080bf](https://github.com/logotip4ik/keycap/commit/1f080bf))
- Remove not needed fallback object ([272cfed](https://github.com/logotip4ik/keycap/commit/272cfed))
- Use `sendNoContent` instead of returning null ([36b40f6](https://github.com/logotip4ik/keycap/commit/36b40f6))
- Do not return map or array as top level responses ([b2124a1](https://github.com/logotip4ik/keycap/commit/b2124a1))
- Provide prettify type helper and prettify all types ([b89e96d](https://github.com/logotip4ik/keycap/commit/b89e96d))
- Extract actual data from api response object ([91f7fee](https://github.com/logotip4ik/keycap/commit/91f7fee))

### 🏡 Chore

- **release:** V3.3.0 ([6e5691d](https://github.com/logotip4ik/keycap/commit/6e5691d))
- Bump checkbox scaling for firefox ([d04dc73](https://github.com/logotip4ik/keycap/commit/d04dc73))
- Update deps ([ca79a41](https://github.com/logotip4ik/keycap/commit/ca79a41))
- Run lint:fix ([a83f842](https://github.com/logotip4ik/keycap/commit/a83f842))
- Run lint:fix ([15b169c](https://github.com/logotip4ik/keycap/commit/15b169c))

### 🤖 CI

- Use latest preset for updating deps ([7a3f01b](https://github.com/logotip4ik/keycap/commit/7a3f01b))
- Correct branch name ([d968f2c](https://github.com/logotip4ik/keycap/commit/d968f2c))

### ❤️ Contributors

- Bogdan Kostyuk ([@logotip4ik](http://github.com/logotip4ik))

## v3.3.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.2.2...v3.3.0)

### 🚀 Enhancements

- Error color ([d94f601](https://github.com/logotip4ik/keycap/commit/d94f601))
- Mark not valid inputs ([a9547fb](https://github.com/logotip4ik/keycap/commit/a9547fb))

### 💅 Refactors

- Remove not needed mocking ([68745e4](https://github.com/logotip4ik/keycap/commit/68745e4))
- Do not use default export ([6dd8ac9](https://github.com/logotip4ik/keycap/commit/6dd8ac9))
- Optimize remove hooks function call ([6a19b5c](https://github.com/logotip4ik/keycap/commit/6a19b5c))
- Also add alias to error color wrapped in hsl ([c9da17c](https://github.com/logotip4ik/keycap/commit/c9da17c))
- Add same item name re but for client side ([f31dce0](https://github.com/logotip4ik/keycap/commit/f31dce0))
- Use pattern attr on input to validate input ([adde223](https://github.com/logotip4ik/keycap/commit/adde223))

### 🏡 Chore

- **release:** V3.2.2 ([85e137f](https://github.com/logotip4ik/keycap/commit/85e137f))
- Update deps ([66038f3](https://github.com/logotip4ik/keycap/commit/66038f3))
- Update some deps to new major version ([164e4b9](https://github.com/logotip4ik/keycap/commit/164e4b9))
- Force brackets around arrow function argument ([73fe52b](https://github.com/logotip4ik/keycap/commit/73fe52b))
- Patch `rad-event-listener` to correct? package json ([8d9515c](https://github.com/logotip4ik/keycap/commit/8d9515c))

### 🎨 Styles

- Move serverHandlers close to nitro prop ([7744758](https://github.com/logotip4ik/keycap/commit/7744758))

### 🤖 CI

- Bump the actions group with 2 updates ([#10](https://github.com/logotip4ik/keycap/pull/10))
- Update node version ([ed29d95](https://github.com/logotip4ik/keycap/commit/ed29d95))

### ❤️ Contributors

- Bogdan Kostyuk ([@logotip4ik](http://github.com/logotip4ik))

## v3.2.2

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.2.1...v3.2.2)

### 💅 Refactors

- **rollup:** Maybe make build output more deterministic ([96e5037](https://github.com/logotip4ik/keycap/commit/96e5037))
- Use singular endpoint names for note and folder ([417b55b](https://github.com/logotip4ik/keycap/commit/417b55b))

### 📖 Documentation

- Update api endpoint ([ab37b15](https://github.com/logotip4ik/keycap/commit/ab37b15))
- Specify what prisma version was benchmarked ([e445dd5](https://github.com/logotip4ik/keycap/commit/e445dd5))

### 🏡 Chore

- **release:** V3.2.1 ([d24b73b](https://github.com/logotip4ik/keycap/commit/d24b73b))

### 🎨 Styles

- Add missing trailing comma ([c63f178](https://github.com/logotip4ik/keycap/commit/c63f178))

### ❤️ Contributors

- Bogdan Kostyuk ([@logotip4ik](http://github.com/logotip4ik))

## v3.2.1

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.2.0...v3.2.1)

### 🩹 Fixes

- Deploy fail because header value is not string ([4cd4240](https://github.com/logotip4ik/keycap/commit/4cd4240))

### 🏡 Chore

- **release:** V3.2.0 ([dbd1f03](https://github.com/logotip4ik/keycap/commit/dbd1f03))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v3.2.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.1.7...v3.2.0)

### 🚀 Enhancements

- Better caching for api routes and webmanifest ([#9](https://github.com/logotip4ik/keycap/pull/9))

### 🩹 Fixes

- Move html class handling to client and server side ([5f7c045](https://github.com/logotip4ik/keycap/commit/5f7c045))
- **chrome:** Not showing nested backdrop-filters ([8ea0a86](https://github.com/logotip4ik/keycap/commit/8ea0a86))
- Sidebar blur interearing with contents ([9f9cafc](https://github.com/logotip4ik/keycap/commit/9f9cafc))
- Move blur behind text to prevent creating multiple stacking contexts ([9e2b9f7](https://github.com/logotip4ik/keycap/commit/9e2b9f7))
- Use `asyncData` prop to access correct folder reference ([43a5eba](https://github.com/logotip4ik/keycap/commit/43a5eba))

### 💅 Refactors

- Narrow down resolve extensions ([149fd5c](https://github.com/logotip4ik/keycap/commit/149fd5c))
- Watch user immediately in login and register pages ([4391854](https://github.com/logotip4ik/keycap/commit/4391854))
- Lower repload path length ([fd37761](https://github.com/logotip4ik/keycap/commit/fd37761))
- Simplify with blob component ([04eec58](https://github.com/logotip4ik/keycap/commit/04eec58))
- Remove not used dom reference ([b81a446](https://github.com/logotip4ik/keycap/commit/b81a446))
- Remove not needed computed on root array ([0f6d527](https://github.com/logotip4ik/keycap/commit/0f6d527))
- Rename function to something more meaningfull ([fef6c5e](https://github.com/logotip4ik/keycap/commit/fef6c5e))
- Set description in dev mode only ([1fcf90a](https://github.com/logotip4ik/keycap/commit/1fcf90a))
- Simplify title and title template resolution ([150c8ed](https://github.com/logotip4ik/keycap/commit/150c8ed))
- Push to new route instead of replacing when search opens ([98162fd](https://github.com/logotip4ik/keycap/commit/98162fd))
- Try to close search when back button pressed ([ab36222](https://github.com/logotip4ik/keycap/commit/ab36222))
- Remove not used note state variable ([2be39c3](https://github.com/logotip4ik/keycap/commit/2be39c3))
- Show different placeholders depending on item ([0acd557](https://github.com/logotip4ik/keycap/commit/0acd557))
- Add more space between text ([52d5fed](https://github.com/logotip4ik/keycap/commit/52d5fed))
- Create isolation context on root element ([fd8fa3d](https://github.com/logotip4ik/keycap/commit/fd8fa3d))
- Use rems to set initial and smaller font size ([e27afe8](https://github.com/logotip4ik/keycap/commit/e27afe8))
- Remove font rendering styles ([fcf4e87](https://github.com/logotip4ik/keycap/commit/fcf4e87))
- Isolate only at root component ([6a86f20](https://github.com/logotip4ik/keycap/commit/6a86f20))
- Apply nuxt-vitest module only if testing ([a6d9bd5](https://github.com/logotip4ik/keycap/commit/a6d9bd5))
- Create new stacking context in sidebar ([d588d5b](https://github.com/logotip4ik/keycap/commit/d588d5b))
- Remove `will-change` hint ([f975ed9](https://github.com/logotip4ik/keycap/commit/f975ed9))
- Merge before unmount hooks ([0980d7d](https://github.com/logotip4ik/keycap/commit/0980d7d))
- Do not use shortcuts in file names ([7e2b69f](https://github.com/logotip4ik/keycap/commit/7e2b69f))
- Bump a bit checkbox size as item share button ([72488b5](https://github.com/logotip4ik/keycap/commit/72488b5))
- Treat item as folder or note only if item is object ([28e9b6e](https://github.com/logotip4ik/keycap/commit/28e9b6e))
- Rename note and folder api routes to plural names ([e4ced87](https://github.com/logotip4ik/keycap/commit/e4ced87))
- Move login and register endpoints to auth subroute ([78129ed](https://github.com/logotip4ik/keycap/commit/78129ed))
- Rename `/user/refresh` route to `/users/me` ([c874044](https://github.com/logotip4ik/keycap/commit/c874044))
- Provide type hints for rule path ([0a7426a](https://github.com/logotip4ik/keycap/commit/0a7426a))
- Remove and do not export not used stuff ([bccea61](https://github.com/logotip4ik/keycap/commit/bccea61))
- Handle cors request ([cf513dc](https://github.com/logotip4ik/keycap/commit/cf513dc))
- Append `max-age` header for cors ([d5f935d](https://github.com/logotip4ik/keycap/commit/d5f935d))

### 🏡 Chore

- **release:** V3.1.7 ([b1ad168](https://github.com/logotip4ik/keycap/commit/b1ad168))
- Update package maneger ([cecd105](https://github.com/logotip4ik/keycap/commit/cecd105))
- Update lock file to latest version ([8dc4183](https://github.com/logotip4ik/keycap/commit/8dc4183))
- Supres typescript error ([d0d1ce5](https://github.com/logotip4ik/keycap/commit/d0d1ce5))
- Add `.vercel` folder to gitignore ([806c7ba](https://github.com/logotip4ik/keycap/commit/806c7ba))
- Update deps ([a75b41f](https://github.com/logotip4ik/keycap/commit/a75b41f))
- Add note ([bd57f2a](https://github.com/logotip4ik/keycap/commit/bd57f2a))
- Remove not needed comment ([812da47](https://github.com/logotip4ik/keycap/commit/812da47))
- Update yarn ([1fcfcdf](https://github.com/logotip4ik/keycap/commit/1fcfcdf))

### 🎨 Styles

- Move bracket to the new line ([89119e0](https://github.com/logotip4ik/keycap/commit/89119e0))
- Remove whiteline ([0b4e62c](https://github.com/logotip4ik/keycap/commit/0b4e62c))
- Move mutating function closer to source ([9f0df9b](https://github.com/logotip4ik/keycap/commit/9f0df9b))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v3.1.7

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.1.6...v3.1.7)

### 💅 Refactors

- Rely on pixles for root font size ([38205cb](https://github.com/logotip4ik/keycap/commit/38205cb))
- Specify what could be `shallowRef` ([48574af](https://github.com/logotip4ik/keycap/commit/48574af))
- Try to send error if captured one ([ff24b8e](https://github.com/logotip4ik/keycap/commit/ff24b8e))
- Add missing will-change contents property ([f5ede96](https://github.com/logotip4ik/keycap/commit/f5ede96))
- Do not use computed on utils array ([47dce85](https://github.com/logotip4ik/keycap/commit/47dce85))

### 🏡 Chore

- **release:** V3.1.6 ([522cf39](https://github.com/logotip4ik/keycap/commit/522cf39))
- Remove vite from package resolution ([78afb3c](https://github.com/logotip4ik/keycap/commit/78afb3c))
- Install new deps after removing vite from resolutions ([9d4dba0](https://github.com/logotip4ik/keycap/commit/9d4dba0))
- Update deps and refresh lock file ([cc89d0c](https://github.com/logotip4ik/keycap/commit/cc89d0c))
- Add todo ([9713506](https://github.com/logotip4ik/keycap/commit/9713506))
- Remove done todo ([865ec7f](https://github.com/logotip4ik/keycap/commit/865ec7f))
- Remove marked todos and add more clear description ([235db85](https://github.com/logotip4ik/keycap/commit/235db85))
- Install `escape-string-regexp` ([ad904b4](https://github.com/logotip4ik/keycap/commit/ad904b4))
- Escape string before using it in regexp ([8f4073e](https://github.com/logotip4ik/keycap/commit/8f4073e))
- Remove not needed variable ([868b1ed](https://github.com/logotip4ik/keycap/commit/868b1ed))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v3.1.6

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.1.5...v3.1.6)

### 🔥 Performance

- Use shallowRef for input reference ([1e82e95](https://github.com/logotip4ik/keycap/commit/1e82e95))

### 🩹 Fixes

- Correctly get ip ([e13f8e6](https://github.com/logotip4ik/keycap/commit/e13f8e6))
- Add smooth scroll to item ([a2b3d1c](https://github.com/logotip4ik/keycap/commit/a2b3d1c))

### 💅 Refactors

- Pollyfill `.at` only when it is not defined ([28469ac](https://github.com/logotip4ik/keycap/commit/28469ac))
- Also remove post css plugin from postcss config ([5789487](https://github.com/logotip4ik/keycap/commit/5789487))
- Tweak rollup output options ([e8ecbf8](https://github.com/logotip4ik/keycap/commit/e8ecbf8))

### 🏡 Chore

- **release:** V3.1.5 ([d874acb](https://github.com/logotip4ik/keycap/commit/d874acb))
- Update tiptap and repatch link extension to remove linkify dep ([1a65ecf](https://github.com/logotip4ik/keycap/commit/1a65ecf))
- Update deps ([65f0849](https://github.com/logotip4ik/keycap/commit/65f0849))
- Fix typo ([acbff42](https://github.com/logotip4ik/keycap/commit/acbff42))
- Remove not used files ([b3f54dd](https://github.com/logotip4ik/keycap/commit/b3f54dd))
- Correct regexp plugin import ([1a70da0](https://github.com/logotip4ik/keycap/commit/1a70da0))
- Install `nolyfill` ([be8aca7](https://github.com/logotip4ik/keycap/commit/be8aca7))
- Remove postcss plugin to combine media queries ([0427106](https://github.com/logotip4ik/keycap/commit/0427106))
- Hint that prisma is external for client and remove warning ([ab290a4](https://github.com/logotip4ik/keycap/commit/ab290a4))
- Enable recommended treeshake options for rollup ([3f3ed50](https://github.com/logotip4ik/keycap/commit/3f3ed50))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v3.1.5

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.1.4...v3.1.5)

### 💅 Refactors

- Migrate to eslint flat config ([1a207b6](https://github.com/logotip4ik/keycap/commit/1a207b6))

### 🏡 Chore

- **release:** V3.1.4 ([3594b28](https://github.com/logotip4ik/keycap/commit/3594b28))
- Update deps ([5e9d952](https://github.com/logotip4ik/keycap/commit/5e9d952))

### 🎨 Styles

- Fix some eslint complains ([0550206](https://github.com/logotip4ik/keycap/commit/0550206))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v3.1.4

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.1.3...v3.1.4)

### 🩹 Fixes

- Allow creating folders ([fb1820f](https://github.com/logotip4ik/keycap/commit/fb1820f))

### 💅 Refactors

- New input placeholder ([894584c](https://github.com/logotip4ik/keycap/commit/894584c))

### 🏡 Chore

- **release:** V3.1.3 ([a1991fb](https://github.com/logotip4ik/keycap/commit/a1991fb))
- Remove not used files ([669cbaf](https://github.com/logotip4ik/keycap/commit/669cbaf))

### 🎨 Styles

- Run lint:fix ([7da2a96](https://github.com/logotip4ik/keycap/commit/7da2a96))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v3.1.3

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.1.2...v3.1.3)

### 🩹 Fixes

- Pass correct `usernameTaken` prop to `ask-username` page ([2c71fab](https://github.com/logotip4ik/keycap/commit/2c71fab))

### 💅 Refactors

- Set autofocus for first inputs on login and register pages ([62b509c](https://github.com/logotip4ik/keycap/commit/62b509c))

### 🏡 Chore

- Specify type as module ([59c8778](https://github.com/logotip4ik/keycap/commit/59c8778))
- **release:** V3.1.2 ([d92c012](https://github.com/logotip4ik/keycap/commit/d92c012))
- Update deps ([abfcafb](https://github.com/logotip4ik/keycap/commit/abfcafb))
- Force resolve postcss to above  version 8 ([4253269](https://github.com/logotip4ik/keycap/commit/4253269))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v3.1.2

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.1.1...v3.1.2)

### 🩹 Fixes

- Use shared username regexp ([168eae2](https://github.com/logotip4ik/keycap/commit/168eae2))
- Clear oauth state cookie only at error or successful registration ([3c8b64f](https://github.com/logotip4ik/keycap/commit/3c8b64f))
- Tighten oauth state check ([7666305](https://github.com/logotip4ik/keycap/commit/7666305))

### 💅 Refactors

- Add little glow for blockquote element ([0da2217](https://github.com/logotip4ik/keycap/commit/0da2217))
- Do not use rest operator for select params ([a861b4d](https://github.com/logotip4ik/keycap/commit/a861b4d))
- Add autofocus attribute to username input ([552bc85](https://github.com/logotip4ik/keycap/commit/552bc85))
- Set cookie age as session ([60f15f4](https://github.com/logotip4ik/keycap/commit/60f15f4))

### 🏡 Chore

- **release:** V3.1.1 ([3965c72](https://github.com/logotip4ik/keycap/commit/3965c72))
- Bump vite ([9b53e95](https://github.com/logotip4ik/keycap/commit/9b53e95))
- Enable back format on save for vscode ([fc573c5](https://github.com/logotip4ik/keycap/commit/fc573c5))

### 🎨 Styles

- Ternary statement on one line ([f0c40d2](https://github.com/logotip4ik/keycap/commit/f0c40d2))
- Run eslint --fix ([a4b6ff7](https://github.com/logotip4ik/keycap/commit/a4b6ff7))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v3.1.1

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.1.0...v3.1.1)

### 🩹 Fixes

- Delete state cookie in all circumstances ([68177bd](https://github.com/logotip4ik/keycap/commit/68177bd))
- Do not call username taken check if short circuiting ([3e56dc8](https://github.com/logotip4ik/keycap/commit/3e56dc8))

### 🏡 Chore

- **release:** V3.1.0 ([f865899](https://github.com/logotip4ik/keycap/commit/f865899))
- Update vite ([38f4cab](https://github.com/logotip4ik/keycap/commit/38f4cab))
- Update deps ([f9706d2](https://github.com/logotip4ik/keycap/commit/f9706d2))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v3.1.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.0.2...v3.1.0)

### 🚀 Enhancements

- Make unplugin plugin to transform parse-duration calls ([8df4cee](https://github.com/logotip4ik/keycap/commit/8df4cee))
- Also transform parse-duration calls in nitro server ([88795b1](https://github.com/logotip4ik/keycap/commit/88795b1))

### 🩹 Fixes

- All uppercase letters ([4e90c5f](https://github.com/logotip4ik/keycap/commit/4e90c5f))
- **scripts:** Do not fail if resolution version is not defined ([ea62f1b](https://github.com/logotip4ik/keycap/commit/ea62f1b))

### 💅 Refactors

- Use already defined server name variable ([2afef57](https://github.com/logotip4ik/keycap/commit/2afef57))
- Use `===` instead of `startsWith` ([712a5dc](https://github.com/logotip4ik/keycap/commit/712a5dc))
- Use cached version of the function ([7f1f167](https://github.com/logotip4ik/keycap/commit/7f1f167))
- Remove not used tiptap extension ([35c8e2d](https://github.com/logotip4ik/keycap/commit/35c8e2d))
- Show different hints in placeholder depending on previous input ([5b0bb7d](https://github.com/logotip4ik/keycap/commit/5b0bb7d))
- Use `getRequestIP` instead of manually getting ip ([b5e52a0](https://github.com/logotip4ik/keycap/commit/b5e52a0))
- Do not pass options through object ([f0237ea](https://github.com/logotip4ik/keycap/commit/f0237ea))
- Use nitro toplevel minification option ([3e88f86](https://github.com/logotip4ik/keycap/commit/3e88f86))
- Also allow ` ([` char in item name](https://github.com/logotip4ik/keycap/commit/` char in item name))
- Move parse duration transformers into production only plugins ([29243a6](https://github.com/logotip4ik/keycap/commit/29243a6))
- Make server user agent variable instead of function ([132bb8c](https://github.com/logotip4ik/keycap/commit/132bb8c))
- User constants instead of function calls where possible ([034bf9a](https://github.com/logotip4ik/keycap/commit/034bf9a))
- Resolve to abolute path where possible ([3cb5ba8](https://github.com/logotip4ik/keycap/commit/3cb5ba8))
- Use suretype validator to check if jwt payload is valid ([4a91667](https://github.com/logotip4ik/keycap/commit/4a91667))
- Allow dropping not used suretype compile statements ([f1108be](https://github.com/logotip4ik/keycap/commit/f1108be))
- Transform auth constants to camel case ([0b282fe](https://github.com/logotip4ik/keycap/commit/0b282fe))
- Disable app manifest ([7987c61](https://github.com/logotip4ik/keycap/commit/7987c61))

### 🏡 Chore

- **release:** V3.0.2 ([dab1da4](https://github.com/logotip4ik/keycap/commit/dab1da4))
- Install rollup plugin for typescript ([eb713f0](https://github.com/logotip4ik/keycap/commit/eb713f0))
- Remove argument from `useRuntimeConfig` ([34cbc17](https://github.com/logotip4ik/keycap/commit/34cbc17))
- Update deps ([cdcdcce](https://github.com/logotip4ik/keycap/commit/cdcdcce))
- Pin eslint config version ([c7cd782](https://github.com/logotip4ik/keycap/commit/c7cd782))
- Pin vite and remove not maintained packages ([9038916](https://github.com/logotip4ik/keycap/commit/9038916))
- Remove unused error supression ([da57398](https://github.com/logotip4ik/keycap/commit/da57398))
- Update deps ([896d41f](https://github.com/logotip4ik/keycap/commit/896d41f))
- Run lint fix ([901204f](https://github.com/logotip4ik/keycap/commit/901204f))

### 🎨 Styles

- Add missing empty line ([fee5708](https://github.com/logotip4ik/keycap/commit/fee5708))

### 🤖 CI

- Use default mode for auto updating deps ([490d43e](https://github.com/logotip4ik/keycap/commit/490d43e))
- Change update deps schedule to run on fridays ([f107785](https://github.com/logotip4ik/keycap/commit/f107785))
- Bump the actions group with 1 update ([#8](https://github.com/logotip4ik/keycap/pull/8))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- 13be7b6 <Bogdan Kostyuk>

## v3.0.2

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.0.1...v3.0.2)

### 🔥 Performance

- Mock tiptap and prosemirror on server ([12b50ed](https://github.com/logotip4ik/keycap/commit/12b50ed))
- Mock node-fetch pollyfill ([d4a9d37](https://github.com/logotip4ik/keycap/commit/d4a9d37))

### 🩹 Fixes

- Allow esbuild to treeshake inline tests ([9c6e0f3](https://github.com/logotip4ik/keycap/commit/9c6e0f3))
- Add back minification for client ([9d291fb](https://github.com/logotip4ik/keycap/commit/9d291fb))
- Add back server minification ([94e853a](https://github.com/logotip4ik/keycap/commit/94e853a))
- Trigger worker refresh after item list mutations ([8949ed4](https://github.com/logotip4ik/keycap/commit/8949ed4))
- Allow creating notes with cyrillic letters ([4bb3a15](https://github.com/logotip4ik/keycap/commit/4bb3a15))

### 💅 Refactors

- Await `sendRedirect` function ([01e3856](https://github.com/logotip4ik/keycap/commit/01e3856))
- Use `import.meta.env` to allow further optimize and treeshake code ([5a239e0](https://github.com/logotip4ik/keycap/commit/5a239e0))
- Replace `std-env`s `isDevelopment`  and `isProduction`  to better treeshake ([735e0d4](https://github.com/logotip4ik/keycap/commit/735e0d4))
- Hoist import promises into init hook ([6af923e](https://github.com/logotip4ik/keycap/commit/6af923e))
- Also mock eventemitter and isomorphic-ws ([b7e3f61](https://github.com/logotip4ik/keycap/commit/b7e3f61))
- Create resolver with `@nuxt/kit` ([d3e216c](https://github.com/logotip4ik/keycap/commit/d3e216c))
- Also remove isomorphic-ws from nitro server ([98398a3](https://github.com/logotip4ik/keycap/commit/98398a3))
- Use `import.meta` based `prod` and `dev` handlers ([8b430b6](https://github.com/logotip4ik/keycap/commit/8b430b6))
- Move correct types into index file ([cba38fb](https://github.com/logotip4ik/keycap/commit/cba38fb))
- Optimize function by utilizing build flags ([cc1ab6e](https://github.com/logotip4ik/keycap/commit/cc1ab6e))

### 🏡 Chore

- **release:** V3.0.1 ([0a71b06](https://github.com/logotip4ik/keycap/commit/0a71b06))
- Update deps and repatch tiptap link extension ([d74f95e](https://github.com/logotip4ik/keycap/commit/d74f95e))
- Mention patch in lock file ([f3af91c](https://github.com/logotip4ik/keycap/commit/f3af91c))
- Remove note used patches ([57a7257](https://github.com/logotip4ik/keycap/commit/57a7257))
- Refresh lock file ([ef12edd](https://github.com/logotip4ik/keycap/commit/ef12edd))
- Also minify server ([2b9e314](https://github.com/logotip4ik/keycap/commit/2b9e314))
- Remove not needed mocks ([435d42f](https://github.com/logotip4ik/keycap/commit/435d42f))
- Update deps ([b202b25](https://github.com/logotip4ik/keycap/commit/b202b25))
- Install rollup plugin replace ([15bcc13](https://github.com/logotip4ik/keycap/commit/15bcc13))

### 🎨 Styles

- Put bracket on new line ([bf4f48d](https://github.com/logotip4ik/keycap/commit/bf4f48d))

### 🤖 CI

- Update deps only on wednesday ([b5def33](https://github.com/logotip4ik/keycap/commit/b5def33))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v3.0.1

[compare changes](https://github.com/logotip4ik/keycap/compare/v3.0.0...v3.0.1)

### 📖 Documentation

- Mark todo ([cca2500](https://github.com/logotip4ik/keycap/commit/cca2500))

### 🏡 Chore

- **release:** V3.0.0 ([d019cc8](https://github.com/logotip4ik/keycap/commit/d019cc8))
- Update deps ([e97c11c](https://github.com/logotip4ik/keycap/commit/e97c11c))
- Update deps ([b9bdf7d](https://github.com/logotip4ik/keycap/commit/b9bdf7d))

### 🤖 CI

- Remove --local from git user config ([35bb9ee](https://github.com/logotip4ik/keycap/commit/35bb9ee))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- --local <--local>

## v3.0.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.5.0...v3.0.0)

### 🚀 Enhancements

- Client error logging ([#6](https://github.com/logotip4ik/keycap/pull/6))
- Folder renaming ([#7](https://github.com/logotip4ik/keycap/pull/7))

### 🩹 Fixes

- Remove github plugin from eslint config ([c57be88](https://github.com/logotip4ik/keycap/commit/c57be88))
- Provide icons shim ([49c316f](https://github.com/logotip4ik/keycap/commit/49c316f))
- Use correct type for subfolder ([2db6dc8](https://github.com/logotip4ik/keycap/commit/2db6dc8))

### 💅 Refactors

- Remove github eslint plugin ([d6e922a](https://github.com/logotip4ik/keycap/commit/d6e922a))
- Bump a bit toast scale from transition value ([a86b8e6](https://github.com/logotip4ik/keycap/commit/a86b8e6))
- Allow dots in note names ([331aff7](https://github.com/logotip4ik/keycap/commit/331aff7))
- Use `ownerId` in where clause ([61941dc](https://github.com/logotip4ik/keycap/commit/61941dc))
- Don't do anything if already creating ([876ca65](https://github.com/logotip4ik/keycap/commit/876ca65))
- Reuse folder object at return ([6161860](https://github.com/logotip4ik/keycap/commit/6161860))
- Utilize nitro to auto set status ([08d8613](https://github.com/logotip4ik/keycap/commit/08d8613))
- Remove cache and offlineStorage handling in store ([a04328f](https://github.com/logotip4ik/keycap/commit/a04328f))
- Handle offline storage and cache in item helpers ([34bbfb4](https://github.com/logotip4ik/keycap/commit/34bbfb4))
- Move vitest config to vitest file ([14ca4f1](https://github.com/logotip4ik/keycap/commit/14ca4f1))
- ⚠️  Specify allowed characters for item name ([b9cc650](https://github.com/logotip4ik/keycap/commit/b9cc650))

### 🏡 Chore

- **release:** V2.5.0 ([803892f](https://github.com/logotip4ik/keycap/commit/803892f))
- Update deps ([ee47b4c](https://github.com/logotip4ik/keycap/commit/ee47b4c))
- Also update patch resolutions ([2ee4d34](https://github.com/logotip4ik/keycap/commit/2ee4d34))
- Run lint:fix ([e61fd46](https://github.com/logotip4ik/keycap/commit/e61fd46))
- Remove note needed eslint error supression ([31f9bf1](https://github.com/logotip4ik/keycap/commit/31f9bf1))
- Repatch link extension to remove linkifyjs ([ef35e53](https://github.com/logotip4ik/keycap/commit/ef35e53))
- Update deps ([3e1d22f](https://github.com/logotip4ik/keycap/commit/3e1d22f))
- Add todo ([209c104](https://github.com/logotip4ik/keycap/commit/209c104))
- Add todo ([43e5ded](https://github.com/logotip4ik/keycap/commit/43e5ded))
- Update unhead ([fca0b0b](https://github.com/logotip4ik/keycap/commit/fca0b0b))
- Update deps ([c1765dd](https://github.com/logotip4ik/keycap/commit/c1765dd))

### 🤖 CI

- Remove --local from git user config ([942d167](https://github.com/logotip4ik/keycap/commit/942d167))
- Shift update deps schedule to sunday night ([be55a22](https://github.com/logotip4ik/keycap/commit/be55a22))

#### ⚠️ Breaking Changes

- ⚠️  Specify allowed characters for item name ([b9cc650](https://github.com/logotip4ik/keycap/commit/b9cc650))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- --local <--local>

## v2.5.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.4.1...v2.5.0)

### 🚀 Enhancements

- Menu icon ([e0ce0fd](https://github.com/logotip4ik/keycap/commit/e0ce0fd))
- Basic sidebar layout and functionality ([8225d2a](https://github.com/logotip4ik/keycap/commit/8225d2a))
- Sidebar header ([ce333dd](https://github.com/logotip4ik/keycap/commit/ce333dd))
- Sidebar header as server component ([f0139dc](https://github.com/logotip4ik/keycap/commit/f0139dc))
- New contents sidebar ([40dcb74](https://github.com/logotip4ik/keycap/commit/40dcb74))
- Contents sidebar and contents sidebar header ([bd70f91](https://github.com/logotip4ik/keycap/commit/bd70f91))
- Function for making sure there is enough space for sidebar ([07ce1bb](https://github.com/logotip4ik/keycap/commit/07ce1bb))
- Check and close sidebar if there is not enough space ([52a1d94](https://github.com/logotip4ik/keycap/commit/52a1d94))
- Contents list functionality ([a178e99](https://github.com/logotip4ik/keycap/commit/a178e99))
- Copy paste existing contents item menu ([15b6646](https://github.com/logotip4ik/keycap/commit/15b6646))
- Add styles for contents list ([b6b3e12](https://github.com/logotip4ik/keycap/commit/b6b3e12))
- Contents list item, basic navigation ([e05fa88](https://github.com/logotip4ik/keycap/commit/e05fa88))
- Right chevron icon ([3c83c43](https://github.com/logotip4ik/keycap/commit/3c83c43))
- Use breakcrumbs as link to go up folder ([f54fb68](https://github.com/logotip4ik/keycap/commit/f54fb68))
- Input for contents list item ([e375d31](https://github.com/logotip4ik/keycap/commit/e375d31))
- Button for creating new items ([ac5fe05](https://github.com/logotip4ik/keycap/commit/ac5fe05))
- Skeleton for contents list ([dde958b](https://github.com/logotip4ik/keycap/commit/dde958b))
- Recent api route ([20709d8](https://github.com/logotip4ik/keycap/commit/20709d8))
- Disply recent items in toolbox ([33d552a](https://github.com/logotip4ik/keycap/commit/33d552a))
- Skeleton for recent list ([8f5a3d4](https://github.com/logotip4ik/keycap/commit/8f5a3d4))
- Better accessibility for sidebar ([82c9235](https://github.com/logotip4ik/keycap/commit/82c9235))
- Better accessibility for item details component ([5c3def0](https://github.com/logotip4ik/keycap/commit/5c3def0))
- Better accessibility for search component ([1d6166b](https://github.com/logotip4ik/keycap/commit/1d6166b))
- Allow opening toolbox and contents sidebars with keyboard shortcuts ([ab302d4](https://github.com/logotip4ik/keycap/commit/ab302d4))

### 🩹 Fixes

- Correct sidebar spacing ([db53454](https://github.com/logotip4ik/keycap/commit/db53454))
- **types:** After serialization id is typeof string ([98bffca](https://github.com/logotip4ik/keycap/commit/98bffca))
- Check and return second sidebar on small screens ([11ae206](https://github.com/logotip4ik/keycap/commit/11ae206))
- Use index of action in actions array as currently confirming index ([3e064c6](https://github.com/logotip4ik/keycap/commit/3e064c6))
- Some types issues ([4bc36d0](https://github.com/logotip4ik/keycap/commit/4bc36d0))
- Move sidebar breakpoints to constants file ([d09b7bc](https://github.com/logotip4ik/keycap/commit/d09b7bc))
- Correct check for folder ([add89da](https://github.com/logotip4ik/keycap/commit/add89da))
- Actually use time for `setTimeout` ([d6d77f4](https://github.com/logotip4ik/keycap/commit/d6d77f4))
- Repatch nuxt to work even after client side navigation ([d425758](https://github.com/logotip4ik/keycap/commit/d425758))
- Correct type import path ([44cc565](https://github.com/logotip4ik/keycap/commit/44cc565))
- Use 'components:dirs' to exclude old contents files ([9cc2ca5](https://github.com/logotip4ik/keycap/commit/9cc2ca5))
- Correct type for loading toast ([05f8dbe](https://github.com/logotip4ik/keycap/commit/05f8dbe))
- Linter complains ([1700fbb](https://github.com/logotip4ik/keycap/commit/1700fbb))
- Use `ownerId` in where clause ([1346127](https://github.com/logotip4ik/keycap/commit/1346127))
- Trigger refetch after each mount and better types ([f56fb71](https://github.com/logotip4ik/keycap/commit/f56fb71))
- Correct type import path ([36ce6d1](https://github.com/logotip4ik/keycap/commit/36ce6d1))
- Exclude rename option for folder menu ([68a7117](https://github.com/logotip4ik/keycap/commit/68a7117))
- Remove double slashes ([dc3f281](https://github.com/logotip4ik/keycap/commit/dc3f281))
- Remove postbuild hook ([6bc711b](https://github.com/logotip4ik/keycap/commit/6bc711b))
- Also remove postbuild hook call ([9cc19d0](https://github.com/logotip4ik/keycap/commit/9cc19d0))
- Do not use template ref with `v-bind` ([c380c62](https://github.com/logotip4ik/keycap/commit/c380c62))
- Prevent user from creating lots of `creating: true` notes ([e94a540](https://github.com/logotip4ik/keycap/commit/e94a540))
- Add back scroll on x axis ([3d2c503](https://github.com/logotip4ik/keycap/commit/3d2c503))
- Not showing creating note on initial folder note ([17444e8](https://github.com/logotip4ik/keycap/commit/17444e8))
- Add missing classes and add back suspense resolve hook ([1af7c68](https://github.com/logotip4ik/keycap/commit/1af7c68))
- Correct type import path ([83fe756](https://github.com/logotip4ik/keycap/commit/83fe756))
- Close toolbox on recent item click and with small screen ([68ab5ef](https://github.com/logotip4ik/keycap/commit/68ab5ef))
- Use username for user query search ([07af0ad](https://github.com/logotip4ik/keycap/commit/07af0ad))
- Mount event listener when template ref is resolved ([f233ad8](https://github.com/logotip4ik/keycap/commit/f233ad8))
- Do not hide sidebar on keyboard navigation if next link is folder ([030ef5a](https://github.com/logotip4ik/keycap/commit/030ef5a))
- Correct cache key function ([4456352](https://github.com/logotip4ik/keycap/commit/4456352))
- Not scrolling to item on initial render ([64c6601](https://github.com/logotip4ik/keycap/commit/64c6601))
- Correctly type list variable ([7098e0f](https://github.com/logotip4ik/keycap/commit/7098e0f))

### 💅 Refactors

- Remain same spacing at the top for mobile screens ([09c04e3](https://github.com/logotip4ik/keycap/commit/09c04e3))
- Use more width ([feeda94](https://github.com/logotip4ik/keycap/commit/feeda94))
- Lower border color saturation ([9243093](https://github.com/logotip4ik/keycap/commit/9243093))
- Sync skeleton padding with editor ([b166cbc](https://github.com/logotip4ik/keycap/commit/b166cbc))
- Use new sidebar and update styles ([bacb9cc](https://github.com/logotip4ik/keycap/commit/bacb9cc))
- Make open btn icon a bit smaller and lower username color saturation ([5f027d3](https://github.com/logotip4ik/keycap/commit/5f027d3))
- Make sidebar max width a bit bigger ([2e6798b](https://github.com/logotip4ik/keycap/commit/2e6798b))
- Remove not used const definition ([0acb233](https://github.com/logotip4ik/keycap/commit/0acb233))
- Remove border and make smaller max size for mobile screens ([7bc0d85](https://github.com/logotip4ik/keycap/commit/7bc0d85))
- Add sidebar footer to sidebar layout ([58bbcd5](https://github.com/logotip4ik/keycap/commit/58bbcd5))
- Add event for opening search ([77a0f08](https://github.com/logotip4ik/keycap/commit/77a0f08))
- Customize generated route paths ([1cbbd4d](https://github.com/logotip4ik/keycap/commit/1cbbd4d))
- Do not use computed for small screen check ([7baed17](https://github.com/logotip4ik/keycap/commit/7baed17))
- Add correct third link ([fd5e5fd](https://github.com/logotip4ik/keycap/commit/fd5e5fd))
- Rename `fixed` to `pinned` state ([e5baf23](https://github.com/logotip4ik/keycap/commit/e5baf23))
- Move contents to old contents ([54e5775](https://github.com/logotip4ik/keycap/commit/54e5775))
- Make sidebar reusable component ([cbe6ee7](https://github.com/logotip4ik/keycap/commit/cbe6ee7))
- Rename old sidebar to toolbox ([7b8c45a](https://github.com/logotip4ik/keycap/commit/7b8c45a))
- Hide `overflow-x` ([0524cf6](https://github.com/logotip4ik/keycap/commit/0524cf6))
- Change dir values ([1307559](https://github.com/logotip4ik/keycap/commit/1307559))
- Disable custom paths ([4dec02a](https://github.com/logotip4ik/keycap/commit/4dec02a))
- Invert dir ([9503867](https://github.com/logotip4ik/keycap/commit/9503867))
- Use `dir` from sidebar to calculate correct position ([10f19dd](https://github.com/logotip4ik/keycap/commit/10f19dd))
- Rename `sidebar` class to `toolbox` ([2c4cb36](https://github.com/logotip4ik/keycap/commit/2c4cb36))
- Bump block padding for utils button ([bc37f97](https://github.com/logotip4ik/keycap/commit/bc37f97))
- More visually standing out styles for keyboard focus ([d7f8786](https://github.com/logotip4ik/keycap/commit/d7f8786))
- Remove sidebar id ([66341f5](https://github.com/logotip4ik/keycap/commit/66341f5))
- Bind attrs to sidebar element ([aa14ec7](https://github.com/logotip4ik/keycap/commit/aa14ec7))
- Use contents sidebar and mount search show listener ([10e009f](https://github.com/logotip4ik/keycap/commit/10e009f))
- Export sidebar state outside sidebar component ([b1ddc9d](https://github.com/logotip4ik/keycap/commit/b1ddc9d))
- Pass sidebar state as props ([53d2665](https://github.com/logotip4ik/keycap/commit/53d2665))
- Make reusable functions for toolbox and contents sidebars state ([fab554f](https://github.com/logotip4ik/keycap/commit/fab554f))
- Make breakpoint for one sidebar bigger ([8d2c805](https://github.com/logotip4ik/keycap/commit/8d2c805))
- Also handle breakpoint for one sidebar ([1b6ac7b](https://github.com/logotip4ik/keycap/commit/1b6ac7b))
- Better header for contents sidebar ([2221fd9](https://github.com/logotip4ik/keycap/commit/2221fd9))
- Inline constant value ([9e0345e](https://github.com/logotip4ik/keycap/commit/9e0345e))
- Lower folders cache ([ef5065b](https://github.com/logotip4ik/keycap/commit/ef5065b))
- Add serialized note type ([cc8e373](https://github.com/logotip4ik/keycap/commit/cc8e373))
- Change types a bit ([391bf2d](https://github.com/logotip4ik/keycap/commit/391bf2d))
- Use new `SerializedNote` type ([4f8152c](https://github.com/logotip4ik/keycap/commit/4f8152c))
- Narrow down query selector ([04c8604](https://github.com/logotip4ik/keycap/commit/04c8604))
- Use normal width on small screens ([d1efa25](https://github.com/logotip4ik/keycap/commit/d1efa25))
- Bump backdrop blur for sidebars ([9ba703e](https://github.com/logotip4ik/keycap/commit/9ba703e))
- Prefix `--ease` with `sidebar-tr` ([2987b8b](https://github.com/logotip4ik/keycap/commit/2987b8b))
- Add back welcome message ([f6a4f88](https://github.com/logotip4ik/keycap/commit/f6a4f88))
- Remove `overflow-x: hidden` and width from nuxt element ([d9c9de9](https://github.com/logotip4ik/keycap/commit/d9c9de9))
- Use `fixed` position for sidebar ([8f1034e](https://github.com/logotip4ik/keycap/commit/8f1034e))
- Make scrollbar a bit thinner for chrome ([91143ef](https://github.com/logotip4ik/keycap/commit/91143ef))
- Use new treeshakable `import.meta` flags ([9903cfc](https://github.com/logotip4ik/keycap/commit/9903cfc))
- Make scrollbar a bit thinner and add background color ([3d221b8](https://github.com/logotip4ik/keycap/commit/3d221b8))
- A bit more spacing for logo and text ([bf76025](https://github.com/logotip4ik/keycap/commit/bf76025))
- Overwrite color only ([7fc01cd](https://github.com/logotip4ik/keycap/commit/7fc01cd))
- Simplify and move menu item up to list component ([3c484f5](https://github.com/logotip4ik/keycap/commit/3c484f5))
- Make toolbox utils buttons look same as contents list item ([767fba3](https://github.com/logotip4ik/keycap/commit/767fba3))
- Add outline for current menu target ([6a26b7d](https://github.com/logotip4ik/keycap/commit/6a26b7d))
- Wrap lazy components into suspense for transition ([5825c30](https://github.com/logotip4ik/keycap/commit/5825c30))
- Fill all available height ([0981d5a](https://github.com/logotip4ik/keycap/commit/0981d5a))
- Do not use computed for `isFolder` ([2cb8ab6](https://github.com/logotip4ik/keycap/commit/2cb8ab6))
- Focus item input even if it is not mounted immediately ([5ca5eff](https://github.com/logotip4ik/keycap/commit/5ca5eff))
- Change `outlined` class to `selected` ([7a83b68](https://github.com/logotip4ik/keycap/commit/7a83b68))
- Inherit only font family ([93cb5d0](https://github.com/logotip4ik/keycap/commit/93cb5d0))
- Move icons files to it's own directory ([18f3619](https://github.com/logotip4ik/keycap/commit/18f3619))
- Rename "search" button to "open search" ([4849915](https://github.com/logotip4ik/keycap/commit/4849915))
- Remove tabindex from contents list ([e3c5ae4](https://github.com/logotip4ik/keycap/commit/e3c5ae4))
- Move focus list item input function to item helpers ([e3c7f72](https://github.com/logotip4ik/keycap/commit/e3c7f72))
- Add placeholder and background for input ([6bfe9ef](https://github.com/logotip4ik/keycap/commit/6bfe9ef))
- Await async data and add some todos ([fcdc2db](https://github.com/logotip4ik/keycap/commit/fcdc2db))
- Remove min-height and set margin top to all items ([f4d9517](https://github.com/logotip4ik/keycap/commit/f4d9517))
- Take into account items spacing in list top margin ([190d81d](https://github.com/logotip4ik/keycap/commit/190d81d))
- Add `will-change: width` to note element ([40098f4](https://github.com/logotip4ik/keycap/commit/40098f4))
- Basic styling for hr's in sidebar context ([ed67dbd](https://github.com/logotip4ik/keycap/commit/ed67dbd))
- Add hr to split buttons and list ([7469096](https://github.com/logotip4ik/keycap/commit/7469096))
- Remove not needed top margin ([bad16ce](https://github.com/logotip4ik/keycap/commit/bad16ce))
- Move document visibility change listener up to note page file ([ef1e706](https://github.com/logotip4ik/keycap/commit/ef1e706))
- Better styles for create icon ([2f7f7e0](https://github.com/logotip4ik/keycap/commit/2f7f7e0))
- Better note downloader ([86a409f](https://github.com/logotip4ik/keycap/commit/86a409f))
- Better update functions ([34b5f98](https://github.com/logotip4ik/keycap/commit/34b5f98))
- Remove not related push ([40e9799](https://github.com/logotip4ik/keycap/commit/40e9799))
- Export similar properties into one type ([3a28431](https://github.com/logotip4ik/keycap/commit/3a28431))
- More efficient item helpers ([cdad632](https://github.com/logotip4ik/keycap/commit/cdad632))
- Hoist `isFolder` boolean ([f061fb3](https://github.com/logotip4ik/keycap/commit/f061fb3))
- Follow eslint rules ([fa6b72f](https://github.com/logotip4ik/keycap/commit/fa6b72f))
- Remove old contents from auto import, eslint and typescript ([85d4f0c](https://github.com/logotip4ik/keycap/commit/85d4f0c))
- Rework `generateItemRouteParams` to be more efficient ([adb3955](https://github.com/logotip4ik/keycap/commit/adb3955))
- Preload needed components ([91ec5bb](https://github.com/logotip4ik/keycap/commit/91ec5bb))
- Add tinykeys shortcut for creating item ([28f3a25](https://github.com/logotip4ik/keycap/commit/28f3a25))
- Remove class from welcome component ([f13714a](https://github.com/logotip4ik/keycap/commit/f13714a))
- Add styles for empty folder ([5ce9f60](https://github.com/logotip4ik/keycap/commit/5ce9f60))
- Add abort controller for folder fetching ([26dd96a](https://github.com/logotip4ik/keycap/commit/26dd96a))
- Trigger transition on folder path change ([6a4dfbf](https://github.com/logotip4ik/keycap/commit/6a4dfbf))
- Lower color saturation for skeleton background ([ed9d72e](https://github.com/logotip4ik/keycap/commit/ed9d72e))
- Make toolbox buttons smaller ([5c61013](https://github.com/logotip4ik/keycap/commit/5c61013))
- Guard recent route with route rules ([b443af6](https://github.com/logotip4ik/keycap/commit/b443af6))
- Use gradient as hr background ([ff1b1a6](https://github.com/logotip4ik/keycap/commit/ff1b1a6))
- Better spacing for utils ([c072d34](https://github.com/logotip4ik/keycap/commit/c072d34))
- Lower font weight ([3af826b](https://github.com/logotip4ik/keycap/commit/3af826b))
- Move logger initialization into setup ([89b44a7](https://github.com/logotip4ik/keycap/commit/89b44a7))
- Use `shallowReactive` for offlineStorage interface ([c282add](https://github.com/logotip4ik/keycap/commit/c282add))
- More efficient `notePath` algorithm ([a5e18ac](https://github.com/logotip4ik/keycap/commit/a5e18ac))
- Remove not needed leading slash check ([9c5bfee](https://github.com/logotip4ik/keycap/commit/9c5bfee))
- Mark options as optional ([a968afb](https://github.com/logotip4ik/keycap/commit/a968afb))
- Use for loop to generate random width ([b700403](https://github.com/logotip4ik/keycap/commit/b700403))
- Minify service worker with postbuild hook ([a951281](https://github.com/logotip4ik/keycap/commit/a951281))
- Move htmlAttrs class to server only head ([06f3a49](https://github.com/logotip4ik/keycap/commit/06f3a49))
- Rename `Inline` menu to `fixed` and change postfix to `box` instead of `menu` ([bd190f2](https://github.com/logotip4ik/keycap/commit/bd190f2))
- Use `shallowRef` for dom element refs ([22c34e9](https://github.com/logotip4ik/keycap/commit/22c34e9))
- Export sidebar visible states to sidebars file ([9c5e495](https://github.com/logotip4ik/keycap/commit/9c5e495))
- Mark navbar as old exclude from website ([9987213](https://github.com/logotip4ik/keycap/commit/9987213))
- Expose sidebar el and allow focusing on it ([c529f23](https://github.com/logotip4ik/keycap/commit/c529f23))
- Better focus styles ([8bf0c46](https://github.com/logotip4ik/keycap/commit/8bf0c46))
- Add polling timer for recent items ([23bf0b4](https://github.com/logotip4ik/keycap/commit/23bf0b4))
- Set immediate watcher only at client ([8f2ac19](https://github.com/logotip4ik/keycap/commit/8f2ac19))
- Only trap focus on `visible` state ([361d936](https://github.com/logotip4ik/keycap/commit/361d936))
- Remove details button in note editor ([8a6f235](https://github.com/logotip4ik/keycap/commit/8a6f235))
- Add item details button in toolbox utils ([888e96e](https://github.com/logotip4ik/keycap/commit/888e96e))
- Use `focus-visible` ([c3fd15a](https://github.com/logotip4ik/keycap/commit/c3fd15a))
- Refresh font ([aa354c7](https://github.com/logotip4ik/keycap/commit/aa354c7))
- Add missing transition ([34bab99](https://github.com/logotip4ik/keycap/commit/34bab99))
- Hide on common cancel buttons and clicks ([28ecd4a](https://github.com/logotip4ik/keycap/commit/28ecd4a))
- Empty message for recent items ([bab8a34](https://github.com/logotip4ik/keycap/commit/bab8a34))
- Add missing cache:populated handler ([674eb76](https://github.com/logotip4ik/keycap/commit/674eb76))
- Bump padding for list ([91d4ec7](https://github.com/logotip4ik/keycap/commit/91d4ec7))
- Add option for opening item in a new tab ([8c6d04e](https://github.com/logotip4ik/keycap/commit/8c6d04e))
- Allow opening native contextmenu after second click ([baea1bb](https://github.com/logotip4ik/keycap/commit/baea1bb))
- Change menu placement ([8ae4540](https://github.com/logotip4ik/keycap/commit/8ae4540))
- Better styles for keyboard navigation ([ced205b](https://github.com/logotip4ik/keycap/commit/ced205b))
- Hide toolbox on keyboard enter ([c3b696c](https://github.com/logotip4ik/keycap/commit/c3b696c))
- Remove weird y scroll chrome ([a47813a](https://github.com/logotip4ik/keycap/commit/a47813a))
- Better error handling for contents list and note page ([7529a90](https://github.com/logotip4ik/keycap/commit/7529a90))
- Better 404 handling ([cac9361](https://github.com/logotip4ik/keycap/commit/cac9361))
- Exclude op mini from browserslist ([ba8bb53](https://github.com/logotip4ik/keycap/commit/ba8bb53))
- Minify `sw.js` in nitro hook ([cbd55c1](https://github.com/logotip4ik/keycap/commit/cbd55c1))
- Remove not needed attribute toggle ([fe18430](https://github.com/logotip4ik/keycap/commit/fe18430))
- Provider `update-state` callback for contentsList ([99d5566](https://github.com/logotip4ik/keycap/commit/99d5566))
- Make sure contents sidebar is visible on create new item ([592f580](https://github.com/logotip4ik/keycap/commit/592f580))
- Remove wait from cache get function ([dc4914c](https://github.com/logotip4ik/keycap/commit/dc4914c))
- Better keyboard styles ([ab87b1f](https://github.com/logotip4ik/keycap/commit/ab87b1f))
- Add console logs to debug hosted website ([a9b90e2](https://github.com/logotip4ik/keycap/commit/a9b90e2))
- Console log all folder triggers ([da15257](https://github.com/logotip4ik/keycap/commit/da15257))
- Remove console logs ([25fad0c](https://github.com/logotip4ik/keycap/commit/25fad0c))
- Make sure input is focused on mounted ([27de181](https://github.com/logotip4ik/keycap/commit/27de181))
- Always use transition duration as timeout delay ([ec0f232](https://github.com/logotip4ik/keycap/commit/ec0f232))
- Make sure that input is visible on initial render ([8ffc188](https://github.com/logotip4ik/keycap/commit/8ffc188))
- Do not use focusItemInput because  component itself manages focus ([745a078](https://github.com/logotip4ik/keycap/commit/745a078))
- Checkout from `better-sidebars` ([45abc7f](https://github.com/logotip4ik/keycap/commit/45abc7f))
- Better check if both rejected ([5386a28](https://github.com/logotip4ik/keycap/commit/5386a28))
- Remove not needed setTimeout ([245e45c](https://github.com/logotip4ik/keycap/commit/245e45c))
- Remove suspense from tree to improve transition ([f16827a](https://github.com/logotip4ik/keycap/commit/f16827a))
- Add back little timeout ([6d0d472](https://github.com/logotip4ik/keycap/commit/6d0d472))
- Better keyboard styles ([0e9f8b6](https://github.com/logotip4ik/keycap/commit/0e9f8b6))
- Add more specificity to fade leave active class ([561c505](https://github.com/logotip4ik/keycap/commit/561c505))
- Remove not needed fade transition classes ([16e4426](https://github.com/logotip4ik/keycap/commit/16e4426))
- Merge if statements ([cd0216d](https://github.com/logotip4ik/keycap/commit/cd0216d))
- Use 3d transformations and add will-change hint ([dec560a](https://github.com/logotip4ik/keycap/commit/dec560a))
- Also use 3d transforms on open buttons ([f11bb6b](https://github.com/logotip4ik/keycap/commit/f11bb6b))
- Export something from `.d.ts` file ([dd4f2c1](https://github.com/logotip4ik/keycap/commit/dd4f2c1))
- Remove any app.config typings ([68160fe](https://github.com/logotip4ik/keycap/commit/68160fe))
- Remove not used variables ([0d4423e](https://github.com/logotip4ik/keycap/commit/0d4423e))
- Display description for all shortcuts ([3c45856](https://github.com/logotip4ik/keycap/commit/3c45856))
- Lower a bit font size ([218def6](https://github.com/logotip4ik/keycap/commit/218def6))
- Remove shortcuts from small screens ([e9fca5f](https://github.com/logotip4ik/keycap/commit/e9fca5f))
- Move search fade transition styles to search component ([f708cc6](https://github.com/logotip4ik/keycap/commit/f708cc6))
- Give a bit more space for note editor ([071f730](https://github.com/logotip4ik/keycap/commit/071f730))
- Bump padding ([393abce](https://github.com/logotip4ik/keycap/commit/393abce))
- Set maxAge and path for state oauth state cookie ([2d00c09](https://github.com/logotip4ik/keycap/commit/2d00c09))
- Only trigger sidebars hiding if window width changed ([2bdb1b7](https://github.com/logotip4ik/keycap/commit/2bdb1b7))
- Remove show details button ([a6660be](https://github.com/logotip4ik/keycap/commit/a6660be))
- Hide sidebars on print ([ed24e1f](https://github.com/logotip4ik/keycap/commit/ed24e1f))
- Hide details button for for folders ([265a95a](https://github.com/logotip4ik/keycap/commit/265a95a))
- Hint browsers that height will change ([7a7482c](https://github.com/logotip4ik/keycap/commit/7a7482c))
- Hint that height will change ([e8cd022](https://github.com/logotip4ik/keycap/commit/e8cd022))
- **logger:** Capture error message and stack if available ([2ec534f](https://github.com/logotip4ik/keycap/commit/2ec534f))
- Clear state cookie if no errors was found ([8953c6c](https://github.com/logotip4ik/keycap/commit/8953c6c))
- Use transition hooks for animating height ([#4](https://github.com/logotip4ik/keycap/pull/4))
- Bump utils animation duration ([7f0938b](https://github.com/logotip4ik/keycap/commit/7f0938b))
- Bump a bit max width for sidebar ([44ebdb7](https://github.com/logotip4ik/keycap/commit/44ebdb7))
- Do not return `undefined` from async data and call refresh only if state is visible ([c29f378](https://github.com/logotip4ik/keycap/commit/c29f378))
- Simplify visible state check ([47d8a8d](https://github.com/logotip4ik/keycap/commit/47d8a8d))
- Do not load `focus-trap-js` with entry file ([54300d7](https://github.com/logotip4ik/keycap/commit/54300d7))
- Close contents list on keyboard press navigation ([47ab84e](https://github.com/logotip4ik/keycap/commit/47ab84e))
- Do not use computed for actions ([c1a8a59](https://github.com/logotip4ik/keycap/commit/c1a8a59))
- Remove not needed debounce imports ([d72c17b](https://github.com/logotip4ik/keycap/commit/d72c17b))
- Ensure that listener is removed ([9ffb96f](https://github.com/logotip4ik/keycap/commit/9ffb96f))
- Use lazy component for shortcuts ([cf623ed](https://github.com/logotip4ik/keycap/commit/cf623ed))
- Use `cachedFunction` instead of `cachedEventHandler` ([3d5b681](https://github.com/logotip4ik/keycap/commit/3d5b681))
- `href` on NuxtLink ([89bf6aa](https://github.com/logotip4ik/keycap/commit/89bf6aa))
- Patch fontaine module to remove double fallback styles ([08802e8](https://github.com/logotip4ik/keycap/commit/08802e8))
- Remove not used variable ([4741e15](https://github.com/logotip4ik/keycap/commit/4741e15))

### 🏡 Chore

- Add todo ([ac8b99e](https://github.com/logotip4ik/keycap/commit/ac8b99e))
- Do not specify terser options in non ci environment ([2f34bca](https://github.com/logotip4ik/keycap/commit/2f34bca))
- Add todo ([e38c113](https://github.com/logotip4ik/keycap/commit/e38c113))
- Also pre optimize popperjs ([cc35e97](https://github.com/logotip4ik/keycap/commit/cc35e97))
- Add some todos ([bdc7a15](https://github.com/logotip4ik/keycap/commit/bdc7a15))
- Add todo ([b25a2f0](https://github.com/logotip4ik/keycap/commit/b25a2f0))
- Apply patch for syncing asyncData and nuxtData ([0463b45](https://github.com/logotip4ik/keycap/commit/0463b45))
- Update nitro and deps ([2a15c1d](https://github.com/logotip4ik/keycap/commit/2a15c1d))
- Mark and remove some todos ([90ba1e5](https://github.com/logotip4ik/keycap/commit/90ba1e5))
- Install `focus-trap-js` ([a5a343d](https://github.com/logotip4ik/keycap/commit/a5a343d))
- Hint what is open button ([1febde3](https://github.com/logotip4ik/keycap/commit/1febde3))
- Mark todo ([ee800e3](https://github.com/logotip4ik/keycap/commit/ee800e3))
- Add comment ([c9d1df5](https://github.com/logotip4ik/keycap/commit/c9d1df5))
- Also ignore old navbar ([192d0a4](https://github.com/logotip4ik/keycap/commit/192d0a4))
- **release:** V2.4.1 ([abc5164](https://github.com/logotip4ik/keycap/commit/abc5164))
- Bump listhen ([93a9907](https://github.com/logotip4ik/keycap/commit/93a9907))
- Refresh lock file ([fafb6ef](https://github.com/logotip4ik/keycap/commit/fafb6ef))
- Add todos ([a0d151b](https://github.com/logotip4ik/keycap/commit/a0d151b))
- Update package manager ([ea51ce8](https://github.com/logotip4ik/keycap/commit/ea51ce8))
- Refresh lock file ([ea1b7e4](https://github.com/logotip4ik/keycap/commit/ea1b7e4))
- Remove note ([543cae3](https://github.com/logotip4ik/keycap/commit/543cae3))
- Annotate what hooks are doing ([ec07ee7](https://github.com/logotip4ik/keycap/commit/ec07ee7))
- Update deps ([d3fd8ea](https://github.com/logotip4ik/keycap/commit/d3fd8ea))
- Update mona sans to v1.0.1 ([d2e9897](https://github.com/logotip4ik/keycap/commit/d2e9897))
- Lint ([41e9ef6](https://github.com/logotip4ik/keycap/commit/41e9ef6))

### 🎨 Styles

- Put gradient values on a new line ([85cd866](https://github.com/logotip4ik/keycap/commit/85cd866))
- Indentation ([b45597b](https://github.com/logotip4ik/keycap/commit/b45597b))
- Postfix vue component import with `Vue` ([f9856bf](https://github.com/logotip4ik/keycap/commit/f9856bf))
- Move shallowRef under composables ([cc896ad](https://github.com/logotip4ik/keycap/commit/cc896ad))

### 🤖 CI

- **release:** Change release trigger to run on schedule ([651efee](https://github.com/logotip4ik/keycap/commit/651efee))
- Use github-actions as user that makes changes ([6d34942](https://github.com/logotip4ik/keycap/commit/6d34942))
- Bump the actions group with 3 updates ([#5](https://github.com/logotip4ik/keycap/pull/5))
- Remove push action and use setup-git-user action ([2058753](https://github.com/logotip4ik/keycap/commit/2058753))
- Remove `setup-git-user` as it is not working ([e1b17e5](https://github.com/logotip4ik/keycap/commit/e1b17e5))
- Use push example from `checkout` action ([64a35d2](https://github.com/logotip4ik/keycap/commit/64a35d2))
- Just run `lint` command ([63340ef](https://github.com/logotip4ik/keycap/commit/63340ef))
- Use github action to do pushing ([f8c1229](https://github.com/logotip4ik/keycap/commit/f8c1229))
- Do not use `gh` command ([2c04630](https://github.com/logotip4ik/keycap/commit/2c04630))
- Allow automatically installing changelogen ([c0441be](https://github.com/logotip4ik/keycap/commit/c0441be))
- **fix:** Move env out of run command ([e4e5c04](https://github.com/logotip4ik/keycap/commit/e4e5c04))
- Try again with `gh release` command ([58adebc](https://github.com/logotip4ik/keycap/commit/58adebc))
- Use --release flag instead of gh release and use git push command to push changes ([551fd13](https://github.com/logotip4ik/keycap/commit/551fd13))
- Configure git user also for push ([0c4d02f](https://github.com/logotip4ik/keycap/commit/0c4d02f))
- Use PAT to set remote origin and push changes ([f89f7c0](https://github.com/logotip4ik/keycap/commit/f89f7c0))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- Github-actions <github-actions@github.com>
- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))

## v2.4.1

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.4.0...v2.4.1)

### 🏡 Chore

- **release:** V2.4.0 ([aa969d6](https://github.com/logotip4ik/keycap/commit/aa969d6))
- Update deps ([186b151](https://github.com/logotip4ik/keycap/commit/186b151))

### ❤️ Contributors

- Github-actions <github-actions@github.com>
- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))

## v2.4.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.3.9...v2.4.0)

### 🚀 Enhancements

- Actually update nuxt and deps ([382f4cc](https://github.com/logotip4ik/keycap/commit/382f4cc))

### 🏡 Chore

- **release:** V2.3.9 ([ff35b8f](https://github.com/logotip4ik/keycap/commit/ff35b8f))
- Apply fixes ([2f91758](https://github.com/logotip4ik/keycap/commit/2f91758))

### ❤️ Contributors

- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))
- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v2.3.9

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.3.8...v2.3.9)

### 💅 Refactors

- Enable `headNext` ([a10b8fd](https://github.com/logotip4ik/keycap/commit/a10b8fd))
- Remove idle callback polyfill import ([55beb9c](https://github.com/logotip4ik/keycap/commit/55beb9c))

### 🏡 Chore

- **release:** V2.3.8 ([6448b5c](https://github.com/logotip4ik/keycap/commit/6448b5c))
- Update deps ([d18f54d](https://github.com/logotip4ik/keycap/commit/d18f54d))
- Remove not needed idle callback polyfill ([956fe7d](https://github.com/logotip4ik/keycap/commit/956fe7d))
- Also remove idle callback patch ([4e14fd6](https://github.com/logotip4ik/keycap/commit/4e14fd6))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))

## v2.3.8

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.3.7...v2.3.8)

### 💅 Refactors

- Move action handlers to `SearchItem` component ([0515609](https://github.com/logotip4ik/keycap/commit/0515609))
- Directly use result element click handler ([3c0cf6c](https://github.com/logotip4ik/keycap/commit/3c0cf6c))

### 🏡 Chore

- **release:** V2.3.7 ([60eb5be](https://github.com/logotip4ik/keycap/commit/60eb5be))
- Update deps ([dc42329](https://github.com/logotip4ik/keycap/commit/dc42329))

### 🎨 Styles

- Run `lint:fix` ([a4c521f](https://github.com/logotip4ik/keycap/commit/a4c521f))

### 🤖 CI

- Trigger release workflow after updating dependencies ([5d1d57c](https://github.com/logotip4ik/keycap/commit/5d1d57c))
- Remove actions permission ([25633ee](https://github.com/logotip4ik/keycap/commit/25633ee))
- Do not run `lint:fix` against `.github` folder ([7c02ec7](https://github.com/logotip4ik/keycap/commit/7c02ec7))

### ❤️ Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- Github-actions <github-actions@github.com>
- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))

## v2.3.7

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.3.6...v2.3.7)

### 🩹 Fixes

- Open item on mouse and touch clicks ([6eecc9f](https://github.com/logotip4ik/keycap/commit/6eecc9f))

### 💅 Refactors

- Directly specify targets for `lightningscss` ([d871191](https://github.com/logotip4ik/keycap/commit/d871191))
- Lower tranform transition duration ([0df5f24](https://github.com/logotip4ik/keycap/commit/0df5f24))
- Handle all transformations for lightningcss ([a7c0787](https://github.com/logotip4ik/keycap/commit/a7c0787))
- Do not use `screen` in media query ([4ea7528](https://github.com/logotip4ik/keycap/commit/4ea7528))
- Use turnery statements instead of function calls ([c6af469](https://github.com/logotip4ik/keycap/commit/c6af469))
- `pointer` cursor for search item ([1d8d8ee](https://github.com/logotip4ik/keycap/commit/1d8d8ee))

### 🏡 Chore

- **release:** V2.3.6 ([99f1a28](https://github.com/logotip4ik/keycap/commit/99f1a28))
- Install and enable back lightningcss ([acdf6be](https://github.com/logotip4ik/keycap/commit/acdf6be))
- Update yarn ([fc64ee4](https://github.com/logotip4ik/keycap/commit/fc64ee4))
- Optimize css target ([7f03b17](https://github.com/logotip4ik/keycap/commit/7f03b17))
- Uninstall `postcss-preset-env` ([08a63f7](https://github.com/logotip4ik/keycap/commit/08a63f7))
- Use postcss plugin for combining same media queries ([deaa612](https://github.com/logotip4ik/keycap/commit/deaa612))

### 🎨 Styles

- Inline browserslist query ([51afb3f](https://github.com/logotip4ik/keycap/commit/51afb3f))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))

## v2.3.6

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.3.5...v2.3.6)

### 💅 Refactors

- Move client used functions to client utils ([0a460a4](https://github.com/logotip4ik/keycap/commit/0a460a4))
- Trim note and folder names before creation ([d3b1bb9](https://github.com/logotip4ik/keycap/commit/d3b1bb9))

### 🏡 Chore

- **release:** V2.3.5 ([f80b1e3](https://github.com/logotip4ik/keycap/commit/f80b1e3))
- Bump back `std-env` to latest ([71987dd](https://github.com/logotip4ik/keycap/commit/71987dd))
- Fix typo ([b5e0a0b](https://github.com/logotip4ik/keycap/commit/b5e0a0b))
- Apply fixes ([c0f0ccc](https://github.com/logotip4ik/keycap/commit/c0f0ccc))

### ❤️  Contributors

- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))
- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v2.3.5

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.3.4...v2.3.5)

### 🩹 Fixes

- **deps:** Lower `std-env` version ([f52009f](https://github.com/logotip4ik/keycap/commit/f52009f))
- Rework start item to enable animation ([deaad43](https://github.com/logotip4ik/keycap/commit/deaad43))

### 🏡 Chore

- **release:** V2.3.4 ([6f65de3](https://github.com/logotip4ik/keycap/commit/6f65de3))

### 🎨 Styles

- Empty line ([1877cff](https://github.com/logotip4ik/keycap/commit/1877cff))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))

## v2.3.4

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.3.3...v2.3.4)

### 💅 Refactors

- Default count column ([e500732](https://github.com/logotip4ik/keycap/commit/e500732))
- Do not use cache for `info` route ([1614875](https://github.com/logotip4ik/keycap/commit/1614875))

### 🏡 Chore

- **release:** V2.3.3 ([a5cbcf7](https://github.com/logotip4ik/keycap/commit/a5cbcf7))
- Apply fixes ([8eb701a](https://github.com/logotip4ik/keycap/commit/8eb701a))

### ❤️  Contributors

- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))
- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v2.3.3

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.3.2...v2.3.3)

### 🩹 Fixes

- **ci:** Actually commit changes ([83e216f](https://github.com/logotip4ik/keycap/commit/83e216f))

### 🏡 Chore

- **release:** V2.3.2 ([e5c7c43](https://github.com/logotip4ik/keycap/commit/e5c7c43))
- Update deps ([5571e07](https://github.com/logotip4ik/keycap/commit/5571e07))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))

## v2.3.2

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.3.1...v2.3.2)

### 🩹 Fixes

- Redirect to workspace root if 404 ([713a99a](https://github.com/logotip4ik/keycap/commit/713a99a))
- Also redirect to workspace root if 404 on folder ([7fe68da](https://github.com/logotip4ik/keycap/commit/7fe68da))
- Correct folder name in toast text ([1c826e4](https://github.com/logotip4ik/keycap/commit/1c826e4))
- Check if response from search is ok ([745933c](https://github.com/logotip4ik/keycap/commit/745933c))

### 💅 Refactors

- Better error status codes ([b7234f3](https://github.com/logotip4ik/keycap/commit/b7234f3))
- Better error messages if no offline copy was found ([309f809](https://github.com/logotip4ik/keycap/commit/309f809))
- Use `debounce` instead of `useDebounceFn` ([481ca77](https://github.com/logotip4ik/keycap/commit/481ca77))
- Debounce error watchers ([b9a3315](https://github.com/logotip4ik/keycap/commit/b9a3315))
- Check for nuxtError rather then debouncing watcher ([0e6213d](https://github.com/logotip4ik/keycap/commit/0e6213d))
- Use typescript reference ([e043dce](https://github.com/logotip4ik/keycap/commit/e043dce))

### 🏡 Chore

- **release:** V2.3.1 ([7102752](https://github.com/logotip4ik/keycap/commit/7102752))
- Add eslint cache to gitignore ([742ea65](https://github.com/logotip4ik/keycap/commit/742ea65))
- Auto-import `debounce` from `perfect-debounce` ([6298330](https://github.com/logotip4ik/keycap/commit/6298330))
- Apply fixes ([d01342f](https://github.com/logotip4ik/keycap/commit/d01342f))

### 🎨 Styles

- Move minify property lower in object ([6fd40ab](https://github.com/logotip4ik/keycap/commit/6fd40ab))

### ❤️  Contributors

- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))
- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v2.3.1

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.3.0...v2.3.1)

### 📖 Documentation

- Better readme and drizzle benchmark results ([a80f552](https://github.com/logotip4ik/keycap/commit/a80f552))

### 🏡 Chore

- **release:** V2.3.0 ([2fe1cdf](https://github.com/logotip4ik/keycap/commit/2fe1cdf))
- Apply fixes ([b363463](https://github.com/logotip4ik/keycap/commit/b363463))

### ❤️  Contributors

- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))
- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v2.3.0

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.2.7...v2.3.0)

### 🚀 Enhancements

- Add dockerfile for building nuxt app ([c3d4767](https://github.com/logotip4ik/keycap/commit/c3d4767))

### 💅 Refactors

- Use global process ([c3b62a6](https://github.com/logotip4ik/keycap/commit/c3b62a6))
- Add dockerignore file ([a44d741](https://github.com/logotip4ik/keycap/commit/a44d741))
- Use different folders for builder and release stages ([b59dd8d](https://github.com/logotip4ik/keycap/commit/b59dd8d))

### 🏡 Chore

- **release:** V2.2.7 ([e846fb0](https://github.com/logotip4ik/keycap/commit/e846fb0))
- Enforce use of global `process` ([c02ffea](https://github.com/logotip4ik/keycap/commit/c02ffea))
- Apply fixes ([2fa2e89](https://github.com/logotip4ik/keycap/commit/2fa2e89))

### 🎨 Styles

- Always specify `terserOptions` ([fbd0f36](https://github.com/logotip4ik/keycap/commit/fbd0f36))
- Remove whitespaces ([6e7302d](https://github.com/logotip4ik/keycap/commit/6e7302d))

### 🤖 CI

- Use `actions/checkout` to push code back to origin ([1e12c8a](https://github.com/logotip4ik/keycap/commit/1e12c8a))

### ❤️  Contributors

- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))
- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v2.2.7

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.2.6...v2.2.7)

### 🩹 Fixes

- Use correct path for note renaming ([68a73a3](https://github.com/logotip4ik/keycap/commit/68a73a3))

### 🏡 Chore

- **release:** V2.2.6 ([6ff44c5](https://github.com/logotip4ik/keycap/commit/6ff44c5))
- Apply fixes ([4b815e3](https://github.com/logotip4ik/keycap/commit/4b815e3))

### ❤️  Contributors

- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))
- Bogdan Kostyuk <contact@bogdankostyuk.xyz>

## v2.2.6

[compare changes](https://github.com/logotip4ik/keycap/compare/v2.2.5...v2.2.6)

### 💅 Refactors

- Repatch link extension to remove linkifyjs ([7100f8b](https://github.com/logotip4ik/keycap/commit/7100f8b))

### 🏡 Chore

- **release:** V2.2.5 ([7f33416](https://github.com/logotip4ik/keycap/commit/7f33416))
- Update deps ([cc5a13c](https://github.com/logotip4ik/keycap/commit/cc5a13c))
- Apply path for tiptap core ([a4a4df5](https://github.com/logotip4ik/keycap/commit/a4a4df5))

### ❤️  Contributors

- Bogdan Kostyuk <contact@bogdankostyuk.xyz>
- Logotip4ik ([@betterqualityassuranceuser](http://github.com/betterqualityassuranceuser))

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

