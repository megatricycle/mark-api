import colors from 'colors';

export function log(type, message) {
    const timestamp = new Date();

    // prettier-ignore
    console.log( // eslint-disable-line no-console
        `${colors.blue.underline(timestamp.toString())} [${type === 'Error' ? colors.red(type) : colors.green(type)}] ${message}`
    );
}
