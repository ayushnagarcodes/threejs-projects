import restart from "vite-plugin-restart";

export default {
  root: "./", // Serve from root (where index.html is)
  publicDir: "./public/", // Public assets
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    outDir: "./dist", // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
  },
  plugins: [
    restart({ restart: ["./public/**", "./src/**"] }), // Restart server on file change
  ],
};
