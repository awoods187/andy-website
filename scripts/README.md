# Python Build Scripts

This directory contains Python scripts used during the build process to generate
static content for the website.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Scripts](#scripts)
  - [scrape-crl-posts.py](#scrape-crl-postspy)
- [Usage](#usage)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Security](#security)

---

## Overview

These scripts automate the extraction of blog post metadata from external
sources and generate type-safe TypeScript data files for use in the Astro static
site generator.

### Key Features

- **Robust Error Handling**: Automatic retries with exponential backoff
- **Bot Detection Avoidance**: Proper User-Agent headers
- **Type Safety**: Generates TypeScript interfaces
- **Comprehensive Logging**: Detailed operation logs for debugging
- **Tag Extraction**: Automatic categorization based on content

---

## Prerequisites

### System Requirements

- **Python**: 3.8 or higher
- **pip**: Latest version recommended
- **Internet Connection**: Required for scraping external content

### Dependencies

All Python dependencies are listed in [`requirements.txt`](../requirements.txt):

```
requests>=2.31.0
beautifulsoup4>=4.12.0
```

---

## Installation

### 1. Set Up Python Virtual Environment (Recommended)

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Verify Installation

```bash
python3 scripts/scrape-crl-posts.py --help
```

---

## Scripts

### `scrape-crl-posts.py`

Scrapes blog posts from Andy Woods' author page on cockroachlabs.com and
generates a TypeScript data file.

#### Features

- **Automatic Tag Extraction**: Categorizes posts based on keywords
- **Date Parsing**: Handles multiple date formats
- **Image Extraction**: Captures featured images with proper URL handling
- **Retry Logic**: Automatically retries failed requests (3 attempts)
- **Progress Tracking**: Real-time logging of extraction progress

#### Generated Output

**File**: `src/data/crl-posts.ts`

**Structure**:

```typescript
export interface ExternalPost {
  title: string;
  url: string;
  date: string | null;
  image: string | null;
  excerpt: string;
  source: 'cockroach-labs';
  tags: string[];
}

export const crlPosts: ExternalPost[] = [
  // ... post data
];
```

#### Tag Categories

Posts are automatically tagged based on content analysis:

| Tag                   | Keywords                                                |
| --------------------- | ------------------------------------------------------- |
| `databases`           | Always included (default)                               |
| `distributed-systems` | distributed, multi-region, geo-distributed, replication |
| `reliability`         | reliability, resilience, failover, uptime               |
| `disaster-recovery`   | disaster recovery, backup, restore, recovery            |
| `product-management`  | product, pricing, packaging, strategy                   |
| `pricing`             | pricing, cost, billing                                  |
| `cloud`               | cloud, aws, gcp, azure                                  |
| `security`            | security, authentication, encryption                    |
| `performance`         | performance, optimization, latency                      |
| `migration`           | migration, migrate, migrating                           |
| `architecture`        | architecture, design, pattern                           |

---

## Usage

### Basic Usage

Run the scraper from the project root directory:

```bash
python3 scripts/scrape-crl-posts.py
```

### Expected Output

```
2024-10-21 23:00:00 - INFO - ============================================================
2024-10-21 23:00:00 - INFO - Scraping Cockroach Labs Author Page
2024-10-21 23:00:00 - INFO - ============================================================
2024-10-21 23:00:00 - INFO - Fetching https://www.cockroachlabs.com/author/andy-woods/...
2024-10-21 23:00:01 - INFO - Successfully fetched page (status: 200)
2024-10-21 23:00:01 - INFO - Found 12 potential post elements
2024-10-21 23:00:01 - INFO - ✓ [1/12] Extracted: Surviving Failures: Disaster Recovery
2024-10-21 23:00:01 - INFO - ✓ [2/12] Extracted: Enabling Multi-Region Applications
...
2024-10-21 23:00:02 - INFO - ✅ Successfully extracted 12 posts
2024-10-21 23:00:02 - INFO - ✅ Generated src/data/crl-posts.ts
2024-10-21 23:00:02 - INFO - ✅ Scraping completed successfully!
```

### Integration with Build Process

The script is typically run before building the Astro site:

```bash
# Manual workflow
python3 scripts/scrape-crl-posts.py
npm run build

# Or add to package.json scripts:
# "prebuild": "python3 scripts/scrape-crl-posts.py"
```

### Exit Codes

- `0`: Success
- `1`: Failure (network error, parsing error, no posts found)

---

## Configuration

### Customization Options

Edit constants in `scrape-crl-posts.py`:

```python
# URL to scrape
AUTHOR_URL = "https://www.cockroachlabs.com/author/andy-woods/"

# Output file path
OUTPUT_PATH = Path("src/data/crl-posts.ts")

# Request timeout (seconds)
REQUEST_TIMEOUT = 30

# Number of retry attempts
MAX_RETRIES = 3

# Retry backoff factor (seconds)
RETRY_BACKOFF_FACTOR = 1

# Maximum excerpt length
EXCERPT_MAX_LENGTH = 200
```

### Logging Level

Adjust logging verbosity:

```python
# In scrape-crl-posts.py, line 46:
logging.basicConfig(
    level=logging.DEBUG,  # Change to DEBUG for verbose output
    ...
)
```

---

## Troubleshooting

### Common Issues

#### 1. **No Posts Found**

**Symptom**: "No posts found!" error

**Causes**:

- Website structure changed
- Network connectivity issues
- Bot detection blocking request

**Solutions**:

```bash
# Check network connectivity
curl -I https://www.cockroachlabs.com/author/andy-woods/

# Run with verbose logging
# Edit script to set level=logging.DEBUG
python3 scripts/scrape-crl-posts.py
```

#### 2. **Import Errors**

**Symptom**: `ModuleNotFoundError: No module named 'requests'`

**Solution**:

```bash
# Ensure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

#### 3. **Permission Denied**

**Symptom**: `IOError: [Errno 13] Permission denied`

**Solution**:

```bash
# Check file permissions
ls -la src/data/

# Fix permissions
chmod 755 src/data/
```

#### 4. **Timeout Errors**

**Symptom**: `requests.exceptions.Timeout`

**Solution**:

- Increase `REQUEST_TIMEOUT` constant
- Check internet connection
- Try again later (site may be temporarily down)

---

## Development

### Code Style

This project follows **PEP 8** style guidelines:

```bash
# Check code style (install flake8 first)
pip install flake8
flake8 scripts/scrape-crl-posts.py

# Auto-format code (install black first)
pip install black
black scripts/scrape-crl-posts.py
```

### Type Checking

The code includes comprehensive type hints. Verify with mypy:

```bash
# Install mypy
pip install mypy

# Run type checker
mypy scripts/scrape-crl-posts.py
```

### Testing

#### Manual Testing

```bash
# Run script and verify output
python3 scripts/scrape-crl-posts.py

# Check generated file
cat src/data/crl-posts.ts
```

#### Unit Testing (Future Enhancement)

```bash
# Install pytest
pip install pytest

# Run tests (when implemented)
pytest tests/
```

### Adding New Scrapers

To add a new scraper following the same pattern:

1. Create `scripts/scrape-<source>.py`
2. Follow the same structure as `scrape-crl-posts.py`
3. Implement required functions:
   - `scrape_<source>()` - Main scraping logic
   - `generate_typescript_file()` - Output generation
   - `main()` - Entry point
4. Update `requirements.txt` if new dependencies needed
5. Document in this README

---

## Security

### Security Considerations

✅ **Safe Practices Implemented**:

- No authentication credentials required
- Public URL scraping only
- Timeout configured to prevent hanging
- No hardcoded secrets or API keys
- User-Agent set to avoid detection
- Error handling prevents information leakage

⚠️ **Recommendations**:

- Run in isolated environment (virtual env)
- Review generated TypeScript before committing
- Monitor for unusual network activity
- Keep dependencies updated for security patches

### Dependency Security

Update dependencies regularly:

```bash
# Check for outdated packages
pip list --outdated

# Update specific package
pip install --upgrade requests

# Update all packages
pip install --upgrade -r requirements.txt
```

### Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public GitHub issue
2. Contact via private channel (internal team)
3. Include detailed description and steps to reproduce
4. Allow time for fix before public disclosure

---

## Contributing

### Guidelines

1. **Follow PEP 8** style guide
2. **Add type hints** to all functions
3. **Write docstrings** in Google style
4. **Test thoroughly** before committing
5. **Update documentation** for any changes
6. **No hardcoded credentials** ever

### Pull Request Process

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Update documentation
4. Commit with descriptive message
5. Push and create pull request
6. Request review from team

---

## License

Internal use only. Not licensed for external distribution.

---

## Support

For questions or issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Review script logs with DEBUG level
3. Contact development team
4. File internal ticket if needed

---

## Changelog

### Version 2.0.0 (2024-10-21)

**Major Refactor - Production Ready**

Added:

- Retry logic with exponential backoff
- User-Agent header to avoid bot detection
- Comprehensive logging with timestamps
- Automatic tag extraction from content
- Type hints for all functions
- Detailed docstrings (Google style)
- Progress tracking during extraction

Improved:

- Error handling with specific exceptions
- Code organization and readability
- Documentation and comments
- Security practices

Removed:

- Print statements (replaced with logging)
- Legacy code and TODOs

---

**Last Updated**: 2024-10-21 **Maintained By**: Andy Woods
