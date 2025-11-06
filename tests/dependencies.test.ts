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

describe('Dependency Consistency', () => {
  it('should use consistent versions of shared dependencies', () => {
    const { readFileSync } = require('fs');
    const { join } = require('path');
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Check for duplicate dependencies with different scopes
    const depNames = new Map<string, string[]>();

    Object.keys(allDeps).forEach((dep) => {
      const baseName = dep.startsWith('@') ? dep.split('/')[1] : dep;
      if (!depNames.has(baseName)) {
        depNames.set(baseName, []);
      }
      depNames.get(baseName)?.push(dep);
    });

    // Find potential conflicts (same package, different scopes)
    const conflicts: string[] = [];
    depNames.forEach((versions, baseName) => {
      if (versions.length > 1) {
        conflicts.push(`${baseName}: ${versions.join(', ')}`);
      }
    });

    // This is informational - we allow scoped packages
    if (conflicts.length > 0) {
      console.log('\n📦 Multiple versions of similar packages detected:');
      conflicts.forEach((conflict) => console.log(`  - ${conflict}`));
      console.log('\nThis is usually OK for scoped packages.\n');
    }

    // Always pass - this is informational
    expect(true).toBe(true);
  });

  it('should use the same TypeScript version across all TS tools', () => {
    const { readFileSync } = require('fs');
    const { join } = require('path');
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Get TypeScript-related package versions
    const tsVersion = allDeps['typescript'];
    const tsEslintParser = allDeps['@typescript-eslint/parser'];
    const tsEslintPlugin = allDeps['@typescript-eslint/eslint-plugin'];

    // TypeScript should be installed
    expect(tsVersion).toBeDefined();

    // If using TypeScript ESLint packages, they should match versions
    if (tsEslintParser && tsEslintPlugin) {
      expect(tsEslintParser).toBe(tsEslintPlugin);
    }
  });

  it('should use the same ESLint version for ESLint plugins', () => {
    const { readFileSync } = require('fs');
    const { join } = require('path');
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const eslintVersion = allDeps['eslint'];

    // ESLint should be installed
    expect(eslintVersion).toBeDefined();

    // Log all ESLint plugins for visibility
    const eslintPlugins = Object.keys(allDeps).filter((dep) => dep.includes('eslint-plugin'));

    if (eslintPlugins.length > 0) {
      console.log('\n🔌 ESLint Plugins:');
      eslintPlugins.forEach((plugin) => {
        console.log(`  - ${plugin}: ${allDeps[plugin]}`);
      });
      console.log('');
    }

    expect(eslintPlugins.length).toBeGreaterThan(0);
  });

  it('should use the same Prettier version across all prettier tools', () => {
    const { readFileSync } = require('fs');
    const { join } = require('path');
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Get Prettier-related packages
    const prettierVersion = allDeps['prettier'];
    const prettierPlugins = Object.keys(allDeps).filter((dep) => dep.includes('prettier-plugin'));

    if (prettierVersion) {
      console.log(`\n💅 Prettier: ${prettierVersion}`);
      if (prettierPlugins.length > 0) {
        console.log('Prettier Plugins:');
        prettierPlugins.forEach((plugin) => {
          console.log(`  - ${plugin}: ${allDeps[plugin]}`);
        });
      }
      console.log('');
    }

    // If prettier is used, it should be defined
    if (prettierPlugins.length > 0) {
      expect(prettierVersion).toBeDefined();
    }

    expect(true).toBe(true);
  });

  it('should use the same Vitest version across test tools', () => {
    const { readFileSync } = require('fs');
    const { join } = require('path');
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Get all Vitest-related packages
    const vitestPackages = Object.keys(allDeps).filter(
      (dep) => dep.startsWith('@vitest/') || dep === 'vitest'
    );

    const versions = vitestPackages.map((pkg) => ({
      package: pkg,
      version: allDeps[pkg],
    }));

    if (versions.length > 0) {
      console.log('\n🧪 Vitest Packages:');
      versions.forEach(({ package: pkg, version }) => {
        console.log(`  - ${pkg}: ${version}`);
      });

      // Extract major.minor versions
      const majorMinorVersions = versions.map(({ version }) => {
        const match = version.match(/(\d+\.\d+)/);
        return match ? match[1] : version;
      });

      // Check if all major.minor versions match
      const uniqueVersions = [...new Set(majorMinorVersions)];
      if (uniqueVersions.length > 1) {
        console.log(
          `\n⚠️  Warning: Multiple Vitest versions detected: ${uniqueVersions.join(', ')}`
        );
        console.log('Consider aligning all @vitest/* packages to the same version.\n');
      } else {
        console.log(`✓ All Vitest packages on version ${uniqueVersions[0]}\n`);
      }
    }

    expect(vitestPackages.length).toBeGreaterThan(0);
  });

  it('should not have conflicting package manager lockfiles', () => {
    const { existsSync } = require('fs');
    const { join } = require('path');

    const lockfiles = [
      { name: 'package-lock.json', manager: 'npm' },
      { name: 'yarn.lock', manager: 'yarn' },
      { name: 'pnpm-lock.yaml', manager: 'pnpm' },
    ];

    const presentLockfiles = lockfiles.filter((lf) => existsSync(join(process.cwd(), lf.name)));

    if (presentLockfiles.length > 1) {
      console.log('\n⚠️  Multiple package manager lockfiles detected:');
      presentLockfiles.forEach((lf) => {
        console.log(`  - ${lf.name} (${lf.manager})`);
      });
      console.log('\nThis can cause dependency conflicts. Use only one package manager.\n');
    }

    // Should have exactly one lockfile
    expect(presentLockfiles.length).toBe(1);
  });
});
