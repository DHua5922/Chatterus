import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import "../src/api/interceptor";
import React from 'react';
import { Provider } from 'react-redux';
import store from '../src/redux/store';
import { SocketContext, socket } from '../src/context/socket';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
        <SocketContext.Provider value={socket}>
          <Component {...pageProps} />
        </SocketContext.Provider>
    </Provider>
  );
}

export default MyApp
