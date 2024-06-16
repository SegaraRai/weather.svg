# Why Preact

Preact was chosen as the front-end framework for this project.
It is only used during development, while a static SVG file is generated in production using a customized JSX renderer.

One advantage of using Preact is that it uses unmodified attribute names, simplifying our customized renderer.
Unlike React, there is no need to modify attribute names like `class` to `className` or `font-family` to `fontFamily`.

Additionally, this project utilizes external SVG icons, which are loaded as components by a custom loader plugin during development.
The use of unmodified attribute names in Preact makes it easier to use these icons as components.
