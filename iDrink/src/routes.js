import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/Home/index';
import Settings from "./pages/Settings/index";
import History from "./pages/History/index";

function Routes() {
  return (
    <BrowserRouter>
        <Route exact path="/settings" component={Settings} sensitive={false} />
        <Route exact path="/history" component={History} sensitive={false} />
        <Route exact path="/" component={Home} sensitive={false} />
    </BrowserRouter>
  );
}

export default Routes;
