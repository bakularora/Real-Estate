//import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { store,persistor } from './redux/store.jsx';
import { Provider } from 'react-redux';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}> 
    <App />
    </PersistGate>
  </Provider>
)
