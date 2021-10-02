class AuthUser {
    constructor() {
        this.email = null;
        this.password = null;
    }

    fill(data) {
        this.email = data.email;
        this.password = data.password;
        if (this.email === undefined || this.password === undefined) {
            throw new Error('All fields must be filled');
        }
    }
}

exports.AuthUser = AuthUser;