'use client';

import { useState } from 'react';

const TAX_RATE = 0.195; // 18% ПДФО + 1.5% ВЗ

function calcAfterTax(rate) {
  if (rate === null || rate === undefined) return null;
  return Math.round(rate * (1 - TAX_RATE) * 10) / 10;
}

function formatAmount(amount) {
  if (!amount) return '—';
  return amount.toLocaleString('uk-UA') + ' ₴';
}

export default function DepositsTable({ uah, eur, updated }) {
  const [currency, setCurrency] = useState('uah');

  const rawData = currency === 'uah' ? uah : eur;

  const data = rawData
    .filter((b) => b.visible)
    .map((b) => ({ ...b, afterTax: calcAfterTax(b.rate12m) }))
    .sort((a, b) => {
      // null rates go to the bottom
      if (a.rate12m === null && b.rate12m === null) return a.assetsRank - b.assetsRank;
      if (a.rate12m === null) return 1;
      if (b.rate12m === null) return -1;
      return b.rate12m - a.rate12m;
    });

  return (
    <div>
      {/* Currency toggle */}
      <div className="currency-toggle">
        <button
          className={currency === 'uah' ? 'active' : ''}
          onClick={() => setCurrency('uah')}
        >
          UAH ₴
        </button>
        <button
          className={currency === 'eur' ? 'active' : ''}
          onClick={() => setCurrency('eur')}
          disabled={eur.length === 0}
        >
          EUR €
        </button>
      </div>

      {/* Updated date */}
      <p className="updated-date">Оновлено: {updated}</p>

      {/* Table */}
      <div className="table-wrapper">
        <table className="deposits-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Банк</th>
              <th>Ставка 12 міс</th>
              <th>Після 19.5% податку</th>
              <th>Мін. сума</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((bank, index) => (
              <tr key={bank.id} className={bank.rate12m === null ? 'row-empty' : ''}>
                <td className="col-rank">{index + 1}</td>
                <td className="col-bank">{bank.bank}</td>
                <td className="col-rate">
                  {bank.rate12m !== null ? (
                    <strong>{bank.rate12m}%</strong>
                  ) : (
                    <span className="rate-unknown">—</span>
                  )}
                </td>
                <td className="col-after-tax">
                  {bank.afterTax !== null ? (
                    <span className="after-tax">{bank.afterTax}%</span>
                  ) : (
                    <span className="rate-unknown">—</span>
                  )}
                </td>
                <td className="col-min">{formatAmount(bank.minAmount)}</td>
                <td className="col-action">
                  <a
                    href={bank.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-open"
                  >
                    Відкрити →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EUR placeholder */}
      {currency === 'eur' && eur.length === 0 && (
        <p className="eur-placeholder">Ставки в EUR з'являться незабаром</p>
      )}
    </div>
  );
}
