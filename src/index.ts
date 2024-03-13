import express,  { Express } from "express";
import dotenv from "dotenv";
import requestTracker from "./api/middleware/tracker.middleware";
dotenv.config();

import './helper/db/mongodb.helper'
import './helper/db/psima.helper'
//import route
import categoriesRoute from './api/routes/categories.routes'
import bannerRoute from './api/routes/banner.routes'
import productRoute from './api/routes/product.routes'
import attributesRoute from './api/routes/attribute.routes'

const app : Express = express();
const port = process.env.PORT || 4000;



app.use(requestTracker)

app.use('/categories',categoriesRoute)
app.use('/banner',bannerRoute)
app.use('/product',productRoute)
app.use('/attributes',attributesRoute)



app.use((req, res, next) => {
    const errorResponse = {
        success: false,
        error: {
            code: 404,
            message: 'Something went wrong'
        },
        timestamp: new Date()
    };

    res.status(404).json(errorResponse);
});


app.listen(port, () => {
    console.log(`server running at port: ${port}`)
})

