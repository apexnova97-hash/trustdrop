import json, subprocess, time, urllib.request, base64, os
from websocket import create_connection

CH = '/tmp/chs/chrome-headless-shell-linux64/chrome-headless-shell'
E = dict(os.environ)
E['LD_LIBRARY_PATH'] = '/tmp/ext/usr/lib/x86_64-linux-gnu:/tmp/ext/lib/x86_64-linux-gnu'
E['FONTCONFIG_FILE'] = '/tmp/fc/fonts.conf'
E['FONTCONFIG_PATH'] = '/tmp/ext/etc/fonts'
proc = subprocess.Popen([CH, '--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
                         '--hide-scrollbars', '--force-color-profile=srgb',
                         '--remote-debugging-port=9999', 'about:blank'],
                        env=E, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
u = None
for _ in range(80):
    try:
        u = json.load(urllib.request.urlopen('http://127.0.0.1:9999/json/version', timeout=1))['webSocketDebuggerUrl']
        break
    except Exception:
        time.sleep(.25)
ws = create_connection(u, timeout=45)
i = [0]
events = []
def send(m, pr=None, s=None, t=45):
    i[0] += 1
    mid = i[0]
    msg = {'id': mid, 'method': m, 'params': pr or {}}
    if s:
        msg['sessionId'] = s
    ws.send(json.dumps(msg))
    end = time.time() + t
    while time.time() < end:
        r = json.loads(ws.recv())
        if r.get('id') == mid:
            if 'error' in r:
                raise RuntimeError(m + ': ' + str(r['error']))
            return r.get('result', {})
        if 'method' in r:
            events.append(r)
            if r['method'] == 'Runtime.exceptionThrown':
                print('    !! EXCEPTION:', json.dumps(r['params'])[:400])
    raise RuntimeError('timeout ' + m)

def page(w, h, url, mobile=False):
    t = send('Target.createTarget', {'url': 'about:blank'})['targetId']
    s = send('Target.attachToTarget', {'targetId': t, 'flatten': True})['sessionId']
    send('Page.enable', {}, s)
    send('Runtime.enable', {}, s)
    send('Log.enable', {}, s)
    send('Emulation.setDeviceMetricsOverride', {'width': w, 'height': h, 'deviceScaleFactor': 1, 'mobile': mobile}, s)
    send('Page.navigate', {'url': url}, s)
    time.sleep(2.4)
    return t, s

def js(s, expr):
    r = send('Runtime.evaluate', {'expression': expr, 'returnByValue': True, 'awaitPromise': True}, s)
    if r.get('exceptionDetails'):
        d = r['exceptionDetails']
        return 'EXC ' + (d.get('exception', {}).get('description') or d.get('text') or '')[:200]
    return r['result'].get('value')

def cap(s, path):
    d = send('Page.captureScreenshot', {'format': 'png'}, s, 60)
    open(path, 'wb').write(base64.b64decode(d['data']))

BASE = 'http://localhost:3000'
fails = []
def check(name, got, want=None, ok=None):
    if isinstance(got, str) and got.startswith('EXC'):
        print('  FAIL  ' + name + '  ->  ' + got[:200])
        fails.append(name)
        return
    good = ok if ok is not None else (got == want)
    print(('  PASS  ' if good else '  FAIL  ') + name + '  ->  ' + repr(got)[:150])
    if not good:
        fails.append(name)

print('== mode switching (no navigation) ==')
t, s = page(1440, 900, BASE + '/auth')
js(s, "window.__alive = 'yes'")
js(s, "document.querySelectorAll('.ta-tab')[1].click()")
time.sleep(0.5)
check('still same document (no reload)', js(s, "window.__alive"), 'yes')
check('url unchanged', js(s, "location.pathname + location.search"), '/auth')
check('signup tab pressed', js(s, "document.querySelectorAll('.ta-tab')[1].getAttribute('aria-pressed')"), 'true')
check('signup heading', js(s, "document.querySelector('.ta-swap h2').textContent"), 'Create your account')
check('business field present', js(s, "!!document.querySelector('#ta-biz')"), True)
check('swap animation on switch', js(s, "getComputedStyle(document.querySelector('.ta-swap')).animationName"), 'taSwap')
check('direction is forward', js(s, "getComputedStyle(document.querySelector('.ta-swap')).getPropertyValue('--swap-x').trim()"), '10px')
js(s, "document.querySelectorAll('.ta-tab')[0].click()")
time.sleep(0.5)
check('back to login heading', js(s, "document.querySelector('.ta-swap h2').textContent"), 'Welcome back')
check('direction is backward', js(s, "getComputedStyle(document.querySelector('.ta-swap')).getPropertyValue('--swap-x').trim()"), '-10px')
check('business field gone', js(s, "!document.querySelector('#ta-biz')"), True)

print('== values survive switching ==')
js(s, """(() => { const set=(el,v)=>{const d=Object.getOwnPropertyDescriptor(el.constructor.prototype,'value');d.set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));};
  set(document.querySelector('#ta-email'),'maya@bloom.co'); set(document.querySelector('#ta-pass'),'secret123'); return 1; })()""")
time.sleep(0.3)
js(s, "document.querySelectorAll('.ta-tab')[1].click()")
time.sleep(0.4)
check('email kept into signup', js(s, "document.querySelector('#ta-email').value"), 'maya@bloom.co')
check('password kept into signup', js(s, "document.querySelector('#ta-pass').value"), 'secret123')
js(s, "document.querySelectorAll('.ta-tab')[0].click()")
time.sleep(0.4)
check('email kept back in login', js(s, "document.querySelector('#ta-email').value"), 'maya@bloom.co')

print('== the live link ==')
js(s, "document.querySelectorAll('.ta-tab')[1].click()")
time.sleep(0.4)
check('default placeholder', js(s, "document.querySelector('.ta-link-value').textContent").endswith('your-business'), True)
js(s, """(() => { const set=(el,v)=>{const d=Object.getOwnPropertyDescriptor(el.constructor.prototype,'value');d.set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));};
  set(document.querySelector('#ta-biz'),'  Café Déjà Vu & Sons!  '); return 1; })()""")
time.sleep(0.4)
check('slug handles accents, & and punctuation', js(s, "document.querySelector('.ta-link-value').textContent").split('/collect/')[1], 'cafe-deja-vu-and-sons')
js(s, "document.querySelectorAll('.ta-example')[1].click()")
time.sleep(0.4)
check('example fills field', js(s, "document.querySelector('#ta-biz').value"), 'Flour & Salt')
check('link follows example', js(s, "document.querySelector('.ta-link-value').textContent").endswith('flour-and-salt'), True)
js(s, "document.querySelector('#ta-biz').focus()")
js(s, "[...document.querySelectorAll('.ta-example')][2].scrollIntoView({block:'center'})")
time.sleep(0.2)
cap(s, 'artifacts/v3-signup-1440.png')

print('== password reveal, meter, validation ==')
check('password hidden first', js(s, "document.querySelector('#ta-pass').type"), 'password')
js(s, "document.querySelector('.ta-eye').click()")
time.sleep(0.25)
check('reveal toggles to text', js(s, "document.querySelector('#ta-pass').type"), 'text')
js(s, "document.querySelector('.ta-eye').click()")
check('meter reads', js(s, "document.querySelector('.ta-meter-txt').textContent"), 'Good')
js(s, """(() => { const set=(el,v)=>{const d=Object.getOwnPropertyDescriptor(el.constructor.prototype,'value');d.set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));};
  set(document.querySelector('#ta-pass'),'Sunflower$24'); return 1; })()""")
time.sleep(0.3)
check('strong password', js(s, "document.querySelector('.ta-meter-txt').textContent"), 'Strong')
check('submit enabled when complete', js(s, "!document.querySelector('.ta-submit').disabled"), True)
js(s, """(() => { const set=(el,v)=>{const d=Object.getOwnPropertyDescriptor(el.constructor.prototype,'value');d.set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));};
  set(document.querySelector('#ta-biz'),''); return 1; })()""")
time.sleep(0.3)
check('submit disabled without business', js(s, "document.querySelector('.ta-submit').disabled"), True)

print('== keyboard ==')
js(s, """(() => { const set=(el,v)=>{const d=Object.getOwnPropertyDescriptor(el.constructor.prototype,'value');d.set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));};
  set(document.querySelector('#ta-biz'),'Bloom & Co.'); return 1; })()""")
time.sleep(0.2)
check('form is a real form', js(s, "document.querySelector('.ta-form').tagName"), 'FORM')
check('password has autocomplete new-password', js(s, "document.querySelector('#ta-pass').getAttribute('autocomplete')"), 'new-password')

print('== real failed login still wired ==')
t2, s2 = page(1440, 900, BASE + '/auth')
js(s2, """(() => { const set=(el,v)=>{const d=Object.getOwnPropertyDescriptor(el.constructor.prototype,'value');d.set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));};
  set(document.querySelector('#ta-email'),'nobody-9x@example.com'); set(document.querySelector('#ta-pass'),'wrongpass123'); return 1; })()""")
time.sleep(0.3)
js(s2, "document.querySelector('.ta-form').requestSubmit()")
time.sleep(4.5)
check('error shown', js(s2, "document.querySelector('.ta-error')?.innerText || 'none'"), 'Invalid login credentials')
check('error clears on mode switch', js(s2, "document.querySelectorAll('.ta-tab')[1].click(); 1") and True)
time.sleep(0.5)
check('no error after switching', js(s2, "!document.querySelector('.ta-error')"), True)

print('== deep links ==')
for path, want in [('/auth', 'Welcome back'), ('/auth?mode=signup', 'Create your account'),
                   ('/login', 'Welcome back'), ('/signup', 'Create your account')]:
    t3, s3 = page(1200, 800, BASE + path)
    got = js(s3, "document.querySelector('.ta-swap h2').textContent")
    check('deep link ' + path, got, want)
    send('Target.closeTarget', {'targetId': t3})

print('== layout matrix, both modes ==')
MEASURE = """(() => { const de=document.documentElement, over=[];
  document.querySelectorAll('*').forEach(el=>{ const r=el.getBoundingClientRect(), cs=getComputedStyle(el);
    if (r.width>0 && (r.right>de.clientWidth+1.5 || r.left<-1.5) && cs.position!=='absolute' && cs.position!=='fixed')
      over.push(el.tagName.toLowerCase()+'.'+String(el.className).split(' ')[0]); });
  return JSON.stringify({ sw:de.scrollWidth, cw:de.clientWidth, over:over.slice(0,5) }); })()"""
for w, h, mob in [(1920, 1080, False), (1440, 900, False), (1024, 800, False), (768, 900, False), (390, 844, True), (320, 640, True)]:
    for path, tag in [('/auth', 'login'), ('/auth?mode=signup', 'signup')]:
        t4, s4 = page(w, h, BASE + path, mob)
        info = json.loads(js(s4, MEASURE))
        check('%s overflow %d' % (tag, w), (info['sw'], info['over']), ok=(info['sw'] <= info['cw'] + 1 and not info['over']))
        send('Target.closeTarget', {'targetId': t4})

print('== reduced motion ==')
send('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-motion', 'value': 'reduce'}]})
t5, s5 = page(390, 844, BASE + '/auth', True)
check('swap animation neutralised', js(s5, "getComputedStyle(document.querySelector('.ta-swap')).animationDuration"), '0.001ms')
js(s5, "document.querySelectorAll('.ta-tab')[1].click()")
time.sleep(0.4)
check('switch still works with motion off', js(s5, "document.querySelector('.ta-swap h2').textContent"), 'Create your account')
check('h1 visible', js(s5, "getComputedStyle(document.querySelector('.ta-line > span')).opacity"), '1')
send('Target.closeTarget', {'targetId': t5})

exc = [e for e in events if e.get('method') == 'Runtime.exceptionThrown']
errs = [e for e in events if e.get('method') == 'Log.entryAdded' and e['params']['entry']['level'] == 'error'
        and 'favicon' not in e['params']['entry'].get('url', '')]
print('== console ==')
check('no page exceptions', len(exc), 0)
check('no console errors', len(errs), 0)
for e in errs[:3]:
    print('    ', e['params']['entry'].get('text', '')[:160])

send('Browser.close')
print('\nRESULT:', 'ALL PASS' if not fails else 'FAILED: ' + ', '.join(fails))
