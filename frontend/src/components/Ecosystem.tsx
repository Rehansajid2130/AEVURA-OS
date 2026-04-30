import React from 'react';

export const Ecosystem = () => {
    return (
        <section className="section" id="ecosystem">
            <div className="container">
                <div className="stack__header">
                    <div><div className="section__eyebrow">// Expansion Modules</div><h2 className="section__title">The Ecosystem</h2></div>
                    <p className="stack__subtitle">Aevura OS expands far beyond goal planning. Explore our specialized sub-engines.</p>
                </div>
                <div>
                    {/* Core Engine Laboratory */}
                    <article className="stack__card">
                        <div className="stack__card-left"><div className="stack__card-step">00</div></div>
                        <div className="stack__card-right">
                            <h3 className="stack__card-title">Core Engine<br/>Laboratory</h3>
                            <p className="stack__card-text">Access the raw structural logic. Generate deep profiles, multi-tier roadmaps, and actionable task clusters using the central Gemini engine.</p>
                            <div style={{ marginTop: '1.5rem' }}>
                                <button className="btn btn--primary" onClick={() => window.location.href = '/index.html'}>Access Laboratory</button>
                            </div>
                        </div>
                    </article>

                    {/* Freelancer Assistant */}
                    <article className="stack__card">
                        <div className="stack__card-left"><div className="stack__card-step">01</div></div>
                        <div className="stack__card-right">
                            <h3 className="stack__card-title">Freelancer<br/>Assistant</h3>
                            <p className="stack__card-text">Automate client proposals, structure your freelance business pricing, and optimize workflow management using brutal data points.</p>
                            <div style={{ marginTop: '1.5rem' }}>
                                <button className="btn btn--ghost" onClick={() => alert('Freelancer Assistant structure loading...')}>Launch Tool</button>
                            </div>
                        </div>
                    </article>

                    {/* Real-World Simulation Mode */}
                    <article className="stack__card">
                        <div className="stack__card-left"><div className="stack__card-step">02</div></div>
                        <div className="stack__card-right">
                            <h3 className="stack__card-title">Real-World<br/>Simulation</h3>
                            <p className="stack__card-text">Stress-test your abilities in AI-modeled scenarios mirroring high-pressure technical interviews and tight client project deadlines.</p>
                            <div style={{ marginTop: '1.5rem' }}>
                                <button className="btn btn--ghost" onClick={() => alert('Simulation Environment loading...')}>Enter Simulation</button>
                            </div>
                        </div>
                    </article>

                    {/* Case Study Architect */}
                    <article className="stack__card">
                        <div className="stack__card-left"><div className="stack__card-step">03</div></div>
                        <div className="stack__card-right">
                            <h3 className="stack__card-title">Case Study<br/>Architect</h3>
                            <p className="stack__card-text">Feed the system your scattered code snippets and project notes. We architect high-impact case studies that sell your results.</p>
                            <div style={{ marginTop: '1.5rem' }}>
                                <button className="btn btn--ghost" onClick={() => window.location.href = '/case-study-architect.html'}>Open Architect</button>
                            </div>
                        </div>
                    </article>

                    {/* Skill Gap Analyzer */}
                    <article className="stack__card">
                        <div className="stack__card-left"><div className="stack__card-step">04</div></div>
                        <div className="stack__card-right">
                            <h3 className="stack__card-title">Skill Gap<br/>Analyzer</h3>
                            <p className="stack__card-text">Scan current market job descriptions against your exact profile. Identify missing variables and eliminate weaknesses immediately.</p>
                            <div style={{ marginTop: '1.5rem' }}>
                                <button className="btn btn--ghost" onClick={() => window.location.href = '/skill-gap-analyzer.html'}>Scan Skills</button>
                            </div>
                        </div>
                    </article>

                    {/* Contract Shield */}
                    <article className="stack__card">
                        <div className="stack__card-left"><div className="stack__card-step">05</div></div>
                        <div className="stack__card-right">
                            <h3 className="stack__card-title">Contract<br/>Shield</h3>
                            <p className="stack__card-text">Architect iron-clad freelance agreements that protect your IP, define strict scope limits, and enforce late payment penalties.</p>
                            <div style={{ marginTop: '1.5rem' }}>
                                <button className="btn btn--ghost" onClick={() => window.location.href = '/contract-generator.html'}>Generate Shield</button>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
};
