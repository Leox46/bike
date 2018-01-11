const root = process.env.SERVER_URL || 'https://bikebaseapp.herokuapp.com/api/v1' // http://127.0.0.1:8080/api
const fetch = require("node-fetch")
const bikesRoot = root+'/bikes'
const exampleBike =  {
    "bikeId": "59",
    "brand": "Lambretta",
    "biker": "Leonardo Dal Ronco"
}
// importante per il TEST COVERAGE!
// const server = require('./server');

// helper methods - you can put these  in a separate file if you have many tests file and want to reuse them

const postBikes = function (newBike) {
    return fetch(bikesRoot, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newBike)
    })
}

const putBikes = function (bikeId, bike) {
    return fetch(bikesRoot+'/'+bikeId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(bike)
    })
}

const deleteBikes = function (bikeId) {
    return fetch(bikesRoot+'/'+bikeId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
}


const getManyBikes = function () {
    return fetch(bikesRoot, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
}

const getOneBike = function (bikeId) {
    return fetch(bikesRoot+'/'+bikeId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
}



test('basic post and get single element', () => {
  return postBikes(exampleBike)
    .then(postResponse => { return postResponse.json() })
    .then(postResponseJson => {
      exampleBike.bikeId = postResponseJson.bikeId
      return getOneBike(exampleBike.bikeId)
    })
    .then(getResponse => {return getResponse.json()})
    .then(jsonResponse => {expect(jsonResponse).toMatchObject(exampleBike)})
    //.catch(e => {console.log(e)})
});

// importante! Mettere la PUT prima della DELETE!
test('put item by bikeId - basic response', () => {
  return putBikes(exampleBike.bikeId, exampleBike)
    .then(response => { expect(response.status).toBe(200) })
    //.catch(e => {console.log(e)})
});

test('delete by bikeId - basic response', () => {
  return deleteBikes(exampleBike.bikeId)
    .then(response => { expect(response.status).toBe(200) })
    //.catch(e => {console.log(e)})
});

test('get all bikes - basic response', () => {
  return getManyBikes()
    .then(response => { expect(response.status).toBe(200) })
    //.catch(e => {console.log(e)})
});


/*
test('delete by bikeID - item actually deleted', () => {
  return getOneBike(exampleBike.bikeId)
    .then(res => {expect(res.status).toBe(404)})
    //.catch(e => {console.log(e)})
});
*/
