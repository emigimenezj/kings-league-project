import pico from 'picocolors';

const symbol = {
	info: pico.blue('ℹ'),
	success: pico.green('✔'),
	warning: pico.yellow('⚠'),
	error: pico.red('✖')
}

export function logInfo(...args) {
  console.log(`${symbol.info} ${pico.cyan(...args)}`);
}

export function logError(...args) {
  console.log(`${symbol.error} ${pico.red(...args)}`);
}

export function logSuccess(...args) {
  console.log(`${symbol.success} ${pico.green(...args)}`);
}

export function logWarning(...args) {
  console.log(`${symbol.warning} ${pico.yellow(...args)}`);
}
