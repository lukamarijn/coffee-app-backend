const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const coffeeBeanSchema = new Schema(
    {
        title :  {
            type: String,
            required: [true, 'Name is required']
        },
        large_image_url:  {
            type: String,
            required: [true, 'Large image is required']
        },
        image_url:  {
            type: String,
            required: [true, 'Image is required']
        },
        description: String,
        roasting_house: {
            type: Schema.Types.ObjectId,
            ref: 'coffeeRoastingHouse'
        }
    }
);

const CoffeeBean  = mongoose.model('coffeeBean', coffeeBeanSchema);

module.exports = CoffeeBean;