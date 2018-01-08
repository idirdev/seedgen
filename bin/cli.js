#!/usr/bin/env node
'use strict';

/**
 * @fileoverview CLI for seedgen — generate seed/fixture data.
 * @author idirdev
 */

const fs = require('fs');
const path = require('path');
const { generateRows, writeJson, writeCsv, writeSql } = require('../src/index.js');

const args = process.argv.slice(2);

if (!args.length || args.includes('--help')) {
  console.log('Usage: seedgen --schema schema.json --count 100 --format json|csv|sql [--table users] [--output seed.json]');
  process.exit(0);
}

function getArg(name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

const schemaFile = getArg('--schema');
const count = parseInt(getArg('--count') || '10', 10);
const format = getArg('--format') || 'json';
const table = getArg('--table') || 'data';
const output = getArg('--output');

if (!schemaFile) {
  console.error('Error: --schema is required');
  process.exit(1);
}

try {
  const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
  const rows = generateRows(count, schema);

  const outFile = output || `seed.${format}`;

  if (format === 'json') {
    writeJson(rows, outFile);
  } else if (format === 'csv') {
    writeCsv(rows, outFile);
  } else if (format === 'sql') {
    writeSql(rows, table, outFile);
  } else {
    console.error(`Unknown format: ${format}`);
    process.exit(1);
  }

  console.log(`Generated ${rows.length} rows -> ${outFile}`);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
