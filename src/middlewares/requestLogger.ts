import morgan, { StreamOptions } from 'morgan';
import chalk from 'chalk';

const logFormat = ':status :method :url - :response-time ms - :date[iso]';

const stream: StreamOptions = {
  write: (message: string) => {
    // Morgan log format produces a single line, parse it into meaningful parts
    const regex = /^(\d{3}) (\w+) ([^ ]+) - ([^ ]+) ms - (.+)$/;
    const match = message.trim().match(regex);

    if (!match) {
      console.error(chalk.red('Failed to parse log message'), message);
      return;
    }

    const [, status, method, url, responseTime, timestamp] = match;

    const statusColor =
      +status >= 500 ? chalk.red : +status >= 400 ? chalk.yellow : chalk.green;
    const methodColor = chalk.blueBright;
    const urlColor = chalk.cyan;
    const timeColor = chalk.magenta;
    const dateColor = chalk.gray;

    console.log(
      `${statusColor(status)} ${methodColor(method)} ${urlColor(
        url
      )} - ${timeColor(responseTime)} ms - ${dateColor(timestamp)}`
    );
  },
};

const logger = morgan(logFormat, { stream });

export default logger;
