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




const baseUrlAPI =  '/' + process.env.BASE_API_URL || 'api'
const APIVersion =  '/' + process.env.API_VERSION || 'v1' 
const fullPath = baseUrlAPI + APIVersion


app.use(`${fullPath}/categories`,categoriesRoute)
app.use(`${fullPath}/banner`,bannerRoute)
app.use(`${fullPath}/product`,productRoute)
app.use(`${fullPath}/attributes`,attributesRoute)



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

