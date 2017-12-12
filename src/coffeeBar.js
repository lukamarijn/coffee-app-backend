const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const coffeeBarSchema = new Schema(
    {
        name : {
            type: String,
            required: [true, 'Name is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        description: String,
        beans:  [{
            type: Schema.ObjectId,
            ref: 'coffeeBean'

        }]
    }
);

const CoffeeBar  = mongoose.model('coffeeBar', coffeeBarSchema);

module.exports = CoffeeBar;
