# seedgen

> **[EN]** A CLI tool and library to generate realistic fake seed data from a JSON schema definition — names, emails, phone numbers, dates, UUIDs, and more.
> **[FR]** Un outil CLI et une bibliothèque pour générer des données de test réalistes à partir d'un schéma JSON — noms, emails, numéros de téléphone, dates, UUIDs et plus.

---

## Features / Fonctionnalités

**[EN]**
- Generate rows of fake data from a simple JSON schema
- Supported field types: uuid, name, email, phone, date, bool, int, text, string
- Configurable row count with --count
- Output to file or stdout
- Cryptographically random UUIDs via Node.js crypto module
- Realistic names, emails, and phone numbers built-in

**[FR]**
- Générer des lignes de fausses données à partir d'un schéma JSON simple
- Types de champs supportés : uuid, name, email, phone, date, bool, int, text, string
- Nombre de lignes configurable avec --count
- Sortie dans un fichier ou stdout
- UUIDs aléatoires cryptographiques via le module crypto de Node.js
- Noms, emails et numéros de téléphone réalistes intégrés

---

## Installation

```bash
npm install -g @idirdev/seedgen
```

---

## CLI Usage / Utilisation CLI

```bash
# Generate 10 rows from a schema (default count)
# Générer 10 lignes à partir d'un schéma (compteur par défaut)
seedgen schema.json

# Generate 50 rows
# Générer 50 lignes
seedgen schema.json --count 50

# Save output to a file
# Sauvegarder la sortie dans un fichier
seedgen schema.json --count 20 -o users-seed.json

# Show help / Afficher l'aide
seedgen --help
```

### schema.json example / Exemple de schema.json

```json
{
  "id":         "uuid",
  "fullName":   "name",
  "email":      "email",
  "phone":      "phone",
  "birthDate":  "date",
  "active":     "bool",
  "score":      "int",
  "bio":        "text"
}
```

### Example Output / Exemple de sortie

```
$ seedgen schema.json --count 3
[
  {
    "id": "a3f7c2d1-8b4e-4f1a-9c0d-2e5b6a7f8c3d",
    "fullName": "Grace Johnson",
    "email": "grace.johnson@demo.net",
    "phone": "+15551234567",
    "birthDate": "1991-07-22",
    "active": true,
    "score": 4821,
    "bio": "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod."
  },
  {
    "id": "b8e1d4f2-3c7a-4b2e-8d1f-9a0c5e6b7d8e",
    "fullName": "Noah Garcia",
    "email": "noah.garcia@example.com",
    "phone": "+13129876543",
    "birthDate": "2003-02-14",
    "active": false,
    "score": 731,
    "bio": "ut labore et dolore magna aliqua incididunt tempor lorem ipsum."
  }
]
Generated 3 rows to users-seed.json
```

---

## API (Programmatic) / API (Programmation)

**[EN]** Use seedgen as a library to generate seed data directly in your tests or migration scripts.
**[FR]** Utilisez seedgen comme bibliothèque pour générer des données de test directement dans vos tests ou scripts de migration.

```javascript
const {
  uuid, fullName, email, phone, date,
  boolean, paragraph, randomInt, pick,
  generateRow, generateRows,
} = require('@idirdev/seedgen');

// Individual generators / Générateurs individuels
console.log(uuid());      // 'a3f7c2d1-8b4e-4f1a-9c0d-2e5b6a7f8c3d'
console.log(fullName());  // 'Grace Johnson'
console.log(email());     // 'grace.johnson@demo.net'
console.log(phone());     // '+15551234567'
console.log(date());      // '1991-07-22'
console.log(boolean());   // true
console.log(randomInt(1, 100)); // 42
console.log(paragraph()); // 'lorem ipsum dolor sit amet...'

// Generate a single row from a schema
// Générer une seule ligne à partir d'un schéma
const row = generateRow({
  id: 'uuid', name: 'name', email: 'email', active: 'bool', score: 'int',
});
console.log(row);
// { id: '...', name: 'Alice Smith', email: 'alice.smith@test.org', active: true, score: 7342 }

// Generate multiple rows
// Générer plusieurs lignes
const rows = generateRows({ id: 'uuid', name: 'name', score: 'int' }, 100);
console.log(rows.length); // 100
```

### API Reference

| Function | Parameters | Returns |
|----------|-----------|---------|
| `generateRows(schema, count)` | schema object, number | `Array<Object>` |
| `generateRow(schema)` | schema object | `Object` |
| `uuid()` | — | `string` |
| `fullName()` | — | `string` |
| `email(first?, last?)` | optional first/last | `string` |
| `phone()` | — | `string` |
| `date(from?, to?)` | ISO date strings | `string` |
| `boolean()` | — | `boolean` |
| `randomInt(min, max)` | numbers | `number` |
| `paragraph()` | — | `string` |

---

## License

MIT - idirdev
