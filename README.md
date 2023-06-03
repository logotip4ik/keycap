[![SWUbanner](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct-single.svg)](https://stand-with-ukraine.pp.ua/)

# Keycap

<img src="public\android-chrome-192x192.png" align="right"
  alt="Purple keycap with capital letter K" width="150" height="150"/>

Simple note taking app with support for markdown. Organize your notes into folders.

## Why ?

After months of usage windows and android phone, i found out that notes aren't syncing. Plus there wasn't support for markdown. But you can ask why to build something similar to notion? and answer will be pretty simple. With this project i developed my skills and i hope it will load much faster than notion 🙃

## Stack

- [Nuxt](https://nuxt.com/)
- [Prisma](https://prisma.io/)
- [Cockroach DB](https://www.cockroachlabs.com/product/)

## Todo

- [x] custom `ctrl+k` search
- [x] commands through `ctrl+k`
- [ ] add support for renaming __folders__
- [ ] oauth with google and github ?
- [x] show notes via sharable links
- [ ] code highlighting
- [ ] work without internet (kinda working, if page is still cached, notes and folders will be loaded from local copies)
- [ ] create landing page
- [x] create project logo

## Notes

- [prisma vs drizzle (my benchmark)](https://github.com/logotip4ik/keycap/tree/feat/drizzle-orm/benchmarks/prisma-vs-drizzle) tldr: prisma is not far behind (at least on my local machine)
