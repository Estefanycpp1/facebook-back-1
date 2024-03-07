import mongoose, { ConnectOptions} from 'mongoose';
import "dotenv/config"

const dbOptions: ConnectOptions = {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    autoCreate: true
};

mongoose.connect(process.env.DB!, dbOptions);
let connection = mongoose.connection;

export default connection;