# namelix-cli

> **Note:**
> 
> This is not official Namelix's client, so it may stop working at any point.

This package is loading unique names from [Namelix](https://namelix.com/), based on the provided criteria.

## Installation

NPM, Yarn or similar is required. Afterwards, you have to install package globally, i.e.:

```bash
npm install -g namelix-cli
```

## Usage

To find domains for selected keywords, you may just run the command directly:

```bash
namelix some-keyword other-keyword
```

After running without keywords or with `--help` option, you see detailed information about available options:

```bash
Usage: namelix-cli [options] <keywords...>

Options:
  -V, --version                               output the version number
  --limit <limit>, -l <limit>                 How many names it should find at most (default: 5000)
  --style <style>, -s <style>                 What style should be used (choices: "brandable", "nonenglish", "multiword", "spelling", "compound", "dictionary", default: "brandable")
  --randomness <randomness>, -r <randomness>  What randomness should be used (choices: "low", "medium", "high", default: "medium")
  -h, --help                                  Show help information (default: false)
```

### Searching for available domains

If you want to search through these names to find available domains,
you may install [available-domains](https://npmjs.com/package/available-domains) and pipe Namelix output there:

```bash
namelix some-keyword other-keyword | available-domains --suffix .com
```
