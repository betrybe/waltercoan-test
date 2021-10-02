const { ObjectID } = require('mongodb');

class User {
    constructor() {
        this._id = new ObjectID();
        this.name = null;
        this.email = null;
        this.password = null;
        this.role = 'user';
    }

    fill(data) {
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role;
        if (this.name === undefined || this.email === undefined
            || this.password === undefined || this.role === undefined) {
            throw new Error('Invalid entries. Try again.');
        }
    }
}

exports.User = User;