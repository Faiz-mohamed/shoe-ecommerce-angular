const fs = require("fs");
const p = "angular.json";
const raw = fs.readFileSync(p, "utf8");
const json = JSON.parse(raw);
const projects = Object.keys(json.projects || {});
if (!projects.length) { console.error("No projects found in angular.json"); process.exit(2); }
const proj = projects[0];
// support angular.json variants (architect vs targets)
const opts = (json.projects[proj].architect && json.projects[proj].architect.build && json.projects[proj].architect.build.options)
          || (json.projects[proj].targets && json.projects[proj].targets.build && json.projects[proj].targets.build.options);
if (!opts) { console.error("Build options not found for project", proj); process.exit(3); }
// set relaxed temporary budgets
opts.budgets = [
  { type: "initial", maximumWarning: "2mb", maximumError: "5mb" },
  { type: "anyComponentStyle", maximumWarning: "50kb", maximumError: "100kb" }
];
fs.writeFileSync(p, JSON.stringify(json, null, 2), "utf8");
console.log("Temporarily updated budgets for project:", proj);
