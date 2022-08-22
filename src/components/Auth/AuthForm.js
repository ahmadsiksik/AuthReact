import { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../Store/auth-context';


import classes from './AuthForm.module.css';

const AuthForm = () => {
  const ctxAuth = useContext(AuthContext);
  const history = useHistory();

  const Email = useRef();
  const Password = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [isLooding, setIsLooding] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const SubmitForm = (e) => {
    e.preventDefault()
    const UserEmail = Email.current.value;
    const UserPass = Password.current.value;
    setIsLooding(true);
    let url;
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAOB3kHe7xOdytUE0VWEklkKo915czt6SE';
    }
    else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAOB3kHe7xOdytUE0VWEklkKo915czt6SE'
    }
    fetch(url,
      {
        method: 'POST',
        body: JSON.stringify({
          email: UserEmail,
          password: UserPass,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(res => {
        setIsLooding(false);
        if (res.ok) {
          return res.json();
        }
        else {
          return res.json().then((data) => {
            //   // show an error modal
            //   console.log(data);
            throw new Error("The Passworde or Email is Wrong")
          })
        }
      }).then((data) => {
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        ctxAuth.login(data.idToken, expirationTime.toISOString());
        history.replace('/')

      }).catch((err) => {
        alert(err.message)
      })
  };


  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : ' SignUp'}</h1>
      <form onSubmit={SubmitForm}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={Email} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={Password} />
        </div>
        <div className={classes.actions}>
          {!isLooding && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLooding && <p>Looding</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;



