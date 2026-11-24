// Portado de Claude Design (Perceptia Home · pc-shader.js).
// Cambios: lens-portrait para pantallas verticales, un solo frame con prefers-reduced-motion
// y `state`/K para animar las lentes desde fuera y convertirlas en el isotipo.
// Resolución: `max-dpr` y `budget` suben el tope por instancia (el hero lo necesita para que el
// isotipo no se vea pixelado); con `adaptive` baja sola si los cuadros se vuelven lentos.
(() => {
if (typeof window === 'undefined' || customElements.get('pc-shader')) return;
const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)');
const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const HEAD = `precision highp float;
uniform vec2 R;uniform float T;uniform vec2 M;uniform float V;uniform float S;uniform float P;uniform vec4 LN;uniform float LF;uniform float K;
const vec3 C0=vec3(.012,.075,.059),C1=vec3(.055,.231,.188),C2=vec3(.078,.878,.647),C3=vec3(.561,.69,.647),C4=vec3(.933,.961,.949);
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float ns(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),u.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*ns(p);p=mat2(1.6,1.2,-1.2,1.6)*p+vec2(1.7,9.2);a*=.5;}return v;}
float b2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}
float b8(vec2 a){return b2(.25*a)*.0625+b2(.5*a)*.25+b2(a);}
float grain(){return h21(gl_FragCoord.xy+fract(T*7.)*91.)-.5;}
`;
const FS = {
lens: `
float warp(vec2 p){vec2 q=vec2(fbm(p+vec2(0.,T*.05)),fbm(p+vec2(5.2,1.3)-T*.04));return fbm(p+2.6*q+vec2(T*.03,P));}
void main(){
 vec2 uv=gl_FragCoord.xy/R;float ar=R.x/R.y;
 vec2 p=(gl_FragCoord.xy-.5*R)/R.y;vec2 m=(M-.5)*vec2(ar,1.);
 vec2 c=LN.xy+(m-LN.xy)*.06;float r=LN.z,s=LN.w;
 vec2 c1=c-vec2(s,0.),c2=c+vec2(s,0.);
 vec2 l1=(p-c1)/r,l2=(p-c2)/r;
 float d1=(length(l1)-1.)*r,d2=(length(l2)-1.)*r;
 float aa=1.5/R.y;
 float e1=1.-smoothstep(-aa,aa,d1),e2=1.-smoothstep(-aa,aa,d2);
 float z1=sqrt(max(0.,1.-dot(l1,l1))),z2=sqrt(max(0.,1.-dot(l2,l2)));
 vec2 q=p*1.5;
 q-=(e1*l1*(1.-z1)+e2*l2*(1.-z2))*.45;
 float md=length(p-m);
 q+=(p-m)/(md+.001)*sin(md*26.-T*3.)*.015*exp(-md*3.)*(.35+V);
 float f=warp(q*1.2);
 float ins=max(e1,e2),ves=e1*e2;
 vec3 col=mix(C0,C1,smoothstep(.3,.8,f));
 col+=C2*pow(smoothstep(.5,.95,f),3.)*.25;
 vec3 lc=mix(C1*.8,C2,smoothstep(.35,.95,f)*.8);
 col=mix(col,lc,ins*(1.-ves)*.75);
 vec3 vc=mix(C2,C4,smoothstep(.45,.95,f)*.8);
 col=mix(col,vc,ves);
 // Filos y halo de las lentes; se apagan con K para que el isotipo quede limpio, sin borde.
 float rim=1.-K;
 col+=C4*(exp(-abs(d1)*320.)+exp(-abs(d2)*320.))*.35*rim;
 col+=C2*(exp(-abs(d1-.006)*260.)+exp(-abs(d2-.006)*260.))*.25*rim;
 float dv=max(d1,d2);
 col+=C2*exp(-max(dv,0.)*9.)*.16*rim;
 col+=C4*exp(-abs(dv)*220.)*.4*rim;
 vec3 L=normalize(vec3(-.5,.65,.9));
 col+=C4*(e1*pow(max(0.,dot(vec3(l1,z1),L)),50.)+e2*pow(max(0.,dot(vec3(l2,z2),L)),50.))*.35;
 col+=C2*exp(-md*md*16.)*.07;
 // K: transición al isotipo (medialunas claras y vesica calada, sin filo).
 if(K>0.){
  vec3 wc=C4*(.93+.07*smoothstep(.2,.9,f));
  vec3 lg=mix(col,wc,ins*(1.-ves));
  lg=mix(lg,C0+C1*.3*smoothstep(.3,.9,f),ves);
  col=mix(col,lg,K);
 }
 col*=1.-.65*pow(length((uv-.5)*vec2(1.,.9)),2.2);
 col+=grain()*.05;
 gl_FragColor=vec4(col,1.);
}`,
dither: `
void main(){
 vec2 cell=floor(gl_FragCoord.xy/S);vec2 fc=(cell+.5)*S;
 vec2 p=(fc-.5*R)/R.y;vec2 m=(M-.5)*vec2(R.x/R.y,1.);
 float f=fbm(p*1.8+vec2(T*.05,-T*.035)+P*7.+fbm(p*2.4-T*.06)*1.4);
 f=smoothstep(.25,.85,f)*.62;
 float md=length(p-m);f+=.5*exp(-md*md*7.);
 if(LF>.5){
  vec2 c=LN.xy+(m-LN.xy)*.05;float r=LN.z,s=LN.w;
  float d1=length(p-c+vec2(s,0.))-r,d2=length(p-c-vec2(s,0.))-r;
  float u=min(d1,d2),dv=max(d1,d2);
  f*=mix(1.,.55,step(u,0.));
  f+=(exp(-abs(d1)*70.)+exp(-abs(d2)*70.))*.55;
  f=mix(f,.8+.2*sin(T*1.5+p.y*9.),step(dv,0.));
  f+=exp(-max(dv,0.)*16.)*.22;
 }
 float v=clamp(f,0.,.999)*3.;float lv=floor(v)+step(b8(cell),fract(v));
 vec3 col=lv<.5?C0:(lv<1.5?C1:(lv<2.5?C2:C4));
 gl_FragColor=vec4(col,1.);
}`,
chrome: `
float hf(vec2 q){return fbm(q+1.4*vec2(fbm(q*1.2+vec2(T*.05,P)),fbm(q*1.2+vec2(3.1,-T*.04))));}
void main(){
 vec2 uv=gl_FragCoord.xy/R;vec2 p=(gl_FragCoord.xy-.5*R)/R.y;vec2 m=(M-.5)*vec2(R.x/R.y,1.);
 float ins=1.,ves=0.,d1=1.,d2=1.;
 vec2 c=LN.xy+(m-LN.xy)*.04;float r=LN.z,s=LN.w;
 if(LF>.5){
  d1=length(p-c+vec2(s,0.))-r;d2=length(p-c-vec2(s,0.))-r;
  float aa=1.5/R.y;
  ins=1.-smoothstep(-aa,aa,min(d1,d2));ves=1.-smoothstep(-aa,aa,max(d1,d2));
 }
 vec2 q=p*1.6+P*3.;float e=.01;
 float h=hf(q),hx=hf(q+vec2(e,0.)),hy=hf(q+vec2(0.,e));
 vec2 g=vec2(hx-h,hy-h)/e;
 vec2 dm=p-m;float bk=exp(-dot(dm,dm)*10.)*(.5+V*.8);
 g+=-5.*dm*bk;
 vec3 n=normalize(vec3(-g*.35,1.));
 vec3 rf=reflect(vec3(0.,0.,-1.),n);
 float t=rf.y*1.6+rf.x*.6+h*2.2;
 float b=.5+.5*sin(t*3.2);
 vec3 col=mix(C0,C1,smoothstep(0.,.6,b));
 col=mix(col,C3,smoothstep(.55,.9,b));
 col=mix(col,C4,pow(smoothstep(.82,1.,b),3.));
 float fr=pow(1.-n.z,2.);col=mix(col,C2,clamp(fr*2.5,0.,.6));
 if(LF>.5){
  vec3 vc=col*vec3(.35,1.15,.9)+C2*.18;
  col=mix(col,vc,ves);
  vec3 bg=C0+C1*.25*smoothstep(.3,.9,fbm(p*2.+T*.03));
  bg+=C2*exp(-max(max(d1,d2),0.)*8.)*.12;
  col=mix(bg,col,ins);
  col+=C4*(exp(-abs(d1)*420.)+exp(-abs(d2)*420.))*.5;
  col+=C2*exp(-abs(max(d1,d2))*260.)*.6;
 }
 col*=1.-.6*pow(length(uv-.5),2.);
 col+=grain()*.04;
 gl_FragColor=vec4(col,1.);
}`,
globe: `
float YW,PT;
vec3 sph(float la,float lo){la=radians(la);lo=radians(lo);return vec3(cos(la)*sin(lo),sin(la),cos(la)*cos(lo));}
vec3 tv(vec3 g){float c=cos(YW),s=sin(YW);g=vec3(c*g.x+s*g.z,g.y,-s*g.x+c*g.z);c=cos(PT);s=sin(PT);return vec3(g.x,c*g.y-s*g.z,s*g.y+c*g.z);}
vec3 tg(vec3 v){float c=cos(PT),s=sin(PT);v=vec3(v.x,c*v.y+s*v.z,-s*v.y+c*v.z);c=cos(YW);s=sin(YW);return vec3(c*v.x-s*v.z,v.y,s*v.x+c*v.z);}
vec3 pin(vec2 p,vec3 w,float ph){
 if(w.z<0.)return vec3(0.);
 float d=length(p-w.xy);float pr=fract(T*.45+ph);
 return C2*exp(-d*d*2500.)*1.1+C4*exp(-d*d*14000.)+C2*exp(-abs(d-pr*.16)*260.)*(1.-pr)*.9;
}
// Arco entre dos puntos del globo: devuelve (distancia mínima a la curva, avance 0–1 en ese punto).
vec2 arc(vec2 p,vec3 A,vec3 B){
 float ad=1e3,at=0.;vec2 pv=tv(A).xy;
 for(int i=1;i<=32;i++){
  float t=float(i)/32.;vec3 w=tv(normalize(mix(A,B,t))*(1.+.12*sin(3.1416*t)));
  vec2 pa=p-pv,ba=w.xy-pv;float hh=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
  float dd=length(pa-ba*hh);if(dd<ad){ad=dd;at=t;}pv=w.xy;
 }
 return vec2(ad,at);
}
vec3 arcCol(vec2 a){
 float dash=.35+.65*step(.45,fract(a.y*7.-T*.8));
 return C2*(exp(-a.x*a.x*30000.)*dash*.9+exp(-a.x*70.)*.12);
}
void main(){
 YW=radians(70.)+sin(T*.2)*.2+(M.x-.5)*.5;PT=radians(10.)-(M.y-.5)*.3;
 vec2 p=(gl_FragCoord.xy-.5*R)/(min(R.x,R.y)*.44);
 float rr=length(p);vec3 col=C0;
 col+=C2*exp(-max(rr-1.,0.)*6.)*.2*smoothstep(.985,1.01,rr);
 if(rr<1.){
  vec3 n=vec3(p,sqrt(1.-rr*rr));vec3 g=tg(n);
  float la=asin(clamp(g.y,-1.,1.)),lo=atan(g.x,g.z);
  vec2 gg=vec2(lo/6.2832*120.,la/3.1416*60.);
  vec2 f=fract(gg)-.5;
  float dr=.2*(.35+.65*cos(la));
  float dt=1.-smoothstep(dr-.07,dr+.07,length(f));
  float land=smoothstep(.42,.6,fbm(vec2(lo,la)*1.6+4.));
  float dif=clamp(dot(n,normalize(vec3(-.45,.5,.75))),0.,1.);
  float lim=pow(n.z,.6);
  col=mix(C0,C1*.6,lim*.7);
  col+=mix(C3*.35,C3,land)*dt*(.12+.88*dif)*.6*lim;
  col+=C2*pow(1.-n.z,3.)*.4;
 }
 // A: Colombia (Medellín) · B: Puerto Rico · U: Estados Unidos (Miami)
 vec3 A=sph(4.6,-74.1),B=sph(18.2,-66.5),U=sph(25.8,-80.2);
 col+=arcCol(arc(p,A,B))+arcCol(arc(p,A,U));
 col+=pin(p,tv(A),0.)+pin(p,tv(B),.5)+pin(p,tv(U),.25);
 col+=grain()*.035;
 gl_FragColor=vec4(col,1.);
}`
};

const ACTIVE = new Set(); const MAXCTX = 8, MAXPX = 650000;
class PcShader extends HTMLElement {
  connectedCallback() {
    Object.assign(this.style, { display: 'block', width: this.style.width || '100%', height: this.style.height || '100%', background: '#03130F', position: this.style.position || 'relative' });
    this._io = new IntersectionObserver(e => { this._vis = e[0].isIntersecting; this._vis ? this._start() : this._stop(); }, { rootMargin: '200px' });
    this._io.observe(this);
    this._pm = e => {
      if (!this.cv) return; const r = this.cv.getBoundingClientRect(); if (!r.width) return;
      const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
      if (x > -.05 && x < 1.05 && y > -.05 && y < 1.05) { this._ptr = [x, y]; this._last = performance.now(); }
    };
    window.addEventListener('pointermove', this._pm, { passive: true });
  }
  disconnectedCallback() { this._io && this._io.disconnect(); window.removeEventListener('pointermove', this._pm); this._stop(); }
  _stop() {
    cancelAnimationFrame(this._raf); this._ro && this._ro.disconnect();
    if (this.gl) { const x = this.gl.getExtension('WEBGL_lose_context'); this.cv.removeEventListener('webglcontextlost', this._lost); x && x.loseContext(); }
    this.cv && this.cv.remove(); this.cv = this.gl = null; ACTIVE.delete(this);
  }
  _start() {
    if (this.cv || !this.isConnected) return;
    if (ACTIVE.size >= MAXCTX) { const old = [...ACTIVE].find(e => !e._vis); if (old) old._stop(); else return; }
    const cv = document.createElement('canvas');
    cv.style.cssText = 'position:absolute;inset:0;display:block;width:100%;height:100%';
    this.appendChild(cv); this.cv = cv;
    const gl = cv.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    if (!gl) { cv.remove(); this.cv = null; return; }
    this.gl = gl; ACTIVE.add(this);
    this._lost = ev => { ev.preventDefault(); const me = this; setTimeout(() => { me._stop(); if (me._vis) me._start(); }, 400); };
    cv.addEventListener('webglcontextlost', this._lost);
    const mode = this.getAttribute('mode') || 'lens';
    const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error('pc-shader', mode, gl.getShaderInfoLog(o)); return o; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, HEAD + FS[mode]));
    gl.linkProgram(pr); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const al = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
    const U = {}; ['R', 'T', 'M', 'V', 'S', 'P', 'LN', 'LF', 'K'].forEach(k => U[k] = gl.getUniformLocation(pr, k));
    const num = (k, d) => { const v = parseFloat(this.getAttribute(k)); return isNaN(v) ? d : v; };
    const heavy = mode === 'lens' || mode === 'chrome';
    const scale = num('scale', heavy ? .55 : 1);
    const px = num('px', 3), P = num('variant', 0);
    const LN = (this.getAttribute('lens') || '0,0.06,0.3,0.15').split(',').map(Number);
    const LNP = this.getAttribute('lens-portrait') ? this.getAttribute('lens-portrait').split(',').map(Number) : null;
    const LF = this.getAttribute('lenses') === '1' ? 1 : 0;
    const maxDpr = num('max-dpr', 1.25), budget = num('budget', MAXPX);
    const adaptive = this.hasAttribute('adaptive');
    // Factor de calidad: 1 = resolución completa; se conserva entre reinicios del contexto.
    if (this._q == null) this._q = 1;
    let dpr = 1;
    const resize = () => {
      const w = cv.clientWidth || 1, h = cv.clientHeight || 1;
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr) * scale * this._q;
      dpr = Math.min(dpr, Math.sqrt(budget / (w * h)));
      cv.width = Math.max(1, Math.round(w * dpr)); cv.height = Math.max(1, Math.round(h * dpr));
    };
    this._ro = new ResizeObserver(() => { resize(); if (REDUCE.matches) requestAnimationFrame(loop); }); this._ro.observe(cv); resize();
    if (this._t0 == null) this._t0 = performance.now() - num('offset', Math.random() * 20) * 1000;
    const m = this._m || (this._m = [.5, .5]); let v = 0;
    // Calidad adaptativa: tras un arranque de gracia, si la mayoría de los cuadros tarda más de
    // ~22 ms (menos de 45 fps), baja la resolución un 20 % (hasta un 35 % de la inicial).
    let prev = 0, frames = 0, slow = 0;
    const adapt = now => {
      const dt = prev ? now - prev : 0; prev = now;
      if (!dt || dt > 100) return; // pestaña en segundo plano o un tirón aislado
      if (++frames < 90) return;
      slow = slow * .95 + (dt > 22 ? .05 : 0);
      if (slow > .6 && this._q > .35) { this._q = Math.max(.35, this._q * .8); slow = 0; frames = 60; resize(); }
    };
    const loop = now => {
      if (!REDUCE.matches) this._raf = requestAnimationFrame(loop);
      if (gl.isContextLost()) return;
      if (adaptive && !REDUCE.matches) adapt(now);
      const t = (now - this._t0) / 1000;
      const idle = !this._ptr || now - this._last > 2500;
      const tg = idle ? [.5 + .17 * Math.cos(t * .37), .52 + .11 * Math.sin(t * .51)] : this._ptr;
      const k = idle ? .02 : .08;
      const dx = (tg[0] - m[0]) * k, dy = (tg[1] - m[1]) * k;
      m[0] += dx; m[1] += dy;
      v += (Math.min(1.5, Math.hypot(dx, dy) * 60) - v) * .08;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(U.R, cv.width, cv.height); gl.uniform1f(U.T, t); gl.uniform2f(U.M, m[0], m[1]);
      gl.uniform1f(U.V, v); gl.uniform1f(U.S, Math.max(1, px * dpr)); gl.uniform1f(U.P, P);
      // `state` permite controlar las lentes desde fuera (p. ej. el hero ligado al scroll).
      const st = this.state;
      const ln = st ? [st.x, st.y, st.r, st.s] : LNP && cv.width < cv.height * 0.9 ? LNP : LN;
      gl.uniform4f(U.LN, ln[0], ln[1], ln[2], ln[3]); gl.uniform1f(U.LF, LF); gl.uniform1f(U.K, st ? st.k : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    this._raf = requestAnimationFrame(loop);
    this._redraw = () => { if (REDUCE.matches && this.gl) requestAnimationFrame(loop); };
  }
  /** Vuelve a pintar un frame cuando el movimiento está reducido (el loop no corre). */
  redraw() { this._redraw && this._redraw(); }
}
customElements.define('pc-shader', PcShader);
})();
