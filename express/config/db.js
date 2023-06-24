const mongoose = require('mongoose');
require('dotenv').config({path: 'config.env'});
//const dbURL = require('./properties').DB;

/*module.exports = () =>{
    mongoose.connect(dbURL, {userNewUrlParser: true}).then(() => console.log(`Mongo connected on ${dbURL}`)).catch(err => console.log(`Connection has error ${err}`))

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log(`Mongo is disconnected`);
            process.exit(0)
        });
    });
}*/

const conectarDB = async() => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            UseUnifiedTopology: true
        })
        console.log('BD Connected');
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}

module.exports = conectarDB;

