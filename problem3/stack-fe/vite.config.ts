import { defineConfig } from "vite";
import * as path from "path";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ["decorators-legacy"]
        }
      }
    })
  ],
  server: {
    port: parseInt(process.env.VITE_PORT ? process.env.VITE_PORT : "3001")
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }]
  }
});
