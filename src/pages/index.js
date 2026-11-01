import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import protocolDefaults from '../../protocol-defaults.json';

const BRN = () => <span className="currency-term--brn">BRN</span>;
const TRST = () => <span className="currency-term--trst">TRST</span>;

const liveDefaults = protocolDefaults.defaults.live;
const defaultRate = Math.round(Number(liveDefaults.find(row => row.name === 'brn_rate').current) * 3600 / 1e18 * 100) / 100;
const defaultLifetime = Number(liveDefaults.find(row => row.name === 'trst_expiry_secs').current) / 31536000;

function MoneySettings() {
  const [rate, setRate] = useState(defaultRate);
  const [lifetime, setLifetime] = useState(defaultLifetime);
  const maxRate = Math.max(2, defaultRate);
  const maxLifetime = Math.max(100, defaultLifetime);
  // The deck's illustrative curve, not a protocol or economic simulation.
  const income = rate / maxRate;
  const permanence = lifetime / maxLifetime;
  const bars = Array.from({length: 60}, (_, i) => {
    const position = i / 60;
    const base = position ** (2 + (1 - income) * 4);
    const retained = Math.max(0.08, 1 - (1 - permanence) * position * 2.5);
    return Math.min(1, base * retained + income * 0.35);
  });
  return <section className={styles.demo} aria-labelledby="demo-title">
    <header className={styles.demoHeader}><h2 id="demo-title">Income and currency lifetime</h2><span>Try both sliders</span></header>
    <div className={styles.distribution}>
      <div className={styles.distributionTitle}>Illustrative wealth distribution</div>
      <div className={styles.bars} role="img" aria-label={`Conceptual wealth distribution with income at ${rate} BRN per hour and currency lifetime at ${lifetime} years. This is an illustrative sketch, not a prediction of real balances.`}>
        {bars.map((height, i) => <i key={i} aria-hidden="true" style={{transform: `scaleY(${Math.max(height, 0.005)})`}} />)}
      </div>
      <div className={styles.axis} aria-hidden="true"><span>Less wealth</span><span>More wealth</span></div>
    </div>
    <div className={styles.setting}>
      <div className={styles.controlLabel}><label htmlFor="income-rate">Personal income</label><output htmlFor="income-rate">{rate} <BRN /> / hour</output></div>
      <input id="income-rate" aria-label="Personal income per hour" aria-valuetext={`${rate} BRN per hour`} aria-describedby="income-help" style={{'--range-progress': `${rate / maxRate * 100}%`}} type="range" min="0" max={maxRate} step="0.25" value={rate} onChange={event => setRate(Number(event.target.value))} />
      <p id="income-help">Income for each verified person. Zero stops new income.</p>
    </div>
    <div className={`${styles.setting} ${styles.expirySetting}`}>
      <div className={styles.controlLabel}><label htmlFor="currency-lifetime">Currency lifetime</label><output htmlFor="currency-lifetime">{lifetime} {lifetime === 1 ? 'year' : 'years'}</output></div>
      <input id="currency-lifetime" aria-label="Currency lifetime" aria-valuetext={`${lifetime} ${lifetime === 1 ? 'year' : 'years'}`} aria-describedby="lifetime-help" style={{'--range-progress': `${(lifetime - 1) / (maxLifetime - 1) * 100}%`}} type="range" min="1" max={maxLifetime} step="1" value={lifetime} onChange={event => setLifetime(Number(event.target.value))} />
      <p id="lifetime-help">How long <TRST /> can circulate before it expires.</p>
    </div>
    <footer className={styles.demoFooter}><span>A concept sketch, not an economic forecast.</span><button type="button" disabled={rate === defaultRate && lifetime === defaultLifetime} onClick={() => {setRate(defaultRate); setLifetime(defaultLifetime);}}>Reset defaults</button></footer>
  </section>;
}

export default function Home() {
  return (
    <Layout title="A currency with personal income built in" description="Explore the two settings at the heart of BURST: personal income and currency lifetime. Participants can vote to change the rules.">
      <main className={styles.home}>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.introduction}>
            <p className={styles.eyebrow}>BURST · An open monetary protocol</p>
            <h1 id="home-title">A currency with personal income built in.</h1>
            <p className={styles.lead}>Time spent caring, learning or looking for work may bring in no money. BURST explores an income that gives people more room to make those choices.</p>
            <p>Participants can vote on how much income people receive and how long circulating money lasts. Try both settings to see what they change.</p>
            <Link className={styles.readMore} to="/introduction/QUICK_TOUR">Read the introduction <span aria-hidden="true">→</span></Link>
          </div>
          <MoneySettings />
        </section>

        <section className={styles.questions} aria-labelledby="questions-title">
          <div><h2 id="questions-title">What makes this work?</h2><p>The currency needs people willing to use it. The software alone cannot give it purchasing power.</p></div>
          <div className={styles.answers}>
            <details>
              <summary>Why would anyone accept this money?</summary>
              <p>Because they expect to be able to spend it themselves. That takes people offering useful goods and services in exchange. BURST creates its own currency, not dollars or euros; it cannot guarantee prices or that the income will cover someone's needs.</p>
              <Link to="/introduction/ECONOMICS">Understand the economics →</Link>
            </details>
            <details>
              <summary>How does personal income become a payment?</summary>
              <p>Spend 5 <BRN /> of personal income, and those units are used up to create 5 <TRST /> for someone else to accept. They can then pass that money on. Keeping them separate lets unused income wait while circulating money has a lifetime and a traceable history. Money from a fraudulent identity can become invalid, even after an honest person receives it.</p>
              <Link to="/introduction/ECONOMICS">How the two balances work →</Link>
            </details>
            <details>
              <summary>What stops someone claiming several incomes?</summary>
              <p>A wallet alone doesn't qualify. Participants must be verified as unique people, using endorsements and checks by randomly selected eligible volunteers. Otherwise, extra accounts could mean extra incomes and votes. Decisions can be challenged.</p>
              <Link to="/protocol/VERIFICATION">How verification works →</Link>
            </details>
            <details>
              <summary>Who decides the income rate?</summary>
              <p>Participants can vote to change supported rules, including the income rate and currency lifetime. They can also stop new income. These choices affect everyone, so they aren't left permanently with the developer.</p>
              <Link to="/protocol/GOVERNANCE">Voting and temporary bootstrap powers →</Link>
            </details>
          </div>
        </section>
        <section className={styles.next} aria-labelledby="next-title">
          <div><h2 id="next-title">Explore the design or try the code.</h2><p>Still in development. Some mechanisms are restricted to experimental networks. <Link to="/introduction/LIMITATIONS">Current limits</Link></p></div>
          <nav aria-label="Explore BURST"><Link to="/introduction/WHITEPAPER">Whitepaper <span aria-hidden="true">→</span></Link><Link to="/development/DEVELOPING">Run a local node <span aria-hidden="true">→</span></Link></nav>
        </section>
      </main>
    </Layout>
  );
}
