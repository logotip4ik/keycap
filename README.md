[![SWUbanner](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct-single.svg)](https://stand-with-ukraine.pp.ua/)

# Keycap

<img src="public\android-chrome-192x192.png" align="right"
  alt="Purple keycap with capital letter K" width="150" height="150"/>

Simple note taking app with support for markdown. Share your thoughts with others and organize them into folders.

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
- [x] oauth with google and github ?
- [x] show notes via sharable links
- [ ] code highlighting
- [ ] work without internet (kinda working, if page is still cached, notes and folders will be loaded from local copies)
- [ ] create landing page
- [x] create project logo

## Notes

- [prisma vs drizzle (my benchmark)](./benchmarks/prisma-vs-drizzle/README.md)    
  tldr: prisma even manages to beat drizzle in some queries (at least on my local machine)

- [prisma vs kysely (my benchmark)](./benchmarks/prisma-vs-kysely/README.md)    
  tldr: in queries without joins prisma is not that far, but in larger queries, kysely has usually more than 100 ops/s difference

[Rewrite with kysely](https://github.com/logotip4ik/keycap/tree/feat/kysely). Kysely is slightly faster in development environment,
though `node-postgres` isn't well suited for serverless. So to see kysely outperforms prisma you will needed much more traffic then 
few visitors in a week.
