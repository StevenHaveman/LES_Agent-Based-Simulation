import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
    base: "/INNO-2025-Groep-625/",
    plugins: [TanStackRouterVite({ autoCodeSplitting: true }), react()],
});
