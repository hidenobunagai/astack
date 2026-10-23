#!/usr/bin/env node
// Pin analyst-mode on for every session. WSTACK_ANALYST=off skips it (set it for headless jobs or non-data repos).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

if (process.env.WSTACK_ANALYST === "off") process.exit(0);
const skill = fileURLToPath(new URL("../skills/analyst-mode/SKILL.md", import.meta.url));
process.stdout.write(
  `analyst-mode is always on in this session, as if the user typed /wstack:analyst-mode before every message. ` +
    `Follow the skill below on every turn. Its file is ${skill}; resolve its relative links from there, and read that file in full if the text below is cut off. ` +
    `If you are a delegate working from a brief, ignore this and follow the brief. ` +
    `The user turns it off for the session with "analyst-mode off".\n\n` +
    readFileSync(skill, "utf8"),
);
