const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Bigman = require('../models/bigman');

mongoose.connect('mongodb://localhost:27017/bigmen', {
    
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Bigman.deleteMany({});
    for (let i = 0; i < 2; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const big = new Bigman({
            //YOUR USER ID
            author: '"62560d01624e5423c6d93fd7',
            category: `${cities[random1000].item}, ${cities[random1000].category}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
          
           
            images: [
                {
                    url: 'https://res.cloudinary.com/ddffwnpbq/image/upload/v1649540794/bigmans/76be8127e5009504ad4416204c91a851--stylish-plus-plus-size-men-fashion-outfits_wl1qlc.jpg',
                    filename: 'bigmans/76be8127e5009504ad4416204c91a851'
                },
                {
                    url: 'https://res.cloudinary.com/ddffwnpbq/image/upload/v1649540794/bigmans/76be8127e5009504ad4416204c91a851--stylish-plus-plus-size-men-fashion-outfits_wl1qlc.jpg',
                    filename: 'bigmans/76be8127e5009504ad4416204c91a851'
                }
            ]
        })
        await big.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})