import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import "../src/api/interceptor";
import React from 'react';
import { Provider } from 'react-redux';
import store from '../src/redux/store';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp
