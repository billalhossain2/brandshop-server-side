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
    res.send(`Assingment 10 Server is running on port ${port}`)
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    //collection
    const brandsCollection = client.db('techStore').collection('brands');
    const brandProducts = client.db('techStore').collection('brandProducts');

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
      const result = await brandProducts.find(query).toArray();
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
        const result = await brandProducts.findOne(query);
        res.send(result)
        } catch (error) {
          res.status(500).json({message:"There is a server side error", error:error.message})
        }
    })

    //Get a route
    app.get("/users/:id", (req, res)=>{})

    //Post a route
    app.post("/users", (req, res)=>{})

    //Put a route
    app.put("/users/:id", (req, res)=>{})

    //Delete a route
    app.delete("/users/:id", (req, res)=>{})


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, (req, res)=>{
    console.log(`Assingment 10 Server is listening at port ${port}`)
})