/* eslint-disable no-underscore-dangle */
const { ObjectID } = require('mongodb');

class Recipe {
    constructor() {
        this._id = new ObjectID();
        this.name = null;
        this.ingredients = null;
        this.preparation = null;
        this.userId = null;
    }

    fill(data) {
        this.name = data.name;
        this.ingredients = data.ingredients;
        this.preparation = data.preparation;
        if (this.name === undefined || this.ingredients === undefined
            || this.preparation === undefined) {
            throw new Error('Invalid entries. Try again.');
        }
    }
}

exports.Recipe = Recipe;