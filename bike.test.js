const root = process.env.SERVER_URL || 'https://assignmentbasemodel.herokuapp.com/api/v1' // http://127.0.0.1:8080/api
const fetch = require("node-fetch")
const assignmentsRoot = root+'/assignments'
const exampleAssignment =  {
    "assignmentId": "30",
    "studentId": "veniam sit proident",
    "assignment": {"url":"some url"},
    "assignmentType": "minim",
    "assignmentValuation": 21
}
// importante per il TEST COVERAGE!
// const server = require('./server');

// helper methods - you can put these  in a separate file if you have many tests file and want to reuse them

const postAssignments = function (newAssignment) {
    return fetch(assignmentsRoot, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newAssignment)
    })
}

const putAssignments = function (assignmentId, assignment) {
    return fetch(assignmentsRoot+'/'+assignmentId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(assignment)
    })
}

const deleteAssignments = function (assignmentId) {
    return fetch(assignmentsRoot+'/'+assignmentId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
}


const getManyAssignments = function () {
    return fetch(assignmentsRoot, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
}

const getOneAssignment = function (assignmentId) {
    return fetch(assignmentsRoot+'/'+assignmentId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
}



test('basic post and get single element', () => {
  return postAssignments(exampleAssignment)
    .then(postResponse => { return postResponse.json() })
    .then(postResponseJson => {
      exampleAssignment.assignmentId = postResponseJson.assignmentId
      return getOneAssignment(exampleAssignment.assignmentId)
    })
    .then(getResponse => {return getResponse.json()})
    .then(jsonResponse => {expect(jsonResponse).toMatchObject(exampleAssignment)})
    //.catch(e => {console.log(e)})
});

// importante! Mettere la PUT prima della DELETE!
test('put item by assignmentId - basic response', () => {
  return putAssignments(exampleAssignment.assignmentId, exampleAssignment)
    .then(response => { expect(response.status).toBe(200) })
    //.catch(e => {console.log(e)})
});

test('delete by assignmentId - basic response', () => {
  return deleteAssignments(exampleAssignment.assignmentId)
    .then(response => { expect(response.status).toBe(200) })
    //.catch(e => {console.log(e)})
});

test('get all assignments - basic response', () => {
  return getManyAssignments()
    .then(response => { expect(response.status).toBe(200) })
    //.catch(e => {console.log(e)})
});


/*
test('delete by assignmentID - item actually deleted', () => {
  return getOneAssignment(exampleAssignment.assignmentId)
    .then(res => {expect(res.status).toBe(404)})
    //.catch(e => {console.log(e)})
});
*/
