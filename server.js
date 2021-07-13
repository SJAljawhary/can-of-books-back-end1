'use strict';
  
const express = require('express');
require('dotenv').config();

const cors = require('cors');

const mongoose = require('mongoose');

const server = express();
const PORT = process.env.PORT;
server.use(cors());

server.get('/', homePageHandler);
function homePageHandler(request, response) {
  response.send('Hello in my route home')
}

server.get('/test', (request, response) => {
  response.status(200).send('my server is working')
})

mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });


const bookSchema = new mongoose.Schema({

  name : String,
  description : String,
  status : String
});

const userSchema = new mongoose.Schema({

  email : String,
  books : [bookSchema]

});

const bookModel = mongoose.model('books', bookSchema);
const userModel = mongoose.model('user', userSchema);

function seedBookCollection () {

  const books = new bookModel({
    name : 'The Growth Mindset',

    description : 'Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.',

    status : 'FAVORITE FIVE'
  })

  books.save();
  // console.log(books);
}
// seedBookCollection ();

function seedUserCollection (){

  const user = new userModel ({

    email : 'sndjehad@gmail.com',

    books : [
      {    name : 'The Growth Mindset',

      description : 'Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.',
  
      status : 'FAVORITE FIVE'},
      
      { name: 'The Momnt of Lift',
      
      description: 'Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.',
      
      status: 'RECOMMENDED TO ME'
      
      }
    ]
  })

  user.save();
  // console.log(user);
}

// seedUserCollection();

//http://localhost:3003/books?userEmail=sndjehad@gmail.com

server.get('/books',getFavouriteBook);

function getFavouriteBook(req,res) {
  let userEmail = req.query.userEmail;
 console.log('userEmail' , userEmail)
  userModel.find({email:userEmail},function(error,userData){
      if(error) {
          res.send('did not work')
      } else {
        console.log('userData', userData[0])
          res.send(userData[0].books)
      }
  })
}

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`)
})
