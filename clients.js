/* ============================================
   PsychoSupervisor Pro — Main Styles
   ============================================ */

:root {
  --primary: #6C63FF;
  --primary-dark: #5A52E8;
  --primary-light: #EEF0FF;
  --accent: #FF6584;
  --accent-2: #43D9AD;
  --accent-3: #FFB347;
  --bg: #F8F9FF;
  --bg-card: #FFFFFF;
  --bg-dark: #1A1A2E;
  --bg-dark-2: #16213E;
  --bg-dark-3: #0F3460;
  --text: #1E1E3F;
  --text-2: #6B7280;
  --text-light: #9CA3AF;
  --border: #E5E7EB;
  --border-dark: #374151;
  --shadow: 0 4px 24px rgba(108, 99, 255, 0.1);
  --shadow-lg: 0 12px 40px rgba(108, 99, 255, 0.18);
  --radius: 16px;
  --radius-sm: 10px;
  --radius-xs: 6px;
  --font: 'Inter', sans-serif;
  --font-display: 'Playfair Display', serif;
  --transition: 0.2s cubic-bezier(0.4,0,0.2,1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
}

.hidden { display: none !important; }

/* ====== BUTTONS ====== */
.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 50px;
  font-family: var(--font);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all var(--transition);
  box-shadow: 0 4px 16px rgba(108,99,255,0.3);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(108,99,255,0.4); }
.btn-primary:active { transform: translateY(0); }

.btn-outline {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  padding: 9px 22px;
  border-radius: 50px;
  font-family: var(--font);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all var(--transition);
}
.btn-outline:hover { background: var(--primary-light); transform: translateY(-1px); }

.btn-ghost {
  background: transparent;
  color: var(--text-2);
  border: 1px solid var(--border);
  padding: 9px 22px;
  border-radius: 50px;
  font-family: var(--font);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all var(--transition);
}
.btn-ghost:hover { background: var(--bg); border-color: var(--text-2); }

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 50px;
  font-family: var(--font);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all var(--transition);
}
.btn-danger:hover { transform: translateY(-2px); opacity: 0.9; }

.btn-link { background:none; border:none; color:var(--primary); cursor:pointer; font-size:13px; font-family:var(--font); text-decoration:underline; padding:0; }
.btn-lg { padding: 14px 32px; font-size: 16px; }
.btn-full { width: 100%; justify-content: center; }
.mt-2 { margin-top: 10px; }
.text-accent { color: var(--accent); }
.text-red { color: #ef4444; }
.gradient-text { background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

/* ====== PAGES ====== */
.page { min-height: 100vh; }

/* ====== SPLASH ====== */
.splash-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-dark-2) 50%, var(--bg-dark-3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.splash-screen::before {
  content: '';
  position: absolute;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%);
  top: -100px; right: -100px;
  border-radius: 50%;
}
.splash-screen::after {
  content: '';
  position: absolute;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(255,101,132,0.15) 0%, transparent 70%);
  bottom: -50px; left: -50px;
  border-radius: 50%;
}
.splash-content { position: relative; z-index: 2; max-width: 640px; padding: 40px 24px; }
.splash-logo { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px; }
.logo-icon {
  width: 64px; height: 64px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; color: #fff;
  box-shadow: 0 8px 24px rgba(108,99,255,0.4);
}
.splash-logo h1 { font-family: var(--font-display); font-size: 36px; color: #fff; font-weight: 700; }
.splash-logo h1 .text-accent { color: var(--accent); -webkit-text-fill-color: var(--accent); }
.splash-tagline { color: rgba(255,255,255,0.7); font-size: 18px; margin-bottom: 40px; }
.splash-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 48px; }
.splash-stats { display: flex; gap: 32px; justify-content: center; flex-wrap: wrap; }
.stat-item { text-align: center; }
.stat-num { display: block; font-size: 28px; font-weight: 800; color: #fff; }
.stat-lbl { font-size: 13px; color: rgba(255,255,255,0.5); }

/* ====== NAV BAR (Landing) ====== */
.nav-bar {
  position: sticky; top: 0; z-index: 100;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 16px 48px;
  display: flex; align-items: center; gap: 32px;
}
.nav-logo { font-size: 18px; font-weight: 800; color: var(--primary); display: flex; align-items: center; gap: 8px; cursor: pointer; }
.nav-logo span { color: var(--accent); }
.nav-links { display: flex; gap: 28px; flex: 1; justify-content: center; }
.nav-links a { color: var(--text-2); text-decoration: none; font-weight: 500; font-size: 15px; transition: color var(--transition); }
.nav-links a:hover { color: var(--primary); }

/* ====== HERO ====== */
.hero-section {
  min-height: calc(100vh - 72px);
  padding: 80px 48px 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--primary-light);
  color: var(--primary);
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 13px; font-weight: 600;
  margin-bottom: 24px;
}
.hero-text h1 { font-family: var(--font-display); font-size: 52px; line-height: 1.2; margin-bottom: 20px; color: var(--text); }
.hero-text p { font-size: 18px; color: var(--text-2); margin-bottom: 32px; line-height: 1.7; }
.hero-buttons { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
.hero-trust { display: flex; gap: 20px; flex-wrap: wrap; }
.hero-trust span { font-size: 13px; color: var(--text-2); display: flex; align-items: center; gap: 6px; }
.hero-trust i { color: var(--primary); }

/* Phone mockup */
.hero-visual { position: relative; display: flex; justify-content: center; align-items: center; }
.phone-mockup {
  width: 320px; height: 520px;
  background: linear-gradient(145deg, #1A1A2E, #16213E);
  border-radius: 40px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.1);
  overflow: hidden;
  padding: 20px;
  position: relative;
}
.phone-screen { height: 100%; display: flex; flex-direction: column; gap: 12px; }
.mock-chat { display: flex; flex-direction: column; gap: 12px; height: 100%; }
.mock-client-msg { display: flex; gap: 10px; align-items: flex-start; }
.mock-avatar { font-size: 24px; }
.mock-bubble { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); border-radius: 16px 16px 16px 4px; padding: 10px 14px; font-size: 13px; line-height: 1.5; }
.mock-bubble.client { }
.mock-supervisor-hint {
  background: linear-gradient(135deg, rgba(108,99,255,0.3), rgba(108,99,255,0.1));
  border: 1px solid rgba(108,99,255,0.4);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 12px; color: rgba(255,255,255,0.7);
}
.mock-supervisor-hint i { color: #FFB347; margin-top: 2px; }
.mock-student-area {
  margin-top: auto;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex; gap: 8px;
  align-items: center;
}
.mock-student-area input { flex: 1; background: none; border: none; color: rgba(255,255,255,0.5); font-size: 12px; font-family: var(--font); outline: none; }
.mock-student-area button { background: var(--primary); border: none; color: #fff; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; }
.floating-badge {
  position: absolute;
  background: #fff;
  border-radius: 12px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  display: flex; align-items: center; gap: 6px;
  animation: float 3s ease-in-out infinite;
}
.badge-score { top: 60px; right: -20px; color: var(--accent-3); }
.badge-score i { color: var(--accent-3); }
.badge-tip { bottom: 100px; left: -30px; color: var(--primary); }
.badge-tip i { color: var(--primary); }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

/* ====== SECTIONS ====== */
.section-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: var(--primary); margin-bottom: 12px; }
.features-section, .howworks-section, .pricing-section { padding: 80px 48px; max-width: 1280px; margin: 0 auto; }
.features-section h2, .howworks-section h2, .pricing-section h2 { font-family: var(--font-display); font-size: 38px; margin-bottom: 48px; color: var(--text); }

/* Features grid */
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  transition: all var(--transition);
}
.feature-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); border-color: var(--primary); }
.feature-card--highlight { background: linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-dark-2) 100%); border-color: transparent; }
.feature-card--highlight h3, .feature-card--highlight p { color: #fff !important; }
.feature-card--highlight .feature-tags span { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); }
.feature-icon { font-size: 28px; color: var(--primary); margin-bottom: 16px; }
.feature-card--highlight .feature-icon { color: var(--accent); }
.feature-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 10px; color: var(--text); }
.feature-card p { font-size: 14px; color: var(--text-2); margin-bottom: 16px; line-height: 1.6; }
.feature-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.feature-tags span { background: var(--primary-light); color: var(--primary); padding: 3px 10px; border-radius: 50px; font-size: 12px; font-weight: 500; }

/* Steps */
.steps-grid { display: flex; align-items: center; gap: 0; }
.step-card { flex: 1; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; text-align: center; }
.step-card:hover { box-shadow: var(--shadow); }
.step-num { font-size: 42px; font-weight: 800; color: var(--primary); opacity: 0.2; margin-bottom: 8px; }
.step-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
.step-card p { font-size: 13px; color: var(--text-2); }
.step-arrow { color: var(--primary); font-size: 24px; padding: 0 8px; opacity: 0.4; }

/* Pricing */
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: start; }
.pricing-card {
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
  position: relative;
  transition: all var(--transition);
}
.pricing-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); }
.pricing-card--popular { border-color: var(--primary); transform: scale(1.04); box-shadow: var(--shadow-lg); }
.popular-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; padding: 4px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; white-space: nowrap; }
.plan-name { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
.plan-price { margin-bottom: 24px; }
.price-amount { font-size: 36px; font-weight: 800; color: var(--text); }
.price-period { font-size: 14px; color: var(--text-2); }
.plan-features { list-style: none; margin-bottom: 28px; }
.plan-features li { padding: 8px 0; font-size: 14px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border); }
.plan-features li:last-child { border-bottom: none; }
.plan-features .fa-check { color: var(--accent-2); }
.plan-features .fa-times { color: #ef4444; }

/* Footer */
.footer { background: var(--bg-dark); color: rgba(255,255,255,0.6); padding: 40px; text-align: center; }
.footer-logo { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; }
.footer-logo span { color: var(--accent); }
.footer p { font-size: 14px; margin-bottom: 8px; }
.footer-copy { font-size: 12px; margin-top: 16px; opacity: 0.5; }

/* ====== APP HEADER ====== */
.app-header {
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 0;
  position: sticky; top: 0; z-index: 50;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
}
.app-logo { font-size: 18px; font-weight: 800; color: var(--primary); cursor: pointer; display: flex; align-items: center; gap: 8px; min-width: 80px; }
.app-nav { flex: 1; display: flex; justify-content: center; gap: 4px; }
.nav-btn {
  background: none; border: none; cursor: pointer;
  padding: 8px 16px; border-radius: 10px;
  font-family: var(--font); font-size: 14px; font-weight: 500;
  color: var(--text-2);
  display: flex; align-items: center; gap: 6px;
  transition: all var(--transition);
}
.nav-btn:hover { background: var(--bg); color: var(--text); }
.nav-btn.active { background: var(--primary-light); color: var(--primary); }
.app-user-info { display: flex; align-items: center; gap: 12px; min-width: 120px; justify-content: flex-end; }
.user-xp { font-size: 14px; font-weight: 600; color: var(--accent-3); display: flex; align-items: center; gap: 4px; }
.user-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; cursor: pointer; transition: transform var(--transition); }
.user-avatar:hover { transform: scale(1.1); }

/* ====== TAB CONTENT ====== */
.tab-content { min-height: calc(100vh - 64px); }
.tab-content.active { display: block; }

/* ====== DASHBOARD ====== */
.dashboard-container { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }
.welcome-banner {
  background: linear-gradient(135deg, var(--bg-dark), var(--bg-dark-3));
  border-radius: var(--radius);
  padding: 32px 36px;
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 28px; gap: 20px;
}
.welcome-text h2 { color: #fff; font-size: 22px; margin-bottom: 6px; }
.welcome-text p { color: rgba(255,255,255,0.6); font-size: 15px; }
.start-session-btn { flex-shrink: 0; }
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 20px;
  display: flex; align-items: center; gap: 14px;
  transition: all var(--transition);
}
.stat-card:hover { box-shadow: var(--shadow); }
.stat-icon { font-size: 24px; }
.stat-icon.blue { color: var(--primary); }
.stat-icon.yellow { color: var(--accent-3); }
.stat-icon.green { color: var(--accent-2); }
.stat-icon.purple { color: var(--accent); }
.stat-card span { font-size: 26px; font-weight: 800; display: block; color: var(--text); }
.stat-card label { font-size: 13px; color: var(--text-2); }
.dashboard-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.dash-card--full { grid-column: 1 / -1; }
.dash-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
}
.dash-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; color: var(--text); }
.dash-card h3 i { color: var(--primary); }
.dash-card p { font-size: 14px; color: var(--text-2); margin-bottom: 16px; }

/* Sessions list */
.sessions-list { display: flex; flex-direction: column; gap: 10px; }
.empty-state { text-align: center; padding: 32px; color: var(--text-light); }
.empty-state i { font-size: 32px; margin-bottom: 12px; opacity: 0.4; }
.empty-state p { font-size: 14px; }
.session-item {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 18px;
  display: flex; align-items: center; gap: 14px;
  cursor: pointer; transition: all var(--transition);
}
.session-item:hover { border-color: var(--primary); box-shadow: var(--shadow); }
.session-emoji { font-size: 24px; }
.session-info { flex: 1; }
.session-name { font-weight: 600; font-size: 14px; }
.session-meta { font-size: 12px; color: var(--text-2); }
.session-score { font-size: 18px; font-weight: 700; }
.score-high { color: var(--accent-2); }
.score-mid { color: var(--accent-3); }
.score-low { color: var(--accent); }

/* ====== TRAINER ====== */
.trainer-layout {
  display: grid;
  grid-template-columns: 280px 1fr 260px;
  height: calc(100vh - 64px);
  overflow: hidden;
}

/* Client Panel */
.client-panel {
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  padding: 20px;
  display: flex; flex-direction: column;
}
.no-client-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 12px; color: var(--text-2); }
.no-client-state i { font-size: 40px; opacity: 0.3; }
.no-client-state h3 { font-size: 16px; font-weight: 600; }
.no-client-state p { font-size: 13px; }
.client-info { display: flex; flex-direction: column; gap: 14px; }
.client-avatar-big { text-align: center; font-size: 56px; }
.client-info h3 { font-size: 18px; font-weight: 700; text-align: center; }
.client-badge { text-align: center; background: var(--primary-light); color: var(--primary); border-radius: 50px; padding: 4px 14px; font-size: 12px; font-weight: 600; }
.client-meta { display: flex; flex-direction: column; gap: 6px; }
.meta-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-2); }
.meta-row i { color: var(--primary); width: 14px; }
.client-history-block { background: var(--bg); border-radius: var(--radius-sm); padding: 14px; }
.client-history-block h4 { font-size: 13px; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.client-history-block p { font-size: 13px; color: var(--text-2); line-height: 1.6; }
.session-controls { display: flex; flex-direction: column; gap: 8px; margin-top: auto; }

/* Chat Area */
.chat-area {
  display: flex; flex-direction: column;
  background: var(--bg);
  overflow: hidden;
}
.chat-placeholder { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-light); text-align: center; gap: 12px; }
.chat-placeholder i { font-size: 48px; opacity: 0.3; }
.chat-placeholder h3 { font-size: 18px; font-weight: 600; }
.chat-placeholder p { font-size: 14px; }
.chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 14px; }

/* Messages */
.msg { max-width: 76%; }
.msg-client { align-self: flex-start; }
.msg-student { align-self: flex-end; }
.msg-supervisor { align-self: center; max-width: 90%; }

.msg-client .msg-bubble {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 18px 18px 18px 4px;
  padding: 12px 16px;
  font-size: 14px; line-height: 1.6;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.msg-student .msg-bubble {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  border-radius: 18px 18px 4px 18px;
  padding: 12px 16px;
  font-size: 14px; line-height: 1.6;
}
.msg-supervisor .msg-bubble {
  background: linear-gradient(135deg, rgba(255,179,71,0.15), rgba(255,179,71,0.05));
  border: 1px solid rgba(255,179,71,0.4);
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px; line-height: 1.5; color: var(--text);
  display: flex; align-items: flex-start; gap: 8px;
}
.msg-supervisor .msg-bubble i { color: var(--accent-3); margin-top: 2px; flex-shrink: 0; }
.msg-label { font-size: 11px; color: var(--text-light); margin-bottom: 4px; font-weight: 500; }
.msg-student .msg-label { text-align: right; }
.msg-time { font-size: 11px; color: var(--text-light); margin-top: 4px; }
.msg-student .msg-time { text-align: right; }
.typing-indicator .msg-bubble { display: flex; align-items: center; gap: 4px; padding: 14px 18px; }
.typing-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-light); animation: typing 1.4s ease-in-out infinite; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%,80%,100%{transform:scale(0.8);opacity:0.5} 40%{transform:scale(1.1);opacity:1} }

/* Chat Input */
.chat-input-area { padding: 16px 20px; background: #fff; border-top: 1px solid var(--border); }
.supervisor-hint {
  background: linear-gradient(135deg, rgba(255,179,71,0.12), rgba(255,179,71,0.04));
  border: 1px solid rgba(255,179,71,0.4);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  display: flex; align-items: flex-start; gap: 8px;
  margin-bottom: 12px; font-size: 13px; color: var(--text);
}
.supervisor-hint i { color: var(--accent-3); margin-top: 2px; flex-shrink: 0; }
.supervisor-hint span { flex: 1; }
.hint-close { background: none; border: none; cursor: pointer; color: var(--text-light); padding: 0; }
.input-row { display: flex; gap: 10px; align-items: flex-end; }
.input-row textarea {
  flex: 1; border: 2px solid var(--border);
  border-radius: var(--radius-sm); padding: 12px 16px;
  font-family: var(--font); font-size: 14px; resize: none;
  outline: none; transition: border-color var(--transition);
  line-height: 1.5;
}
.input-row textarea:focus { border-color: var(--primary); }
.input-actions { display: flex; flex-direction: column; gap: 8px; }
.btn-hint {
  width: 42px; height: 42px; border-radius: 12px;
  background: var(--primary-light); border: none; cursor: pointer;
  color: var(--primary); font-size: 16px; transition: all var(--transition);
  display: flex; align-items: center; justify-content: center;
}
.btn-hint:hover { background: var(--primary); color: #fff; }
.btn-send {
  width: 42px; height: 42px; border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border: none; cursor: pointer; color: #fff; font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition); box-shadow: 0 4px 12px rgba(108,99,255,0.3);
}
.btn-send:hover { transform: scale(1.08); }
.input-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 12px; color: var(--text-light); }

/* Supervisor Panel */
.supervisor-panel {
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  overflow-y: auto;
  display: flex; flex-direction: column;
}
.supervisor-header {
  padding: 16px 18px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 12px;
  background: linear-gradient(135deg, var(--bg-dark), var(--bg-dark-2));
}
.supervisor-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; }
.supervisor-header h4 { font-size: 14px; font-weight: 700; color: #fff; }
.supervisor-header small { font-size: 12px; color: rgba(255,255,255,0.5); }
.online-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-2); display: inline-block; margin-right: 4px; box-shadow: 0 0 6px var(--accent-2); }
.supervisor-body { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
.sup-section h5 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-2); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
.phase-badge { background: var(--primary-light); color: var(--primary); border-radius: 50px; padding: 4px 12px; font-size: 12px; font-weight: 600; display: inline-block; }
.emotion-bar { margin-bottom: 8px; }
.emotion-label { font-size: 12px; color: var(--text-2); margin-bottom: 4px; }
.progress-bar { background: var(--bg); border-radius: 50px; height: 6px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 50px; transition: width 0.5s ease; }
.bar-fill.red { background: linear-gradient(90deg, #ef4444, #dc2626); }
.bar-fill.green { background: linear-gradient(90deg, var(--accent-2), #22c55e); }
.bar-fill.blue { background: linear-gradient(90deg, var(--primary), #8B5CF6); }
.techniques-list { display: flex; flex-direction: column; gap: 6px; }
.technique-item { background: var(--primary-light); color: var(--primary); border-radius: var(--radius-xs); padding: 6px 10px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all var(--transition); }
.technique-item:hover { background: var(--primary); color: #fff; }
.red-flags-list { display: flex; flex-direction: column; gap: 6px; }
.no-flags { font-size: 12px; color: var(--accent-2); display: flex; align-items: center; gap: 6px; }
.red-flag-item { background: rgba(239,68,68,0.1); color: #ef4444; border-radius: var(--radius-xs); padding: 6px 10px; font-size: 12px; border: 1px solid rgba(239,68,68,0.2); }
.score-display { display: flex; align-items: baseline; gap: 6px; }
.score-big { font-size: 36px; font-weight: 800; color: var(--primary); }
.score-label { font-size: 14px; color: var(--text-2); }

/* ====== MODALS ====== */
.modal { position: fixed; inset: 0; z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
.modal-box { position: relative; z-index: 1; background: var(--bg-card); border-radius: var(--radius); box-shadow: var(--shadow-lg); max-height: 88vh; overflow: hidden; display: flex; flex-direction: column; width: 100%; max-width: 580px; }
.modal-box--wide { max-width: 780px; }
.modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.modal-header h3 { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.modal-header h3 i { color: var(--primary); }
.modal-header button { background: none; border: none; cursor: pointer; font-size: 18px; color: var(--text-2); transition: color var(--transition); }
.modal-header button:hover { color: var(--text); }
.modal-body { padding: 20px 24px; overflow-y: auto; }
.modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 12px; justify-content: flex-end; }

/* Client Selector */
.filter-row { display: flex; gap: 12px; margin-bottom: 20px; }
.filter-row select { flex: 1; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-family: var(--font); font-size: 14px; outline: none; }
.filter-row select:focus { border-color: var(--primary); }
.clients-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.client-card {
  background: var(--bg);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px;
  cursor: pointer;
  transition: all var(--transition);
}
.client-card:hover { border-color: var(--primary); box-shadow: var(--shadow); background: var(--primary-light); }
.client-card-emoji { font-size: 28px; margin-bottom: 8px; }
.client-card-name { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
.client-card-type { font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 6px; }
.client-card-desc { font-size: 12px; color: var(--text-2); }
.difficulty-stars { font-size: 12px; color: var(--accent-3); margin-top: 4px; }

/* Session Report */
.report-loading { text-align: center; padding: 40px; color: var(--text-2); font-size: 16px; }
.report-loading i { font-size: 28px; margin-bottom: 12px; display: block; color: var(--primary); }
.report-section { margin-bottom: 24px; }
.report-section h4 { font-size: 15px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.report-score-big { text-align: center; padding: 24px; }
.report-score-num { font-size: 64px; font-weight: 800; color: var(--primary); display: block; }
.report-score-label { font-size: 14px; color: var(--text-2); }
.report-errors { display: flex; flex-direction: column; gap: 10px; }
.error-item {
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
}
.error-item .error-title { font-weight: 600; font-size: 13px; color: #dc2626; margin-bottom: 4px; }
.error-item .error-text { font-size: 13px; color: var(--text-2); margin-bottom: 6px; }
.error-item .error-suggestion { font-size: 13px; color: var(--accent-2); display: flex; align-items: flex-start; gap: 6px; }
.strengths-list { display: flex; flex-direction: column; gap: 8px; }
.strength-item {
  background: rgba(67,217,173,0.1);
  border: 1px solid rgba(67,217,173,0.3);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-size: 13px; display: flex; align-items: flex-start; gap: 8px;
}
.strength-item i { color: var(--accent-2); margin-top: 2px; }
.rec-list { display: flex; flex-direction: column; gap: 8px; }
.rec-item { background: var(--primary-light); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 13px; display: flex; align-items: flex-start; gap: 8px; color: var(--primary); }
.rec-item i { margin-top: 2px; }
.xp-gained { background: linear-gradient(135deg, var(--primary-light), rgba(255,179,71,0.1)); border: 1px solid rgba(108,99,255,0.2); border-radius: var(--radius-sm); padding: 16px; text-align: center; font-size: 18px; font-weight: 700; color: var(--primary); }
.xp-gained span { font-size: 28px; }

/* ====== TRANSCRIPTION ====== */
.transcribe-container { max-width: 860px; margin: 0 auto; padding: 32px 24px; }
.transcribe-header { margin-bottom: 28px; }
.transcribe-header h2 { font-size: 24px; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
.transcribe-header h2 i { color: var(--primary); }
.transcribe-header p { color: var(--text-2); font-size: 15px; }
.transcribe-tabs { display: flex; gap: 8px; margin-bottom: 28px; }
.trans-tab {
  background: var(--bg);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 10px 20px;
  cursor: pointer; font-family: var(--font); font-size: 14px; font-weight: 600;
  color: var(--text-2); transition: all var(--transition);
  display: flex; align-items: center; gap: 8px;
}
.trans-tab.active { background: var(--primary-light); border-color: var(--primary); color: var(--primary); }
.trans-panel { }
.transcribe-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 600; color: var(--text); display: flex; align-items: center; gap: 6px; }
.form-group label i { color: var(--primary); }
.form-group input, .form-group textarea {
  border: 2px solid var(--border); border-radius: var(--radius-sm);
  padding: 12px 16px; font-family: var(--font); font-size: 14px;
  outline: none; transition: border-color var(--transition); resize: vertical;
}
.form-group input:focus, .form-group textarea:focus { border-color: var(--primary); }
.audio-upload-area {
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: 48px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition);
  background: var(--bg);
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.audio-upload-area:hover, .audio-upload-area.drag-over { border-color: var(--primary); background: var(--primary-light); }
.audio-upload-area i { font-size: 48px; color: var(--primary); opacity: 0.5; }
.audio-upload-area h3 { font-size: 18px; font-weight: 600; }
.audio-upload-area p { color: var(--text-2); font-size: 14px; }
.audio-preview { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); margin-top: 12px; }
.audio-preview i { color: var(--primary); font-size: 20px; }
.audio-preview span { flex: 1; font-size: 14px; font-weight: 500; }
.audio-preview button { background: none; border: none; cursor: pointer; color: var(--text-2); font-size: 16px; }
.audio-notice { display: flex; gap: 10px; padding: 12px 16px; background: rgba(108,99,255,0.06); border-radius: var(--radius-sm); margin: 16px 0; font-size: 13px; color: var(--text-2); }
.audio-notice i { color: var(--primary); margin-top: 2px; flex-shrink: 0; }
.transcribe-result { margin-top: 32px; }
.result-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.result-header h3 { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; }

/* ====== PROGRESS ====== */
.progress-container { max-width: 960px; margin: 0 auto; padding: 32px 24px; }
.progress-container h2 { font-size: 24px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
.level-banner {
  background: linear-gradient(135deg, var(--bg-dark), var(--bg-dark-3));
  border-radius: var(--radius);
  padding: 28px 32px;
  display: flex; align-items: center; gap: 32px;
  margin-bottom: 28px;
}
.level-info { display: flex; align-items: center; gap: 16px; }
.level-icon { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; font-size: 26px; color: #fff; }
.level-title { font-size: 20px; font-weight: 700; color: #fff; }
.level-num { font-size: 14px; color: rgba(255,255,255,0.5); }
.level-progress { flex: 1; }
.xp-bar-label { font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 8px; }
.xp-bar { background: rgba(255,255,255,0.1); border-radius: 50px; height: 10px; overflow: hidden; }
.xp-bar-fill { height: 100%; border-radius: 50px; background: linear-gradient(90deg, var(--primary), var(--accent)); transition: width 0.8s ease; }
.progress-stats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 28px; }
.pstat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 16px; text-align: center; }
.pstat-card i { font-size: 20px; color: var(--primary); margin-bottom: 8px; display: block; }
.pstat-card span { font-size: 20px; font-weight: 700; display: block; color: var(--text); }
.pstat-card label { font-size: 11px; color: var(--text-2); }
.chart-card, .skills-chart-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 24px; }
.chart-card h3, .skills-chart-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.badges-section, .history-section { margin-bottom: 28px; }
.badges-section h3, .history-section h3 { font-size: 18px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.badges-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; }
.badge-item {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: 16px 10px; text-align: center; transition: all var(--transition);
}
.badge-item:hover { box-shadow: var(--shadow); }
.badge-item.earned { border-color: var(--accent-3); background: rgba(255,179,71,0.06); }
.badge-item.locked { opacity: 0.4; filter: grayscale(1); }
.badge-emoji { font-size: 32px; margin-bottom: 6px; }
.badge-name { font-size: 11px; font-weight: 600; color: var(--text); }
.badge-desc { font-size: 10px; color: var(--text-2); margin-top: 2px; }

/* ====== KNOWLEDGE BASE ====== */
.knowledge-container { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
.knowledge-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 16px; }
.knowledge-header h2 { font-size: 24px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
.knowledge-search { position: relative; }
.knowledge-search i { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-light); }
.knowledge-search input { border: 2px solid var(--border); border-radius: 50px; padding: 10px 16px 10px 38px; font-family: var(--font); font-size: 14px; outline: none; width: 280px; transition: border-color var(--transition); }
.knowledge-search input:focus { border-color: var(--primary); }
.knowledge-categories { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
.cat-btn { background: var(--bg); border: 2px solid var(--border); border-radius: 50px; padding: 7px 16px; font-family: var(--font); font-size: 13px; font-weight: 600; cursor: pointer; color: var(--text-2); transition: all var(--transition); }
.cat-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.cat-btn:hover:not(.active) { border-color: var(--primary); color: var(--primary); }
.knowledge-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.knowledge-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px;
  cursor: pointer; transition: all var(--transition);
}
.knowledge-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); border-color: var(--primary); }
.kcard-tag { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
.tag-technique { background: rgba(108,99,255,0.1); color: var(--primary); }
.tag-mistake { background: rgba(239,68,68,0.1); color: #dc2626; }
.tag-biblical { background: rgba(255,179,71,0.15); color: #D97706; }
.tag-theory { background: rgba(67,217,173,0.1); color: #059669; }
.knowledge-card h4 { font-size: 15px; font-weight: 700; margin-bottom: 8px; }
.knowledge-card p { font-size: 13px; color: var(--text-2); line-height: 1.6; }
.kcard-example { margin-top: 12px; background: var(--bg); border-radius: var(--radius-xs); padding: 10px 12px; font-size: 12px; color: var(--text-2); border-left: 3px solid var(--primary); font-style: italic; }

/* ====== KNOWLEDGE DETAIL MODAL ====== */
#knowledge-detail-modal .modal-box { max-width: 680px; }
.kdetail-body { padding: 24px; }
.kdetail-body h3 { font-size: 20px; font-weight: 700; margin-bottom: 16px; }
.kdetail-body p { font-size: 14px; color: var(--text-2); line-height: 1.7; margin-bottom: 16px; }
.kdetail-body ul { padding-left: 20px; }
.kdetail-body li { font-size: 14px; color: var(--text-2); margin-bottom: 8px; }
.kdetail-steps { margin-top: 16px; }
.kdetail-step { display: flex; gap: 12px; margin-bottom: 12px; }
.kdetail-step-num { width: 28px; height: 28px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
.kdetail-step-text { font-size: 14px; color: var(--text-2); }
.kdetail-verse { background: rgba(255,179,71,0.08); border: 1px solid rgba(255,179,71,0.3); border-radius: var(--radius-sm); padding: 14px 16px; font-style: italic; font-size: 14px; color: var(--text); margin-top: 16px; }
.kdetail-verse strong { font-style: normal; color: var(--accent-3); display: block; margin-top: 6px; font-size: 12px; }

/* ====== PROFILE MODAL ====== */
.form-group hr { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
hr { border: none; border-top: 1px solid var(--border); margin: 20px 0; }

/* ====== TOASTS ====== */
.toast-container { position: fixed; top: 80px; right: 24px; z-index: 999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
.toast {
  background: #fff;
  border-radius: var(--radius-sm);
  padding: 14px 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  display: flex; align-items: center; gap: 12px;
  font-size: 14px; font-weight: 500;
  min-width: 280px; pointer-events: auto;
  animation: slideIn 0.3s ease;
  border-left: 4px solid var(--primary);
}
.toast.success { border-color: var(--accent-2); }
.toast.error { border-color: var(--accent); }
.toast.warning { border-color: var(--accent-3); }
.toast i { font-size: 16px; }
.toast.success i { color: var(--accent-2); }
.toast.error i { color: var(--accent); }
.toast.warning i { color: var(--accent-3); }
@keyframes slideIn { from{transform:translateX(120%);opacity:0} to{transform:translateX(0);opacity:1} }
@keyframes slideOut { from{transform:translateX(0);opacity:1} to{transform:translateX(120%);opacity:0} }
.toast.hiding { animation: slideOut 0.3s ease forwards; }

/* ====== RESPONSIVE ====== */
@media (max-width: 1024px) {
  .hero-section { grid-template-columns: 1fr; padding: 60px 24px; text-align: center; }
  .hero-visual { display: none; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .trainer-layout { grid-template-columns: 240px 1fr 220px; }
}
@media (max-width: 768px) {
  .nav-bar { padding: 14px 20px; }
  .nav-links { display: none; }
  .hero-text h1 { font-size: 36px; }
  .features-grid { grid-template-columns: 1fr; }
  .steps-grid { flex-direction: column; }
  .step-arrow { transform: rotate(90deg); }
  .pricing-grid { grid-template-columns: 1fr; }
  .pricing-card--popular { transform: none; }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .dashboard-grid { grid-template-columns: 1fr; }
  .trainer-layout { grid-template-columns: 1fr; grid-template-rows: auto 1fr auto; height: auto; }
  .client-panel { height: auto; }
  .supervisor-panel { height: auto; }
  .chat-area { height: 60vh; }
  .progress-stats-grid { grid-template-columns: repeat(3, 1fr); }
  .nav-btn span { display: none; }
  .nav-btn { padding: 8px 10px; }
}

/* ====== AI STATUS INDICATOR ====== */
.ai-status-indicator {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 50px;
  font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all var(--transition);
  border: 1.5px solid var(--border);
}
.ai-status-indicator.ai-on {
  background: rgba(67,217,173,0.1);
  border-color: rgba(67,217,173,0.4);
  color: #059669;
}
.ai-status-indicator.ai-on i { color: var(--accent-2); }
.ai-status-indicator.ai-off {
  background: rgba(156,163,175,0.1);
  border-color: var(--border);
  color: var(--text-2);
}
.ai-status-indicator.ai-loading {
  background: rgba(255,179,71,0.1);
  border-color: rgba(255,179,71,0.4);
  color: #D97706;
}

/* ====== AI SETUP MODAL ====== */
.ai-setup-steps { display: flex; flex-direction: column; gap: 20px; }
.setup-step {
  display: flex; gap: 14px;
  padding: 16px; background: var(--bg);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}
.step-icon {
  width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 18px;
}
.step-body h4 { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
.step-body p { font-size: 13px; color: var(--text-2); margin-bottom: 0; }
.setup-note {
  margin-top: 10px; padding: 8px 12px;
  background: rgba(108,99,255,0.06);
  border-radius: var(--radius-xs);
  font-size: 12px; color: var(--text-2);
}

.api-key-input-row {
  display: flex; gap: 8px; margin-top: 8px;
}
.api-key-input-row input {
  flex: 1; border: 2px solid var(--border); border-radius: var(--radius-sm);
  padding: 10px 14px; font-family: var(--font); font-size: 14px; outline: none;
  transition: border-color var(--transition);
}
.api-key-input-row input:focus { border-color: var(--primary); }
.btn-icon-toggle {
  width: 42px; height: 42px; border-radius: var(--radius-sm);
  background: var(--bg); border: 2px solid var(--border); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-2); transition: all var(--transition);
}
.btn-icon-toggle:hover { border-color: var(--primary); color: var(--primary); }

/* Model selector */
.model-selector { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
.model-option {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border: 2px solid var(--border);
  border-radius: var(--radius-sm); cursor: pointer;
  transition: all var(--transition);
}
.model-option:hover { border-color: var(--primary); background: var(--primary-light); }
.model-option input[type=radio] { accent-color: var(--primary); width: 16px; height: 16px; }
.model-info { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.model-name { font-size: 14px; font-weight: 600; }
.model-desc { font-size: 12px; color: var(--text-2); }
.model-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 50px; }
.model-badge.best { background: rgba(67,217,173,0.15); color: #059669; }
.model-badge.pro { background: rgba(108,99,255,0.15); color: var(--primary); }
.model-badge.free { background: rgba(156,163,175,0.15); color: var(--text-2); }

/* Test result */
.api-test-result {
  padding: 12px 16px; border-radius: var(--radius-sm);
  font-size: 13px; font-weight: 500;
}
.api-test-result.success { background: rgba(67,217,173,0.12); color: #059669; border: 1px solid rgba(67,217,173,0.3); }
.api-test-result.error { background: rgba(239,68,68,0.1); color: #dc2626; border: 1px solid rgba(239,68,68,0.2); }
.api-test-result.testing { background: rgba(255,179,71,0.1); color: #D97706; border: 1px solid rgba(255,179,71,0.3); }

/* Settings section */
.settings-section { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
.settings-section:last-child { border-bottom: none; margin-bottom: 0; }
.settings-section h4 { font-size: 15px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.settings-section h4 i { color: var(--primary); }
.api-key-status { padding: 10px 14px; background: var(--bg); border-radius: var(--radius-sm); font-size: 13px; }

/* AI thinking indicator */
.ai-thinking-msg .msg-bubble {
  background: linear-gradient(135deg, rgba(108,99,255,0.08), rgba(108,99,255,0.03));
  border: 1px solid rgba(108,99,255,0.2);
  border-radius: 12px;
  padding: 10px 14px;
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: var(--primary);
  font-style: italic;
}

/* ====== REVIEWS SECTION ====== */
.reviews-section { padding: 80px 48px; background: var(--bg); }
.reviews-section h2 { font-family: var(--font-display); font-size: 38px; margin-bottom: 40px; }
.reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1280px; margin: 0 auto; }
.review-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 28px;
  transition: all var(--transition);
}
.review-card:hover { box-shadow: var(--shadow); transform: translateY(-3px); }
.review-card--featured {
  background: linear-gradient(135deg, var(--bg-dark), var(--bg-dark-2));
  border-color: transparent;
}
.review-card--featured p { color: rgba(255,255,255,0.85); }
.review-stars { font-size: 18px; color: var(--accent-3); margin-bottom: 14px; }
.review-card p { font-size: 15px; color: var(--text-2); line-height: 1.7; margin-bottom: 20px; font-style: italic; }
.review-author { display: flex; align-items: center; gap: 12px; }
.review-avatar { font-size: 32px; }
.review-author strong { font-size: 14px; display: block; color: var(--text); }
.review-card--featured strong { color: #fff; }
.review-author small { font-size: 12px; color: var(--text-2); }
.review-card--featured small { color: rgba(255,255,255,0.5); }

/* ====== FAQ ====== */
.faq-section { padding: 80px 48px; max-width: 900px; margin: 0 auto; }
.faq-section h2 { font-family: var(--font-display); font-size: 38px; margin-bottom: 32px; }
.faq-grid { display: flex; flex-direction: column; gap: 12px; }
.faq-item {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-sm); overflow: hidden;
  cursor: pointer; transition: all var(--transition);
}
.faq-item:hover { border-color: var(--primary); }
.faq-item.open { border-color: var(--primary); }
.faq-q {
  padding: 16px 20px; font-size: 15px; font-weight: 600;
  display: flex; align-items: center; gap: 10px; color: var(--text);
}
.faq-icon { color: var(--primary); transition: transform var(--transition); font-size: 12px; }
.faq-item.open .faq-icon { transform: rotate(90deg); }
.faq-a {
  padding: 0 20px; font-size: 14px; color: var(--text-2); line-height: 1.7;
  max-height: 0; overflow: hidden; transition: all 0.3s ease;
}
.faq-item.open .faq-a { padding: 0 20px 16px; max-height: 200px; }

/* ====== CTA SECTION ====== */
.cta-section {
  background: linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-dark-3) 100%);
  padding: 80px 48px; text-align: center;
  position: relative; overflow: hidden;
}
.cta-section::before {
  content: ''; position: absolute; width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(108,99,255,0.25) 0%, transparent 70%);
  top: -100px; left: 50%; transform: translateX(-50%); border-radius: 50%;
}
.cta-content { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
.cta-content h2 { font-family: var(--font-display); font-size: 42px; color: #fff; margin-bottom: 16px; }
.cta-content p { font-size: 18px; color: rgba(255,255,255,0.7); margin-bottom: 32px; }
.cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px; }
.cta-trust { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
.cta-trust span { font-size: 13px; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 6px; }
.cta-trust i { color: var(--accent-2); }

/* ====== FOOTER LINKS ====== */
.footer-links { display: flex; gap: 24px; justify-content: center; margin: 12px 0; }
.footer-links a { color: rgba(255,255,255,0.4); text-decoration: none; font-size: 14px; display: flex; align-items: center; gap: 6px; transition: color var(--transition); }
.footer-links a:hover { color: rgba(255,255,255,0.8); }

/* ====== RESPONSIVE REVIEWS ====== */
@media (max-width: 768px) {
  .reviews-section { padding: 48px 20px; }
  .reviews-grid { grid-template-columns: 1fr; }
  .faq-section { padding: 48px 20px; }
  .cta-section { padding: 60px 20px; }
  .cta-content h2 { font-size: 30px; }
  .ai-status-indicator span { display: none; }
}

/* ====== SPEAKER MAP BLOCK ====== */
.speaker-map-block {
  background: rgba(108,99,255,0.05);
  border: 1px solid rgba(108,99,255,0.2);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  margin-bottom: 16px;
}
.speaker-map-header {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 600; margin-bottom: 12px;
  color: var(--primary);
}
.speaker-map-row {
  display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap;
}
.speaker-map-item {
  display: flex; flex-direction: column; gap: 4px;
}
.speaker-map-item label { font-size: 12px; color: var(--text-2); font-weight: 500; }
.speaker-map-item select {
  padding: 8px 12px; border: 1.5px solid var(--border);
  border-radius: var(--radius-xs); font-family: var(--font);
  font-size: 14px; background: var(--bg-card); cursor: pointer;
  color: var(--text);
}
.speaker-map-item select:focus { border-color: var(--primary); outline: none; }
.speaker-map-note {
  font-size: 12px; color: var(--text-2);
  margin-top: 10px; padding-top: 8px;
  border-top: 1px dashed var(--border);
}

/* ====== REPORT SECTIONS COLORS ====== */
.report-section--good {
  background: rgba(5,150,105,0.05);
  border: 1px solid rgba(5,150,105,0.2);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  margin-bottom: 16px;
}
.report-section--warn {
  background: rgba(217,119,6,0.05);
  border: 1px solid rgba(217,119,6,0.2);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  margin-bottom: 16px;
}
.report-section--next {
  background: linear-gradient(135deg, rgba(108,99,255,0.06), rgba(67,217,173,0.06));
  border: 2px solid rgba(108,99,255,0.2);
  border-radius: var(--radius-sm);
  padding: 16px 18px;
  margin-top: 8px;
}
.report-section--next h4 { margin-bottom: 8px; }
.report-section--good h4,
.report-section--warn h4 { margin-bottom: 8px; font-size: 14px; }
.pricing-cta-box {
  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
  background: linear-gradient(135deg, rgba(108,99,255,0.06), rgba(67,217,173,0.06));
  border: 2px solid rgba(108,99,255,0.15);
  border-radius: var(--radius);
  padding: 24px 32px;
  margin-top: 32px;
  max-width: 900px; margin-left: auto; margin-right: auto;
}
.pcta-icon { font-size: 36px; color: #0088cc; flex-shrink: 0; }
.pricing-cta-box h4 { font-size: 17px; font-weight: 700; margin-bottom: 4px; }
.pricing-cta-box p { font-size: 14px; color: var(--text-2); }
.pricing-cta-box .btn-primary { flex-shrink: 0; margin-left: auto; }
.price-note { font-size: 12px; color: var(--text-2); text-align: center; margin-top: 8px; }

/* ====== ACCESS MODAL ====== */
.access-info-banner {
  display: flex; gap: 12px; align-items: flex-start;
  background: rgba(108,99,255,0.06);
  border: 1px solid rgba(108,99,255,0.2);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
}
.access-info-banner i { color: var(--primary); font-size: 18px; flex-shrink: 0; margin-top: 2px; }
.access-info-banner strong { font-size: 15px; display: block; margin-bottom: 4px; }
.access-info-banner p { font-size: 13px; color: var(--text-2); margin: 0; }
.access-status-block { margin-bottom: 16px; }

/* Plan preview grid */
.access-plans-preview { margin-top: 20px; border-top: 1px solid var(--border); padding-top: 16px; }
.plan-preview-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.plan-preview {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 12px 8px;
  text-align: center; transition: all var(--transition);
}
.plan-preview:hover { border-color: var(--primary); }
.plan-preview span { display: block; font-size: 14px; font-weight: 600; margin-bottom: 2px; }
.plan-preview small { font-size: 12px; color: var(--text-2); }
.plan-preview--popular { border-color: var(--primary); background: rgba(108,99,255,0.05); }
.plan-preview--popular span { color: var(--primary); }

/* ====== ACCESS BADGE IN HEADER ====== */
.access-badge-header-wrap { flex-shrink: 0; }

/* ====== SPEECH RECORDING UI ====== */
.speech-rec-block { max-width: 740px; margin: 0 auto; }
.speech-rec-header { margin-bottom: 20px; }
.speech-rec-header h3 { font-size: 17px; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
.speech-rec-header p { font-size: 14px; color: var(--text-2); }
.speech-controls { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.speech-status {
  display: flex; align-items: center; gap: 10px;
  background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
  border-radius: 10px; padding: 10px 16px; margin-bottom: 12px;
  font-size: 14px; color: #dc2626; font-weight: 600;
}
.recording-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: #dc2626; flex-shrink: 0;
  animation: blink-red 1s ease infinite;
}
@keyframes blink-red { 0%,100%{opacity:1} 50%{opacity:0.2} }
.speech-transcript-area { margin-bottom: 16px; }
.speech-transcript-area textarea {
  width: 100%; border: 2px solid var(--border);
  border-radius: var(--radius-sm); padding: 14px;
  font-family: var(--font); font-size: 14px; resize: vertical;
  background: var(--bg); color: var(--text);
  transition: border-color var(--transition);
}
.speech-transcript-area textarea:focus { border-color: var(--primary); outline: none; }
.speech-action-row { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 16px; }
.btn-danger {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #fff; border: none; padding: 10px 20px;
  border-radius: 10px; cursor: pointer; font-family: var(--font);
  font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px;
  transition: all var(--transition);
}
.btn-danger:hover { opacity: 0.9; transform: translateY(-1px); }

/* ====== KEYS GENERATOR MODAL ====== */
.keys-gen-btn {
  background: linear-gradient(135deg, rgba(245,158,11,0.15), rgba(108,99,255,0.1)) !important;
  border: 1.5px solid rgba(245,158,11,0.4) !important;
  color: #f59e0b !important;
}
.keys-gen-btn:hover { background: rgba(245,158,11,0.25) !important; }

.keys-tariff-row {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;
}
.keys-tariff-card {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  background: var(--bg); border: 1.5px solid var(--border);
  border-radius: var(--radius-sm); padding: 16px 12px; text-align: center;
  position: relative;
}
.keys-tariff-card--popular {
  border-color: var(--primary);
  background: rgba(108,99,255,0.04);
}
.keys-tariff-badge {
  position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
  background: var(--primary); color: #fff;
  font-size: 10px; font-weight: 700; padding: 2px 10px; border-radius: 20px;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.keys-tariff-name { font-size: 14px; font-weight: 700; }
.keys-tariff-price { font-size: 18px; font-weight: 800; color: var(--primary); }
.keys-tariff-days { font-size: 11px; color: var(--text-2); margin-bottom: 4px; }
.keys-count-input {
  width: 60px; text-align: center; padding: 6px 8px;
  border: 1.5px solid var(--border); border-radius: 8px;
  background: var(--bg-secondary); color: var(--text); font-size: 14px; font-weight: 700;
}
.keys-result {
  background: var(--bg); border: 1.5px solid var(--border);
  border-radius: var(--radius-sm); margin-bottom: 10px; overflow: hidden;
}
.keys-result-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; background: var(--bg-secondary);
  font-size: 13px; font-weight: 600; border-bottom: 1px solid var(--border);
}
.keys-result-list { padding: 4px 0; }
.keys-result-item {
  display: flex; align-items: center; gap: 10px;
  padding: 7px 14px; border-bottom: 1px solid var(--border);
  font-size: 13px;
}
.keys-result-item:last-child { border-bottom: none; }
.keys-result-num {
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--bg-secondary); color: var(--text-2);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; flex-shrink: 0;
}
.keys-result-code {
  flex: 1; font-family: monospace; font-size: 13px;
  color: var(--primary); letter-spacing: 0.03em;
}
.keys-tip {
  display: flex; gap: 8px; align-items: flex-start;
  font-size: 12px; color: var(--text-2); line-height: 1.5;
  padding: 10px 14px; background: rgba(108,99,255,0.04);
  border-radius: var(--radius-sm); border: 1px solid rgba(108,99,255,0.1);
}
.keys-tip i { color: var(--primary); flex-shrink: 0; margin-top: 2px; }

@media (max-width: 480px) {
  .keys-tariff-row { grid-template-columns: 1fr; }
}

/* ====== AUDIO NOTICE ====== */
.audio-notice {
  display: flex; gap: 12px; align-items: flex-start;
  background: rgba(108,99,255,0.05);
  border: 1px solid rgba(108,99,255,0.15);
  border-radius: var(--radius-sm);
  padding: 16px 18px; margin-top: 20px; max-width: 740px; margin-left: auto; margin-right: auto;
  font-size: 13px; color: var(--text-2); line-height: 1.6;
}
.audio-notice i { color: var(--primary); font-size: 18px; flex-shrink: 0; margin-top: 2px; }
.audio-notice strong { display: block; color: var(--text); font-size: 14px; margin-bottom: 6px; }

