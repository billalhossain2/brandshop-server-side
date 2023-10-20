const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 9000;
dotenv.config()

//Middlewares
app.use(express.json())
app.use(cors())


//Default Route
app.get("/", (req, res)=>{
    res.send(`Tech Store Server is running on port ${port}`)
})

//Mongodb connection string
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    //collection
    const brandsCollection = client.db('techStore').collection('brands');
    const brandProductsCollection = client.db('techStore').collection('brandProducts');
    const cartCollection = client.db('techStore').collection('cart');

    //Get all route
    app.get("/brands", async(req, res)=>{
      try {
        const result = await brandsCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).json({message:"There is a server side error", error:error.message})
      }
    })

    //Get products by brand name
    app.get("/brand-products/:brandName", async(req, res)=>{
      try {
      const brandName = req.params.brandName;
      const query = {brand_name:brandName}
      const result = await brandProductsCollection.find(query).toArray();
      res.send(result)
      } catch (error) {
        res.status(500).json({message:"There is a server side error", error:error.message})
      }
    })

    //Get brand product details by id
    app.get("/brand-products/details/:productId", async(req, res)=>{
      try {
        const productId = req.params.productId;
        const query = {_id:new ObjectId(productId)}
        const result = await brandProductsCollection.findOne(query);
        res.send(result)
        } catch (error) {
          res.status(500).json({message:"There is a server side error", error:error.message})
        }
    })

    //Add a product to  cart route
    app.post("/cart", async(req, res)=>{
      try {
      const productToBeAdded = req.body;
      const result = await cartCollection.insertOne(productToBeAdded)
      res.send(result)
      } catch (error) {
        res.status(500).json({message:"There is a server side error", error:error.message})
      }
    })

    //Get all products from cart route
    app.get("/cart/:displayName", async(req, res)=>{
      try {
      const displayName = req.params.displayName;
      const result = await cartCollection.find({displayName:displayName}).toArray();
      res.send(result)
      } catch (error) {
        res.status(500).json({message:"There is a server side error", error:error.message})
      }
    })

    //Remove a product from cart route
    app.delete("/cart/:productId", async(req, res)=>{
      try {
      const productId = req.params.productId;
      const query = {_id:new ObjectId(productId)}
      const result = await cartCollection.deleteOne(query);
      res.send(result)
      } catch (error) {
        res.status(500).json({message:"There is a server side error", error:error.message})
      }
    })


    //Add product to brand products 
    app.post("/brand-products", async(req, res)=>{
      try {
      const productToBeAdded = req.body;
      const result = await brandProductsCollection.insertOne(productToBeAdded)
      res.send(result)
      } catch (error) {
        res.status(500).json({message:"There is a server side error", error:error.message})
      }
    })


    //Update a product by id
    app.put("/brand-products/:productId", async(req, res)=>{
      try {
        const productId = req.params.productId;
        const options = {upsert:true}
        const updateDoc = {$set:req.body}
        const query = {_id:new ObjectId(productId)}
        const result = await brandProductsCollection.updateOne(query, updateDoc, options);
        res.send(result)
        } catch (error) {
          res.status(500).json({message:"There is a server side error", error:error.message})
        }
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, (req, res)=>{
    console.log(`Tech Store Server is listening at port ${port}`)
})