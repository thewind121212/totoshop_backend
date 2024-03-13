import mongoose from "mongoose";


const dbURL = `mongodb://${process.env.MONGO_URI}:${process.env.MONGO_PORT}` 
const connectOptions = {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    dbName: process.env.MONGO_DBNAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    minPoolSize: 10,
}


const connectAndCheckingConnect = async () => {
    try {
        await mongoose.connection.db.admin().ping() 
        console.log('mongodb connection is healthy');
        
    } catch (error) {
        console.error('mongodb connection is lost:', error);
    }
}


//connect to the database
mongoose.connect(dbURL, connectOptions).catch((error) => {
    console.error(error);
    throw error;
    });

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB database');
    
    const checkInterval = setInterval(connectAndCheckingConnect, 1000 * 60 * 5 );
    
    process.on('SIGINT', () => {
      clearInterval(checkInterval);
      mongoose.connection.close()
        console.log('Database connection closed');
        console.log('Application is shutting down');
        process.exit(0);
    });
  });
