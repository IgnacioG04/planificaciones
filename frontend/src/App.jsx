import React from 'react';
import Header from './components/Header/Header';
import Home from './components/Main/Home';
import Footer from './components/Footer/Footer';

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <Home />
            <Footer />
        </div>
    );
}

export default App;
