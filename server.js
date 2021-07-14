'use strict';

const express = require('express');
require('dotenv').config();

const cors = require('cors');

const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.get('/', homePageHandler);
function homePageHandler(request, response) {
  response.send('Hello in my route home')
}

app.use(express.json())


mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });


const bookSchema = new mongoose.Schema({

  name: String,
  description: String,
  status: String,
  img: String
});

const userSchema = new mongoose.Schema({

  email: String,
  books: [bookSchema]

});

const bookModel = mongoose.model('books', bookSchema);
const userModel = mongoose.model('user', userSchema);



function seedUserCollection() {

  const user = new userModel({

    email: 'sndjehad@gmail.com',

    books: [
      {
        name: 'The Growth Mindset',

        description: 'Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.',

        status: 'FAVORITE FIVE',

        img: 'https://m.media-amazon.com/images/I/61bDwfLudLL._AC_UL640_QL65_.jpg'
      },

      {
        name: 'The Momnt of Lift',

        description: 'Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.',

        status: 'RECOMMENDED TO ME',

        img: 'https://m.media-amazon.com/images/I/71LESEKiazL._AC_UY436_QL65_.jpg'

      }
    ]
  })

  // user.save();
  // console.log(user);
}

// seedUserCollection();

//http://localhost:3003/books?userEmail=sndjehad@gmail.com

app.get('/books', getFavouriteBook);

function getFavouriteBook(req, res) {
  let userEmail = req.query.userEmail;
  console.log('userEmail', userEmail)
  userModel.find({ email: userEmail }, function (error, userData) {
    if (error) {
      res.send('did not work')
    } else {
      console.log('userData', userData[0])
      res.send(userData[0].books)
    }
  })
}

app.post('/addbook', aadBookHandler);

function aadBookHandler(req, res) {

  let { userEmail, bookName, bookDesc, bookStatus, bookImage } = req.body;

  console.log(req.body)

  userModel.find({ email: userEmail }, function (error, userData) {
    if (error) {
      res.send('user not found')
    } else {
      userData[0].books.push({

        name: bookName,
        description: bookDesc,
        status: bookStatus,
        img: bookImage
      })

      userData[0].save();
      res.send(userData[0].books)
    }
  }
  )
}

app.delete('/deletebook/:id', deleteBookHandler)

function deleteBookHandler(req, res) {

  const id = Number(req.params.id);


  let userEmail = req.query.userEmail;

  userModel.find({ email: userEmail }, function (error, userData) {
    if (error) {
      response.status(500).send('NOT FOUND')
    } else {

      let newArray = userData[0].books.filter((item, idx) => {

        if (idx !== id) return { item }
      })
      userData[0].books = newArray

      userData[0].save();

      res.send(userData[0].books)
    }
  }
  )
}

app.put('/updateBook/:bookID',updateBookHandler);


function updateBookHandler(req,res) {
 
  let { userEmail, bookName, bookDesc, bookStatus, bookImage } = req.body;
  let index = Number(req.params.bookID);

  userModel.findOne({email: userEmail},(error,userData)=>{
      if(error) res.send('error in finding the data')
      else {
          
          userData.books.splice(index,1,{
              name:bookName,
              description:bookDesc,
              status:bookStatus,
              img:bookImage
          })
    
          userData.save();
          res.send(userData.books)
          
      }
  })


}



app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`)
})

