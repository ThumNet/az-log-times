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

function createEntryElement(entry) {
  const div = document.createElement('div');
  div.className = 'logentry'
  div.innerHTML = `${entry.date.toJSON()} (${entry.diffInMs}ms) ${entry.text}`;
  return div;
}

function renderEntries(entries) {
  let preElm = document.getElementsByTagName('pre')[0];
  
  entries.forEach(entry => {
    document.body.appendChild(createEntryElement(entry));
  });
  
  preElm.style.display = 'none';
}

function renderTimeLine(entries) {
  console.log(entries.length);
  console.log(entries[entries.length-1].date - entries[0].date);
}

let entries = readLog();
renderTimeLine(entries);
renderEntries(entries);
