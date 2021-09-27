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

function renderEntries(entries) {
  const entriesElm = document.createElement('div');
  entriesElm.className = 'entries';

  entries.forEach((entry, ix) => {
    entriesElm.appendChild(createEntryElement(entry, ix));
  });

  return entriesElm;
}

function highlightEntry(ev) {
  const highlightIx = ev.target.dataset.ix;
  const toHighlight = document.querySelector(`.logentry.item${highlightIx}`);
  toHighlight.classList.toggle('highlight');
  if (toHighlight.classList.contains('highlight')){ 
    toHighlight.scrollIntoView(false);
  }
}


function renderTimeline(entries, totalMs) {
  
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

  return container;
}

function renderTotals(totalMs) {
  const totalText = document.createElement('div');
  totalText.className = 'total'
  totalText.innerText = `Total duration: ${totalMs}ms`
  return totalText;
}

function createDiv(className, child) {
  const row = document.createElement('div');
  row.className = className;
  row.appendChild(child);
  return row;
}

function render() {
  const entries = readLog();
  const totalMs = entries[entries.length-1].date - entries[0].date;

  const box = document.createElement('div');
  box.className = 'box';
  box.appendChild(createDiv('row header', renderTimeline(entries, totalMs)));
  box.appendChild(createDiv('row content', renderEntries(entries)));
  box.appendChild(createDiv('row footer', renderTotals(totalMs)));
  document.body.appendChild(box);  
  const preElm = document.getElementsByTagName('pre')[0];  
  preElm.style.display = 'none';
}

render();
