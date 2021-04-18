const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 5000;

//welcome site
app.get("/", (req, res) => {
  res.send("WElcome to our website");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfpqs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  //service collection
  const serviceCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("services");

  //review collection
  const reviewCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("review");

  //booking collection
  const bookingCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("booking");

  //admin collection
  const adminCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("admin");

  //add service in website
  app.post("/addServices", (req, res) => {
    const service = req.body;
    serviceCollection.insertOne(service).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //add review from user
  app.post("/addReview", (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //add booking from user in service
  app.post("/addBooking", (req, res) => {
    const booking = req.body;
    bookingCollection.insertOne(booking).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //Make admin
  app.post("/makeAdmin", (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //load specific admin filter in email
  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email }).toArray((err, admin) => {
      res.send(admin.length > 0);
    });
  });

  //load dynamic booking by id
  app.get("/bookingById/:id", (req, res) => {
    serviceCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, book) => {
        res.send(book[0]);
      });
  });

  //Update user status
  app.patch("/update/:id", (req, res) => {
    bookingCollection
      .updateOne({ _id: ObjectId(req.params.id) },
        {
          $set: { status: req.body.status },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  //load all services
  app.get("/services", (req, res) => {
    serviceCollection.find({}).toArray((err, service) => {
      res.send(service);
    });
  });

  //load review
  app.get("/reviews", (req, res) => {
    reviewCollection.find({}).toArray((err, review) => {
      res.send(review);
    });
  });

  //get all orders
  app.get("/orders", (req, res) => {
    bookingCollection.find({}).toArray((err, orders) => {
      res.send(orders);
    });
  });

  //load specific user order filter by email
  app.get("/booking", (req, res) => {
    bookingCollection
      .find({ email: req.query.email })
      .toArray((err, booking) => {
        res.send(booking);
      });
  });

  //delete service F
  app.delete("/delete/:id", (req, res) => {
    console.log(req.params.id);
    serviceCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log(result);
        res.send(result.deletedCount > 0);
      });
  });
});

app.listen(port);
