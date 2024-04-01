import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GloabalStyles from './components/GlobalStyles';
import { persistor, store } from './redux/store';
import { Provider } from 'react-redux'

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistGate } from 'redux-persist/integration/react';


const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <Provider store={store}>
      <GloabalStyles>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>

      </GloabalStyles>
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>

  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
