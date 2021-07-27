import * as React from "react";
import { Global } from "@emotion/react";

export const Fonts = () => (
  <Global
    styles={`
			@font-face {
				font-family: 'Minecraft';
				src: url('/fonts/Minecraft.otf') format('otf');
			}
			@font-face {
				font-family: 'Minecraft';
				font-weight: bold;
				src: url('/fonts/MinecraftBold.otf') format('otf');
			}
		`}
  />
);
