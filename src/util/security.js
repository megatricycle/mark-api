import bcrypt from 'bcrypt';

export function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return {
        salt,
        hash
    };
}

export function hashPasswordWithSalt(password, salt) {
    return bcrypt.hashSync(password, salt);
}
