import React from 'react';

function Footer() {
    return (
        <footer className="text-center py-3 bg-dark text-white mt-auto">
            <p>Generador de Planificación © {new Date().getFullYear()}</p>
        </footer>
    );
}

export default Footer;
