import React from 'react';

export const Header = () => {
    return (
        <header className="header">
            <div className="header__inner">
                <div className="header__left">
                    <a href="#" className="header__logo">
                        <span className="header__logo-mark">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#FF3E00" strokeWidth="2.5" />
                                <line x1="12" y1="2" x2="12" y2="22" stroke="#FF3E00" strokeWidth="2" />
                            </svg>
                        </span>
                        AEVURA <span className="logo-os" style={{ color: '#FF3E00', fontSize: '0.85em', marginLeft: '4px' }}>OS</span>
                    </a>
                    <span className="header__sep"></span>
                    <span className="header__product">v1.0 REACT BETA</span>
                </div>
                <nav className="header__nav">
                    <a href="#" className="active">Core Engine</a>
                    <a href="#ecosystem">Ecosystem</a>
                </nav>
                <div className="header__right">
                    <div className="header__status"><span className="header__status-dot"></span><span>System Online</span></div>
                </div>
            </div>
        </header>
    );
};
