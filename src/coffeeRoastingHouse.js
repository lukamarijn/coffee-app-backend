const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const coffeeRoastingHouseSchema = new Schema(
    {
        name : String,
        city: String,

      /* beans: [{
            type: Schema.Types.ObjectId,
            ref: 'coffeeBean'}
        ]*/
    }
);

const CoffeeRoastingHouse  = mongoose.model('coffeeRoastingHouse', coffeeRoastingHouseSchema);

module.exports = CoffeeRoastingHouse;