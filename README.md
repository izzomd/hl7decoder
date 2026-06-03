# HL7 Decode

A browser-based tool for parsing raw HL7 2.x messages into human-readable output. Paste any HL7 message and instantly see a structured breakdown of every segment, field, component, and subcomponent — no installation, no server, no data sent anywhere.

## What it does

HL7 2.x messages are pipe-delimited text that's nearly impossible to read at a glance. HL7 Decode takes the raw message and displays it as labeled, structured cards — one per segment — so you can quickly understand what's in a message without counting pipes or consulting a spec.

## Features

- Parses all HL7 2.x segment types
- Handles custom field/component delimiters (reads from MSH-1/MSH-2)
- Supports repetitions, components, and subcomponents
- Split-pane layout: raw input on the left, decoded output on the right
- Includes a sample ORU^R01 lab result message to try immediately
- Runs entirely in the browser — nothing is sent to a server

## Running locally

```bash
git clone https://github.com/YOUR_USERNAME/hl7decode.git
cd hl7decode
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
