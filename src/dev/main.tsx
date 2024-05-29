import { render } from "preact";
import { App } from "./app.tsx";

import "uno.css";
import "./main.css";

render(<App />, document.getElementById("app")!);
