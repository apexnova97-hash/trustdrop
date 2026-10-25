// lib/widgetHtml.js — renders the public TrustDrop widget page. Pure functions, no dependencies.
const WIDGET_CSS = `.td-w{--navy:#0d1b3d;--mute:#6b7690;--line:#e9e5dc;--blue:#0b5fff;--blue2:#5b94ff;--bg:#fbf9f5;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--navy);background:var(--bg);padding:18px;color-scheme:light;line-height:1.5;-webkit-font-smoothing:antialiased}
.td-w *{box-sizing:border-box}
.td-w h2,.td-w h3,.td-w p{margin:0}
.td-head{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:center;gap:14px 20px;flex-wrap:wrap;padding:18px 20px;background:#fff radial-gradient(130% 160% at 100% 0%,rgba(91,148,255,.30),rgba(91,148,255,0) 58%);border:1px solid var(--line);border-radius:16px}
.td-biz{display:flex;align-items:center;gap:12px;min-width:0}
.td-mark{flex:none;width:36px;height:36px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg,var(--blue2),var(--blue) 60%,#2a3dff);box-shadow:0 6px 14px -6px rgba(11,95,255,.6)}
.td-mark svg{width:18px;height:18px;fill:#fff}
.td-biz h2{font-family:"Space Grotesk",Inter,sans-serif;font-size:19px;font-weight:700;letter-spacing:-.01em;overflow-wrap:anywhere}
.td-biz p{font-size:13px;color:var(--mute)}
.td-score{display:flex;align-items:baseline;gap:6px;white-space:nowrap}
.td-score b{font-family:"Space Grotesk",Inter,sans-serif;font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1}
.td-score span{font-size:13px;color:var(--mute)}
.td-score .td-stars{margin-left:4px;font-size:14px}
.td-count{display:inline-block;margin-top:2px;font-size:12px;color:var(--mute)}
.td-stars{color:#f5a524;letter-spacing:1px;white-space:nowrap}
.td-stars i{font-style:normal;color:#ddd7c9}
.td-list{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:10px}
.td-card{display:grid;grid-template-columns:40px 1fr;gap:12px;padding:14px 16px;background:#fff;border:1px solid var(--line);border-radius:14px}
.td-av{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;font-family:"Space Grotesk",Inter,sans-serif;font-size:13px;font-weight:700}
.td-top{display:flex;flex-wrap:wrap;align-items:center;gap:2px 8px}
.td-top h3{font-size:14px;font-weight:600}
.td-top time{font-size:12px;color:var(--mute)}
.td-top .td-stars{font-size:12px}
.td-text{margin-top:6px;font-size:14.5px;color:#1c2a4d;overflow-wrap:anywhere}
.td-ver{display:flex;align-items:center;gap:6px;margin-top:10px;font-size:12px;color:var(--mute)}
.td-ver svg{width:14px;height:14px;stroke:#1f9d5c;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.td-foot{margin-top:14px;text-align:center;font-size:12px;color:var(--mute)}
.td-foot a{color:var(--navy);font-weight:600;text-decoration:none}
.td-foot a:hover{text-decoration:underline}
.td-state{margin-top:12px;padding:34px 20px;text-align:center;background:#fff;border:1px solid var(--line);border-radius:14px}
.td-ico{width:48px;height:48px;margin:0 auto 12px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,#e6efff,#f1ebff)}
.td-ico svg{width:22px;height:22px;stroke:var(--blue);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.td-state h3{font-family:"Space Grotesk",Inter,sans-serif;font-size:17px;font-weight:700}
.td-state p{margin:4px auto 0;max-width:34ch;font-size:13.5px;color:var(--mute)}
.td-btn{margin-top:14px;padding:9px 18px;border:0;border-radius:999px;background:linear-gradient(135deg,var(--blue2),var(--blue));color:#fff;font:600 13px Inter,sans-serif;cursor:pointer}
.td-btn:focus-visible,.td-foot a:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.td-sk{border-radius:8px;background:linear-gradient(90deg,#f1ede4 25%,#faf7f0 50%,#f1ede4 75%);background-size:200% 100%;animation:tdsh 1.3s linear infinite}
@keyframes tdsh{to{background-position:-200% 0}}
@media (prefers-reduced-motion:reduce){.td-sk{animation:none}}
@media (max-width:480px){.td-w{padding:12px}.td-head{padding:16px}.td-card{grid-template-columns:34px 1fr;padding:12px 14px}.td-av{width:34px;height:34px;font-size:12px}}
`;

function tdEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
var TD_TONES = [['#e6efff', '#2a62d9'], ['#efe9ff', '#6a4bd8'], ['#e3f6ec', '#1f9d5c'], ['#fff1de', '#c9741a']];
var TD_STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>';
var TD_CHECK = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/></svg>';

function tdInitials(name) {
  var p = String(name || '?').trim().split(/\s+/);
  var a = Array.from(p[0] || '?')[0];
  var b = p.length > 1 ? Array.from(p[p.length - 1])[0] : '';
  return (a + b).toUpperCase();
}
function tdStars(n) {
  n = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  return '<span class="td-stars" role="img" aria-label="' + n + ' out of 5 stars">' +
    '\u2605'.repeat(n) + '<i>' + '\u2605'.repeat(5 - n) + '</i></span>';
}
function tdDate(d) {
  var t = new Date(d);
  return isNaN(t) ? '' : t.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
function tdState(icon, title, text, action) {
  return '<div class="td-state"><div class="td-ico">' + icon + '</div><h3>' + title + '</h3><p>' + text + '</p>' + (action || '') + '</div>';
}
var TD_ICON_STAR = '<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8z"/></svg>';
var TD_ICON_WARN = '<svg viewBox="0 0 24 24"><path d="M12 8v5M12 16.5v.01"/><path d="M10.3 3.9L2.4 17.5A2 2 0 004.1 20.5h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/></svg>';

/* data: { state: 'ready' | 'loading' | 'error' | 'notFound', businessName, reviews: [{ name, rating, text, date }] } */
function renderWidget(data) {
  var biz = tdEsc(data.businessName || 'this business');
  var head, body;
  if (data.state === 'loading') {
    head = '<header class="td-head" aria-busy="true"><div class="td-biz"><span class="td-mark">' + TD_STAR + '</span><div><div class="td-sk" style="width:150px;height:18px"></div><div class="td-sk" style="width:110px;height:12px;margin-top:8px"></div></div></div><div class="td-sk" style="width:90px;height:30px"></div></header>';
    var sk = '<li class="td-card"><div class="td-sk" style="width:40px;height:40px"></div><div><div class="td-sk" style="width:55%;height:14px"></div><div class="td-sk" style="width:95%;height:12px;margin-top:10px"></div><div class="td-sk" style="width:70%;height:12px;margin-top:6px"></div></div></li>';
    body = '<ul class="td-list">' + sk + sk + sk + '</ul>';
  } else if (data.state === 'notFound') {
    head = '';
    body = tdState(TD_ICON_WARN, 'Widget not found', 'This TrustDrop widget link is invalid or the business is unavailable.');
  } else if (data.state === 'error') {
    head = '';
    body = tdState(TD_ICON_WARN, 'Reviews couldn\u2019t load', 'Check your connection and try again. Your page is unaffected.', '<button type="button" class="td-btn" data-td-retry>Try again</button>');
  } else {
    var rs = data.reviews || [];
    var avg = rs.length ? (rs.reduce(function (s, r) { return s + (Number(r.rating) || 0); }, 0) / rs.length) : 0;
    head = '<header class="td-head"><div class="td-biz"><span class="td-mark">' + TD_STAR + '</span><div><h2>' + biz + '</h2><p>Verified customer reviews</p></div></div>' +
      (rs.length ? '<div><div class="td-score"><b>' + avg.toFixed(1) + '</b><span>/ 5</span>' + tdStars(avg) + '</div><span class="td-count">' + rs.length + (rs.length === 1 ? ' review' : ' reviews') + '</span></div>' : '') + '</header>';
    body = rs.length ? '<ul class="td-list">' + rs.map(function (r, i) {
      var tone = TD_TONES[i % TD_TONES.length];
      var d = tdDate(r.date);
      return '<li class="td-card"><div class="td-av" style="background:' + tone[0] + ';color:' + tone[1] + '">' + tdEsc(tdInitials(r.name)) + '</div><div>' +
        '<div class="td-top"><h3>' + tdEsc(r.name) + '</h3>' + tdStars(r.rating) + (d ? '<time datetime="' + tdEsc(r.date) + '">' + d + '</time>' : '') + '</div>' +
        '<p class="td-text">' + tdEsc(r.text) + '</p><div class="td-ver">' + TD_CHECK + 'Verified customer</div></div></li>';
    }).join('') + '</ul>' : tdState(TD_ICON_STAR, 'No reviews yet', 'Approved reviews from ' + biz + ' customers will appear here.');
  }
  return '<div class="td-w">' + head + body + '<p class="td-foot">Powered by <a href="https://trustdrop-lac.vercel.app" target="_blank" rel="noopener">TrustDrop</a></p></div>';
}

export function renderWidgetDocument(data) {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Customer reviews</title><link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap">' +
    '<style>html,body{margin:0;background:#fbf9f5}' + WIDGET_CSS + '</style></head><body>' + renderWidget(data) +
    '<script>document.addEventListener("click",function(e){if(e.target.closest("[data-td-retry]"))location.reload()})</script></body></html>';
}
