const express = require( 'express' );
const mongoose = require( 'mongoose' );
const morgan = require( 'morgan' );
const bodyParser = require( 'body-parser' );
const { DATABASE_URL, PORT } = require( './config' );
const { Users } = require( './models/user-model' );
const app = express();
const jsonParser = bodyParser.json();
const cors = require( './middleware/cors' );

app.use( cors );
app.use( express.static( "public" ) );
app.use( morgan( 'dev' ) );

app.post( '/api/users/register', jsonParser, ( req, res ) => {
    let {firstName, lastName, email, password} = req.body;

    if( !firstName || !lastName || !email || !password ){
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status( 406 ).end();
    }
    
    let newUser = { firstName, lastName, password, email };

    Users
        .createUser( newUser )
        .then( result => {
            return res.status( 201 ).json( result ); 
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.listen( PORT, () =>{
    console.log( "This server is running on port 8080" );

    new Promise( ( resolve, reject ) => {

        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        };
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });
});