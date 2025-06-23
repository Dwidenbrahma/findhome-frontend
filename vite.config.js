import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), , react()],
  // rollupOptions: {
  //   external: [
  //     "VrButton",
  //     "VrHeadModel",
  //     "VrSoundEffects",
  //     "Environment",
  //     "asset",
  //     "staticAssetURL",
  //     "texture",
  //     "Animated",
  //     "AppRegistry",
  //     "AsyncStorage",
  //     "NativeModules",
  //     "StyleSheet",
  //   ],
  // },
});
