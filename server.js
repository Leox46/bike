var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bike = require('./bike');

/*************************** INIZIALIZZAZIONE *****************************/
// instantiate express
const app = express();

mongoose.Promise = global.Promise;
var options = {
    useMongoClient: true,
    //user: 'test', // non obbligatori, dato che sono già presenti nell'URI.
    //pass: 'test'
  };
mongoose.connect('mongodb://user:password@ds149865.mlab.com:49865/db_test', options); // MLAB
//mongoose.connect('mongodb://localhost:27017/GENERAL', options) // LOCALE

const db = mongoose.connection;
db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
  console.log('DB connected successfully!');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080;
// get an instance of the express Router
var router = express.Router();
/***************************************************************************/

// test route to make sure everything is working
router.get('/', function (req, res) {
  res.status = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: 'Welcome to our API!!!!!!' });
});


router.route('/bikes')

  // create a bike
  // accessed at POST http://localhost:8080/api/v1/bikes
  .post(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    // create a new instance of the Bike model
    var bike = new Bike();
    // set the bikes name (comes from the request)
    bike.bikeId = req.body.bikeId;
  	bike.brand = req.body.brand;
  	bike.biker = req.body.biker;

    // save the bike and check for errors
    bike.save(function (err) {
      if (err) { res.send({ error: { message: "Item not found" }}) }
      else{
        res.json(bike);
      }
    });
  })

  // get all the bikes
  // accessed at GET http://localhost:8080/api/v1/bikes
  // variante: questo server risponde anche se gli viene specificata come query
  // del GET lo brand, ritornando tutti gli bike con lo brand specificato.
  // accessed at GET http://localhost:8080/api/v1/bikes/?brand=177928
  .get(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    if(req.query.brand == null) { // se NON è specificato lo brand, allora ritorno tutti gli bikes
      Bike.find(function (err, bikes) {
        if (err) { res.send({ error: { message: "Item not found" }}) }
        else{
          res.json(bikes);
        }
      });
    }
    else {
      Bike.find( {'brand': req.query.brand}, function (err, bikes) {
        if (err) { res.send({ error: { message: "Item not found" }}) }
        else{
          res.json(bikes);
        }
      });
    }
  });


// route /bikes/bike
router.route('/bikes/:bike_id')

  // get the bike with that id
  // (accessed at GET http://localhost:8080/api/bikes/:bike_id)
  .get(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    Bike.findOne( {'bikeId': req.params.bike_id}, function (err, bike) {
      if (err) { res.send({ error: { message: "Item not found" }}) }
      else{
        res.json(bike);
      }
    });
  })

  // update the bike with this id
  // (accessed at PUT http://localhost:8080/api/v1/bikes/:bike_id)
  .put(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    // use our bike model to find the bike we want
    // ATTENZIONE!: usare findOne, e non find, altrimenti ritorna una collezione di oggetti, e bisogna estrarre il primo!
    Bike.findOne( {'bikeId': req.params.bike_id}, function (err, bike) {
      if (err) { res.send({ error: { message: "Item not found" }}) }
      else{
        // update the bikes info
        if(bike != null){
          if(req.body.bikeId != null) bike.bikeId = req.body.bikeId;
        	if(req.body.brand != null) bike.brand = req.body.brand;
        	if(req.body.biker != null) bike.biker = req.body.biker;
          // save the bike
          bike.save(function (err) {
            if (err) { res.send({ error: { message: "Item not found" }}) }
            else{
              res.json(bike);
            }
          });
        }
        else{
          res.status = 404;
          res.json({ error: { message: "Item Not Found" } });
        }
      }
    });
  })

  // delete the bike with this id
  // (accessed at DELETE http://localhost:8080/api/v1/bikes/:bike_id)
  .delete(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    Bike.remove( {'bikeId': req.params.bike_id}, function (err, bike) {
      if (err) { res.send({ error: { message: "Item not found" }}) }
      else {
        res.json({ message: 'Successfully deleted' });
      }
    });
  });



/*************************** MIDDLEWARE CORS ********************************/
// middleware route to support CORS and preflighted requests
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening: ' + req.method);
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});
/**************************************************************************/

// register our router on /api
app.use('/api/v1', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});


app.listen(port);
console.log('Magic happens on port ' + port);
module.exports = router;
