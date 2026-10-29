// lib/widgetHtml.js — premium public TrustDrop review widget renderer.
const WIDGET_CSS = `.td-w{
  --td-navy:#0d1b3d;
  --td-ink:#182747;
  --td-muted:#6b7690;
  --td-faint:#8994a9;
  --td-line:#dce7f5;
  --td-blue:#0b5fff;
  --td-blue2:#5b94ff;
  --td-blue-soft:#eaf1ff;
  --td-gold:#f5a524;
  --td-green:#1f9d5c;
  --td-cream:#f5f9ff;
  position:relative;
  isolation:isolate;
  width:100%;
  max-width:980px;
  margin:0 auto;
  padding:clamp(10px,2.4vw,22px);
  color:var(--td-navy);
  background:var(--td-cream);
  color-scheme:light;
  font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  line-height:1.55;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
  overflow-wrap:anywhere;
}
.td-w *{box-sizing:border-box}
.td-w h1,.td-w h2,.td-w h3,.td-w p{margin:0}
.td-w button,.td-w a{font:inherit}
.td-w a{color:inherit}
.td-head{
  position:relative;
  isolation:isolate;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:18px 24px;
  flex-wrap:wrap;
  padding:clamp(17px,2.8vw,25px);
  overflow:hidden;
  border:1px solid rgba(206,220,244,.95);
  border-radius:22px;
  background:linear-gradient(130deg,#fff 0%,#fff 38%,#f4f7ff 100%);
  box-shadow:0 8px 26px rgba(13,27,61,.045),0 1px 2px rgba(13,27,61,.035);
  animation:td-enter .55s cubic-bezier(.16,1,.3,1) both;
}
.td-head:before{
  position:absolute;z-index:-1;content:"";width:270px;height:210px;right:-95px;top:-120px;
  border-radius:50%;background:radial-gradient(circle,rgba(91,148,255,.26),rgba(91,148,255,0) 70%);
  animation:td-glow 16s ease-in-out infinite alternate;
}
.td-head:after{
  position:absolute;z-index:-1;content:"";width:180px;height:140px;left:25%;bottom:-115px;
  border-radius:50%;background:radial-gradient(circle,rgba(183,166,255,.13),rgba(183,166,255,0) 72%);
}
.td-biz{display:flex;align-items:center;gap:13px;flex:1 1 220px;min-width:0}
.td-mark{
  display:grid;place-items:center;flex:none;width:44px;height:44px;border-radius:14px;
  background:linear-gradient(140deg,#70a4ff 0%,#0b5fff 58%,#373dff 100%);
  box-shadow:0 8px 18px -7px rgba(11,95,255,.65),inset 0 1px 0 rgba(255,255,255,.45);
  position:relative;overflow:hidden;
}
.td-mark:after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 25%,rgba(255,255,255,.22) 48%,transparent 70%);transform:translateX(-120%);animation:td-sheen 7s ease-in-out infinite}
.td-mark svg{position:relative;z-index:1;width:21px;height:21px;fill:#fff;filter:drop-shadow(0 1px 2px rgba(0,30,100,.16))}
.td-brand-copy{min-width:0}
.td-eyebrow{display:flex;align-items:center;gap:7px;margin-bottom:2px!important;color:var(--td-blue);font-family:"Caveat",cursive;font-size:16px;font-weight:600;letter-spacing:0;text-transform:none;line-height:1.1}
.td-eyebrow:before{content:"";width:14px;height:2px;border-radius:2px;background:linear-gradient(90deg,var(--td-blue2),var(--td-blue))}
.td-biz h2{font-family:"Space Grotesk",Inter,system-ui,sans-serif;font-size:clamp(19px,2.2vw,25px);line-height:1.18;font-weight:700;letter-spacing:-.045em;color:var(--td-navy);overflow-wrap:anywhere}
.td-biz p.td-subtitle{margin-top:5px!important;color:var(--td-muted);font-size:12.5px;line-height:1.45}
.td-scorebox{
  position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;
  flex:0 1 auto;min-width:145px;padding:2px 0 2px 21px;border-left:1px solid rgba(216,225,241,.95);
  animation:td-enter .6s cubic-bezier(.16,1,.3,1) .08s both;
}
.td-scoreline{display:flex;align-items:baseline;gap:5px}
.td-scoreline b{font-family:"Space Grotesk",Inter,system-ui,sans-serif;font-size:clamp(29px,3.5vw,37px);font-weight:700;letter-spacing:-.065em;line-height:1;color:var(--td-navy);font-variant-numeric:tabular-nums}
.td-scoreline span{font-size:12px;color:var(--td-muted)}
.td-score-stars{margin-top:7px}
.td-count{display:block;margin-top:3px;color:var(--td-muted);font-size:11.5px}
.td-stars{display:inline-flex;align-items:center;gap:1px;color:var(--td-gold);white-space:nowrap;font-size:13px;letter-spacing:0}
.td-stars i{font-style:normal;color:#dcd7ca}
.td-list{list-style:none;margin:14px 0 0;padding:0;display:grid;grid-template-columns:1fr;gap:11px}
.td-card{
  position:relative;display:grid;grid-template-columns:43px minmax(0,1fr);align-items:start;gap:13px;
  min-width:0;padding:17px 18px;border:1px solid rgba(221,225,234,.92);border-radius:17px;
  background:linear-gradient(145deg,#fff 0%,#fff 68%,#fdfcff 100%);
  box-shadow:0 1px 2px rgba(13,27,61,.035),0 4px 8px rgba(13,27,61,.035),0 12px 24px -12px rgba(13,27,61,.16),inset 0 1px 0 rgba(255,255,255,.95);
  transition:transform .23s cubic-bezier(.16,1,.3,1),border-color .23s ease,box-shadow .23s ease,background-color .23s ease;
  animation:td-card-in .48s cubic-bezier(.16,1,.3,1) both;
  animation-delay:var(--td-delay,0ms);
}
.td-av{
  display:grid;place-items:center;flex:none;width:43px;height:43px;border-radius:14px;
  font-family:"Space Grotesk",Inter,system-ui,sans-serif;font-size:12px;font-weight:700;letter-spacing:-.02em;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.72);
}
.td-review-main{min-width:0}
.td-top{display:flex;flex-wrap:wrap;align-items:center;gap:5px 9px;min-width:0}
.td-top h3{min-width:0;color:var(--td-ink);font-size:14px;font-weight:700;letter-spacing:-.015em;line-height:1.45;overflow-wrap:anywhere}
.td-top time{color:var(--td-faint);font-size:11px;white-space:nowrap}
.td-review-stars{margin-top:5px}
.td-text{margin-top:9px!important;color:#34425f;font-size:14px;line-height:1.75;overflow-wrap:anywhere;word-break:break-word;white-space:pre-wrap}
.td-ver{display:flex;align-items:center;gap:6px;margin-top:11px!important;color:var(--td-muted);font-size:10.5px;font-weight:600}
.td-ver svg{width:15px;height:15px;flex:none;stroke:var(--td-green);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.td-ver .td-ver-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border:1px solid #d8efe1;border-radius:999px;background:#f3fbf6;color:#278452}
.td-ver .td-ver-pill svg{width:11px;height:11px}
.td-foot{display:flex;justify-content:center;align-items:center;gap:5px;margin-top:15px!important;padding:3px 0 1px;color:var(--td-muted);font-family:"Caveat",cursive;font-size:15px;letter-spacing:0}
.td-foot a{color:var(--td-navy);font-family:"Pacifico",cursive;font-size:15px;font-weight:400;text-decoration:none;transition:color .18s ease}
.td-foot a:hover{color:var(--td-blue);text-decoration:underline;text-underline-offset:3px}
.td-foot .td-foot-mark{display:inline-grid;place-items:center;width:17px;height:17px;margin-right:2px;border-radius:5px;background:linear-gradient(135deg,#5b94ff,#0b5fff);color:#fff;font-size:10px}
.td-state{
  position:relative;margin-top:14px;padding:clamp(28px,5vw,42px) 20px;text-align:center;
  border:1px solid rgba(220,227,239,.95);border-radius:19px;
  background:radial-gradient(100% 140% at 50% 0%,rgba(91,148,255,.10),transparent 64%),#fff;
  box-shadow:0 2px 4px rgba(13,27,61,.025),0 10px 24px -10px rgba(13,27,61,.15),0 22px 44px -28px rgba(13,27,61,.18),inset 0 1px 0 rgba(255,255,255,.95);
  animation:td-enter .45s cubic-bezier(.16,1,.3,1) both;
}
.td-ico{display:grid;place-items:center;width:50px;height:50px;margin:0 auto 14px;border:1px solid #dce7ff;border-radius:16px;background:linear-gradient(135deg,#e6efff,#f1ebff);box-shadow:0 3px 6px rgba(11,95,255,.06),0 9px 20px -8px rgba(11,95,255,.22),inset 0 1px 0 rgba(255,255,255,.9)}
.td-ico svg{width:23px;height:23px;stroke:var(--td-blue);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.td-state h3{font-family:"Great Vibes",cursive;color:var(--td-navy);font-size:30px;font-weight:400;letter-spacing:0;line-height:1.1}
.td-state p{margin:6px auto 0!important;max-width:36ch;color:var(--td-muted);font-size:13px;line-height:1.7}
.td-btn{display:inline-flex;align-items:center;justify-content:center;min-height:39px;margin-top:16px;padding:10px 18px;border:1px solid rgba(255,255,255,.35);border-radius:999px;background:linear-gradient(135deg,var(--td-blue2),var(--td-blue) 72%);box-shadow:0 7px 18px -8px rgba(11,95,255,.62);color:#fff;font:700 12.5px Inter,system-ui,sans-serif;cursor:pointer;transition:transform .2s cubic-bezier(.16,1,.3,1),box-shadow .2s ease,filter .2s ease}
.td-btn:focus-visible,.td-foot a:focus-visible{outline:3px solid rgba(11,95,255,.35);outline-offset:3px}
.td-btn:active{transform:translateY(0) scale(.98)}
.td-sk{border-radius:9px;background:linear-gradient(100deg,#eef3fb 20%,#f9fbff 43%,#e4eefc 55%,#eef3fb 78%);background-size:240% 100%;animation:td-shimmer 1.45s linear infinite}
.td-skeleton-list{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:11px}
.td-skeleton-card{display:grid;grid-template-columns:43px 1fr;gap:13px;padding:17px 18px;border:1px solid rgba(221,225,234,.92);border-radius:17px;background:#fff;box-shadow:0 1px 2px rgba(13,27,61,.025),0 8px 20px -12px rgba(13,27,61,.12),inset 0 1px 0 rgba(255,255,255,.95)}
@keyframes td-enter{from{opacity:0;transform:translate3d(0,10px,0)}to{opacity:1;transform:translate3d(0,0,0)}}
@keyframes td-card-in{from{opacity:0;transform:translate3d(0,13px,0)}to{opacity:1;transform:translate3d(0,0,0)}}
@keyframes td-shimmer{to{background-position:-240% 0}}
@keyframes td-glow{0%{transform:translate3d(0,0,0) scale(1);opacity:.7}100%{transform:translate3d(-18px,14px,0) scale(1.08);opacity:1}}
@keyframes td-sheen{0%,65%,100%{transform:translateX(-120%)}82%{transform:translateX(120%)}}
@media(hover:hover) and (pointer:fine){
  .td-card:hover{transform:translateY(-2px);border-color:#d4e1fb;box-shadow:0 5px 12px rgba(13,27,61,.04),0 15px 32px rgba(13,27,61,.055)}
  .td-btn:hover{transform:translateY(-1px);box-shadow:0 10px 22px -8px rgba(11,95,255,.68);filter:saturate(1.06)}
}
@media(max-width:560px){
  .td-w{padding:10px}
  .td-head{gap:16px;padding:17px;border-radius:18px}
  .td-biz{flex-basis:100%;gap:11px}
  .td-mark{width:40px;height:40px;border-radius:12px}
  .td-scorebox{flex-basis:100%;min-width:0;padding:13px 0 0;border-left:0;border-top:1px solid rgba(216,225,241,.95)}
  .td-scoreline b{font-size:30px}
  .td-score-stars{display:inline-block;margin-top:0;margin-left:6px}
  .td-score-summary{display:flex;align-items:center;flex-wrap:wrap;gap:4px 9px}
  .td-count{margin-top:4px}
  .td-list{gap:9px;margin-top:11px}
  .td-card{grid-template-columns:36px minmax(0,1fr);gap:10px;padding:14px 13px;border-radius:15px}
  .td-av{width:36px;height:36px;border-radius:12px;font-size:11px}
  .td-text{font-size:13.5px;line-height:1.72;margin-top:8px!important}
  .td-top{gap:4px 7px}
  .td-top h3{font-size:13.5px}
  .td-top time{font-size:10.5px}
  .td-state{padding:30px 17px}
  .td-skeleton-card{grid-template-columns:36px 1fr;padding:14px 13px}
}
@media(max-width:360px){
  .td-w{padding:7px}
  .td-head{padding:14px}
  .td-biz h2{font-size:18px}
  .td-biz p.td-subtitle{font-size:12px}
  .td-scoreline b{font-size:28px}
  .td-card{padding:12px 10px;gap:9px}
  .td-text{font-size:13px}
}
@media(prefers-reduced-motion:reduce){
  .td-w *, .td-w *::before, .td-w *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}
  .td-head:before,.td-mark:after{animation:none!important}
}
`;

function tdEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
var TD_TONES = [
  ['#e6efff', '#2a62d9'],
  ['#efe9ff', '#6a4bd8'],
  ['#e3f6ec', '#1f9d5c'],
  ['#fff1de', '#c9741a'],
  ['#fce8f1', '#c13d75'],
  ['#e2f4f5', '#167d86']
];
var TD_STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>';
var TD_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/></svg>';
var TD_ICON_WARN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v5M12 16.5v.01"/><path d="M10.3 3.9L2.4 17.5A2 2 0 004.1 20.5h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/></svg>';
var TD_ICON_SPARKLE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.9 5.8L20 11l-6.1 2.1L12 19l-1.9-5.9L4 11l6.1-2.2L12 3Z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/></svg>';

function tdInitials(name) {
  var p = String(name || '?').trim().split(/\s+/);
  var a = Array.from(p[0] || '?')[0] || '?';
  var b = p.length > 1 ? Array.from(p[p.length - 1])[0] || '' : '';
  return (a + b).toUpperCase();
}
function tdTone(name) {
  var value = String(name || 'customer');
  var hash = 0;
  for (var i = 0; i < value.length; i++) hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  return TD_TONES[Math.abs(hash) % TD_TONES.length];
}
function tdStars(n) {
  var score = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  return '<span class="td-stars" role="img" aria-label="' + score + ' out of 5 stars">' +
    '<span aria-hidden="true">' + '★'.repeat(score) + '</span><i aria-hidden="true">' + '★'.repeat(5 - score) + '</i></span>';
}
function tdDate(d) {
  var t = new Date(d);
  return isNaN(t) ? '' : t.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
function tdState(icon, title, text, action) {
  return '<section class="td-state" role="status"><div class="td-ico">' + icon + '</div><h3>' + title + '</h3><p>' + text + '</p>' + (action || '') + '</section>';
}

/* data: { state: 'ready' | 'loading' | 'error' | 'notFound', businessName, reviews: [{ name, rating, text, date }] } */
function renderWidget(data) {
  var biz = tdEsc(data.businessName || 'this business');
  var head = '';
  var body = '';

  if (data.state === 'loading') {
    head = '<header class="td-head" aria-busy="true"><div class="td-biz"><span class="td-mark">' + TD_STAR + '</span><div class="td-brand-copy"><p class="td-eyebrow">TrustDrop reviews</p><div class="td-sk" style="width:175px;max-width:52vw;height:21px"></div><div class="td-sk" style="width:115px;height:12px;margin-top:8px"></div></div></div><div class="td-scorebox"><div class="td-sk" style="width:88px;height:34px"></div><div class="td-sk" style="width:112px;height:12px;margin-top:8px"></div></div></header>';
    var sk = '<li class="td-skeleton-card"><div class="td-sk" style="width:43px;height:43px"></div><div><div class="td-sk" style="width:44%;height:13px"></div><div class="td-sk" style="width:26%;height:11px;margin-top:8px"></div><div class="td-sk" style="width:95%;height:12px;margin-top:13px"></div><div class="td-sk" style="width:77%;height:12px;margin-top:7px"></div></div></li>';
    body = '<ul class="td-skeleton-list">' + sk + sk + sk + '</ul>';
  } else if (data.state === 'notFound') {
    body = tdState(TD_ICON_WARN, 'Widget not found', 'This TrustDrop widget link is invalid or the business is unavailable.');
  } else if (data.state === 'error') {
    body = tdState(TD_ICON_WARN, 'Reviews couldn’t load', 'Check your connection and try again. Your page is unaffected.', '<button type="button" class="td-btn" data-td-retry>Try again</button>');
  } else {
    var reviews = Array.isArray(data.reviews) ? data.reviews : [];
    var rated = reviews.map(function (r) { return Number(r.rating); }).filter(function (n) { return Number.isFinite(n) && n >= 1 && n <= 5; });
    var avg = rated.length ? rated.reduce(function (sum, rating) { return sum + rating; }, 0) / rated.length : 0;
    var countLabel = reviews.length === 1 ? '1 approved review' : reviews.length + ' approved reviews';

    head = '<header class="td-head">' +
      '<div class="td-biz"><span class="td-mark">' + TD_STAR + '</span><div class="td-brand-copy">' +
      '<p class="td-eyebrow">TrustDrop · customer feedback</p><h2>' + biz + '</h2><p class="td-subtitle">Real experiences from real customers</p>' +
      '</div></div>' +
      (reviews.length ? '<div class="td-scorebox"><div class="td-scoreline"><b>' + avg.toFixed(1) + '</b><span>/ 5</span></div><div class="td-score-summary"><span class="td-score-stars">' + tdStars(avg) + '</span><span class="td-count">' + countLabel + '</span></div></div>' : '<div class="td-scorebox"><span class="td-count">Building customer trust</span></div>') +
      '</header>';

    body = reviews.length
      ? '<ul class="td-list" aria-label="Approved customer reviews">' + reviews.map(function (r, i) {
          var name = String(r.name || 'Customer').trim() || 'Customer';
          var tone = tdTone(name);
          var date = tdDate(r.date);
          var isoDate = r.date && !isNaN(new Date(r.date)) ? new Date(r.date).toISOString() : '';
          var delay = Math.min(i, 7) * 55;
          return '<li class="td-card" style="--td-delay:' + delay + 'ms">' +
            '<div class="td-av" aria-hidden="true" style="background:' + tone[0] + ';color:' + tone[1] + '">' + tdEsc(tdInitials(name)) + '</div>' +
            '<div class="td-review-main"><div class="td-top"><h3>' + tdEsc(name) + '</h3>' +
            tdStars(r.rating) + (date ? '<time datetime="' + tdEsc(isoDate) + '">' + tdEsc(date) + '</time>' : '') + '</div>' +
            '<p class="td-text">' + tdEsc(r.text || '') + '</p>' +
            '<p class="td-ver"><span class="td-ver-pill">' + TD_CHECK + ' Verified review</span></p></div></li>';
        }).join('') + '</ul>'
      : tdState(TD_ICON_SPARKLE, 'Your story starts here', 'Approved reviews from ' + biz + ' customers will appear here.');
  }

  return '<div class="td-w">' + head + body +
    '<footer class="td-foot"><span class="td-foot-mark" aria-hidden="true">★</span> Powered by <a href="https://trustdrop-lac.vercel.app" target="_blank" rel="noopener noreferrer">TrustDrop</a></footer>' +
    '</div>';
}

export function renderWidgetDocument(data) {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="color-scheme" content="light"><meta name="referrer" content="strict-origin-when-cross-origin">' +
    '<title>Customer reviews · TrustDrop</title>' +
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=Caveat:wght@600&family=Great+Vibes&family=Pacifico&display=swap" rel="stylesheet">' +
    '<style>html,body{margin:0;min-height:100%;background:#f5f9ff}body{padding:0}button{font-family:inherit}' + WIDGET_CSS + '</style></head><body>' + renderWidget(data) +
    '<script>document.addEventListener("click",function(e){if(e.target.closest("[data-td-retry]"))location.reload()})</script></body></html>';
}
