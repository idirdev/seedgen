'use strict';

/**
 * @fileoverview Generate realistic seed/fixture data for databases.
 * @module seedgen
 * @author idirdev
 */

const fs = require('fs');
const crypto = require('crypto');

/** @type {string[]} */
const FIRST_NAMES = [
  'James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda',
  'William','Barbara','David','Elizabeth','Richard','Susan','Joseph','Jessica',
  'Thomas','Sarah','Charles','Karen','Christopher','Lisa','Daniel','Nancy',
  'Matthew','Betty','Anthony','Margaret','Mark','Sandra','Donald','Ashley',
  'Steven','Emily','Paul','Dorothy','Andrew','Kimberly','Kenneth','Donna',
  'George','Michelle','Joshua','Carol','Kevin','Amanda','Brian','Melissa',
  'Edward','Deborah',
];

/** @type {string[]} */
const LAST_NAMES = [
  'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis',
  'Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson',
  'Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White',
  'Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young',
  'Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green',
  'Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts',
];

/** @type {string[]} */
const COMPANIES = [
  'Acme Corp','Globex','Initech','Umbrella','Soylent','Vandelay','Hooli',
  'Pied Piper','Dunder Mifflin','Massive Dynamic','Oscorp','Stark Industries',
  'Wayne Enterprises','LexCorp','Cyberdyne','Weyland-Yutani','Tyrell',
  'Rekall','Abstergo','Aperture Science','Black Mesa','InGen','Omni Consumer',
  'Soylent Green','Vehement Capital','Multivac','Spacely Sprockets',
];

/** @type {string[]} */
const STREET_NAMES = [
  'Main St','Oak Ave','Elm St','Park Blvd','Maple Dr','Cedar Ln','Pine Rd',
  'Lake View Dr','Sunset Blvd','River Rd','Forest Way','Hill Crest Dr',
];

/** @type {string[]} */
const CITIES = [
  'Springfield','Shelbyville','Capital City','Ogdenville','North Haverbrook',
  'Brockway','Waverly Hills','Oakdale','Riverside','Lakewood',
];

/** @type {string[]} */
const LOREM_WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit',
  'sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore',
  'magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation',
];

/**
 * Generate a v4 UUID.
 * @returns {string}
 */
function uuid() {
  return crypto.randomUUID();
}

/**
 * Pick a random element from an array.
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a random first name.
 * @returns {string}
 */
function firstName() {
  return pick(FIRST_NAMES);
}

/**
 * Generate a random last name.
 * @returns {string}
 */
function lastName() {
  return pick(LAST_NAMES);
}

/**
 * Generate a random full name.
 * @returns {string}
 */
function fullName() {
  return `${firstName()} ${lastName()}`;
}

/**
 * Generate an email address from a first and last name.
 * @param {string} [first]
 * @param {string} [last]
 * @returns {string}
 */
function email(first, last) {
  const f = (first || firstName()).toLowerCase().replace(/\s+/g, '');
  const l = (last || lastName()).toLowerCase().replace(/\s+/g, '');
  const domains = ['example.com','test.org','demo.net','sample.io','fake.dev'];
  return `${f}.${l}@${pick(domains)}`;
}

/**
 * Generate a random US-style phone number.
 * @returns {string}
 */
function phone() {
  const area = Math.floor(Math.random() * 900) + 100;
  const prefix = Math.floor(Math.random() * 900) + 100;
  const line = Math.floor(Math.random() * 9000) + 1000;
  return `(${area}) ${prefix}-${line}`;
}

/**
 * Generate a random date between two dates.
 * @param {Date|string} from
 * @param {Date|string} to
 * @returns {Date}
 */
function date(from, to) {
  const start = new Date(from).getTime();
  const end = new Date(to).getTime();
  return new Date(start + Math.random() * (end - start));
}

/**
 * Generate a random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function integer(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random float between min and max.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function float(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a random boolean.
 * @returns {boolean}
 */
function boolean() {
  return Math.random() < 0.5;
}

/**
 * Generate random lorem ipsum text with N sentences.
 * @param {number} [sentences=2]
 * @returns {string}
 */
function text(sentences = 2) {
  const result = [];
  for (let i = 0; i < sentences; i++) {
    const wordCount = integer(6, 14);
    const words = [];
    for (let j = 0; j < wordCount; j++) words.push(pick(LOREM_WORDS));
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    result.push(words.join(' ') + '.');
  }
  return result.join(' ');
}

/**
 * Generate a random postal address.
 * @returns {string}
 */
function address() {
  const num = integer(1, 9999);
  return `${num} ${pick(STREET_NAMES)}, ${pick(CITIES)}`;
}

/**
 * Generate a random company name.
 * @returns {string}
 */
function company() {
  return pick(COMPANIES);
}

/**
 * Generate a random IPv4 address.
 * @returns {string}
 */
function ip() {
  return [integer(1, 254), integer(0, 255), integer(0, 255), integer(1, 254)].join('.');
}

/**
 * Generate a random URL.
 * @returns {string}
 */
function url() {
  const tlds = ['com','org','net','io','dev'];
  const words = ['api','app','data','service','hub','cloud','platform','store'];
  return `https://${pick(words)}-${pick(LAST_NAMES).toLowerCase()}.${pick(tlds)}`;
}

/**
 * Parse a field type string into a generator config.
 * Supports: 'uuid','firstName','lastName','fullName','email','phone',
 * 'date:from|to','integer:min-max','float:min-max','boolean','text',
 * 'text:N','address','company','ip','url','pick:a,b,c'
 * @param {string} type
 * @returns {function(): *}
 */
function parseFieldType(type) {
  const [base, param] = type.split(':');
  switch (base) {
    case 'uuid':      return uuid;
    case 'firstName': return firstName;
    case 'lastName':  return lastName;
    case 'fullName':  return fullName;
    case 'email':     return email;
    case 'phone':     return phone;
    case 'boolean':   return boolean;
    case 'address':   return address;
    case 'company':   return company;
    case 'ip':        return ip;
    case 'url':       return url;
    case 'text': {
      const n = param ? parseInt(param, 10) : 2;
      return () => text(n);
    }
    case 'integer': {
      const [mn, mx] = (param || '0-100').split('-').map(Number);
      return () => integer(mn, mx);
    }
    case 'float': {
      const [mn, mx] = (param || '0-1').split('-').map(Number);
      return () => float(mn, mx);
    }
    case 'date': {
      const [from, to] = (param || '2000-01-01|2026-01-01').split('|');
      return () => date(from, to);
    }
    case 'pick': {
      const choices = (param || '').split(',');
      return () => pick(choices);
    }
    default:
      throw new Error(`Unknown field type: ${type}`);
  }
}

/**
 * Generate N rows of data based on a schema definition.
 * @param {number} count - Number of rows to generate.
 * @param {Object.<string, string>} schema - Map of field name to type string.
 * @returns {Object[]} Array of generated row objects.
 */
function generateRows(count, schema) {
  const generators = {};
  for (const [field, type] of Object.entries(schema)) {
    generators[field] = parseFieldType(type);
  }
  const rows = [];
  for (let i = 0; i < count; i++) {
    const row = {};
    for (const [field, gen] of Object.entries(generators)) {
      row[field] = gen();
    }
    rows.push(row);
  }
  return rows;
}

/**
 * Write rows to a JSON file.
 * @param {Object[]} rows
 * @param {string} file
 */
function writeJson(rows, file) {
  fs.writeFileSync(file, JSON.stringify(rows, null, 2));
}

/**
 * Write rows to a CSV file.
 * @param {Object[]} rows
 * @param {string} file
 */
function writeCsv(rows, file) {
  if (!rows.length) { fs.writeFileSync(file, ''); return; }
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    const s = String(v instanceof Date ? v.toISOString() : v);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  fs.writeFileSync(file, lines.join('\n'));
}

/**
 * Write rows to a SQL file with INSERT statements.
 * @param {Object[]} rows
 * @param {string} table - Table name.
 * @param {string} file
 */
function writeSql(rows, table, file) {
  if (!rows.length) { fs.writeFileSync(file, ''); return; }
  const headers = Object.keys(rows[0]);
  const quote = (v) => {
    if (v === null || v === undefined) return 'NULL';
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    if (typeof v === 'number') return String(v);
    if (v instanceof Date) return `'${v.toISOString()}'`;
    return `'${String(v).replace(/'/g, "\\'")}'`;
  };
  const cols = headers.join(', ');
  const lines = rows.map((row) => {
    const vals = headers.map((h) => quote(row[h])).join(', ');
    return `INSERT INTO ${table} (${cols}) VALUES (${vals});`;
  });
  fs.writeFileSync(file, lines.join('\n'));
}

module.exports = {
  uuid, firstName, lastName, fullName, email, phone, date, integer, float,
  boolean, text, pick, address, company, ip, url,
  parseFieldType, generateRows, writeJson, writeCsv, writeSql,
};
