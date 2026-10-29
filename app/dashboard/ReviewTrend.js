'use client'

const RANGES = [
  ['day', 'Days'],
  ['week', 'Weeks'],
  ['month', 'Months'],
]

function rangeLabel(range) {
  if (range === 'day') return '30 days'
  if (range === 'week') return '12 weeks'
  return '12 months'
}

export default function ReviewTrend({
  series,
  peak,
  total,
  range,
  onRangeChange,
  product,
  onProductChange,
  products = [],
  reduced,
  delay = 0,
}) {
  return (
    <section className="tdd-card tdd-rise" style={{ animationDelay: delay + 's' }}>
      <div className="tdd-chart-head">
        <div>
          <p className="tdd-chart-title">Reviews over time</p>
          <p className="tdd-chart-sub">
            {total === 0
              ? 'No reviews in this period yet'
              : total + ' review' + (total === 1 ? '' : 's') + ' in the last ' + rangeLabel(range)}
          </p>
        </div>
        <div className="tdd-chart-controls">
          <div className="tdd-select-wrap">
            <select
              className="tdd-select"
              value={product}
              onChange={(e) => onProductChange(e.target.value)}
              aria-label="Filter by product"
            >
              <option value="all">All products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 9 6 6 6-6" stroke="#8391A2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="tdd-seg">
            {RANGES.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={'tdd-seg-btn' + (range === value ? ' is-on' : '')}
                onClick={() => onRangeChange(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tdd-bars" key={range + ':' + product}>
        {series.map((b, i) => (
          <div
            key={i}
            className="tdd-bar-col"
            title={b.full + ': ' + b.count + ' review' + (b.count === 1 ? '' : 's')}
          >
            <span className={'tdd-bar-count' + (b.count ? '' : ' is-empty')}>{b.count}</span>
            <div
              className={'tdd-bar' + (b.count ? '' : ' is-empty')}
              style={{
                height: b.count ? Math.max(8, (b.count / peak) * 100) + '%' : 3,
                animationDelay: reduced ? '0s' : (i * 0.012) + 's',
                transition: reduced ? 'none' : undefined,
              }}
            />
          </div>
        ))}
      </div>

      <div className="tdd-bar-labels" key={'labels' + range}>
        {series.map((b, i) => {
          const hide = series.length >= 20 ? i % 7 !== 0 : series.length > 8 && i % 2 !== 0
          return (
            <div key={i} className="tdd-bar-label">
              {hide ? '' : b.label}
            </div>
          )
        })}
      </div>
    </section>
  )
}
