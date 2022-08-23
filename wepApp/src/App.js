import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthContext from './Store/auth-context';

function App() {
  const ctxAuth = useContext(AuthContext)
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
      < Route path='/auth'>
        { !ctxAuth.IsLogin &&
        <AuthPage />
        }
      </Route>
      { ctxAuth.IsLogin &&
      <Route path='/profile'>
        
        <UserProfile />
      </Route>
        }

      <Route path='*'>
        <Redirect to='/' />
      </Route>
    </Switch>
    </Layout >
  );
}

export default App;
