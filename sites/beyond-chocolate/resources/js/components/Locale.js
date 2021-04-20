import React, { useState } from 'react';
import { Navbar } from 'react-bootstrap';


const Locale = ({ locale, updateLocale }) => {

    const handleLocale = newLocale => {
        if (newLocale !== locale.active) {
            updateLocale({ ...locale, active: newLocale });
        }
    };

    return (
        <Navbar.Text>
            <span className="locale">
                <a className={ locale.active === 'en' ? 'active' : ''}
                   onClick={() => handleLocale('en') }
                >EN</a>
                &nbsp;
                <a className={ locale.active === 'de' ? 'active' : ''}
                   onClick={() => handleLocale('de') }
                >DE</a>
            </span>
        </Navbar.Text>
    );
};

export default Locale;
