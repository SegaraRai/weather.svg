# Overview of the `widget` directory

This directory houses the primary widget programs for the project.
Widgets are constructed by directly writing SVG tags in JSX.
Please be aware that a custom runtime is employed for JSX in production, while Preact is utilized during development.
As a result, hooks are not accessible within the widget, and components are limited to returning JSX.

Unlike React, HTML (SVG) attributes should be used as-is, without `className` or `fontSize`.
Certain UnoCSS utility classes are only meant for development and not available in production.
For better compatibility, it is recommended to avoid using CSS in the widget and utilize SVG attributes instead.
