const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload');



const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('services'));
app.use(fileUpload());

const port = process.env.PORT || 5000


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/addServices', (req, res) => {
    const file = req.files.file
    const name = req.body.name
    const email = req.body.email
    const description = req.body.description
    
    file.mv(`${__dirname}/services/${file.name}`, err => {
        if(err) {
            console.log(err)
           return res.status(400).send({massage : "filed to load"})
        }
        return res.status(200).send({name : file.name, path : `/${file.name}`})
    })
})

app.listen(port)