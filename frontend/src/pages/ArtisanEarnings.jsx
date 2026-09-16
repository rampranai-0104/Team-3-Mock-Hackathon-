import React, { useState } from 'react';
import {
  Download,
  ShieldCheck,
  CheckCircle2,
  PieChart,
  Landmark,
} from 'lucide-react';
import { EARNINGS_DATA } from '../data/artisanMockData';

export default function ArtisanEarnings() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('50000');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setShowWithdrawModal(false);
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 4000);
  };

  const handleDownloadPdf = () => {
    alert('Generating Official Tax Receipt & Disbursal Ledger PDF with Tvarita Fair Trade Seal...');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Header & Disbursal Action */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Direct Bank Payouts Ledger &amp; Earnings
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Zero platform commission deduction. Every rupee transferred directly to your verified artisan bank account.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowWithdrawModal(true)}
          >
            <Landmark size={18} />
            <span>Withdraw to Bank</span>
          </button>

          <button
            type="button"
            className="btn-surface"
            onClick={handleDownloadPdf}
          >
            <Download size={18} />
            <span>Download Statement (PDF)</span>
          </button>
        </div>
      </div>

      {withdrawSuccess && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CheckCircle2 size={20} />
          <span>Disbursal request of ₹{Number(withdrawAmount).toLocaleString()} submitted to {EARNINGS_DATA.bankName}! IMPS confirmation SMS dispatched.</span>
        </div>
      )}

      {/* 4 Financial KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div style={{ padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'var(--color-surface-container-lowest)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
            Total Earnings (All Time)
          </span>
          <div className="font-display-hero" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>
            {EARNINGS_DATA.totalEarnings}
          </div>
          <p className="font-body-sm" style={{ color: 'var(--color-secondary)', fontWeight: 600, marginTop: '4px' }}>
            ✓ 0% Platform Commission
          </p>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'var(--color-surface-container-lowest)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
            This Month Payouts
          </span>
          <div className="font-display-hero" style={{ color: 'var(--color-secondary)', marginTop: '4px' }}>
            {EARNINGS_DATA.thisMonthEarnings}
          </div>
          <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
            From 2 cleared sales
          </p>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'var(--color-surface-container-lowest)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
            Pending Payments
          </span>
          <div className="font-display-hero" style={{ color: 'var(--color-primary)', marginTop: '4px' }}>
            {EARNINGS_DATA.pendingPayments}
          </div>
          <p className="font-body-sm" style={{ color: 'var(--color-primary)', fontWeight: 600, marginTop: '4px' }}>
            IIT Bombay Honorarium in processing
          </p>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'var(--color-surface-container-lowest)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
            Withdrawable Balance
          </span>
          <div className="font-display-hero" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>
            {EARNINGS_DATA.withdrawableBalance}
          </div>
          <p className="font-body-sm" style={{ color: 'var(--color-secondary)', fontWeight: 600, marginTop: '4px' }}>
            Ready for instant bank credit
          </p>
        </div>
      </div>

      {/* Transparency Banner from artist.html with Fictional Bank Data */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '1rem',
          backgroundColor: 'rgba(209, 229, 212, 0.45)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span
            style={{
              padding: '10px',
              borderRadius: '0.75rem',
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-on-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={24} />
          </span>
          <div>
            <div className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
              Tvarita Ethical Art Protocol Guaranteed
            </div>
            <div className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              Platform Commission: <strong>0.0%</strong> • Payment Gateway Fees: Sponsored by Tribal Culture Ministry Trust
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
            Verified Fictional Account Details
          </div>
          <div className="font-title-md" style={{ color: 'var(--color-on-surface)', fontWeight: 700 }}>
            {EARNINGS_DATA.bankName}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-outline)' }}>
            {EARNINGS_DATA.accountMasked} • {EARNINGS_DATA.ifscMasked}
          </div>
        </div>
      </div>

      {/* Income Breakdown Visual Chart/Bars */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          padding: '1.5rem',
          borderRadius: '1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChart size={20} color="var(--color-primary)" />
          <h2 className="font-title-lg">Income Source Breakdown</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {EARNINGS_DATA.incomeBreakdown.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{item.label}</span>
                <span style={{ color: 'var(--color-outline)' }}>
                  {item.amount} ({item.percentage}%)
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-surface-container-high)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    backgroundColor: idx === 0 ? 'var(--color-primary)' : idx === 1 ? 'var(--color-secondary)' : 'var(--color-tertiary)',
                    borderRadius: '9999px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ledger Transactions Table from artist.html */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-surface-container)' }}>
          <h2 className="font-title-lg">Disbursal History &amp; Transaction Ledger</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead
              style={{
                backgroundColor: 'var(--color-surface-container-low)',
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                color: 'var(--color-outline)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <tr>
                <th style={{ padding: '1rem' }}>Transaction ID &amp; Date</th>
                <th style={{ padding: '1rem' }}>Source / Collector</th>
                <th style={{ padding: '1rem' }}>Artwork Title</th>
                <th style={{ padding: '1rem' }}>Buyer Paid</th>
                <th style={{ padding: '1rem' }}>Deduction</th>
                <th style={{ padding: '1rem' }}>Net Payout to Bank</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px', color: 'var(--color-on-surface)' }}>
              {EARNINGS_DATA.transactions.map((txn, index) => (
                <tr
                  key={txn.id}
                  style={{
                    borderTop: index > 0 ? '1px solid var(--color-surface-container)' : 'none',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700 }}>{txn.id}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-outline)' }}>{txn.date}</div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{txn.collector}</td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                    {txn.title}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{txn.buyerPaid}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-secondary)', fontWeight: 700 }}>
                    {txn.deduction}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--color-secondary)', fontSize: '15px' }}>
                    {txn.netPayout}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      className="badge-secondary"
                      style={{ fontSize: '10px', textTransform: 'none', fontWeight: 700 }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }} />
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal Drawer */}
      {showWithdrawModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(27, 28, 24, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              borderRadius: '1.5rem',
              padding: '2rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <h3 className="font-headline-sm">बँक खात्यात पैसे पाठवा</h3>
            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              Transfer your retained earnings directly to verified bank account <strong>{EARNINGS_DATA.accountMasked}</strong>.
            </p>

            <form onSubmit={handleWithdrawSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                  Withdraw Amount (₹)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  max={120000}
                  min={1000}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--color-outline-variant)',
                    backgroundColor: 'var(--color-surface-container-low)',
                    fontSize: '18px',
                    fontWeight: 700,
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--color-outline)', marginTop: '2px', display: 'block' }}>
                  Available withdrawable balance: {EARNINGS_DATA.withdrawableBalance}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn-surface"
                  onClick={() => setShowWithdrawModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Confirm Instant Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
