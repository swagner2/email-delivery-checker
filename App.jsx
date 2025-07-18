import React, { useState } from "react";
import "./App.css";

// Inline styles
const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: 'Inter, Arial, sans-serif',
    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  main: {
    width: '100%',
    maxWidth: 600,
    margin: '40px auto',
    padding: '0 0 40px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 4px 24px 0 rgba(44,62,80,0.10)',
    padding: '32px 24px',
    marginBottom: 32,
    width: '100%',
    boxSizing: 'border-box',
    maxWidth: 600,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: 600,
    margin: '40px auto 0 auto',
    padding: '32px 24px 24px 24px',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    boxShadow: '0 4px 24px 0 rgba(44,62,80,0.10)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: '#1a2540',
    marginBottom: 8,
    letterSpacing: '-0.5px',
  },
  appSubtitle: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 0,
    fontWeight: 400,
  },
  fullWidth: {
    width: '100%',
    maxWidth: '100vw',
    margin: 0,
    padding: 0,
  },
  section: {
    width: '100%',
    maxWidth: 700,
    margin: '0 auto',
    padding: '32px 16px',
    boxSizing: 'border-box',
  },
  headline: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 16,
    color: '#0a2540',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 18,
    border: '1px solid #bcd0e5',
    borderRadius: 6,
    marginBottom: 16,
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px 0',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    fontSize: 18,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    marginBottom: 12,
    transition: 'background 0.2s',
  },
  blurred: {
    filter: 'blur(4px)',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '24px 0',
    gap: 8,
  },
  progressDot: (active) => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: active ? '#2563eb' : '#bcd0e5',
    transition: 'background 0.2s',
  }),
  testimonial: {
    background: '#e6f0fa',
    borderRadius: 8,
    padding: 16,
    margin: '24px 0',
    fontStyle: 'italic',
    color: '#1a2a3a',
    textAlign: 'center',
  },
  logos: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    margin: '24px 0',
    flexWrap: 'wrap',
  },
  logo: {
    height: 32,
    opacity: 0.8,
  },
  footer: {
    marginTop: 48,
    padding: '24px 0',
    background: '#0a2540',
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  link: {
    color: '#60a5fa',
    textDecoration: 'underline',
    margin: '0 8px',
  },
  vsl: {
    margin: '32px 0',
    textAlign: 'center',
  },
};

const steps = [
  'Landing',
  'DNS Check',
  'Email Capture',
  'ROI Calculator',
  'Results',
];

// Add SVG icons for use in DNS results
const icons = {
  spf: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{marginRight:8}}><circle cx="10" cy="10" r="10" fill="#2563eb"/><text x="10" y="15" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">S</text></svg>
  ),
  dkim: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{marginRight:8}}><circle cx="10" cy="10" r="10" fill="#7c3aed"/><text x="10" y="15" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">D</text></svg>
  ),
  dmarc: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{marginRight:8}}><circle cx="10" cy="10" r="10" fill="#059669"/><text x="10" y="15" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">M</text></svg>
  ),
  mx: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{marginRight:8}}><circle cx="10" cy="10" r="10" fill="#f59e42"/><text x="10" y="15" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">MX</text></svg>
  ),
  check: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{marginRight:8}}><circle cx="10" cy="10" r="10" fill="#22c55e"/><path d="M6 10.5l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  error: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{marginRight:8}}><circle cx="10" cy="10" r="10" fill="#ef4444"/><path d="M7 7l6 6M13 7l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
};

// Add more icons for use in other sections
icons.email = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{marginRight:8}}><rect width="20" height="20" rx="6" fill="#2563eb"/><path d="M4 6.5l6 5 6-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="6.5" width="12" height="7" rx="2" stroke="#fff" strokeWidth="1.5"/></svg>
);
icons.guide = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{marginRight:8}}><rect width="20" height="20" rx="6" fill="#7c3aed"/><path d="M7 5h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="#fff" strokeWidth="1.5"/><path d="M8 8h4M8 11h2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
icons.calc = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{marginRight:8}}><rect width="20" height="20" rx="6" fill="#059669"/><rect x="6" y="6" width="8" height="8" rx="2" stroke="#fff" strokeWidth="1.5"/><path d="M8 9h4M8 12h2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
);

export default function App() {
  const [step, setStep] = useState(0); // 0: Landing, 1: DNS, 2: Email, 3: ROI, 4: Results
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [dnsResults, setDnsResults] = useState(null); // DKIM, SPF, DMARC
  const [dnsLoading, setDnsLoading] = useState(false);
  const [dnsError, setDnsError] = useState("");
  const [roiInputs, setRoiInputs] = useState({
    listSize: '',
    aov: '',
    openRate: '',
    ctr: '',
  });
  const [roiResult, setRoiResult] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  // Guide request state
  const [guideLoading, setGuideLoading] = useState(false);
  const [guideError, setGuideError] = useState("");
  const [guideSuccess, setGuideSuccess] = useState(false);

  // DNS lookup helpers
  async function fetchDnsRecord(domain, type, nameOverride) {
    // Google DNS-over-HTTPS API
    // type: 'TXT' for SPF/DKIM/DMARC
    // nameOverride: for DKIM selector, etc.
    const name = nameOverride || domain;
    const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('DNS query failed');
      const data = await res.json();
      return data;
    } catch (e) {
      throw new Error('DNS lookup failed');
    }
  }

  // Check SPF, DKIM, DMARC
  async function checkEmailInfra(domain) {
    setDnsLoading(true);
    setDnsError("");
    setDnsResults(null);
    try {
      // SPF
      const spfData = await fetchDnsRecord(domain, 'TXT');
      let spfStatus = 'Not found';
      if (spfData && spfData.Answer) {
        const spfTxt = spfData.Answer.map(a => a.data.replace(/^"|"$/g, '')).find(txt => txt.includes('v=spf1'));
        if (spfTxt) {
          spfStatus = spfTxt.includes('all') ? 'Found' : 'Incomplete';
        }
      }
      // DMARC
      const dmarcData = await fetchDnsRecord(`_dmarc.${domain}`, 'TXT');
      let dmarcStatus = 'Not found';
      if (dmarcData && dmarcData.Answer) {
        const dmarcTxt = dmarcData.Answer.map(a => a.data.replace(/^"|"$/g, '')).find(txt => txt.includes('v=DMARC1'));
        if (dmarcTxt) {
          dmarcStatus = dmarcTxt.includes('p=none') ? 'Policy: none' : 'Policy: enforced';
        }
      }
      // DKIM (try common selectors)
      const selectors = ['default', 'mail', 'selector1', 'google', 'smtp', 'dkim'];
      let dkimStatus = 'Not found';
      let foundDkim = false;
      for (let sel of selectors) {
        try {
          const dkimData = await fetchDnsRecord(`${sel}._domainkey.${domain}`, 'TXT');
          if (dkimData && dkimData.Answer) {
            const dkimTxt = dkimData.Answer.map(a => a.data.replace(/^"|"$/g, '')).find(txt => txt.includes('v=DKIM1'));
            if (dkimTxt) {
              dkimStatus = `Found (${sel})`;
              foundDkim = true;
              break;
            }
          }
        } catch {}
      }
      if (!foundDkim) dkimStatus = 'Not found';
      // Determine if there are issues
      const issues = spfStatus !== 'Found' || dkimStatus === 'Not found' || dmarcStatus === 'Not found';
      setDnsResults({
        spf: { status: spfStatus },
        dkim: { status: dkimStatus },
        dmarc: { status: dmarcStatus },
        issues,
      });
    } catch (e) {
      setDnsError('Could not check DNS records. Please try again.');
    } finally {
      setDnsLoading(false);
    }
  }

  // Trigger DNS check when entering DNS step
  React.useEffect(() => {
    if (step === 1 && domain) {
      checkEmailInfra(domain);
    }
    // eslint-disable-next-line
  }, [step, domain]);

  // Klaviyo integration
  async function addToKlaviyoList(email, domain, listId = 'TCapS8') {
    // Klaviyo public API endpoint for list subscribe
    // https://developers.klaviyo.com/en/reference/subscribe
    const url = `https://a.klaviyo.com/client/subscriptions/?company_id=${listId}`;
    const payload = {
      data: {
        type: 'subscription',
        attributes: {
          list_id: listId,
          profiles: [
            {
              email,
              custom_properties: {
                domain,
                consent: 'Full marketing consent',
                source: 'ROI Tool',
              },
              consent: [
                'EMAIL',
                'WEB',
                'SMS',
                'DIRECTMAIL',
                'MOBILE_PUSH',
                'MESSENGER'
              ],
              // Add more fields as needed
            },
          ],
        },
      },
    };
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Klaviyo-API-Key Mzfpkb',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Klaviyo error');
      }
      return true;
    } catch (e) {
      throw new Error('Could not add to Klaviyo: ' + e.message);
    }
  }

  // Email capture state
  const [klaviyoLoading, setKlaviyoLoading] = useState(false);
  const [klaviyoError, setKlaviyoError] = useState("");
  const [klaviyoSuccess, setKlaviyoSuccess] = useState(false);

  // Google Sheets integration
  // Replace this with your actual endpoint
  const SHEETS_ENDPOINT = 'https://your-google-sheets-endpoint.com/row';

  // Store rowId for this session
  const [rowId, setRowId] = useState(null);
  const [sheetsLoading, setSheetsLoading] = useState(false);
  const [sheetsError, setSheetsError] = useState("");
  const [sheetsSuccess, setSheetsSuccess] = useState(false);

  // Add a new row when a domain is checked
  async function createSheetsRow(domain) {
    setSheetsLoading(true);
    setSheetsError("");
    try {
      const res = await fetch(SHEETS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, timestamp: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error('Failed to create row');
      const data = await res.json();
      setRowId(data.rowId); // Expect API to return { rowId }
    } catch (e) {
      setSheetsError('Could not log domain to Google Sheets.');
    } finally {
      setSheetsLoading(false);
    }
  }

  // Update the row with email, DNS, ROI
  async function updateSheetsRow({ email, dnsResults, roiResult }) {
    if (!rowId) return;
    setSheetsLoading(true);
    setSheetsError("");
    try {
      const res = await fetch(`${SHEETS_ENDPOINT}/${rowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          dnsResults,
          roiResult,
          updated: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Failed to update row');
      setSheetsSuccess(true);
    } catch (e) {
      setSheetsError('Could not update Google Sheets row.');
    } finally {
      setSheetsLoading(false);
    }
  }

  // On DNS check, create a row
  React.useEffect(() => {
    if (step === 1 && domain) {
      createSheetsRow(domain);
    }
    // eslint-disable-next-line
  }, [step, domain]);

  // On email/ROI, update the row
  React.useEffect(() => {
    if (step === 4 && email && dnsResults && roiResult) {
      updateSheetsRow({ email, dnsResults, roiResult });
    }
    // eslint-disable-next-line
  }, [step, email, dnsResults, roiResult]);

  // Progress indicator
  const renderProgress = () => (
    <div className="progress">
      {steps.map((s, i) => (
        <div key={s} className={`progress-dot ${i === step ? 'active' : ''}`} title={s} />
      ))}
    </div>
  );

  // Landing Section
  const renderLanding = () => (
    <section className="section">
      <div className="logos">
        {/* Replace with real client logos */}
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Mail_%28iOS%29.svg" alt="Client1" className="logo" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png" alt="Client2" className="logo" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Outlook.com_icon.png" alt="Client3" className="logo" />
      </div>
      <h1 className="headline">
        Over 3,200 domains checked this month—are your emails being ignored?
      </h1>
      <input
        className="input"
        type="text"
        placeholder="Enter your email domain (e.g. example.com)"
        value={domain}
        onChange={e => setDomain(e.target.value)}
        autoFocus
      />
      <button
        className="button"
        onClick={() => setStep(1)}
        disabled={!domain.trim()}
      >
        Check My Email Infrastructure
      </button>
      <div className="testimonial">
        "We improved our inbox rate by 22% in 3 weeks—this tool is a must-have!"<br />
        <b>- Jamie, CEO at Tumblerware</b>
      </div>
    </section>
  );

  // DNS Checker Section (restyled)
  const renderDnsCheck = () => (
    <section className="section">
      <h2 className="section-title">{icons.spf} 🔍 Domain Email Infrastructure Check</h2>
      <p className="section-desc">Enter your domain (e.g., example.com):</p>
      <input
        className="input"
        type="text"
        placeholder="example.com"
        value={domain}
        onChange={e => setDomain(e.target.value)}
        disabled={dnsLoading || sheetsLoading}
      />
      <button
        className="button"
        onClick={() => setStep(1)}
        disabled={!domain.trim() || dnsLoading || sheetsLoading}
      >
        {dnsLoading ? 'Checking…' : 'Check Email Records'}
      </button>
      <div className="status-panel">
        {dnsError && <div className="status-error">{icons.error} {dnsError}</div>}
        {sheetsError && <div className="status-error">{icons.error} {sheetsError}</div>}
        {sheetsLoading && <div className="status-info">Logging to Google Sheets…</div>}
        {dnsResults && (
          <div className="status-success">
            <div className="status-item"><span>{icons.spf}</span> SPF Record: <span>{dnsResults.spf?.status}</span></div>
            <div className="status-item"><span>{icons.dmarc}</span> DMARC Record: <span>{dnsResults.dmarc?.status}</span></div>
            <div className="status-item"><span>{icons.dkim}</span> DKIM Record: <span>{dnsResults.dkim?.status}</span></div>
            {/* MX record is not checked in logic, but you can add it here if needed */}
            {/* <div style={{display:'flex', alignItems:'center', marginBottom:10}}>{icons.mx}<b>MX Record</b>: <span style={{marginLeft:8}}>Found</span></div> */}
            {dnsResults.issues ? (
              <div className="status-warning">
                {icons.error} Issues found! Enter your email to see the full report and ROI calculator.
              </div>
            ) : (
              <div className="status-success">
                {icons.check} Great job! Your email infrastructure looks solid.
              </div>
            )}
          </div>
        )}
      </div>
      <button
        className="button"
        onClick={() => setStep(2)}
        disabled={!dnsResults || !dnsResults.issues}
      >
        See Full Report & ROI Calculator
      </button>
      <button
        className="button"
        onClick={() => setStep(0)}
      >
        Back
      </button>
    </section>
  );

  // Email Capture Gate (restyled)
  const renderEmailCapture = () => (
    <section className="section">
      <h2 className="section-title">{icons.email} What email should we send the results to?</h2>
      <p className="section-desc">We’ll also send you our deliverability guide and tips.</p>
      <input
        className="input"
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoFocus
        disabled={klaviyoLoading}
      />
      <button
        className="button"
        onClick={async () => {
          setKlaviyoLoading(true);
          setKlaviyoError("");
          setKlaviyoSuccess(false);
          try {
            await addToKlaviyoList(email, domain, 'TCapS8');
            setKlaviyoSuccess(true);
            setStep(3);
          } catch (e) {
            setKlaviyoError(e.message);
          } finally {
            setKlaviyoLoading(false);
          }
        }}
        disabled={!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || klaviyoLoading}
      >
        {klaviyoLoading ? 'Submitting…' : 'See My Full Report & ROI Calculator'}
      </button>
      {klaviyoError && <div className="status-error">{icons.error} {klaviyoError}</div>}
      {klaviyoSuccess && <div className="status-success">{icons.check} Success! Email submitted.</div>}
    </section>
  );

  // ROI Calculator logic
  function calculateRoi() {
    // Parse and validate inputs
    const listSize = parseInt(roiInputs.listSize, 10);
    const aov = parseFloat(roiInputs.aov);
    const openRate = parseFloat(roiInputs.openRate); // as %
    const ctr = parseFloat(roiInputs.ctr); // as %
    if (
      isNaN(listSize) || listSize <= 0 ||
      isNaN(aov) || aov <= 0 ||
      isNaN(openRate) || openRate < 0 || openRate > 100 ||
      isNaN(ctr) || ctr < 0 || ctr > 100
    ) {
      setRoiResult({ error: 'Please enter valid numbers for all fields.' });
      return;
    }
    // Current revenue
    const currentRevenue = listSize * (openRate / 100) * (ctr / 100) * aov;
    // Benchmark open rate (average 22%)
    const benchmarkOpen = 22;
    const benchmarkRevenue = listSize * (benchmarkOpen / 100) * (ctr / 100) * aov;
    const revenueImpact = Math.round(benchmarkRevenue - currentRevenue);
    setRoiResult({
      currentRevenue: Math.round(currentRevenue),
      benchmarkRevenue: Math.round(benchmarkRevenue),
      revenueImpact,
      openRate,
      benchmarkOpen,
    });
  }

  // ROI Calculator Section (restyled)
  const renderRoiCalculator = () => (
    <section className="section">
      <h2 className="section-title">{icons.calc} Email Marketing Performance Calculator</h2>
      <p className="section-desc">Brands like yours typically see <b>18–25% open rates</b>—how do you stack up?</p>
      <div className="input-group">
        <input className="input" type="number" placeholder="List Size" value={roiInputs.listSize} onChange={e => setRoiInputs({...roiInputs, listSize: e.target.value})} min={1} />
        <input className="input" type="number" placeholder="Avg Order Value ($)" value={roiInputs.aov} onChange={e => setRoiInputs({...roiInputs, aov: e.target.value})} min={1} step={0.01} />
        <input className="input" type="number" placeholder="Open Rate (%)" value={roiInputs.openRate} onChange={e => setRoiInputs({...roiInputs, openRate: e.target.value})} min={0} max={100} step={0.1} />
        <input className="input" type="number" placeholder="Click-Through Rate (%)" value={roiInputs.ctr} onChange={e => setRoiInputs({...roiInputs, ctr: e.target.value})} min={0} max={100} step={0.1} />
      </div>
      <button
        className="button"
        onClick={() => { calculateRoi(); setStep(4); }}
        disabled={!(roiInputs.listSize && roiInputs.aov && roiInputs.openRate && roiInputs.ctr)}
      >
        Calculate My Revenue Impact
      </button>
      {roiResult && roiResult.error && (
        <div className="status-error">{icons.error} {roiResult.error}</div>
      )}
    </section>
  );

  // Results & Actions Section (restyled)
  const renderResults = () => (
    <section className="section">
      <h2 className="section-title">📊 Monthly Revenue Impact</h2>
      <div className="result-impact">
        {roiResult && !roiResult.error ? (
          <>
            <div className="result-item">{icons.error} Monthly Revenue Impact</div>
            ${Math.abs(roiResult.revenueImpact).toLocaleString()}
            <div className="result-desc">
              You’re potentially losing this much revenue per month due to poor email deliverability.
            </div>
            <div className="result-desc">
              Annual Impact: <b>${(Math.abs(roiResult.revenueImpact)*12).toLocaleString()}</b>
            </div>
          </>
        ) : (
          <div className="result-desc">{icons.error} Calculation will appear here after you enter your numbers.</div>
        )}
      </div>
      <div className="result-summary">
        <div className="summary-item">
          <div className="summary-label">Current Performance</div>
          <div className="summary-value">Open Rate: {roiInputs.openRate}%<br/>Revenue: ${roiResult?.currentRevenue?.toLocaleString() || 0}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Potential with Good Deliverability</div>
          <div className="summary-value">Open Rate: 22%<br/>Revenue: ${roiResult?.benchmarkRevenue?.toLocaleString() || 0}</div>
        </div>
      </div>
      <button
        className="button"
        onClick={async () => {
          setGuideLoading(true);
          setGuideError("");
          setGuideSuccess(false);
          try {
            await addToKlaviyoList(email, domain, 'U42FCU');
            setGuideSuccess(true);
          } catch (e) {
            setGuideError(e.message);
          } finally {
            setGuideLoading(false);
          }
        }}
        disabled={guideLoading || guideSuccess}
      >
        {guideLoading ? 'Submitting…' : '✅ Get My Deliverability Fix-It Plan'}
      </button>
      {guideError && <div className="status-error">{icons.error} {guideError}</div>}
      {guideSuccess && <div className="status-success">{icons.check} Guide sent! Check your inbox.</div>}
      <a
        href="https://cal.com/stevenwagner/inboxsos"
        target="_blank"
        rel="noopener noreferrer"
        className="action-link"
      >
        Hire Us to Fix It
      </a>
      {sheetsError && <div className="status-error">{icons.error} {sheetsError}</div>}
      {sheetsLoading && <div className="status-info">Updating Google Sheets…</div>}
      {sheetsSuccess && <div className="status-success">{icons.check} Results saved to Google Sheets!</div>}
    </section>
  );

  // VSL Section (restyled)
  const renderVsl = () => (
    <section className="vsl-section">
      <h2 className="section-title">{icons.guide} Watch: How to Fix Your Email Deliverability</h2>
      <div className="vsl-video-container">
        <iframe
          src="https://www.youtube.com/embed/2e-yb2pQGgA"
          title="VSL"
          className="vsl-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );

  // Footer (restyled)
  const renderFooter = () => (
    <footer className="footer">
      <div>
        <a href="https://inboxsos.com" className="footer-link" target="_blank" rel="noopener noreferrer">Website</a>
        <a href="https://linkedin.com/in/stevenwagner" className="footer-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://linktr.ee/stevenwagner" className="footer-link" target="_blank" rel="noopener noreferrer">Linktree</a>
      </div>
      <div className="footer-copyright">© {new Date().getFullYear()} InboxSOS. All rights reserved.</div>
    </footer>
  );

  // Main render
  return (
    <div className="app-container">
      <div className="app-header">
        <div className="app-title">
          <span role="img" aria-label="email">📧</span> Email Delivery Checker & ROI Calculator
        </div>
        <div className="app-subtitle">
          Analyze your email infrastructure and calculate the cost of poor deliverability
        </div>
      </div>
      <main className="app-main">
        <div className="card">
          {renderProgress()}
          {step === 0 && renderLanding()}
          {step === 1 && renderDnsCheck()}
          {step === 2 && renderEmailCapture()}
          {step === 3 && renderRoiCalculator()}
          {step === 4 && renderResults()}
        </div>
        {renderVsl()}
        {renderFooter()}
      </main>
    </div>
  );
} 