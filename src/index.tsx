/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { installPuzzle } from "./puzzle";
import "./styles/theme.css";
import "./styles/app.css";

installPuzzle();
render(() => <App />, document.getElementById("root")!);
