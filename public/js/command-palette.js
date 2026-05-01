/* 
    AEVURA OS - COMMAND PALETTE HUD
    Handles Shortcuts, Deep Commands, and Navigation
*/

const COMMANDS = [
    { id: "dash", name: "Go to Dashboard", desc: "Access the central Operating System hub", url: "landing.html", icon: "🏠" },
    { id: "mods", name: "Modules Index", desc: "View all active system modules and tools", url: "modules.html", icon: "📦" },
    { id: "lab", name: "Core Engine Laboratory", desc: "Execute M01-M05 structural logic", url: "index.html?stay=true", icon: "🧪" },
    { id: "arch", name: "Case Study Architect", desc: "Generate professional portfolio assets", url: "case-study-architect.html", icon: "📐" },
    { id: "gap", name: "Skill Gap Analyzer", desc: "Compare your profile against job market", url: "skill-gap-analyzer.html", icon: "🔍" },
    { id: "shield", name: "Contract Shield", desc: "Architect iron-clad legal agreements", url: "contract-generator.html", icon: "🛡️" },
    { id: "decide", name: "Decision Engine", desc: "Compare career paths and skill choices", url: "decision-engine.html", icon: "🧠" },
    { id: "progress", name: "Progress Tracker", desc: "Track micro-tasks and roadmap metrics", url: "progress.html", icon: "📈" },
    { id: "gig", name: "Search Gigs", desc: "Usage: gig [skill]", url: "freelancer-assistant.html", icon: "💼" },
    { id: "sim", name: "Start Simulation", desc: "Usage: sim [scenario]", url: "simulation.html", icon: "🤖" },
    { id: "signout", name: "System: Sign Out", desc: "Terminate current session safely", action: "signout", icon: "⏹️" },
    { id: "status", name: "System: Status Check", desc: "Inspect current profile integrity", action: "status", icon: "⚡" }
];

let selectedIndex = 0;
let filteredCommands = [...COMMANDS];

function initPalette() {
    if (document.getElementById('command-palette-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'command-palette-overlay';
    overlay.innerHTML = `
        <div class="palette-container">
            <div class="palette-header">
                <span class="palette-icon">></span>
                <input type="text" class="palette-input" placeholder="Enter System Command..." id="paletteInput" autocomplete="off">
            </div>
            <div class="palette-results" id="paletteResults"></div>
            <div class="palette-footer">
                <span><b>ESC</b> TO CLOSE</span>
                <span><b>ENT</b> TO EXECUTE</span>
                <span><b>↑↓</b> TO NAVIGATE</span>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const input = document.getElementById('paletteInput');
    
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            togglePalette();
        }
        
        if (!overlay.classList.contains('active')) return;

        if (e.key === 'Escape') togglePalette();
        if (e.key === 'ArrowDown') { e.preventDefault(); navigate(1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); navigate(-1); }
        if (e.key === 'Enter') { e.preventDefault(); executeSelected(); }
    });

    input.addEventListener('input', (e) => {
        filterResults(e.target.value);
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) togglePalette();
    });

    renderResults();
}

function togglePalette() {
    const overlay = document.getElementById('command-palette-overlay');
    const input = document.getElementById('paletteInput');
    if (!overlay || !input) return;

    const isActive = overlay.classList.contains('active');

    if (isActive) {
        overlay.classList.remove('active');
        input.value = '';
    } else {
        overlay.classList.add('active');
        setTimeout(() => input.focus(), 10);
        filterResults('');
    }
}

function filterResults(query) {
    const q = query.toLowerCase().trim();
    
    // Logic for Deep Commands
    const firstWord = q.split(' ')[0];
    if (["gig", "sim"].includes(firstWord) && q.includes(' ')) {
        const arg = q.substring(firstWord.length).trim();
        const baseCmd = COMMANDS.find(c => c.id === firstWord);
        
        filteredCommands = [{
            ...baseCmd,
            name: `${baseCmd.name}: ${arg || '...'}`,
            desc: `Execute ${firstWord} search with: ${arg || 'input'}`,
            arg: arg
        }];
    } else {
        filteredCommands = COMMANDS.filter(c => 
            c.name.toLowerCase().includes(q) || 
            c.desc.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q)
        );
    }
    
    selectedIndex = 0;
    renderResults();
}

function renderResults() {
    const container = document.getElementById('paletteResults');
    if (!container) return;

    container.innerHTML = filteredCommands.map((c, i) => `
        <div class="palette-item ${i === selectedIndex ? 'selected' : ''}" onclick="executeByIndex(${i})">
            <div class="item-label">
                <span class="item-name">${c.icon} ${c.name}</span>
                <span class="item-desc">${c.desc}</span>
            </div>
            <span class="item-shortcut">${c.id.toUpperCase()}</span>
        </div>
    `).join('');

    const selected = container.querySelector('.selected');
    if (selected) selected.scrollIntoView({ block: 'nearest' });
}

function navigate(dir) {
    selectedIndex += dir;
    if (selectedIndex < 0) selectedIndex = filteredCommands.length - 1;
    if (selectedIndex >= filteredCommands.length) selectedIndex = 0;
    renderResults();
}

function executeSelected() {
    if (filteredCommands[selectedIndex]) {
        executeCmd(filteredCommands[selectedIndex]);
    }
}

function executeByIndex(index) {
    if (filteredCommands[index]) {
        executeCmd(filteredCommands[index]);
    }
}

async function executeCmd(cmd) {
    if (cmd.arg) {
        // Redirect with query param for deep linking
        window.location.href = `${cmd.url}?q=${encodeURIComponent(cmd.arg)}`;
        return;
    }

    if (cmd.url) {
        window.location.href = cmd.url;
    } else if (cmd.action) {
        if (cmd.action === 'signout') {
            await fetch('/api/signout', { method: 'POST' });
            window.location.href = 'signin.html';
        } else if (cmd.action === 'status') {
            alert("SYSTEM STATUS: NOMINAL\nINTEGRITY: HIGH\nAUTH: ENCRYPTED");
        }
        togglePalette();
    }
}

// Ensure init runs
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPalette);
} else {
    initPalette();
}
