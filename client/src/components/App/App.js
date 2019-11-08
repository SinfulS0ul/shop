import React, { useState, useEffect } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import ResetPassword from '../ResetPassword/ResetPassword';
import SellProductForm from '../SellProductForm/SellProductForm';
import SearchPage from '../SearchPage/SearchPage';
import ProductPage from '../ProductPage/ProductPage';
import EditProfileForm from '../EditProfileForm/EditProfileForm';
import UserProfilePage from '../UserProfilePage/UserProfilePage';
import Header from '../Header/Header';
import Home from '../Home/Home';
import Footer from '../Footer/Footer';
import Inbox from '../Inbox/Inbox';
import './App.scss';
import { Route, Switch, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { setCurrentUser, getAllProducts, setModal } from '../../store/actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const socketUrl = "http://localhost:3001"

const App = props => {
  const dispatch = useDispatch();
  const socket = io(socketUrl)

  const [showModal, setShowModal] = useState(false);

  const modal = useSelector(state => state.modal.modal);
  const isAuth = useSelector(state => state.auth.isAuthentificated);

  useEffect(() => {
    if(modal !== showModal){
      props.history.push('/products/new')
      dispatch(setModal());
    }
  }, [])

  useEffect(() => {
    axios
      .get('/api/products/getAll')
      .then(res => dispatch(getAllProducts(res.data)))
  }, [])

  if(localStorage.jwtToken){
    const decoded = jwt_decode(localStorage.jwtToken);
    dispatch(setCurrentUser(decoded));
    socket.emit('create', decoded.id);
  }

  return (
    <div className='App' >
      <Header 
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <Switch>
        <Route exact path='/' render={() => (
          <Redirect to='/Main/1'/>
        )}/>
        <Route path='/Login' exact component={LoginForm} />
        <Route path='/Register' exact component={RegisterForm} />
        <Route path='/RestorePassword' exact component={ResetPasswordForm} />
        <Route path='/reset/:token' exact component={ResetPassword} />
        <Route path='/Main/:page' exact component={Home} />
        <Route path='/products/new' exact render={() => 
          isAuth? <SellProductForm /> : <Redirect to='/Login' />} />
        <Route path='/Search/:page' exact component={SearchPage} />
        <Route path='/products/:id' exact render={() => <ProductPage socket={socket}/>}/>
        <Route path='/users/:id/:page' exact component={UserProfilePage} />
        <Route path='/EditProfile' exact render={() => 
          isAuth? <EditProfileForm /> : <Redirect to='/Login' />} />
        <Route path='/Inbox' exact render={() => 
          isAuth? <Inbox socket={socket}/> : <Redirect to='/Login' />} /> />
      </Switch>
      <Footer />
    </div>
  );
}

export default withRouter(App);