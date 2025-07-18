import React, { useState } from "react";

// Inline styles
const styles = {
  container: {
    fontFamily: 'Inter, Arial, sans-serif',
    background: '#f7fbff',
    minHeight: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    color: '#1a2a3a',
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
    <div style={styles.progress}>
      {steps.map((s, i) => (
        <div key={s} style={styles.progressDot(i === step)} title={s} />
      ))}
    </div>
  );

  // Landing Section
  const renderLanding = () => (
    <section style={styles.section}>
      <div style={styles.logos}>
        {/* Replace with real client logos */}
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Mail_%28iOS%29.svg" alt="Client1" style={styles.logo} />
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png" alt="Client2" style={styles.logo} />
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Outlook.com_icon.png" alt="Client3" style={styles.logo} />
      </div>
      <h1 style={styles.headline}>
        Over 3,200 domains checked this month—are your emails being ignored?
      </h1>
      <input
        style={styles.input}
        type="text"
        placeholder="Enter your email domain (e.g. example.com)"
        value={domain}
        onChange={e => setDomain(e.target.value)}
        autoFocus
      />
      <button
        style={styles.button}
        onClick={() => setStep(1)}
        disabled={!domain.trim()}
      >
        Check My Email Infrastructure
      </button>
      <div style={styles.testimonial}>
        "We improved our inbox rate by 22% in 3 weeks—this tool is a must-have!"<br />
        <b>- Jamie, CEO at Tumblerware</b>
      </div>
    </section>
  );

  // DNS Checker Section (add Sheets error/loading display)
  const renderDnsCheck = () => (
    <section style={styles.section}>
      <h2 style={{...styles.headline, fontSize: 22}}>Checking your domain’s email infrastructure…</h2>
      {/* DNS check logic will go here */}
      <div style={{margin: '24px 0'}}>
        {/* Show loading, error, or partial results */}
        {dnsLoading && <div>Loading DNS records…</div>}
        {dnsError && <div style={{color: 'red'}}>{dnsError}</div>}
        {sheetsError && <div style={{color: 'red'}}>{sheetsError}</div>}
        {sheetsLoading && <div>Logging to Google Sheets…</div>}
        {dnsResults && (
          <div>
            {/* Partial results shown, details blurred if issues found */}
            <div style={dnsResults.issues ? styles.blurred : {}}>
              <div>SPF: {dnsResults.spf?.status || 'Checking…'}</div>
              <div>DKIM: {dnsResults.dkim?.status || 'Checking…'}</div>
              <div>DMARC: {dnsResults.dmarc?.status || 'Checking…'}</div>
            </div>
            {dnsResults.issues && (
              <div style={{marginTop: 16, color: '#1a2a3a', fontWeight: 500}}>
                Issues found! Enter your email to see the full report and ROI calculator.
              </div>
            )}
          </div>
        )}
      </div>
      <button
        style={styles.button}
        onClick={() => setStep(2)}
        disabled={!dnsResults || !dnsResults.issues}
      >
        See Full Report & ROI Calculator
      </button>
      <button
        style={{...styles.button, background: '#e0e7ef', color: '#2563eb'}}
        onClick={() => setStep(0)}
      >
        Back
      </button>
    </section>
  );

  // Email Capture Gate
  const renderEmailCapture = () => (
    <section style={styles.section}>
      <h2 style={{...styles.headline, fontSize: 22}}>What email should we send the results to?</h2>
      <input
        style={styles.input}
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoFocus
        disabled={klaviyoLoading}
      />
      <button
        style={styles.button}
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
      {klaviyoError && <div style={{color: 'red', marginTop: 8}}>{klaviyoError}</div>}
      {klaviyoSuccess && <div style={{color: 'green', marginTop: 8}}>Success! Email submitted.</div>}
      <div style={{marginTop: 16, color: '#1a2a3a', fontSize: 15}}>
        We’ll also send you our deliverability guide and tips.
      </div>
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

  // ROI Calculator Section
  const renderRoiCalculator = () => (
    <section style={styles.section}>
      <h2 style={{...styles.headline, fontSize: 22}}>ROI Calculator</h2>
      <div style={{marginBottom: 12, color: '#1a2a3a', fontWeight: 500}}>
        Brands like yours typically see 18–25% open rates—how do you stack up?
      </div>
      <input
        style={styles.input}
        type="number"
        placeholder="List size (number of subscribers)"
        value={roiInputs.listSize}
        onChange={e => setRoiInputs({...roiInputs, listSize: e.target.value})}
        min={1}
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Average order value ($)"
        value={roiInputs.aov}
        onChange={e => setRoiInputs({...roiInputs, aov: e.target.value})}
        min={1}
        step={0.01}
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Open rate (%)"
        value={roiInputs.openRate}
        onChange={e => setRoiInputs({...roiInputs, openRate: e.target.value})}
        min={0}
        max={100}
        step={0.1}
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Click-through rate (%)"
        value={roiInputs.ctr}
        onChange={e => setRoiInputs({...roiInputs, ctr: e.target.value})}
        min={0}
        max={100}
        step={0.1}
      />
      <button
        style={styles.button}
        onClick={() => {
          calculateRoi();
          setStep(4);
        }}
        disabled={!(roiInputs.listSize && roiInputs.aov && roiInputs.openRate && roiInputs.ctr)}
      >
        Calculate My Revenue Impact
      </button>
      {roiResult && roiResult.error && (
        <div style={{color: 'red', marginTop: 8}}>{roiResult.error}</div>
      )}
    </section>
  );

  // Results & Actions Section (add Sheets error/loading display)
  const renderResults = () => (
    <section style={styles.section}>
      <h2 style={{...styles.headline, fontSize: 22}}>Your Full Deliverability Report</h2>
      {/* Show full DNS results and ROI calculation */}
      <div style={{margin: '16px 0'}}>
        <div>
          <b>SPF:</b> {dnsResults?.spf?.status || 'N/A'}<br />
          <b>DKIM:</b> {dnsResults?.dkim?.status || 'N/A'}<br />
          <b>DMARC:</b> {dnsResults?.dmarc?.status || 'N/A'}<br />
        </div>
        <div style={{marginTop: 16}}>
          <b>ROI Calculation:</b><br />
          {/* ROI result will be shown here */}
          {roiResult ? (
            roiResult.error ? (
              <div style={{color: 'red'}}>{roiResult.error}</div>
            ) : (
              <div>
                <div>Current Revenue: <b>${roiResult.currentRevenue}</b></div>
                <div>Benchmark Revenue (22% open): <b>${roiResult.benchmarkRevenue}</b></div>
                <div style={{color: roiResult.revenueImpact < 0 ? 'red' : 'green'}}>
                  Potential Revenue {roiResult.revenueImpact < 0 ? 'Loss' : 'Gain'}: <b>${Math.abs(roiResult.revenueImpact)}</b>
                </div>
                <div>Open Rate: {roiInputs.openRate}% (Benchmark: 18–25%)</div>
              </div>
            )
          ) : (
            <div>Calculation will appear here after you enter your numbers.</div>
          )}
        </div>
        {sheetsError && <div style={{color: 'red', marginTop: 8}}>{sheetsError}</div>}
        {sheetsLoading && <div>Updating Google Sheets…</div>}
        {sheetsSuccess && <div style={{color: 'green', marginTop: 8}}>Results saved to Google Sheets!</div>}
      </div>
      <button
        style={styles.button}
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
      {guideError && <div style={{color: 'red', marginTop: 8}}>{guideError}</div>}
      {guideSuccess && <div style={{color: 'green', marginTop: 8}}>Guide sent! Check your inbox.</div>}
      <a
        href="https://cal.com/stevenwagner/inboxsos"
        target="_blank"
        rel="noopener noreferrer"
        style={{...styles.button, display: 'block', background: '#fff', color: '#2563eb', border: '1px solid #2563eb', textAlign: 'center', textDecoration: 'none'}}
      >
        Hire Us to Fix It
      </a>
      {showGuide && (
        <div style={{marginTop: 24, color: '#1a2a3a', fontWeight: 500}}>
          Guide download and Klaviyo integration will be triggered here.
        </div>
      )}
    </section>
  );

  // VSL Section
  const renderVsl = () => (
    <section style={styles.vsl}>
      <h2 style={{...styles.headline, fontSize: 22}}>Watch: How to Fix Your Email Deliverability</h2>
      <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8, boxShadow: '0 2px 8px #bcd0e5'}}>
        <iframe
          src="https://www.youtube.com/embed/2e-yb2pQGgA"
          title="VSL"
          style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0}}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );

  // Footer
  const renderFooter = () => (
    <footer style={styles.footer}>
      <div>
        <a href="https://inboxsos.com" style={styles.link} target="_blank" rel="noopener noreferrer">Website</a>
        <a href="https://linkedin.com/in/stevenwagner" style={styles.link} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://linktr.ee/stevenwagner" style={styles.link} target="_blank" rel="noopener noreferrer">Linktree</a>
      </div>
      <div style={{marginTop: 8, fontSize: 14, color: '#bcd0e5'}}>© {new Date().getFullYear()} InboxSOS. All rights reserved.</div>
    </footer>
  );

  // Main render
  return (
    <div style={styles.container}>
      {renderProgress()}
      <div style={styles.fullWidth}>
        {step === 0 && renderLanding()}
        {step === 1 && renderDnsCheck()}
        {step === 2 && renderEmailCapture()}
        {step === 3 && renderRoiCalculator()}
        {step === 4 && renderResults()}
        {renderVsl()}
        {renderFooter()}
      </div>
    </div>
  );
} 