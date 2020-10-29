# EBX-Viewer

## Setup

(Using `npm` here, `yarn` is fine too)

1. `npm install`
2. `git submodule update --init --recursive`
3. `npm run build-type-index`
4. Place `assetHashes.json`, `eventHashes.json` and `InterfaceIDs` in `data`
5. Add a game

## Adding a game

1. Create a game directory in `static` (e.g. `static/venice`)
2. Register the game in `src/viewer.ts` (search for `const registries`)
3. Place an EBX JSON dump in `static/<game>/ebx`
5. `npm run build-file-index`
6. `npm run build-partition-index`

Should look something like this:

    static
    \---venice
        +---ebx
        +   +---AI
        |   |   ...
        |   |   +---DriverSettings
        |   |   +---Entries
        |   |   +---Pickups
        |   |   \---Weapons
        |   +---Animations
        |   |   +---Characters
        |   ...
        +---files.json
        \---partitions.json

## Running

`npm run dev`

## Building

1. Delete `dist`
2. `npm run build`

## Deploying

1. Upload the contents of `dist` to a web server serving static files
2. https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
