import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App/App';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import rootReducer from './store/index';
export const store = createStore(rootReducer, compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)); 

export const persistor = persistStore(store);


ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);