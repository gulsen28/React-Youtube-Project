import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Details from './Details';
import Head from './Head'





const router=
<Router>
  <Head></Head>
  <Route path="/" exact component={App}/>
  <Route path="/videodetails/:id" exact component={Details}/>
</Router>

ReactDOM.render(router,document.getElementById('root'));


reportWebVitals();
