/* Document-request gating test harness — McCune intake mockups.
   Run: npm install jsdom && node gating-test.js  (from the Intake Pages folder; set DIR below to ".")
   Simulates debtor answers on every page and asserts which upload buttons appear,
   per DOC-LOGIC.md. 116 assertions. Last full pass: 2026-07-10. */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const DIR = './';
const sleep = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0, failures = [];

function assert(name, cond, detail='') {
  if (cond) { pass++; } else { fail++; failures.push(name + (detail?` — ${detail}`:'')); }
}

function load(file, url, seed) {
  const html = fs.readFileSync(DIR + file, 'utf8');
  const dom = new JSDOM(html, {
    url: url || 'https://mock.test/' + file,
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(window) {
      // emulate offsetParent (jsdom has no layout): non-null unless an ancestor is display:none
      Object.defineProperty(window.HTMLElement.prototype, 'offsetParent', {
        get() {
          let el = this;
          while (el && el !== window.document.body) {
            if (el.style && el.style.display === 'none') return null;
            el = el.parentElement;
          }
          return window.document.body;
        }
      });
      if (seed) for (const [k,v] of Object.entries(seed)) window.sessionStorage.setItem(k, v);
      window.HTMLMediaElement && (window.HTMLMediaElement.prototype.play = ()=>Promise.resolve());
      window.fetch = async () => ({ json: async () => ({ configured: true, suggestions: [] }) });
    }
  });
  return dom;
}

function visible(win, doc, docType) {
  const b = doc.querySelector(`.dbtn[data-doc="${docType}"]`);
  if (!b) return null;
  let el = b;
  while (el && el.tagName !== 'BODY') {
    const d = el.style ? el.style.display : '';
    if (d === 'none') return false;
    el = el.parentElement;
  }
  return true;
}

function clickYes(win, doc, toggleId, which=0) {
  const t = doc.getElementById(toggleId);
  const sp = t.querySelectorAll('span')[which];
  sp.dispatchEvent(new win.window.MouseEvent('click', { bubbles: true }));
}

function clickToggleByLabel(win, doc, sub, which=0) {
  const rows = doc.querySelectorAll('.qrow, .fa-q');
  for (const r of rows) {
    const lab = r.querySelector('label');
    if (!lab || lab.textContent.toLowerCase().indexOf(sub.toLowerCase()) < 0) continue;
    const sp = r.querySelectorAll('.toggle span')[which];
    if (sp) { sp.dispatchEvent(new win.window.MouseEvent('click', { bubbles: true })); return true; }
  }
  return false;
}

function railCount(doc){ const c=doc.querySelector('.docbar .count'); return c?c.textContent.trim():'?'; }

(async () => {

  /* ================= INCOME ================= */
  {
    const dom = load('income.html'); const doc = dom.window.document;
    await sleep(300);
    assert('income: pay_stubs hidden by default', visible(dom, doc, 'pay_stubs') === false);
    assert('income: other_income_proof hidden by default', visible(dom, doc, 'other_income_proof') === false);
    assert('income: bank_statements visible always', visible(dom, doc, 'bank_statements') === true);
    assert('income: sp_pay_stubs hidden (not married)', visible(dom, doc, 'sp_pay_stubs') === false);
    assert('income: sp_bank_statements hidden (not married)', visible(dom, doc, 'sp_bank_statements') === false);
    clickYes(dom, doc, 'employedTg', 0); await sleep(250);
    assert('income: pay_stubs appears on employed=Yes', visible(dom, doc, 'pay_stubs') === true);
    clickYes(dom, doc, 'employedTg', 1); await sleep(250);
    assert('income: pay_stubs hides on employed=No', visible(dom, doc, 'pay_stubs') === false);
    clickYes(dom, doc, 'otherIncTg', 0); await sleep(250);
    assert('income: other_income_proof appears on otherIncome=Yes', visible(dom, doc, 'other_income_proof') === true);
    assert('income rail count reflects visible only', railCount(doc).endsWith('/ 2'), railCount(doc));
  }

  /* ---- income, married ---- */
  {
    const dom = load('income.html', 'https://mock.test/income.html?married=1'); const doc = dom.window.document;
    await sleep(400);
    assert('income(married): sp_bank_statements visible', visible(dom, doc, 'sp_bank_statements') === true);
    assert('income(married): sp_pay_stubs hidden until spouse employed', visible(dom, doc, 'sp_pay_stubs') === false);
    assert('income(married): sp_other_income_proof hidden until Yes', visible(dom, doc, 'sp_other_income_proof') === false);
    clickYes(dom, doc, 'spEmployedTg', 0); await sleep(250);
    assert('income(married): sp_pay_stubs appears on spouseEmployed=Yes', visible(dom, doc, 'sp_pay_stubs') === true);
    clickYes(dom, doc, 'spOtherIncTg', 0); await sleep(250);
    assert('income(married): sp_other_income_proof appears on Yes', visible(dom, doc, 'sp_other_income_proof') === true);
    clickYes(dom, doc, 'spEmployedTg', 1); await sleep(250);
    assert('income(married): sp_pay_stubs hides on spouseEmployed=No', visible(dom, doc, 'sp_pay_stubs') === false);
  }

  /* ================= ASSETS ================= */
  {
    const dom = load('assets.html'); const doc = dom.window.document; const win = dom;
    await sleep(400);
    for (const d of ['zillow_valuation','foreclosure_docs','kbb_valuation','vehicle_title','repo_docs','investment_statements'])
      assert(`assets: ${d} hidden by default`, visible(dom, doc, d) === false, String(visible(dom,doc,d)));
    clickYes(dom, doc, 'realEstateTg', 0); await sleep(250);
    assert('assets: zillow appears on realEstate=Yes', visible(dom, doc, 'zillow_valuation') === true);
    assert('assets: foreclosure still hidden (not behind)', visible(dom, doc, 'foreclosure_docs') === false);
    assert('assets: behind-on-mortgage toggle found+clicked', clickToggleByLabel(dom, doc, 'behind on mortgage', 0)); await sleep(250);
    assert('assets: foreclosure appears on behind=Yes', visible(dom, doc, 'foreclosure_docs') === true);
    clickYes(dom, doc, 'vehTg', 0); await sleep(250);
    assert('assets: kbb appears on vehicles=Yes', visible(dom, doc, 'kbb_valuation') === true);
    assert('assets: title appears because financed defaults to No', visible(dom, doc, 'vehicle_title') === true);
    assert('assets: financed toggle found+clicked No', clickToggleByLabel(dom, doc, 'financed', 1)); await sleep(250);
    assert('assets: title appears on financed=No', visible(dom, doc, 'vehicle_title') === true);
    clickToggleByLabel(dom, doc, 'financed', 0); await sleep(250);
    assert('assets: title hides on financed=Yes', visible(dom, doc, 'vehicle_title') === false);
    const gotBehindVeh = clickToggleByLabel(dom, doc, 'behind on payments', 0); await sleep(250);
    assert('assets: behind-on-payments toggle found', gotBehindVeh);
    assert('assets: repo docs appear on behindPayments=Yes', visible(dom, doc, 'repo_docs') === true);
    clickToggleByLabel(dom, doc, 'retirement or pension', 0); await sleep(250);
    assert('assets: investments appear on retirement=Yes', visible(dom, doc, 'investment_statements') === true);
    clickToggleByLabel(dom, doc, 'retirement or pension', 1); await sleep(250);
    assert('assets: investments hide when the only Yes flips to No', visible(dom, doc, 'investment_statements') === false);
    clickToggleByLabel(dom, doc, 'annuities', 0); await sleep(250);
    assert('assets: investments reappear via annuities=Yes (OR gate)', visible(dom, doc, 'investment_statements') === true);
    // cross-page persistence
    const trg = JSON.parse(dom.window.sessionStorage.getItem('mcl_doc_triggers') || '{}');
    assert('assets: persists real_estate=yes', trg.real_estate === 'yes', JSON.stringify(trg));
    assert('assets: persists vehicle_financed=yes', trg.vehicle_financed === 'yes', JSON.stringify(trg));
  }

  /* ---- assets: structured address; street-only carryover ---- */
  {
    const dom = load('assets.html'); const doc = dom.window.document;
    await sleep(400);
    clickYes(dom, doc, 'realEstateTg', 0); await sleep(250);
    const card = doc.querySelector('#realEstateBlock .reitem');
    const labels = [...card.querySelectorAll('label')].map(l=>l.textContent.trim());
    assert('assets: address block has street/city/state/zip', labels.some(l=>l.startsWith('Property address'))&&labels.some(l=>l.startsWith('City'))&&labels.some(l=>l.startsWith('State'))&&labels.some(l=>l.startsWith('ZIP')), JSON.stringify(labels.slice(0,5)));
    const street = card.querySelector('input');
    street.value = '123 Main St';
    street.dispatchEvent(new dom.window.Event('input',{bubbles:true})); await sleep(150);
    const sec = JSON.parse(dom.window.sessionStorage.getItem('mcl_secured')||'{}');
    assert('assets: only street carries to mcl_secured', JSON.stringify(sec.properties)===JSON.stringify(['123 Main St']), JSON.stringify(sec.properties));
  }

  /* ================= DEBTS: no assets answered ================= */
  {
    const dom = load('debts.html'); const doc = dom.window.document;
    await sleep(400);
    assert('debts(clean): unsecured visible (T1 always)', visible(dom, doc, 'unsecured_statements') === true);
    for (const d of ['mortgage_statements','hoa_statements','other_secured_statements','vehicle_loan_statements','dso_docs','tax_notices','student_loan_statements','business_debt_statements'])
      assert(`debts(clean): ${d} hidden`, visible(dom, doc, d) === false, String(visible(dom,doc,d)));
    clickYes(dom, doc, 'dsoTg', 0); await sleep(250);
    assert('debts: dso_docs appears on support=Yes', visible(dom, doc, 'dso_docs') === true);
    clickYes(dom, doc, 'taxTg', 0); await sleep(250);
    assert('debts: tax_notices appears on backTaxes=Yes', visible(dom, doc, 'tax_notices') === true);
    clickYes(dom, doc, 'slTg', 0); await sleep(250);
    assert('debts: student_loan_statements appears on Yes', visible(dom, doc, 'student_loan_statements') === true);
    clickYes(dom, doc, 'bizDebtTg', 0); await sleep(250);
    assert('debts: business_debt_statements appears on Yes', visible(dom, doc, 'business_debt_statements') === true);
    clickYes(dom, doc, 'otherSecTg', 0); await sleep(250);
    assert('debts: other_secured_statements appears on Yes', visible(dom, doc, 'other_secured_statements') === true);
  }

  /* ================= DEBTS: carryover from assets ================= */
  {
    const dom = load('debts.html', null, {
      mcl_secured: JSON.stringify({properties:['123 Main St','456 Oak Ave'], vehicles:['2019 Honda Civic']}),
      mcl_doc_triggers: JSON.stringify({real_estate:'yes', vehicle:'yes', vehicle_financed:'yes'})
    });
    const doc = dom.window.document;
    await sleep(400);
    const heads = [...doc.querySelectorAll('.pp-head')].map(h=>h.textContent.trim());
    assert('debts(carry): two property panels with addresses', heads.filter(h=>h.startsWith('Your property ·')).length===2, JSON.stringify(heads));
    assert('debts(carry): vehicle panel labeled', heads.some(h=>h==='Your vehicle · 2019 Honda Civic'), JSON.stringify(heads));
    assert('debts(carry): mortgage_statements visible', visible(dom, doc, 'mortgage_statements') === true);
    assert('debts(carry): vehicle_loan_statements visible', visible(dom, doc, 'vehicle_loan_statements') === true);
    assert('debts(carry): hoa hidden until HOA=Yes', visible(dom, doc, 'hoa_statements') === false);
    assert('debts(carry): HOA toggle found+clicked', clickToggleByLabel(dom, doc, 'HOA', 0)); await sleep(250);
    assert('debts(carry): hoa_statements appears on HOA=Yes', visible(dom, doc, 'hoa_statements') === true);
  }

  /* ---- debts: answer-only fallback ---- */
  {
    const dom = load('debts.html', null, { mcl_doc_triggers: JSON.stringify({real_estate:'yes', vehicle_financed:'yes'}) });
    const doc = dom.window.document;
    await sleep(400);
    const heads = [...doc.querySelectorAll('.pp-head')].map(h=>h.textContent.trim());
    assert('debts(fallback): generic property panel appears', heads.some(h=>h.includes('add your address')), JSON.stringify(heads));
    assert('debts(fallback): generic vehicle panel appears', heads.some(h=>h.includes('add your vehicle details')), JSON.stringify(heads));
    assert('debts(fallback): mortgage_statements visible from answer alone', visible(dom, doc, 'mortgage_statements') === true);
  }

  /* ================= FINANCIAL AFFAIRS ================= */
  {
    const dom = load('financial-affairs.html'); const doc = dom.window.document;
    await sleep(400);
    assert('sofa: court_paperwork hidden by default', visible(dom, doc, 'court_paperwork') === false);
    // On-screen Q8 (Form 107 line 9): lawsuit/court action
    const q8 = doc.querySelector('.sofa-q[data-question="8"]');
    q8.querySelectorAll('.toggle span')[0].dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})); await sleep(250);
    assert('sofa: court_paperwork appears on Q8(lawsuit)=Yes', visible(dom, doc, 'court_paperwork') === true);
    q8.querySelectorAll('.toggle span')[1].dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})); await sleep(250);
    assert('sofa: court_paperwork hides on Q8=No', visible(dom, doc, 'court_paperwork') === false);
    const q9 = doc.querySelector('.sofa-q[data-question="9"]');
    q9.querySelectorAll('.toggle span')[0].dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})); await sleep(250);
    assert('sofa: court_paperwork appears on Q9(repo/garnish)=Yes (OR gate)', visible(dom, doc, 'court_paperwork') === true);
  }

  /* ================= PERSONAL: spouse docs ================= */
  {
    const dom = load('personal.html'); const doc = dom.window.document;
    await sleep(400);
    const spBtns = [...doc.querySelectorAll('.dbtn.spouse-doc')];
    assert('personal: 4 spouse doc buttons exist', spBtns.length===4, String(spBtns.length));
    assert('personal: spouse docs hidden by default', spBtns.every(b=>b.style.display==='none'));
    assert('personal: base docs visible', visible(dom, doc, 'id_license')===true && visible(dom, doc, 'tax_return_y1')===true);
  }

  /* ================= COUNSELING: attorney code copy ================= */
  {
    const dom = load('counseling.html'); const doc = dom.window.document;
    await sleep(100);
    const button = doc.getElementById('copyAttorneyCode');
    const link = doc.querySelector('.cs-go');
    assert('counseling: copy button exists', !!button);
    assert('counseling: copy button has an accessible label', button && button.getAttribute('aria-label') === 'Copy attorney code');
    assert('counseling: external class link remains protected', link && link.target === '_blank' && link.rel.includes('noopener'));
    let copied = '';
    Object.defineProperty(dom.window.navigator, 'clipboard', { configurable: true, value: { writeText: async value => { copied = value; } } });
    button.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    await sleep(50);
    assert('counseling: copy button writes the attorney code', copied === '449858', copied);
    assert('counseling: successful copy is announced', doc.getElementById('copyAttorneyCodeStatus').textContent === 'Copied');
  }

  /* ================= DOCUMENTS (step 8): clean session ================= */
  {
    const dom = load('documents.html'); const doc = dom.window.document; const win = dom.window;
    await sleep(400);
    assert('docs(clean): 4 tier-1 rows', doc.querySelectorAll('.row[data-tier="1"]').length===4);
    const t2 = [...doc.querySelectorAll('.row[data-tier="2"]')].map(r=>r.dataset.doc);
    assert('docs(clean): tier-2 = taxes + counseling only', JSON.stringify(t2)===JSON.stringify(['tax_return_y1','tax_return_y2','counseling_certificate']), JSON.stringify(t2));
    assert('docs(clean): derived list mentions no-real-estate skip', doc.getElementById('derivedList').textContent.includes('no real estate'));
    for (const r of doc.querySelectorAll('.row[data-tier="1"]')) r.querySelector('.btn-up').dispatchEvent(new win.MouseEvent('click',{bubbles:true}));
    await sleep(100);
    assert('docs(clean): progress 4 of 7 after t1 uploads', doc.getElementById('pcount').textContent.trim()==='4 of 7 resolved', doc.getElementById('pcount').textContent);
    doc.getElementById('submitBtn').dispatchEvent(new win.MouseEvent('click',{bubbles:true}));
    await sleep(50);
    assert('docs(clean): soft modal lists 3 open items', doc.getElementById('softList').children.length===3, String(doc.getElementById('softList').children.length));
  }

  /* ---- documents: summary reacts to persisted answers ---- */
  {
    const dom = load('documents.html', null, {
      mcl_doc_triggers: JSON.stringify({real_estate:'yes',behind_mortgage:'no',vehicle:'yes',vehicle_financed:'yes',employed:'yes',lawsuit:'yes',sp_employed:'yes',hoa:'yes'}),
      mcl_marital: 'Married'
    });
    const doc = dom.window.document;
    await sleep(400);
    const t2 = [...doc.querySelectorAll('.row[data-tier="2"]')].map(r=>r.dataset.doc);
    for (const want of ['pay_stubs','sp_pay_stubs','zillow_valuation','kbb_valuation','mortgage_statements','hoa_statements','vehicle_loan_statements','court_paperwork'])
      assert(`docs(seeded): row rendered for ${want}`, t2.includes(want), JSON.stringify(t2));
    assert('docs(seeded): no foreclosure row (not behind)', !t2.includes('foreclosure_docs'));
    const derived = doc.getElementById('derivedList').textContent;
    assert('docs(seeded): derived list does NOT claim no-real-estate', !derived.includes('no real estate'), derived);
    assert('docs(seeded): derived list does NOT claim filing individually', !derived.includes('individually'), derived);
  }

  /* ---- documents: joint filing pushes spouse docs ---- */
  {
    const dom = load('documents.html', null, {
      mcl_doc_triggers: JSON.stringify({joint:'yes'}),
      mcl_marital: 'Married'
    });
    const doc = dom.window.document;
    await sleep(400);
    const t1 = [...doc.querySelectorAll('.row[data-tier="1"]')].map(r=>r.dataset.doc);
    assert('docs(joint): spouse ID in tier 1', t1.includes('sp_id_license'), JSON.stringify(t1));
    assert('docs(joint): spouse SSN proof in tier 1', t1.includes('sp_ssn_proof'));
    assert('docs(joint): 6 tier-1 rows total', t1.length===6, String(t1.length));
    const t2 = [...doc.querySelectorAll('.row[data-tier="2"]')].map(r=>r.dataset.doc);
    assert('docs(joint): spouse tax returns in tier 2', t2.includes('sp_tax_return_y1')&&t2.includes('sp_tax_return_y2'), JSON.stringify(t2));
    assert('docs(joint): NO spouse bank stmts (joint accounts covered)', !t2.includes('sp_bank_statements'));
  }
  {
    const dom = load('documents.html', null, {
      mcl_doc_triggers: JSON.stringify({joint:'no'}),
      mcl_marital: 'Married'
    });
    const doc = dom.window.document;
    await sleep(400);
    const t1 = [...doc.querySelectorAll('.row[data-tier="1"]')].map(r=>r.dataset.doc);
    const t2 = [...doc.querySelectorAll('.row[data-tier="2"]')].map(r=>r.dataset.doc);
    assert('docs(married,not joint): no spouse T1 docs', !t1.includes('sp_id_license'));
    assert('docs(married,not joint): spouse bank stmts requested', t2.includes('sp_bank_statements'), JSON.stringify(t2));
    assert('docs(married,not joint): no spouse tax returns', !t2.includes('sp_tax_return_y1'));
  }

  /* ---- documents: title vs repo (mutually exclusive financed states) ---- */
  {
    const dom = load('documents.html', null, { mcl_doc_triggers: JSON.stringify({vehicle:'yes',vehicle_financed:'no'}) });
    const doc = dom.window.document; await sleep(400);
    const t2 = [...doc.querySelectorAll('.row[data-tier="2"]')].map(r=>r.dataset.doc);
    assert('docs(paid-off vehicle): title requested', t2.includes('vehicle_title'), JSON.stringify(t2));
    assert('docs(paid-off vehicle): no repo docs', !t2.includes('repo_docs'));
  }
  {
    const dom = load('documents.html', null, { mcl_doc_triggers: JSON.stringify({vehicle:'yes',vehicle_financed:'yes',behind_vehicle:'yes'}) });
    const doc = dom.window.document; await sleep(400);
    const t2 = [...doc.querySelectorAll('.row[data-tier="2"]')].map(r=>r.dataset.doc);
    assert('docs(behind on car): repo docs requested', t2.includes('repo_docs'), JSON.stringify(t2));
    assert('docs(behind on car): no title (financed)', !t2.includes('vehicle_title'));
  }

  /* ---- documents: stale joint flag without Married must NOT show spouse docs ---- */
  {
    const dom = load('documents.html', null, { mcl_doc_triggers: JSON.stringify({joint:'yes'}) }); /* no mcl_marital */
    const doc = dom.window.document; await sleep(400);
    const t1 = [...doc.querySelectorAll('.row[data-tier="1"]')].map(r=>r.dataset.doc);
    assert('docs(stale joint, not married): no spouse T1 docs', !t1.includes('sp_id_license') && t1.length===4, JSON.stringify(t1));
    const t2 = [...doc.querySelectorAll('.row[data-tier="2"]')].map(r=>r.dataset.doc);
    assert('docs(stale joint, not married): no spouse tax returns', !t2.includes('sp_tax_return_y1'));
  }

  /* ---- personal: switching away from Married clears joint ---- */
  {
    const dom = load('personal.html'); const doc = dom.window.document;
    await sleep(300);
    const sel = doc.getElementById('maritalSel');
    sel.value='Married'; sel.dispatchEvent(new dom.window.Event('change',{bubbles:true})); await sleep(200);
    doc.getElementById('jointTg').querySelectorAll('span')[0].dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})); await sleep(250);
    let trg = JSON.parse(dom.window.sessionStorage.getItem('mcl_doc_triggers')||'{}');
    assert('personal: joint=yes while Married', trg.joint==='yes');
    sel.value='Single'; sel.dispatchEvent(new dom.window.Event('change',{bubbles:true})); await sleep(250);
    trg = JSON.parse(dom.window.sessionStorage.getItem('mcl_doc_triggers')||'{}');
    assert('personal: joint cleared when no longer Married', trg.joint==='no', JSON.stringify(trg));
  }

  /* ---- personal: joint answer persists ---- */
  {
    const dom = load('personal.html'); const doc = dom.window.document;
    await sleep(300);
    const sel = doc.getElementById('maritalSel');
    sel.value='Married'; sel.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
    await sleep(200);
    const jt = doc.getElementById('jointTg');
    jt.querySelectorAll('span')[0].dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
    await sleep(250);
    const trg = JSON.parse(dom.window.sessionStorage.getItem('mcl_doc_triggers')||'{}');
    assert('personal: joint=yes persisted', trg.joint==='yes', JSON.stringify(trg));
  }

  /* ---- personal: REVISIT restores answers, storage survives (the bug Matt hit) ---- */
  {
    const dom = load('personal.html', null, { mcl_marital: 'Married', mcl_joint: 'yes' });
    const doc = dom.window.document; await sleep(500);
    assert('personal(revisit): marital select restored', doc.getElementById('maritalSel').value==='Married', doc.getElementById('maritalSel').value);
    assert('personal(revisit): spouse block visible', doc.getElementById('spouseBlock').style.display!=='none');
    const sp0 = doc.getElementById('jointTg').querySelectorAll('span')[0];
    assert('personal(revisit): joint toggle restored to Yes', sp0.classList.contains('on'));
    assert('personal(revisit): mcl_joint NOT clobbered', dom.window.sessionStorage.getItem('mcl_joint')==='yes', dom.window.sessionStorage.getItem('mcl_joint'));
    assert('personal(revisit): mcl_marital NOT clobbered', dom.window.sessionStorage.getItem('mcl_marital')==='Married', dom.window.sessionStorage.getItem('mcl_marital'));
    const trg = JSON.parse(dom.window.sessionStorage.getItem('mcl_doc_triggers')||'{}');
    assert('personal(revisit): doc_triggers joint stays yes', trg.joint==='yes', JSON.stringify(trg));
  }

  /* ---- SOFA: spouse columns appear with joint=yes once a question opens ---- */
  {
    const dom = load('financial-affairs.html', null, { mcl_joint: 'yes', mcl_marital: 'Married' });
    const doc = dom.window.document; await sleep(400);
    // answer on-screen Q3 (income) Yes and check its spouse block becomes visible
    const q3 = doc.querySelector('.sofa-q[data-question="3"]');
    q3.querySelectorAll('.toggle span')[0].dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
    await sleep(250);
    const spouseEls = [...doc.querySelectorAll('.spouse-only,.spouse-addr-col')];
    const anyVisible = spouseEls.some(el => { let e=el; while(e&&e.tagName!=='BODY'){ if(e.style&&e.style.display==='none')return false; e=e.parentElement; } return true; });
    assert('sofa(joint): spouse/D2 block visible after answering Yes', anyVisible, String(spouseEls.length)+' spouse els');
  }
  {
    const dom = load('financial-affairs.html', null, { mcl_joint: 'no' });
    const doc = dom.window.document; await sleep(400);
    const q3 = doc.querySelector('.sofa-q[data-question="3"]');
    q3.querySelectorAll('.toggle span')[0].dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
    await sleep(250);
    const spouseEls = [...doc.querySelectorAll('.spouse-only,.spouse-addr-col')];
    const anyVisible = spouseEls.some(el => { let e=el; while(e&&e.tagName!=='BODY'){ if(e.style&&e.style.display==='none')return false; e=e.parentElement; } return true; });
    assert('sofa(not joint): spouse/D2 blocks stay hidden', !anyVisible);
  }

  console.log(`\n=== DYNAMIC SIMULATION: ${pass} passed, ${fail} failed ===`);
  failures.forEach(f=>console.log('FAIL: '+f));
  process.exit(fail?1:0);
})().catch(e=>{ console.error('HARNESS ERROR:', e.stack || e.message); process.exit(2); });
