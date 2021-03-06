function readLog() {

  let preElm = document.getElementsByTagName('pre')[0];
  let logLines = preElm.textContent.split('\n');

  // 2021-09-24T08:18:31.4144710Z
  let entries = [];
  for (let i = 0; i < logLines.length; i++)
  {
    let line = logLines[i];
    if (line.length === 0) continue;
    // let year = line.substr(0, 4);
    // let month = line.substr(5, 2);
    // let day = line.substr(8, 2);
    // let hour = line.substr(11, 2);
    // let minute = line.substr(14, 2);
    // let second = line.substr(17, 2);
    // let millis = line.substr(20, 7);
    let text = line.substr(29);
    let date = new Date(line.substr(0, 28));
    let diffInMs = i === 0 ? 0 : date - entries[i-1].date;
    entries.push({date, diffInMs, text});
  }
  
  return entries;
} 

function createEntryElement(entry, index) {
  const div = document.createElement('div');
  div.className = `logentry item${index}`;  
  div.innerHTML = `${entry.date.toJSON()} ${entry.text}`;
  const span = document.createElement('span');
  span.className = 'duration';
  span.innerText = `${entry.diffInMs}ms`
  div.appendChild(span);
  return div;
}

function renderEntries(entries, parentElm) {
  const entriesElm = document.createElement('div');
  entriesElm.className = 'entries';

  entries.forEach((entry, ix) => {
    entriesElm.appendChild(createEntryElement(entry, ix));
  });

  parentElm.appendChild(entriesElm);
}

function highlightEntry(ev) {
  const highlightIx = ev.target.dataset.ix;
  const toHighlight = document.querySelector(`.logentry.item${highlightIx}`);
  toHighlight.classList.toggle('highlight');
  if (toHighlight.classList.contains('highlight')){ 
    toHighlight.scrollIntoView(false);
  }
}

function calcIndicator(total, maxItems) {
  let sizes = [500000, 100000, 50000, 10000, 5000, 1000, 500, 100];
  let x = 0;
  while (x < sizes.length - 1 && (total / sizes[x+1] < maxItems)) {
    x++;
  }
  return sizes[x];
}


function renderTimeline(entries, totalMs, parentElm) {
  
  function map(value, valueRangeStart, valueRangeEnd, newRangeStart, newRangeEnd) {
    return newRangeStart + (newRangeEnd - newRangeStart) * ((value - valueRangeStart) / (valueRangeEnd - valueRangeStart));
  }

  const container = document.createElement('div');
  container.className = 'timeline';
  entries.forEach((entry, ix) => {
    const e = document.createElement('div');
    let value = map(entry.diffInMs, 0, totalMs, 0, 100);
    e.style.width = value + '%';
    e.dataset.ix = ix;
    e.addEventListener('mouseover', highlightEntry);
    e.addEventListener('mouseout', highlightEntry);
    container.appendChild(e);
  });

  // visual timeline indicators
  // we want to see 5 indicators and the total on the right side
  const indicators = document.createElement('div');
  indicators.className = 'indicators';
  const maxIndicators = 5;
  const indictatorSize = calcIndicator(totalMs, maxIndicators);
  for (let i=1; i<maxIndicators; i++) {
    const indElm = createDiv('indicator');
    indElm.style.width = map(indictatorSize, 0, totalMs, 0, 100) + '%';
    indElm.innerHTML = (indictatorSize * i) + '&nbsp;';
    indicators.appendChild(indElm);
  }
  const totalElm = document.createElement('div');
  totalElm.className = 'indicator-total';
  totalElm.style.width = map(totalMs - (indictatorSize * (maxIndicators -1)), 0, totalMs, 0, 100) + '%';
  totalElm.innerText = `Total ${totalMs}ms`;
  indicators.appendChild(totalElm);
  
  parentElm.appendChild(container);
  parentElm.appendChild(indicators);
}

function renderTotals(totalMs, parentElm) {
  const totalText = document.createElement('div');
  totalText.className = 'total'
  totalText.innerText = `Total duration: ${totalMs}ms`
  parentElm.appendChild(totalText);
}

function createDiv(className) {
  const row = document.createElement('div');
  row.className = className;
  return row;
}

function render() {
  const entries = readLog();
  const totalMs = entries[entries.length-1].date - entries[0].date;

  const box = createDiv('box');
  const header = createDiv('row header');
  const content = createDiv('row content');
  const footer = createDiv('row footer');
  renderTimeline(entries, totalMs, header);
  renderEntries(entries, content);
  renderTotals(totalMs, footer);
  box.appendChild(header);
  box.appendChild(content);
  box.appendChild(footer);
  document.body.appendChild(box);  
  const preElm = document.getElementsByTagName('pre')[0];  
  preElm.style.display = 'none';
}

render();
