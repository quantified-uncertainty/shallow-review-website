const yaml = require("js-yaml");
const fs = require("fs");
const data = yaml.load(fs.readFileSync("./src/data/papers.yaml", "utf8"));

console.log("Agendas with 0 papers:");
data.sections.forEach(s => {
  s.agendas.forEach(a => {
    if (!a.papers || a.papers.length === 0) {
      console.log(`  ${s.id} / ${a.id}: ${a.name}`);
    }
  });
});
