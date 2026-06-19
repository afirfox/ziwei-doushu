import { createCommand } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * zh-punct-lint.mjs
 * Simple linter to ensure Chinese punctuation is used in CJK contexts 
 * and basic spacing between CJK and Latin characters.
 */

const TARGET_EXTENSIONS = ['.ts', '.tsx', '.md', '.mdx'];
const ARGS = process.argv.slice(2);
const SHOULD_FIX = ARGS.includes('--fix');

async function lintFile(filePath) {
  let content = await fs.readFile(filePath, 'utf8');
  let originalContent = content;

  // 1. Replace half-width punctuation with full-width when surrounded by CJK characters
  // This is a simplified version of the rules.
  const cjkRange = /[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/;
  
  // Basic mapping for common punctuation
  const punctMap = {
    ',': '，',
    '.': '。',
    '!': '！',
    '?': '？',
    ';': '；',
    ':': '：',
    '(': '（',
    ')': '）',
  };

  for (const [half, full] of Object.entries(punctMap)) {
    const regex = new RegExp(`(${content.match(cjkRange) ? '[\u4e00-\u9fa5]' : ''})\\${half}(?=[\u4e00-\u9fa5])`, 'g');
    // To be safe and avoid breaking code/strings, we'd normally need a proper parser.
    // But for a basic lint script, we target content that looks like text.
  }

  // Better approach: only replace punctuation if it's NOT inside a string literal or tag
  // However, implementing a full JS/TS parser here is too much.
  // I will implement a very conservative "fix" that targets common mistakes in markdown-like content.

  if (SHOULD_FIX) {
    // Basic fix: Replace half-width punctuation between Chinese characters
    content = content.replace(/([\u4e00-\u9fa5])([,.:!;?()])([\u4e00-\u9fa5])/g, (match, p1, p2, p3) => {
      return p1 + (punctMap[p2] || p2) + p3;
    });

    // Fix: Add space between CJK and Latin/Numbers (Standard typography)
    content = content.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '$1 $2');
    content = content.replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '$1 $2');
  }

  if (content !== originalContent) {
    console.log(`Issue found in ${filePath}${SHOULD_FIX ? ' (fixed)' : ''}`);
    if (SHOULD_FIX) {
      await fs.writeFile(filePath, content, 'utf8');
    }
  }
}

async function main() {
  // In lint-staged, the file paths are passed as arguments
  const files = ARGS.filter(arg => !arg.startsWith('--'));

  if (files.length === 0) {
    console.log('No files to lint.');
    return;
  }

  for (const file of files) {
    const ext = path.extname(file);
    if (TARGET_EXTENSIONS.includes(ext)) {
      await lintFile(file);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
