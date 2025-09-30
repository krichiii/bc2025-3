#!/usr/bin/env node
const { program } = require("commander");
const fs = require("fs");

program
  .option("-i, --input <path>", "Input file path")
  .option("-o, --output <path>", "Output file path")
  .option("-d, --display", "Display result in console")
  .option("-s, --survived", "Show only survived passengers")
  .option("-a, --age", "Show passenger age");

program.parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

const raw = fs.readFileSync(options.input, "utf-8");
let data = raw
  .split("\n")
  .filter(line => line.trim().length > 0)
  .map(line => JSON.parse(line));

if (options.survived) {
  data = data.filter(p => Number(p.Survived) === 1);
}

let result = data.map(p => {
  let line = p.Name;
  if (options.age) line += " " + (p.Age ?? "N/A");
  line += " " + p.Ticket;
  return line;
}).join("\n");

if (!options.output && !options.display) {
  process.exit(0);
}

if (options.display) {
  console.log(result);
}

if (options.output) {
  fs.writeFileSync(options.output, result, "utf-8");
}


