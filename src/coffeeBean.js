const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const coffeeBeanSchema = new Schema(
    {
        title : String,
        large_image_url: String,
        image_url: String,
        description: String,
        roasting_house: {
            type: Schema.Types.ObjectId,
            ref: 'coffeeRoastingHouse'
        }
    }
);

const CoffeeBean  = mongoose.model('coffeeBean', coffeeBeanSchema);

module.exports = CoffeeBean;