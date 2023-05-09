const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = 3000;

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// start mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.br1rtw5.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb://localhost:27017/helloDB" ;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const productsCollection = await client
      .db("helloDB")
      .collection("products");

    //get the data
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //get the Single data
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });
  //update the Data
  app.put("/products/:id", async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    console.log(data, id);
    const query = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatedProducts = {
      $set: {
        name: data.name,
        photoUrl: data.photoUrl,
        productsCata: data.productsCata,
        favColor: data.favColor,
      },
    };
    const result = await productsCollection.updateOne(
      query,
      updatedProducts,
      options
    );
    res.send(result);
  });

    // Post the data
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });
  
    //Delete the data
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
      console.log("deleted");
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
