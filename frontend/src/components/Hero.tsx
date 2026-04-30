import React from 'react';

export const Hero = () => {
    return (
        <section className="hero">
            <div className="hero__grid hero__grid--dense" aria-hidden="true"></div>
            <div className="hero__label">Precision Goal Engineering</div>
            <h1 className="hero__title">
                <span className="line">Map Your</span>
                <span className="line line--indent">Success<span className="accent-dot">.</span></span>
            </h1>
            <div className="hero__bottom">
                <p className="hero__desc">Turn your massive, undefined goals into structurally sound, machine-generated micro-tasks. Brutally efficient. Zero failure tolerance.</p>
                <div className="hero__stats">
                    <div><div className="hero__stat-num">React<span className="accent">.</span></div><div className="hero__stat-label">Architecture</div></div>
                    <div><div className="hero__stat-num">100<span className="accent">%</span></div><div className="hero__stat-label">Actionable</div></div>
                </div>
            </div>
        </section>
    );
};
