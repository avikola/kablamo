import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		// minification
		minify: "terser",

		// Dev sourcemaps
		sourcemap: true,

		rollupOptions: {
			// Remove redundant dependencies
			treeshake: true,
			output: {
				// chunk
				manualChunks(id) {
					if (id.includes("src/styles")) return "styles";

					if (id.includes("src/components/StopwatchClass.tsx")) {
						return "stopwatchClass";
					}

					if (id.includes("src/components/StopwatchFunctional.tsx")) {
						return "stopwatchFunc";
					}

					return "index";
				},
			},
		},
	},
});
