#!/usr/bin/env node

/**
 * YAML Frontmatter Validator
 *
 * Validates all blog post frontmatter can be parsed by js-yaml (same parser Astro uses).
 * Prevents runtime errors like "YAMLException: bad indentation of a mapping entry"
 *
 * Usage:
 *   npm run validate:yaml
 *   node scripts/validate-yaml-frontmatter.mjs
 *
 * Exit codes:
 *   0 - All frontmatter valid
 *   1 - Validation errors found
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateBlogFrontmatter() {
  const blogDir = join(projectRoot, 'src/content/blog');
  const blogFiles = readdirSync(blogDir).filter((f) => f.endsWith('.md'));

  log('\n🔍 Validating YAML frontmatter in blog posts...\n', 'cyan');

  const errors = [];
  const warnings = [];

  for (const filename of blogFiles) {
    const filepath = join(blogDir, filename);
    const content = readFileSync(filepath, 'utf-8');

    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
      errors.push({
        file: filename,
        error: 'No frontmatter found',
        line: 1,
      });
      continue;
    }

    const frontmatterText = frontmatterMatch[1];

    // Validate YAML syntax
    try {
      const parsed = yaml.load(frontmatterText);

      // Validate required fields
      const requiredFields = ['title', 'date', 'excerpt', 'tags'];
      for (const field of requiredFields) {
        if (!parsed[field]) {
          warnings.push({
            file: filename,
            warning: `Missing required field: ${field}`,
          });
        }
      }

      // Check for common pitfalls
      if (parsed.title && typeof parsed.title === 'string') {
        // Check if title has colons but frontmatter doesn't have quotes
        if (parsed.title.includes(':')) {
          const titleLine = frontmatterText.match(/^title:\s*(.*)$/m);
          if (titleLine && !titleLine[1].match(/^["'].*["']$/)) {
            warnings.push({
              file: filename,
              warning: 'Title contains colon but may not be quoted (verify YAML is valid)',
            });
          }
        }
      }

      // Check excerpt length
      if (parsed.excerpt && parsed.excerpt.length > 200) {
        warnings.push({
          file: filename,
          warning: `Excerpt is ${parsed.excerpt.length} characters (recommended: <200)`,
        });
      }

      log(`✓ ${filename}`, 'green');
    } catch (error) {
      const yamlError = error;
      errors.push({
        file: filename,
        error: yamlError.message,
        line: yamlError.mark?.line || 0,
      });
    }
  }

  // Report results
  console.log('');
  log('─'.repeat(80), 'dim');
  console.log('');

  if (warnings.length > 0) {
    log(`⚠️  ${warnings.length} Warning(s):\n`, 'yellow');
    for (const warning of warnings) {
      log(`  ${warning.file}`, 'yellow');
      log(`    ${warning.warning}\n`, 'dim');
    }
  }

  if (errors.length > 0) {
    log(`❌ ${errors.length} Error(s):\n`, 'red');
    for (const error of errors) {
      log(`  ${error.file}:${error.line}`, 'red');
      log(`    ${error.error}\n`, 'dim');
    }
    log('\n💡 Common fixes:', 'yellow');
    log('  • Add quotes around values with colons:', 'dim');
    log('    title: "My Title: With a Colon"', 'dim');
    log('  • Use single-line format for simple values', 'dim');
    log('  • Ensure proper indentation (2 spaces)', 'dim');
    console.log('');
    process.exit(1);
  }

  log(`✅ All ${blogFiles.length} blog posts have valid YAML frontmatter!\n`, 'green');

  if (warnings.length > 0) {
    log(
      `⚠️  Found ${warnings.length} warning(s) - review recommended but not required\n`,
      'yellow'
    );
  }

  process.exit(0);
}

// Run validation
try {
  validateBlogFrontmatter();
} catch (error) {
  log(`\n❌ Unexpected error: ${error.message}\n`, 'red');
  console.error(error);
  process.exit(1);
}
