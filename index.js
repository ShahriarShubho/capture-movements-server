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

    const bookingCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("booking");

    const adminCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("admin");


  app.post('/addServices', (req, res) => {
    const service = req.body
    serviceCollection.insertOne(service)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

app.post('/addReview', (req, res) => {
  const review = req.body
  reviewCollection.insertOne(review)
  .then(result => {
    res.send(result.insertedCount > 0)
  })
})

app.post('/addBooking', (req, res) => {
  const booking = req.body
  bookingCollection.insertOne(booking)
  .then(result => {
    res.send(result.insertedCount > 0)
  })
})

app.post('/makeAdmin', (req, res) => {
  const admin = req.body
  console.log(admin);
  adminCollection.insertOne(admin)
  .then(result => {
    res.send(result.insertedCount > 0)
  })
})

app.post('/isAdmin', (req, res) => {
  const email = req.body.email
  adminCollection.find({email: email})
  .toArray((err, admin) => {
    res.send(admin.length > 0)
  })
  
})


app.get('/bookingById/:id', (req, res) => {
  serviceCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err, book) => {
    res.send(book[0])
  })
})


app.patch('/update/:id', (req, res) => {
  console.log(req.body.status)
  bookingCollection.updateOne({_id: ObjectId(req.params.id)},
  {
    $set : {status : req.body.status}
  })
  .then(result =>{
    res.send(result.modifiedCount > 0)
    console.log(result)
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

  app.get("/orders", (req, res) => {
    bookingCollection.find({})
    .toArray((err, orders) => {
      res.send(orders);
    });
  });

  app.get("/booking", (req, res) => {
    bookingCollection.find({email : req.query.email})
    .toArray((err, booking) => {
      res.send(booking);
    });
  });

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id)
    serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result =>{
      console.log(result)
      res.send(result.deletedCount > 0)
    })
  })

});

app.listen(port);
