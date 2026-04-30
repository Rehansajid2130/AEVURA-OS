import React, { useState } from 'react';

export const BentoDashboard = () => {
    const [goal, setGoal] = useState("");
    const [loading, setLoading] = useState(false);
    const [dbData, setDbData] = useState<any>(null);

    const handleRunEngine = async () => {
        if (!goal) return alert("Enter a goal first.");
        setLoading(true);
        try {
            // First step triggers Mod 1 & 2 roughly... Currently integrating everything sequentially as a test
            // This is pointing to the local Node Express server!
            const startRes = await fetch('http://localhost:3000/api/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal })
            });
            
            if (!startRes.ok) {
                const errData = await startRes.json().catch(() => ({ error: 'Unknown Error' }));
                alert(`Engine Start Failed (${startRes.status}): ${errData.error || errData.message}`);
                setLoading(false);
                return;
            }

            const startData = await startRes.json();

            // In a full app, we'd pause for questions. For now, simulate rapid end-to-end to hit our mocks.
            const buildRes = await fetch('http://localhost:3000/api/build-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: {} })
            });
            await buildRes.json(); // Don't strictly need to parse if we just want to push process forward

            const planRes = await fetch('http://localhost:3000/api/analyze-and-plan', { method: 'POST' });
            if (!planRes.ok) {
                const errData = await planRes.json().catch(() => ({ error: 'Unknown Error' }));
                alert(`Planning Failed (${planRes.status}): ${errData.error || errData.message}`);
                setLoading(false);
                return;
            }
            const planData = await planRes.json();

            setDbData(planData);
        } catch(e: any) {
            alert("Network Error: " + e.message);
        }
        setLoading(false);
    };

    return (
        <section className="section section--surface" id="modules">
            <div className="container">
                <div className="section__header">
                    <div className="section__eyebrow">// Our AI Engine Architecture</div>
                    <h2 className="section__title">The Operating<br/>System</h2>
                    
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <input 
                            type="text" 
                            placeholder="Enter your massive goal here..." 
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            style={{ padding: '0.8rem', border: '4px solid black', width: '300px', fontFamily: 'JetBrains Mono' }}
                        />
                        <button className="btn btn--primary" onClick={handleRunEngine} disabled={loading}>
                            {loading ? "ENGINE ENGAGED..." : "IGNITE ENGINE"}
                        </button>
                    </div>
                </div>

                <div className="bento__grid">
                    
                    {/* Bento Card: Module 1/2 Profile */}
                    <div className="bento-card bento-card--wide">
                        <div className="bento-card__number">MOD—01 & 02</div>
                        <div>
                            <h3 className="bento-card__title">Deep Profiling Engine</h3>
                            <p className="bento-card__text">We mathematically structure your existing skills, available time, and learning limits before we write a single task.</p>
                        </div>
                        <div className="bar-chart">
                            <div className="bar-chart__col" style={{ height: '45%' }}></div>
                            <div className="bar-chart__col" style={{ height: '70%' }}></div>
                            <div className="bar-chart__col" style={{ height: '100%' }}></div>
                            <div className="bar-chart__col" style={{ height: '50%' }}></div>
                        </div>
                    </div>

                    {/* Bento Card: Module 3 Analysis */}
                    <div className="bento-card bento-card--narrow bento-card--dark">
                        <div className="bento-card__number">MOD—03</div>
                        <h3 className="bento-card__title">Life Coach Analysis</h3>
                        <p className="bento-card__text" style={{ marginTop: '1rem', opacity: 0.8 }}>
                            {dbData?.goalAnalysis?.analysis ? dbData.goalAnalysis.analysis : "Brutal honesty mixed with strategic motivation. Waiting for engine."}
                        </p>
                    </div>

                    {/* Bento Card: Module 4 Roadmap */}
                    <div className="bento-card bento-card--mid">
                        <div className="bento-card__number">MOD—04</div>
                        <div>
                            <h3 className="bento-card__title">Adaptive Level Matrix</h3>
                            <p className="bento-card__text">
                                {dbData && dbData.roadmapData && dbData.roadmapData.roadmap ? 
                                    `Generated ${dbData.roadmapData.roadmap.length} distinct structural levels mapped to goal.` 
                                    : "Traditional tasks are boring. Your goal is parsed into a 3-tier leveled progression system to optimize dopamine loops."}
                            </p>
                        </div>
                        <div style={{ alignSelf: 'end', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <span className="tag tag--filled">Level 1 Setup</span>
                            <span className="tag">Level 2 Action</span>
                            <span className="tag">Level 3 Mastery</span>
                        </div>
                    </div>

                    {/* Bento Card: Module 5 Tasks */}
                    <div className="bento-card bento-card--mid bento-card--safety">
                        <div className="bento-card__number" style={{ opacity: 0.6 }}>MOD—05</div>
                        <h3 className="bento-card__title">Iterative Micro-Tasks</h3>
                        <p className="bento-card__text" style={{ opacity: 0.85 }}>
                            {dbData && dbData.taskPlan && dbData.taskPlan.tasks ? 
                                `Successfully generated ${dbData.taskPlan.tasks.length} critical actionable micro-tasks.` 
                                : "We restrict task generation strictly to actionable, heavily defined steps. Zero overwhelm."}
                        </p>
                        <div className="bento-card__stat">5-7</div>
                    </div>
                    
                    {/* Bento Card: Module 05 Expansion Contract Shield */}
                    <div className="bento-card bento-card--narrow" style={{ background: '#FF3E00', color: '#000' }}>
                        <div className="bento-card__number" style={{ color: '#000', opacity: 0.8 }}>MOD—05 EX</div>
                        <h3 className="bento-card__title" style={{ color: '#000' }}>Contract Shield</h3>
                        <p className="bento-card__text" style={{ color: '#000', opacity: 0.9 }}>Iron-clad legal protection for every engagement.</p>
                        <div style={{ marginTop: 'auto' }}>
                            <button 
                                className="btn" 
                                style={{ background: '#000', color: '#fff', border: 'none', padding: '5px 10px', fontSize: '10px' }}
                                onClick={() => window.location.href = '/contract-generator.html'}
                            >
                                LAUNCH
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
