import passport from 'passport';
import { User } from '../models';
import { hashPasswordWithSalt } from '../util/security';
import { Strategy as LocalStrategy } from 'passport-local';

export const strategy = new LocalStrategy((username, password, done) => {
    User.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if (user === null) {
            return done(null, false, { message: 'Incorrect credentials.' });
        }

        var hashedPassword = hashPasswordWithSalt(password, user.salt);

        if (user.password === hashedPassword) {
            return done(null, user);
        }

        return done(null, false, { message: 'Incorrect credentials.' });
    });
});

export function serialize(user, done) {
    done(null, user.id);
}

export function deserialize(id, done) {
    User.findOne({
        where: { id }
    }).then(user => {
        if (user === null) {
            done(new Error('Wrong user id.'));
        }

        done(null, user);
    });
}

export function init() {
    passport.use(strategy);
    passport.serializeUser(serialize);
    passport.deserializeUser(deserialize);
}
