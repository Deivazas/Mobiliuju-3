// App.js
import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import AdvertisementScreen from './screens/AdvertisementScreen';

export default function App() {
  return (
    <Provider store={store}>
      <AdvertisementScreen />
    </Provider>
  );
}
