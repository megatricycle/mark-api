let config;

if (process.env.NODE_ENV === 'development') {
    config = {
        database: '',
        username: '',
        password: '',
        options: {
            dialect: ''
        }
    };
} else {
    config = {
        database: '',
        username: '',
        password: '',
        options: {
            dialect: '',
            logging: false
        }
    };
}

export default config;
