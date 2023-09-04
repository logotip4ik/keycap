# Changelog


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

