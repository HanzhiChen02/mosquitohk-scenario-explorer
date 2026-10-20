/* MosquitoHK front-end demonstration.
 * Actual Stage 1 outputs provide geography and the no-intervention baseline.
 * Scenario responses below are transparent visual heuristics, not fitted forecasts.
 */

const $ = (id) => document.getElementById(id);
const state = { frequency: 'impulsive', timing: 'rise', selectedDay: 205, playing: false };
const controls = ['weather','release','chemical','larva','adult','competition','ci','shortfall','delay','drugFactor','uncertainty'];
const englishText = {
  '防控策略': 'Vector-control strategy',
  '探索器': 'explorer',
  '調整釋放與防治方案，觀察香港蚊蟲相對豐度的時空變化。': 'Explore how release and chemical-control strategies change mosquito abundance across Hong Kong and over time.',
  '策略設定': 'Strategies',
  '穩健性': 'Robustness',
  '環境與釋放': 'Weather & releases',
  '設定共同的天氣及 Wolbachia 方案': 'Set matched weather and Wolbachia male-release scenarios',
  '天氣情景': 'Weather scenario',
  '2025 年基線': '2025 baseline',
  '偏乾情景 · 示意': 'Drier conditions · illustrative',
  '強降雨情景 · 示意': 'Heavy rainfall · illustrative',
  '釋放強度': 'Release intensity',
  '相對於當地野生雄蚊的示意釋放量': 'Illustrative ratio of released to wild males',
  '釋放方式': 'Release frequency',
  '集中一次': 'Impulsive release',
  '定期多次': 'Periodic release',
  '兩種方式的總釋放量保持一致': 'The total number of released males is held constant',
  '開始時間': 'Intervention timing',
  '蚊季前': 'Pre-season',
  '增長期': 'Population rising phase',
  '高峰期': 'Predicted seasonal peak',
  '化學防治': 'Chemical vector control',
  '比較單獨及聯合干預': 'Compare single and integrated interventions',
  '防治類型': 'Control type',
  '不使用化學防治': 'No chemical control',
  '殺幼蟲劑': 'Larvicide',
  '成蚊殺蟲劑': 'Adulticide',
  '兩者並用': 'Larvicide + adulticide',
  '殺幼蟲劑效果': 'Larvicide effect',
  '成蚊殺蟲劑效果': 'Adulticide effect',
  '空間配置': 'Spatial allocation',
  '配置熱點中心與周邊的措施': 'Place interventions in hotspot centres and surrounding areas',
  'Wolbachia 置中': 'Wolbachia centre',
  '化學防治在周邊': 'Chemical control in surrounding areas',
  '化學防治置中': 'Chemical centre',
  'Wolbachia 在周邊': 'Wolbachia releases in surrounding areas',
  '兩者同地': 'Co-located',
  '共同作用於熱點': 'Both interventions in the same cells',
  '隨機配置': 'Random allocation',
  '作為比較參照': 'Reference across eligible hotspot cells',
  '生物不確定性': 'Biological parameter uncertainty',
  '改變釋放雄蚊的有效性': 'Vary the effectiveness of released males',
  '交配競爭力': 'Mating competitiveness',
  '不相容性強度': 'Cytoplasmic incompatibility',
  '執行偏差': 'Intervention implementation uncertainty',
  '測試現場安排與計畫的差距': 'Test differences between planned and delivered interventions',
  '釋放量不足': 'Release shortfall',
  '開始延遲': 'Start delay',
  '藥劑效果倍率': 'Chemical efficacy multiplier',
  '顯示選項': 'Display options',
  '檢視結果對不確定性的敏感度': 'Inspect sensitivity to uncertainty',
  '示意不確定性帶': 'Illustrative uncertainty band',
  '以目前情景效果顯示變動範圍': 'Shows an illustrative range around the selected strategy',
  '此面板的範圍是前端示意；正式研究應以擬合後驗及實測執行資料設定。': 'These ranges illustrate front-end behaviour. A study version should use fitted posterior distributions and observed implementation data.',
  '還原預設設定': 'Reset to defaults',
  '資料基線：MosquitoHK 2025 · 1 km 格網': 'Data baseline: MosquitoHK 2025 · 1 km grid',
  '互動示範': 'Interactive demo',
  '配色方案預覽': 'Colour study',
  '香港蚊蟲相對豐度': 'Mosquito relative abundance in Hong Kong',
  '探索干預時機、釋放方式和空間配置如何改變季節曲線。': 'Explore how intervention timing, release frequency and spatial allocation change the seasonal curve.',
  '非正式模型預測': 'Illustrative, not calibrated',
  '選定日期': 'Selected date',
  '沿時間曲線移動以更新地圖': 'Move along the curve to update the map',
  '全港平均相對豐度': 'Hong Kong mean relative abundance',
  '以基線全年峰值 = 100% 表示': 'Annual baseline peak = 100%',
  '較無干預情景降低': 'Reduction vs no intervention',
  '同一天、同一個天氣情景': 'Same date and weather scenario',
  '香港 1 km 格網地圖': 'Hong Kong 1 km grid map',
  '野生雌性成蚊相對豐度 · 由綠至紅表示較高': 'Wild adult female mosquito relative abundance · green to red indicates higher abundance',
  '地圖日期': 'Map date',
  '較低': 'Lower',
  '較高': 'Higher',
  '實際香港格網 · 干預效果為示意': 'Hong Kong land grid · illustrative intervention effect',
  '全港平均 · 時間曲線': 'Hong Kong mean · time series',
  '移動滑鼠或拖動下方日期滑桿，同步查看當天地圖': 'Hover over the curve or move the date slider to see the corresponding map',
  '無干預': 'No-intervention baseline',
  '目前策略': 'Selected strategy',
  '示意範圍': 'Illustrative range',
  '關於此示範': 'About this demo',
  '地理格網與無干預基線來自所提供的 MosquitoHK preliminary results。調整控件後的變化由前端示意規則產生，不代表已擬合的三階段模型預測、實測 AGI 或政策效果。': 'The land grid and no-intervention baseline come from the supplied MosquitoHK preliminary results. Changes produced by the controls are illustrative browser-side rules, not predictions from a fitted three-stage model, observed AGI, or estimates of policy effectiveness.'
};
const dynamicText = {
  zh: { baseline: '無干預', strategy: '目前策略', relative: '相對豐度', loadError: '資料載入失敗', chartError: '無法載入示範資料', play: '播放時間變化', pause: '暫停時間變化' },
  en: { baseline: 'No-intervention baseline', strategy: 'Selected strategy', relative: 'Relative abundance', loadError: 'Data could not be loaded', chartError: 'Demo data could not be loaded', play: 'Play time series', pause: 'Pause time series' }
};
const districtNamesZh = {
  'Central & Western': '中西區', Eastern: '東區', Islands: '離島區', 'Kowloon City': '九龍城區',
  'Kwai Tsing': '葵青區', 'Kwun Tong': '觀塘區', North: '北區', 'Sai Kung': '西貢區',
  'Sha Tin': '沙田區', 'Sham Shui Po': '深水埗區', Southern: '南區', 'Tai Po': '大埔區',
  'Tsuen Wan': '荃灣區', 'Tuen Mun': '屯門區', 'Wan Chai': '灣仔區',
  'Wong Tai Sin': '黃大仙區', 'Yau Tsim Mong': '油尖旺區', 'Yuen Long': '元朗區'
};
let locale = (() => { try { return localStorage.getItem('mosquitohk-language') === 'en' ? 'en' : 'zh'; } catch { return 'zh'; } })();
let staticTextNodes = [], localizedAttributes = [];
function captureTranslations() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const source = node.textContent, key = source.trim();
    if (Object.hasOwn(englishText, key)) staticTextNodes.push({node, source, key});
  }
  const attributes = [
    ['.sidebar','aria-label','Scenario settings'],
    ['.sidebar-tabs','aria-label','Settings panels'],
    ['.help','title','Uses the 2025 baseline with illustrative drier and heavy-rainfall factors.'],
    ['.segmented[aria-label="釋放方式"]','aria-label','Release frequency'],
    ['.segmented[aria-label="開始時間"]','aria-label','Intervention timing'],
    ['.allocation-list','aria-label','Spatial allocation'],
    ['#mapCanvas','aria-label','Hong Kong relative-abundance grid map'],
    ['#chart','aria-label','Hong Kong mean relative-abundance time series'],
    ['#daySlider','aria-label','Select map date'],
    ['#play','aria-label','Play time series'],
    ['#play','title','Play time series']
  ];
  localizedAttributes = attributes.map(([selector,name,en]) => {
    const element = document.querySelector(selector);
    return element ? {element,name,en,zh:element.getAttribute(name)} : null;
  }).filter(Boolean);
}
function translatePage() {
  const english = locale === 'en';
  document.documentElement.lang = english ? 'en' : 'zh-Hant';
  document.title = english ? 'MosquitoHK · Blue palette study' : 'MosquitoHK · 藍色配色方案';
  document.querySelector('meta[name="description"]').content = english
    ? 'Interactive demonstration of Wolbachia male releases and chemical vector control in Hong Kong.'
    : '香港蚊蟲防控策略互動示範：調整干預與穩健性設定，探索相對豐度的時間和空間變化。';
  staticTextNodes.forEach(({node,source,key}) => {
    node.textContent = english ? source.replace(key,englishText[key]) : source;
  });
  localizedAttributes.forEach(({element,name,en,zh}) => element.setAttribute(name,english ? en : zh));
  $('langZh').classList.toggle('active',!english);
  $('langEn').classList.toggle('active',english);
  $('langZh').setAttribute('aria-pressed',String(!english));
  $('langEn').setAttribute('aria-pressed',String(english));
  const playLabel = dynamicText[locale][state.playing ? 'pause' : 'play'];
  $('play').setAttribute('aria-label',playLabel);
  $('play').setAttribute('title',playLabel);
  $('chartTooltip').hidden=true;
  $('mapTooltip').hidden=true;
  updateControlLabels();
  if (data) { renderChart(); selectDay(state.selectedDay); }
}
function setLanguage(next) {
  locale = next;
  try { localStorage.setItem('mosquitohk-language',next); } catch {}
  translatePage();
}
let data, cellCount, peak, weekLinks, dayScales, risk, randomA, randomB;
let baseCurve = [], scenarioCurve = [], lowCurve = [], highCurve = [];
let canvasTransform = null, playback = null, recalcTimer = null;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const num = (id) => Number($(id).value);
const dateText = (iso) => { const d = new Date(`${iso}T00:00:00Z`); return locale === 'en' ? new Intl.DateTimeFormat('en-US',{timeZone:'UTC',year:'numeric',month:'long',day:'numeric'}).format(d) : `${d.getUTCFullYear()} 年 ${d.getUTCMonth()+1} 月 ${d.getUTCDate()} 日`; };
const shortDate = (iso) => { const d = new Date(`${iso}T00:00:00Z`); return locale === 'en' ? new Intl.DateTimeFormat('en-US',{timeZone:'UTC',month:'short',day:'numeric'}).format(d) : `${d.getUTCMonth()+1} 月 ${d.getUTCDate()} 日`; };

function updateControlLabels() {
  $('releaseValue').textContent = `${num('release').toFixed(1)}×`;
  $('larvaValue').textContent = `${num('larva')}%`;
  $('adultValue').textContent = `${num('adult')}%`;
  $('competitionValue').textContent = `${num('competition').toFixed(2)}×`;
  $('ciValue').textContent = `${num('ci')}%`;
  $('shortfallValue').textContent = `${num('shortfall')}%`;
  $('delayValue').textContent = locale === 'en' ? `${num('delay')} ${num('delay') === 1 ? 'day' : 'days'}` : `${num('delay')} 天`;
  $('drugFactorValue').textContent = `${num('drugFactor').toFixed(2)}×`;
  $('larvaControl').classList.toggle('visible', ['larvicide','both'].includes($('chemical').value));
  $('adultControl').classList.toggle('visible', ['adulticide','both'].includes($('chemical').value));
  $('bandLegend').style.display = $('uncertainty').checked ? 'flex' : 'none';
}

function weatherFactor(day) {
  if ($('weather').value === 'normal') return 1;
  const summer = Math.exp(-Math.pow((day - 205) / 78, 2));
  if ($('weather').value === 'dry') return 0.96 + 0.22 * summer - 0.05 * Math.exp(-Math.pow((day - 120) / 45, 2));
  return 1.04 - 0.24 * summer + 0.06 * Math.exp(-Math.pow((day - 265) / 50, 2));
}

function releaseKernel(lag) {
  return lag < 0 ? 0 : (1 - Math.exp(-lag / 11)) * Math.exp(-lag / 110);
}

function dailyEffects(day) {
  const start = ({pre: 119, rise: 179, peak: 232})[state.timing] + num('delay');
  const amount = num('release') * num('competition') * (num('ci') / 100) * (1 - num('shortfall') / 100);
  const strength = 0.68 * (1 - Math.exp(-0.48 * amount));
  let releaseShape;
  if (state.frequency === 'impulsive') releaseShape = releaseKernel(day - start);
  else {
    releaseShape = 0;
    for (let visit = 0; visit < 5; visit++) releaseShape += releaseKernel(day - start - visit * 16) / 5;
  }
  const chemical = $('chemical').value;
  const lag = day - start;
  const drugFactor = num('drugFactor');
  const larva = ['larvicide','both'].includes(chemical) && lag >= 0
    ? 0.48 * num('larva') / 100 * drugFactor * (1 - Math.exp(-lag / 14)) * Math.exp(-lag / 105) : 0;
  const adult = ['adulticide','both'].includes(chemical) && lag >= 0
    ? 0.55 * num('adult') / 100 * drugFactor * Math.exp(-lag / 56) : 0;
  return [clamp(strength * releaseShape * (1 - adult * 0.32), 0, 0.9), clamp(larva,0,0.9), clamp(adult,0,0.9)];
}

function allocationFactors(index) {
  const r = risk[index];
  const choice = document.querySelector('input[name="allocation"]:checked').value;
  if (choice === 'wolbachia') return [0.60 + 0.90*r, 1.30 - 0.52*r];
  if (choice === 'chemical') return [1.30 - 0.52*r, 0.60 + 0.90*r];
  if (choice === 'overlap') return [0.58 + 0.91*r, 0.58 + 0.91*r];
  return [0.45 + 1.08*randomA[index], 0.45 + 1.08*randomB[index]];
}

function dayCellValue(day, index, applyIntervention = true) {
  const [left, right, ratio] = weekLinks[day];
  const first = data.weekly[left][1][index], second = data.weekly[right][1][index];
  const baseline = (first + (second - first)*ratio) * dayScales[day] * weatherFactor(day);
  if (!applyIntervention) return baseline;
  const [wolbachia, larva, adult] = dailyEffects(day);
  const [wSpace, cSpace] = allocationFactors(index);
  return baseline * clamp(1 - wolbachia*wSpace,0.03,1) * clamp(1 - larva*cSpace,0.03,1) * clamp(1 - adult*cSpace,0.03,1);
}

function buildBaselineInterpolation() {
  cellCount = data.cells.length;
  peak = Math.max(...data.daily.map(row => row[1]));
  risk = data.cells.map(cell => clamp((cell[2] - 0.69) / 0.86, 0, 1));
  randomA = data.cells.map((_, i) => ((Math.imul(i+19, 16807) >>> 0) % 997) / 997);
  randomB = data.cells.map((_, i) => ((Math.imul(i+71, 48271) >>> 0) % 991) / 991);
  const firstDay = Date.parse('2025-01-01T00:00:00Z');
  const centers = data.weekly.map(([start]) => (Date.parse(`${start}T00:00:00Z`) - firstDay)/86400000 + 3);
  const means = data.weekly.map((week) => week[1].reduce((sum,v) => sum+v,0)/cellCount);
  weekLinks = []; dayScales = [];
  for (let day=0; day<365; day++) {
    let right = centers.findIndex(center => center >= day);
    if (right < 0) right = centers.length-1;
    const left = Math.max(0,right-1);
    const ratio = right === left ? 0 : clamp((day-centers[left])/(centers[right]-centers[left]),0,1);
    weekLinks.push([left,right,ratio]);
    const interpolatedMean = means[left] + (means[right]-means[left])*ratio;
    dayScales.push(data.daily[day][1] / Math.max(interpolatedMean,1e-9));
  }
}

function recalculate() {
  updateControlLabels();
  baseCurve = []; scenarioCurve = []; lowCurve = []; highCurve = [];
  const choice = document.querySelector('input[name="allocation"]:checked').value;
  const factors = data.cells.map((_,i) => allocationFactors(i));
  for (let day=0; day<365; day++) {
    const base = data.daily[day][1] * weatherFactor(day);
    const [w, l, a] = dailyEffects(day);
    const [left,right,ratio] = weekLinks[day];
    const w1 = data.weekly[left][1], w2 = data.weekly[right][1];
    let total = 0;
    for (let i=0; i<cellCount; i++) {
      const raw = (w1[i] + (w2[i]-w1[i])*ratio) * dayScales[day] * weatherFactor(day);
      const [wf,cf] = factors[i];
      total += raw * clamp(1-w*wf,0.03,1) * clamp(1-l*cf,0.03,1) * clamp(1-a*cf,0.03,1);
    }
    const scenario = total / cellCount;
    const span = Math.max(base*0.025, (base-scenario)*0.32);
    baseCurve.push(base); scenarioCurve.push(scenario);
    lowCurve.push(Math.max(0,scenario-span)); highCurve.push(Math.min(base*1.06,scenario+span));
  }
  renderChart();
  selectDay(state.selectedDay);
}

function svgEl(name, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg',name);
  Object.entries(attrs).forEach(([key,value]) => el.setAttribute(key,String(value)));
  return el;
}

function renderChart() {
  const chart = $('chart'); chart.replaceChildren();
  const chartWidth = window.innerWidth < 560 ? 480 : 940;
  chart.setAttribute('viewBox',`0 0 ${chartWidth} 266`);
  const plot = chartWidth === 480 ? {x:39,y:14,w:425,h:205} : {x:52,y:14,w:859,h:205};
  const max = Math.max(...baseCurve,...highCurve) * 1.14;
  const X = (i) => plot.x + i/364*plot.w;
  const Y = (v) => plot.y + plot.h - v/max*plot.h;
  for (let tick=0; tick<=4; tick++) {
    const value = max*tick/4, y=Y(value);
    chart.append(svgEl('line',{x1:plot.x,y1:y,x2:plot.x+plot.w,y2:y,class:'chart-grid'}));
    const label=svgEl('text',{x:plot.x-9,y:y+4,'text-anchor':'end',class:'chart-label'});
    label.textContent=`${Math.round(value/peak*100)}%`; chart.append(label);
  }
  const months=[0,59,120,181,243,304,364];
  months.forEach((day,j) => { const x=X(day); chart.append(svgEl('line',{x1:x,y1:plot.y+plot.h,x2:x,y2:plot.y+plot.h+5,class:'chart-axis'})); const label=svgEl('text',{x,y:plot.y+plot.h+21,'text-anchor':j===0?'start':j===6?'end':'middle',class:'chart-label'}); label.textContent=locale==='en'?['Jan','Mar','May','Jul','Sep','Nov','Dec'][j]:(j===6?'12 月':`${j*2+1} 月`); chart.append(label); });
  const path=(values) => values.map((v,i)=>`${i?'L':'M'}${X(i).toFixed(2)} ${Y(v).toFixed(2)}`).join(' ');
  if ($('uncertainty').checked) {
    const area = path(lowCurve)+highCurve.map((_,k)=>{const i=364-k; return `L${X(i).toFixed(2)} ${Y(highCurve[i]).toFixed(2)}`;}).join(' ')+'Z';
    chart.append(svgEl('path',{d:area,fill:'#43a675',opacity:'.18'}));
  }
  chart.append(svgEl('path',{d:path(baseCurve),fill:'none',stroke:'#7f8c82','stroke-width':'2.4','stroke-dasharray':'6 5','stroke-linecap':'round','stroke-linejoin':'round'}));
  chart.append(svgEl('path',{d:path(scenarioCurve),fill:'none',stroke:'#237a59','stroke-width':'3.2','stroke-linecap':'round','stroke-linejoin':'round'}));
  chart.append(svgEl('line',{id:'chartCursor',x1:0,y1:plot.y,x2:0,y2:plot.y+plot.h,class:'chart-hover'}));
  chart.append(svgEl('circle',{id:'baseDot',cx:0,cy:0,r:5,class:'chart-circle-base'}));
  chart.append(svgEl('circle',{id:'scenarioDot',cx:0,cy:0,r:6,class:'chart-circle-scenario'}));
  const hit=svgEl('rect',{x:plot.x,y:plot.y,width:plot.w,height:plot.h,class:'chart-hit'});
  hit.addEventListener('pointermove',(event)=>{
    const rect=chart.getBoundingClientRect();
    const chartX=(event.clientX-rect.left)/rect.width*chartWidth;
    const day=clamp(Math.round((chartX-plot.x)/plot.w*364),0,364);
    selectDay(day);
    const tip=$('chartTooltip');
    tip.hidden=false;
    tip.innerHTML=`<b>${shortDate(data.daily[day][0])}</b><br>${dynamicText[locale].baseline} ${formatPercent(baseCurve[day])}<br>${dynamicText[locale].strategy} ${formatPercent(scenarioCurve[day])}`;
    const wrap=$('chart').parentElement.getBoundingClientRect();
    tip.style.left=`${clamp(event.clientX-wrap.left+12,12,Math.max(12,wrap.width-tip.offsetWidth-12))}px`;
    tip.style.top=`${clamp(event.clientY-wrap.top-57,4,wrap.height-70)}px`;
  });
  hit.addEventListener('pointerleave',()=>{$('chartTooltip').hidden=true;});
  chart.append(hit);
  chart.dataset.x=plot.x;chart.dataset.width=plot.w;chart.dataset.y=plot.y;chart.dataset.height=plot.h;chart.dataset.max=max;
}

function formatPercent(value) { return `${Math.round(value/peak*100)}%`; }
function updateChartCursor(day) {
  const chart=$('chart'), x=Number(chart.dataset.x)+day/364*Number(chart.dataset.width);
  const y=(value)=>Number(chart.dataset.y)+Number(chart.dataset.height)-value/Number(chart.dataset.max)*Number(chart.dataset.height);
  $('chartCursor').setAttribute('x1',x); $('chartCursor').setAttribute('x2',x);
  $('baseDot').setAttribute('cx',x); $('baseDot').setAttribute('cy',y(baseCurve[day]));
  $('scenarioDot').setAttribute('cx',x); $('scenarioDot').setAttribute('cy',y(scenarioCurve[day]));
}

const colorStops=[[0,[43,171,108]],[.65,[43,171,108]],[.75,[55,174,100]],[.83,[117,199,88]],[.90,[217,217,71]],[.96,[244,179,51]],[1.02,[235,106,48]],[1.08,[214,62,49]],[2.1,[174,39,42]]];
function colorFor(value) {
  const x=clamp(value/peak,0,2.1);
  for(let s=1;s<colorStops.length;s++) if(x<=colorStops[s][0]) {
    const [a,ca]=colorStops[s-1], [b,cb]=colorStops[s],t=(x-a)/(b-a);
    return `rgb(${ca.map((v,i)=>Math.round(v+(cb[i]-v)*t)).join(',')})`;
  }
  return 'rgb(174,39,42)';
}

function drawMap() {
  const canvas=$('mapCanvas'), bounds=canvas.getBoundingClientRect(), dpr=window.devicePixelRatio||1;
  const width=Math.max(1,bounds.width),height=Math.max(1,bounds.height);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const size=Math.min((width-54)/71,(height-26)/48);
  const x0=(width-size*71)/2,y0=(height-size*48)/2;
  canvasTransform={x0,y0,size,width,height};
  ctx.save();
  for (let i=0;i<cellCount;i++) {
    const [col,row]=data.cells[i];
    const x=x0+col*size, y=y0+(47-row)*size;
    ctx.fillStyle=colorFor(dayCellValue(state.selectedDay,i));
    ctx.fillRect(x+.16,y+.16,Math.max(1,size-.32),Math.max(1,size-.32));
  }
  ctx.restore();
  ctx.fillStyle='#557363';ctx.font='600 14px Arial, sans-serif';
  const gridLabel=locale === 'en' ? '1 km × 1 km grid' : '1 km × 1 km 格網';
  ctx.fillText(gridLabel,width-ctx.measureText(gridLabel).width-18,25);
}

function selectDay(day) {
  state.selectedDay=clamp(day,0,364);
  const iso=data.daily[state.selectedDay][0];
  $('daySlider').value=state.selectedDay;
  $('sliderDate').textContent=shortDate(iso);
  $('metricDate').textContent=shortDate(iso);
  $('mapDate').textContent=dateText(iso);
  $('metricAbundance').textContent=formatPercent(scenarioCurve[state.selectedDay]);
  const base=baseCurve[state.selectedDay],scenario=scenarioCurve[state.selectedDay];
  $('metricReduction').textContent=base>0?`${Math.max(0,Math.round((1-scenario/base)*100))}%`:'—';
  updateChartCursor(state.selectedDay);
  drawMap();
}

function wireControls() {
  controls.forEach(id=>$(id).addEventListener('input',()=>{updateControlLabels();clearTimeout(recalcTimer);recalcTimer=setTimeout(recalculate,45);}));
  document.querySelectorAll('input[name="allocation"]').forEach(input=>input.addEventListener('change',recalculate));
  document.querySelectorAll('.segmented button').forEach(button=>button.addEventListener('click',()=>{
    const group=button.dataset.group;
    state[group]=button.dataset.value;
    document.querySelectorAll(`.segmented button[data-group="${group}"]`).forEach(item=>item.classList.toggle('active',item===button));
    recalculate();
  }));
  for (const [tab,panel] of [['tabStrategy','panelStrategy'],['tabRobust','panelRobust']]) {
    $(tab).addEventListener('click',()=>{
      for(const [t,p] of [['tabStrategy','panelStrategy'],['tabRobust','panelRobust']]) {
        const active=t===tab;$(t).classList.toggle('active',active);$(t).setAttribute('aria-selected',active);$(p).hidden=!active;
      }
    });
  }
  $('daySlider').addEventListener('input',()=>selectDay(Number($('daySlider').value)));
  $('play').addEventListener('click',()=>{
    state.playing=!state.playing;
    $('play').textContent=state.playing?'Ⅱ':'▶';
    const playLabel=dynamicText[locale][state.playing?'pause':'play'];
    $('play').setAttribute('aria-label',playLabel);
    $('play').setAttribute('title',playLabel);
    clearInterval(playback);
    if(state.playing) playback=setInterval(()=>selectDay((state.selectedDay+2)%365),90);
  });
  $('reset').addEventListener('click',()=>{
    const defaults={weather:'normal',release:'2',chemical:'none',larva:'55',adult:'45',competition:'1',ci:'95',shortfall:'0',delay:'0',drugFactor:'1'};
    Object.entries(defaults).forEach(([id,value])=>{$(id).value=value;});
    $('uncertainty').checked=true;
    document.querySelector('input[name="allocation"][value="wolbachia"]').checked=true;
    state.frequency='impulsive';state.timing='rise';
    document.querySelectorAll('.segmented button').forEach(button=>button.classList.toggle('active',state[button.dataset.group]===button.dataset.value));
    recalculate();
  });
  $('mapCanvas').addEventListener('pointermove',(event)=>{
    if(!canvasTransform)return;
    const rect=$('mapCanvas').getBoundingClientRect();
    const x=event.clientX-rect.left,y=event.clientY-rect.top;
    const col=Math.floor((x-canvasTransform.x0)/canvasTransform.size);
    const row=47-Math.floor((y-canvasTransform.y0)/canvasTransform.size);
    const index=cellLookup.get(`${col},${row}`);
    const tip=$('mapTooltip');
    if(index===undefined){tip.hidden=true;return;}
    tip.hidden=false;
    const district = data.districts[data.cells[index][4]];
    tip.innerHTML=`<b>${locale === 'en' ? district : districtNamesZh[district]}</b><br>${dynamicText[locale].relative} ${formatPercent(dayCellValue(state.selectedDay,index))}`;
    tip.style.left=`${clamp(x+14,10,Math.max(10,rect.width-tip.offsetWidth-10))}px`;
    tip.style.top=`${clamp(y-47,5,rect.height-52)}px`;
  });
  $('mapCanvas').addEventListener('pointerleave',()=>{$('mapTooltip').hidden=true;});
  $('langZh').addEventListener('click',()=>setLanguage('zh'));
  $('langEn').addEventListener('click',()=>setLanguage('en'));
  window.addEventListener('resize',()=>{if(data){renderChart();updateChartCursor(state.selectedDay);drawMap();}});
}

let cellLookup;
async function init() {
  try {
    const response=await fetch('./baseline-2025.json');
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    data=await response.json();
    cellLookup=new Map(data.cells.map((cell,i)=>[`${cell[0]},${cell[1]}`,i]));
    buildBaselineInterpolation();
    wireControls();recalculate();
  } catch(error) {
    console.error(error);
    $('mapDate').textContent=dynamicText[locale].loadError;
    $('chartHeading').textContent=dynamicText[locale].chartError;
  }
}
captureTranslations();
translatePage();
init();
