import * as mongoose from "mongoose";

export async function connect(dbName) {
    try {
        await mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`);
        console.log(`Successfully connected to ${dbName}`);
    } catch (error) {
        console.log(error);
    }
}
