import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebaseHelper from 'firebase-functions-helper';
import * as express from 'express';
import * as bodyParser from 'body-parser';
//import * as credentials from '../../serviceAccountKey.json';

//admin.initializeApp(functions.config().firebase);

admin.initializeApp({
    credential: admin.credential.cert(require('../../serviceAccountKey.json')),
    databaseURL: "https://proyecto-1-nrc-7828.firebaseio.com"
});

const db = admin.firestore();
const app = express();
const main = express();

const collectionPersons = "persons";

main.use("/api", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));

export const api = functions.https.onRequest(main);

interface Person{
    name: String
    age: number

}

app.post('/persons', async(req, res)=>{
    try{
        const person:Person = {
            name: req.body['name'],
            age: req.body['age'],
        }

        /*db.collection(collectionPersons).add(person).then(resullt => {
          res.status(201).send('Person was added to collection');
        }).catch(err =>
        res.status(400).send(`An error has ocurred ${err}`);
       )*/
        const newPerson = await firebaseHelper.firestore.createNewDocument(db, collectionPersons, person);
        res.status(201).send(`Person ${newPerson.id} was added to collection`);

    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`);
    }
})

export {app};


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
