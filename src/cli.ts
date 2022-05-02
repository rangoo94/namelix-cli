#!/usr/bin/env node
import ProgressBar = require('progress');
import { program, Option } from 'commander';
import { cyan } from 'chalk';
import { getNames, NameRandomness, NameStyle } from './getNames';

// Build helpers

const pkgJson = require('../package.json');

function intArgument(value: string): number {
  const result = parseInt(value);
  if (isNaN(result) || `${result}` !== value) {
    throw new Error('Invalid integer.');
  }
  return result;
}

function clearLine() {
  process.stderr.clearLine(0);
  if (process.stdout.cursorTo) {
    process.stdout.cursorTo(0);
  }
  if (process.stderr.cursorTo) {
    process.stderr.cursorTo(0);
  }
}

// Define program

program
  .name(pkgJson.name)
  .version(pkgJson.version)
  .argument('<keywords...>')
  .requiredOption<number>(
    '--limit <limit>, -l <limit>',
    'How many names it should find at most',
    intArgument,
    5000
  )
  .addOption(
    new Option('--style <style>, -s <style>', 'What style should be used')
      .choices(Object.values(NameStyle))
      .default(NameStyle.brandable)
  )
  .addOption(
    new Option('--randomness <randomness>, -r <randomness>', 'What randomness should be used')
      .choices(Object.values(NameRandomness))
      .default(NameRandomness.medium)
  )
  .requiredOption(
    '-h, --help',
    'Show help information',
    false,
  )
  .action(async (keywords: string[], options) => {
    // Detect help
    if (options.help) {
      return program.outputHelp();
    }

    // Validate

    // Set up progress bar
    const bar = new ProgressBar(cyan(':bar :percent (:current/:total) [eta: :etas | took: :elapseds]'), {
      total: options.limit,
      width: 20,
      complete: '█',
      incomplete: '░',
      clear: true,
    });

    // Start crawling
    await getNames(keywords, {
      ...options,
      onNext: (name) => {
        clearLine();
        process.stdout.write(`${name}\n`);
        bar.tick(1);
        bar.render(undefined, true);
      },
    });
  })
  .showHelpAfterError(true);

// Run program
program.parse(process.argv);
