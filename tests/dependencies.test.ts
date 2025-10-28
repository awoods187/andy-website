/**
 * Dependency Health Tests
 *
 * Tests to ensure npm dependencies are reasonably up-to-date
 * and alert when packages need updating.
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('Dependency Health', () => {
  it('should check for outdated dependencies', () => {
    let outdated: Record<string, any> = {};

    try {
      // Run npm outdated --json (exits with code 1 if outdated packages exist)
      const output = execSync('npm outdated --json', {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      outdated = JSON.parse(output || '{}');
    } catch (error: any) {
      // npm outdated exits with code 1 when packages are outdated
      if (error.stdout) {
        try {
          outdated = JSON.parse(error.stdout);
        } catch {
          outdated = {};
        }
      }
    }

    const outdatedPackages = Object.keys(outdated);
    const criticallyOutdated = outdatedPackages.filter((pkg) => {
      const info = outdated[pkg];
      // Check if we're more than 1 major version behind
      const currentMajor = parseInt(info.current.split('.')[0]);
      const latestMajor = parseInt(info.latest.split('.')[0]);
      return latestMajor > currentMajor + 1;
    });

    // Log outdated packages for visibility
    if (outdatedPackages.length > 0) {
      console.log('\n📦 Outdated Dependencies:');
      outdatedPackages.forEach((pkg) => {
        const info = outdated[pkg];
        console.log(`  - ${pkg}: ${info.current} → ${info.latest}`);
      });
      console.log(`\nTotal outdated: ${outdatedPackages.length}`);
      console.log('Run `npm update` to update within semver range');
      console.log('Run `npm outdated` for full details\n');
    }

    // Fail if any package is critically outdated (>1 major version behind)
    expect(criticallyOutdated).toHaveLength(0);
  });

  it('should have a package.json file', () => {
    const { existsSync } = require('fs');
    const { join } = require('path');
    const packageJsonPath = join(process.cwd(), 'package.json');
    expect(existsSync(packageJsonPath)).toBe(true);
  });

  it('should have package-lock.json for reproducible builds', () => {
    const { existsSync } = require('fs');
    const { join } = require('path');
    const lockfilePath = join(process.cwd(), 'package-lock.json');
    expect(existsSync(lockfilePath)).toBe(true);
  });
});
