var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// ci sono solo 3 data type: Object, String e Number.
var BikeSchema = new Schema({
	bikeId: String,
	brand: String,
	biker: String
});

module.exports = mongoose.model('Bike', BikeSchema);
