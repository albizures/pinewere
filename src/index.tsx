import * as React from "react";
import { render } from "react-dom";
import Menu from "./Menu";

const container = document.createElement("div");
document.body.appendChild(container);

render(<Menu />, container);
