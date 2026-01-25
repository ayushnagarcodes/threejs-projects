import restart from "vite-plugin-restart";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";
import { readdirSync, renameSync, rmSync, existsSync, mkdirSync } from "fs";

// Get all project directories for multi-page build
function getProjectInputs() {
  const projectsDir = resolve(__dirname, "src/projects");
  const inputs = { main: resolve(__dirname, "index.html") };

  try {
    const projects = readdirSync(projectsDir, { withFileTypes: true });
    projects.forEach((project) => {
      if (project.isDirectory()) {
        inputs[project.name] = resolve(projectsDir, project.name, "index.html");
      }
    });
  } catch (e) {
    // projects folder may not exist yet
  }

  return inputs;
}

// Get copy targets for all project assets
function getAssetCopyTargets() {
  const projectsDir = resolve(__dirname, "src/projects");
  const targets = [];

  try {
    const projects = readdirSync(projectsDir, { withFileTypes: true });
    projects.forEach((project) => {
      if (project.isDirectory()) {
        const assetsPath = resolve(projectsDir, project.name, "assets");
        try {
          readdirSync(assetsPath);
          targets.push({
            src: `src/projects/${project.name}/assets/*`,
            dest: `projects/${project.name}/assets`,
          });
        } catch (e) {
          // No assets folder for this project
        }
      }
    });
  } catch (e) {
    // projects folder may not exist yet
  }

  return targets;
}

export default {
  root: "./", // Serve from root (where index.html is)
  publicDir: "./public/", // Public assets
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if it's not a CodeSandbox
  },
  plugins: [
    restart({ restart: ["./public/**", "./src/**"] }), // Restart server on file change
    viteStaticCopy({
      targets: getAssetCopyTargets(),
    }),
    {
      name: "rewrite-projects",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Rewrite /projects/* to /src/projects/*
          if (req.url?.startsWith("/projects/")) {
            req.url = "/src" + req.url;
          }
          next();
        });
      },
      // Move dist/src/projects/* to dist/projects/* after build
      closeBundle() {
        const distSrcProjects = resolve(__dirname, "dist/src/projects");
        const distProjects = resolve(__dirname, "dist/projects");

        if (existsSync(distSrcProjects)) {
          const projects = readdirSync(distSrcProjects, {
            withFileTypes: true,
          });
          projects.forEach((project) => {
            if (project.isDirectory()) {
              const srcPath = resolve(distSrcProjects, project.name);
              const destPath = resolve(distProjects, project.name);
              // Ensure destination folder exists
              if (!existsSync(destPath)) {
                mkdirSync(destPath, { recursive: true });
              }
              // Copy HTML files from src/projects to projects
              const files = readdirSync(srcPath);
              files.forEach((file) => {
                renameSync(resolve(srcPath, file), resolve(destPath, file));
              });
            }
          });
          // Remove the empty dist/src folder
          rmSync(resolve(__dirname, "dist/src"), { recursive: true });
        }
      },
    },
  ],
  build: {
    outDir: "./dist", // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
    rollupOptions: {
      input: getProjectInputs(),
    },
  },
};
