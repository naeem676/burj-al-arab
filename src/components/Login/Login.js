import React, { useContext } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';
import google from "../../google.png";
import './Login.css';

if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
}

const Login = () => {

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);

    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };


    const googleProvider = new firebase.auth.GoogleAuthProvider();

    const googleHandle = ()=>{
        firebase.auth()
                .signInWithPopup(googleProvider)
                .then((result) => {
                    /** @type {firebase.auth.OAuthCredential} */
                    
                    const user = result.user;
                    const {displayName, email} = user;
                    const signedInUser = {name: displayName, email}

                    setLoggedInUser(signedInUser);
                    storeAuthToken();

                    
                    // ...
                }).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    console.log(errorCode, errorMessage);
                   
                });

    }

    const storeAuthToken = () => {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
        .then(function(idToken) {
            sessionStorage.setItem('token', idToken)
            history.replace(from);
          }).catch(function(error) {
            // Handle error
          });
          
    }

    return (
        <div>
            <button className='google-btn' onClick={googleHandle}>
            <img className='google-pic' src={google} alt="" srcset=""/> Google SignIn</button>
        </div>
    );
};

export default Login;