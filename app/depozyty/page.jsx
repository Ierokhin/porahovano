import DepositsTable from './DepositsTable';
import depositsData from '@/public/data/deposits.json';

export const metadata = {
  title: 'Депозити в Україні 2026 | Porahovano',
  description:
    'Порівняй депозитні ставки топ-20 банків України після 19.5% податку. Реальна дохідність — чесно.',
};

export default function DepozytyPage() {
  const { uah, eur, updated } = depositsData;

  // Top rate for hero block (first visible UAH bank with a rate)
  const topBank = uah
    .filter((b) => b.visible && b.rate12m !== null)
    .sort((a, b) => b.rate12m - a.rate12m)[0];

  const topAfterTax = topBank
    ? Math.round(topBank.rate12m * (1 - 0.195) * 10) / 10
    : null;

  return (
    <main className="page-deposits">
      {/* Hero */}
      <section className="hero">
        <h1>Депозити в Україні</h1>
        <p className="hero-sub">
          Порівняй реальну дохідність після 19.5% податку (18% ПДФО&nbsp;+&nbsp;1.5% ВЗ)
        </p>
        {topBank && (
          <div className="hero-top-rate">
            <span className="hero-label">Найкраща ставка зараз</span>
            <span className="hero-rate">{topAfterTax}%</span>
            <span className="hero-bank">після податку · {topBank.bank}</span>
          </div>
        )}
      </section>

      {/* Info strip */}
      <section className="info-strip">
        <div className="info-item">
          <span className="info-icon">🛡️</span>
          <div>
            <strong>Гарантія ФГВФО</strong>
            <p>
              Держава гарантує до <strong>600&nbsp;000&nbsp;₴</strong> на рахунок у кожному банку.{' '}
              <a
                href="https://www.fg.gov.ua/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Реєстр банків-учасників →
              </a>
            </p>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icon">📊</span>
          <div>
            <strong>Податок 19.5%</strong>
            <p>
              З доходу по депозиту утримується 18% ПДФО&nbsp;+&nbsp;1.5% військовий збір.
              Всі ставки в таблиці вже з урахуванням цього.
            </p>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icon">🏦</span>
          <div>
            <strong>Топ-20 за активами</strong>
            <p>
              Список банків — за даними НБУ на поточний квартал.
            </p>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="deposits-section">
        <DepositsTable uah={uah} eur={eur} updated={updated} />
      </section>

      {/* Tax comparison block */}
      <section className="tax-compare">
        <h2>Чому ставка в рекламі відрізняється від реальної?</h2>
        <div className="compare-grid">
          <div className="compare-card">
            <p className="compare-label">Ставка банку</p>
            <p className="compare-value">16%</p>
          </div>
          <div className="compare-arrow">→</div>
          <div className="compare-card highlight">
            <p className="compare-label">Ви отримаєте</p>
            <p className="compare-value">12.9%</p>
          </div>
        </div>
        <p className="compare-note">
          З кожних 16 грн доходу 3.1 грн забирає держава. Porahovano показує тільки те, що залишається у вас.
        </p>
      </section>

      {/* CTA */}
      <section className="cta-block">
        <h2>Порахуй свій капітал</h2>
        <p>Додай депозит до калькулятора і порівняй з ОВДП та НПФ</p>
        <a href="/kalkulator" className="btn-primary">
          Відкрити калькулятор →
        </a>
      </section>
    </main>
  );
}
