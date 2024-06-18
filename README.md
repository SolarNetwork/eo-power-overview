# Energise Ōtaki: Donut Chart

This project is a small web app to show a basic donut chart
in a TypeScript project to render an accumulating meter reading datum stream in a chart with the [billboard.js][billboard] project to generate a chart out of a SolarNetwork datum stream.

You can see the chart in action here:

<https://go.solarnetwork.net/nz/eo/donut/>

<!--img alt="Screenshot of the Energise Ōtaki Donut Chart app" src="docs/eo-donut-screenshot@2x.png" width="1155"-->

# Building from source

To build yourself, clone or download this repository. You need to have
Node 16+ installed. Then:

```sh
# initialize dependencies
npm ci

# run development live server on http://localhost:8080
npm run dev

# build for production
npm run build
```

Running the `build` script will generate the application into the `dist/` directory.

[billboard]: https://naver.github.io/billboard.js/
