import app from "./app.js";
import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
    try {
        const conn = mongoose.connect(process.env.DB!)
        console.log('Mongodb Connection stablished');
    } catch (error) {
        console.log('Mongodb connection error:', error);
        process.exit();
    }
}

connectDB().then(() => {
    console.log('Mongodb connected');
    app.listen(app.get('port'));
    console.log('Server on port', app.get('port'));
}
);

