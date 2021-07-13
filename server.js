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

app.get('/test', (request, response) => {
  response.status(200).send('my server is working')
})


app.use(express.json())


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

    status : 'FAVORITE FIVE',
    img : 'https://prodimage.images-bn.com/pimages/9781119421979_p0_v2_s550x406.jpg'
  },
  
  { name: 'The Momnt of Lift',
      
  description: 'Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.',
  
  status: 'RECOMMENDED TO ME',
  img : 'https://images-na.ssl-images-amazon.com/images/I/71LESEKiazL.jpg'
  
  }

  )

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

app.get('/books',getFavouriteBook);

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

app.post('/books' , aadBookHandler);

function aadBookHandler(req,res){

  let {userEmail,bookName,bookDesc,bookStatus,bookImage} = req.body;

  userModel.find({email:userEmail},function(error,userData){
    if(error) {
        res.send('user not found')
    } else { userData[0].books.push({
 
             name : bookName,
             description : bookDesc,
             status : bookStatus,
             img : bookImage
    })
    
    userData[0].save();
    res.send(userData[0].books)
  }
  }
  )}

  app.delete('/books/:id', deleteBookHandler )

  function deleteBookHandler(req,res){

   let id =req.params.id;
   let userEmail = req.query.userEmail;

   userModel.find({email:userEmail},function(error,userData){
    if(error) {
        res.send('user not found')
    } else { let newArray = userData[0].books.filter(value => {

      return value._id.toString() !== id
    })
    userData[0] = newArray;
    userData[0].save();
    res.send(userData[0].books)

  }
}
   )}


app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`)
})

