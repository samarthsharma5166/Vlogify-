import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import store from './redux/store.js'
import {Provider} from 'react-redux'
import ThemeProvider from './Components/ThemeProvider.jsx'
import ScrollToTop from './Components/ScrollToTop.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
       <Provider store={store}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
       </Provider>
       <Toaster />
    </BrowserRouter>
)
