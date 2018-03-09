'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

//Queue Node and Class

class _Node{
  constructor(value) {
    this.value=value,
    this.next=null,
    this.prev=null;
  }
}

class Queue {
  constructor(){
    this.first = null;
    this.last = null;
  }

  enqueue(data) {
    const node = new _Node(data);

    if (this.first === null) {
      this.first = node;
    }
    if (this.last) {
      node.next = this.last;
      this.last.prev = node;
    }
    this.last = node;
  }

  dequeue() {
    if (this.first === null) {
      return;
    }

    const node = this.first;
    this.first = node.prev;

    if (node === this.last) {
      this.last = null;
    }
    return node.value; 
  }

  dump() {
    for (let node = this.first; node; node = node.prev) console.log(node.value);

    console.log('---');

    for (let node = this.last; node; node = node.next) 
      console.log(node.value);
  }

  peek() {
    return this.first;
  }
}

const main = () => {
  const catQueue = new Queue();
  const dogQueue = new Queue();
  catQueue.enqueue({
    imageURL:'https://assets3.thrillist.com/v1/image/2622128/size/tmg-slideshow_l.jpg',
    imageDescription: 'Orange bengal cat with black stripes lounging on concrete.',
    name: 'Fluffy',
    sex: 'Female',
    age: 2,
    breed: 'Bengal',
    story: 'Thrown on the street'
  });
  catQueue.enqueue({
    imageURL: 'https://images.unsplash.com/photo-1509195605820-8eb07b921387?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cef41b325aa1f84d694aa4d831fb4852&auto=format&fit=crop&w=800&q=80',
    imageDescription: 'Hes not unamused, hes merely philosophizing',
    name: 'Simon',
    sex: 'Female',
    age: 2,
    breed: 'Cat',
    story: 'Scarf business went bankrupt, needs hooman to pay for affluent lifestyle',
  });
  catQueue.enqueue({
    imageURL: 'https://images.unsplash.com/photo-1457410129867-5999af49daf7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=db366be68b7ffcb315597fcf0c1b6a51&auto=format&fit=crop&w=1055&q=80',
    imageDescription: 'Lick.....lllllick',
    name: 'Georgina',
    sex: 'Female',
    age: 10.5,
    breed: 'Cat',
    story: 'Kiiiity' 
  });
  dogQueue.enqueue({
    imageURL: 'http://www.dogster.com/wp-content/uploads/2015/05/Cute%20dog%20listening%20to%20music%201_1.jpg',
    imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
    name: 'Zeus',
    sex: 'Male',
    age: 3,
    breed: 'Golden Retriever',
    story: 'Owner Passed away' 
  });
  dogQueue.enqueue({
    imageURL: 'https://images.unsplash.com/photo-1446231855385-1d4b0f025248?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b225b82aed59ec4163fffedc145f33d6&auto=format&fit=crop&w=1050&q=80',
    imageDescription: 'The coolest dog-panda combo youve ever seen',
    name: 'Floofy',
    sex: 'Male',
    age: 5,
    breed: 'Pomchewbacca',
    story: 'Pupper from Kashykk, needs home' 
  });
  dogQueue.enqueue({
      imageURL: 'https://images.unsplash.com/uploads/1412433710756bfa9ec14/d568362b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6ade3daa9473993c645b681f6b790ced&auto=format&fit=crop&w=1510&q=80',
      imageDescription: 'Hes not unamused, hes merely philosophizing',
      name: 'Bernard',
      sex: 'Male',
      age: 4.5,
      breed: 'Mutt pup',
      story: 'Parents gave him to son, who traded him for Call of Duty WWII, and is now at shelter' 
    });
  console.log(catQueue.peek().value);


//Pet endpoints
app.get('/api/cat', (req, res) => {
  return res.json(catQueue.peek().value);
});

app.get('/api/dog', (req, res) => {
  return res.json(dogQueue.peek().value);
});

app.delete('/api/cat', (req, res) => {
  catQueue.dequeue();
  res.status(204).end();
});

app.delete('/api/dog', (req, res) => {
  dogQueue.dequeue();
  res.status(204).end();
});

};
main();


//Run server functions
function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = {app};
