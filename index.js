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

// 1. Перевірка наявності input
if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

// 2. Перевірка чи існує файл
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// 3. Читання файлу
const raw = fs.readFileSync(options.input, "utf-8");
let data = raw
  .split("\n")
  .filter(line => line.trim().length > 0)
  .map(line => JSON.parse(line));

// Фільтр по виживших
if (options.survived) {
  data = data.filter(p => Number(p.Survived) === 1);
}

// Формування рядків для виводу
let result = data.map(p => {
  let line = p.Name;
  if (options.age) line += " " + (p.Age ?? "N/A");
  line += " " + p.Ticket;
  return line;
}).join("\n");

// Якщо немає -o і -d → нічого не виводимо
if (!options.output && !options.display) {
  process.exit(0);
}

// Вивід у консоль
if (options.display) {
  console.log(result);
}

// Запис у файл
if (options.output) {
  fs.writeFileSync(options.output, result, "utf-8");
}


