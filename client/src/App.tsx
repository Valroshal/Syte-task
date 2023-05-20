import React from 'react';
import './App.css';
import {Route, BrowserRouter} from "react-router-dom"
import {Routes} from "react-router"
import Login from "./containers/login/Login";
import CatalogsWrapper from "./containers/catalogs/CatalogsWrapper";

const styles = {
    container: {
        display: "flex",
        justifyContent: 'center',
        flex: 1,
        background:'linear-gradient(rgba(255, 248, 220, 0.20),#EADDCA)',
        height: '100vh',
    }
} as const;



function App() {
  return (

      <div style={styles.container}>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/catalogs" element={<CatalogsWrapper />} />
              </Routes>
          </BrowserRouter>
      </div>
  );
}

export default App;
