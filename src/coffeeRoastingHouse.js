const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const coffeeRoastingHouseSchema = new Schema(
    {
        name : String,
        city: String,
    }
);

const CoffeeRoastingHouse  = mongoose.model('coffeeRoastingHouse', coffeeRoastingHouseSchema);

module.exports = CoffeeRoastingHouse;