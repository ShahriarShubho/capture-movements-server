const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfpqs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {

  const serviceCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("services");

    const reviewCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("review");


  app.post('/addServices', (req, res) => {
    const service = req.body
    serviceCollection.insertOne(service)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

app.post('/addReview', (req, res) => {
  const review = req.body
  console.log(review)
  reviewCollection.insertOne(review)
  .then(result => {
    console.log(result.insertedCount, "inserted")
    res.send(result.insertedCount > 0)
  })
})

app.get('/bookingById/:id', (req, res) => {
  serviceCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err, book) => {
    res.send(book[0])
  })
})

  app.get("/services", (req, res) => {
    serviceCollection.find({})
    .toArray((err, service) => {
      res.send(service);
    });
  });

  app.get("/reviews", (req, res) => {
    reviewCollection.find({})
    .toArray((err, review) => {
      res.send(review);
    });
  });

});

app.listen(port);
