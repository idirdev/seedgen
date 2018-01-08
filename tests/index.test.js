'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  uuid, firstName, lastName, fullName, email, phone, date,
  integer, float, boolean, text, pick, address, company, ip, url,
  parseFieldType, generateRows, writeJson, writeCsv, writeSql,
} = require('../src/index.js');

// ─── Generator tests ─────────────────────────────────────────────────────────

test('uuid: produces valid v4 UUID format', () => {
  const v = uuid();
  assert.match(v, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

test('firstName / lastName: return non-empty strings', () => {
  assert.ok(firstName().length > 0);
  assert.ok(lastName().length > 0);
});

test('fullName: contains space between names', () => {
  assert.ok(fullName().includes(' '));
});

test('email: contains @ and dot in domain', () => {
  const v = email('Alice', 'Smith');
  assert.match(v, /^alice\.smith@[^@]+\.[^@]+$/);
});

test('phone: matches US phone pattern', () => {
  const v = phone();
  assert.match(v, /^\(\d{3}\) \d{3}-\d{4}$/);
});

test('integer: within bounds', () => {
  for (let i = 0; i < 50; i++) {
    const v = integer(5, 10);
    assert.ok(v >= 5 && v <= 10, `${v} out of [5,10]`);
  }
});

test('float: within bounds', () => {
  for (let i = 0; i < 50; i++) {
    const v = float(0, 1);
    assert.ok(v >= 0 && v < 1, `${v} out of [0,1)`);
  }
});

test('boolean: only true or false', () => {
  const vals = new Set(Array.from({ length: 100 }, () => boolean()));
  assert.ok(vals.has(true));
  assert.ok(vals.has(false));
});

test('date: returned value between from and to', () => {
  const from = new Date('2020-01-01');
  const to = new Date('2021-01-01');
  const v = date(from, to);
  assert.ok(v >= from && v <= to);
});

test('text: returns string ending with period', () => {
  const v = text(2);
  assert.ok(v.endsWith('.'));
  assert.ok(v.length > 5);
});

test('pick: returns element from array', () => {
  const arr = ['a', 'b', 'c'];
  const v = pick(arr);
  assert.ok(arr.includes(v));
});

test('ip: valid IPv4 format', () => {
  assert.match(ip(), /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
});

test('url: starts with https://', () => {
  assert.ok(url().startsWith('https://'));
});

// ─── parseFieldType tests ─────────────────────────────────────────────────────

test('parseFieldType: integer:18-65 stays in range', () => {
  const gen = parseFieldType('integer:18-65');
  for (let i = 0; i < 30; i++) {
    const v = gen();
    assert.ok(v >= 18 && v <= 65);
  }
});

test('parseFieldType: unknown type throws', () => {
  assert.throws(() => parseFieldType('nonexistent'), /Unknown field type/);
});

// ─── generateRows tests ───────────────────────────────────────────────────────

test('generateRows: produces correct count and fields', () => {
  const schema = { id: 'uuid', name: 'fullName', age: 'integer:18-65', active: 'boolean' };
  const rows = generateRows(20, schema);
  assert.equal(rows.length, 20);
  for (const row of rows) {
    assert.ok('id' in row);
    assert.ok('name' in row);
    assert.ok('age' in row);
    assert.ok('active' in row);
  }
});

// ─── Output format tests ──────────────────────────────────────────────────────

test('writeJson: produces valid JSON file', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'seedgen-'));
  const file = path.join(tmp, 'out.json');
  const rows = [{ id: 1, name: 'Alice' }];
  writeJson(rows, file);
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.deepEqual(parsed, rows);
  fs.rmSync(tmp, { recursive: true });
});

test('writeCsv: first line is headers', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'seedgen-'));
  const file = path.join(tmp, 'out.csv');
  writeCsv([{ a: 1, b: 'hello' }, { a: 2, b: 'world' }], file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  assert.equal(lines[0], 'a,b');
  assert.equal(lines[1], '1,hello');
  fs.rmSync(tmp, { recursive: true });
});

test('writeSql: produces INSERT statements', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'seedgen-'));
  const file = path.join(tmp, 'out.sql');
  writeSql([{ id: 1, name: 'Bob' }], 'users', file);
  const content = fs.readFileSync(file, 'utf8');
  assert.ok(content.startsWith('INSERT INTO users'));
  assert.ok(content.includes("'Bob'"));
  fs.rmSync(tmp, { recursive: true });
});
