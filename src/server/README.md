# Overview of the `server` directory

This directory houses the server-side program for the project.
It offers an API that generates and delivers widgets in SVG format.
Instead of relying on Preact for server-side JSX rendering, we have developed custom factory functions (located in the `jsx` directory).
To start the preview API server, use the command `pnpm run preview`.
