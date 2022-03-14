import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';

const logDirPath = path.join(__dirname, '..', '..', 'logs');

const appendMessage = (type: string, data: any) => {
  const exists = fs.existsSync(logDirPath);
  if (!exists) {
    fs.mkdirSync(logDirPath);
  }
  fs.appendFileSync(path.join(logDirPath, `${type}.log`), JSON.stringify(data) + '\n');
};

export const logError = (err: any) => {
  appendMessage('errors', {
    timestamp: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
    message: err.message,
    stack: err.stack
  });
};

export const logInfo = (msg: any) => {
  appendMessage('logInfo', {
    timestamp: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
    message: msg
  });
};
