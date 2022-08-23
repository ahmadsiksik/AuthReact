import { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../Store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const ChangePassword = useRef();
  const Authctx = useContext(AuthContext);
  const history=useHistory();

  const SubmitHand = (event) => {
    event.preventDefault();
    const ChangeHandlerPassword = ChangePassword.current.value;
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAOB3kHe7xOdytUE0VWEklkKo915czt6SE', {
      method: "POST",
      body: JSON.stringify({
        idToken: Authctx.token,
        password: ChangeHandlerPassword,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => {
      history.replace('/')
    })


  }
  return (
    <form className={classes.form} onSubmit={SubmitHand}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' minLength={7} id='new-password' ref={ChangePassword} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
