const fs = require("fs");
const content = fs.readFileSync("./reference/Shallow Review 2025.md", "utf8");
const lines = content.split("\n");

// Check line 270
const line270 = lines[270];
console.log("Line 270:", line270.substring(0, 100));
console.log("Starts with #:", line270.startsWith("# "));
console.log("Includes [sec:", line270.includes("[sec:"));
console.log("Includes backslash-bracket:", line270.includes("\\["));

// Look for pattern - the line has \\[sec:big\\_labs\\]
// In the string, backslashes are literal, so we need to match them
const secMatch = line270.match(/sec:([a-z_]+)/);
console.log("sec: match:", secMatch);
