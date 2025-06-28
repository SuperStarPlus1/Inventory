const itemsData = [
  {"code": 777444, "family": "טלה", "name": "אוסובוקו טלה"},
  {"code": 888402, "family": "טלה", "name": "טלה טרי עם עצם"},
  {"code": 888084, "family": "טלה", "name": "צווואר טלה"},
  {"code": 888407, "family": "מיוחדים", "name": "אשכי הודו"},
  {"code": 888407, "family": "מיוחדים", "name": "אשכי טלה"},
  {"code": 888411, "family": "מיוחדים", "name": "חלקי פנים טלה"},
  {"code": 887831, "family": "מיוחדים", "name": "כבד אווז קפוא"},
  {"code": 57813, "family": "מיוחדים", "name": "מוח טלה טרי"},
  {"code": 888466, "family": "מיוחדים", "name": "קריספי"},
  {"code": 888467, "family": "מיוחדים", "name": "קריספי רול"},
  {"code": 57031, "family": "מיוחדים", "name": "לסת טלה"},
  {"code": 432691, "family": "מיוחדים", "name": "לשון"},
  {"code": 631144, "family": "עגל", "name": "אחורי עגל בלי סינטה"},
  {"code": 631134, "family": "עגל", "name": "אחורי עגלה עם סינטה"},
  {"code": 888070, "family": "עגל", "name": "אנטריקוט עגל טרי"},
  {"code": 888529, "family": "עגל", "name": "אסאדו עגל עם עצם"},
  {"code": 888000, "family": "עגל", "name": "המבורגר שקיל"},
  {"code": 888455, "family": "עגל", "name": "נקניקיות חריפות/שאריות"},
  {"code": 888410, "family": "עגל", "name": "סינטה משוישת"},
  {"code": 57129, "family": "עגל", "name": "פולי עגל"},
  {"code": 888082, "family": "עגל", "name": "פילה עגלה"},
  {"code": 631231, "family": "עגל", "name": "קדמי עגלה בלי ברוסט"},
  {"code": 9720000000902, "family": "עגל", "name": "קפוא מספר 3"},
  {"code": 320211, "family": "עגל", "name": "קפוא צלעות מספר 2"},
  {"code": 888453, "family": "עוף", "name": "חזה עוף"},
  {"code": 888009, "family": "עוף", "name": "חזה עוף עם עצם"},
  {"code": 888464, "family": "עוף", "name": "ירכיים עוף טרי"},
  {"code": 888463, "family": "עוף", "name": "כבד עוף"},
  {"code": 888456, "family": "עוף", "name": "כנפיים עוף"},
  {"code": 888459, "family": "עוף", "name": "כרעיים עוף"},
  {"code": 888055, "family": "עוף", "name": "לבבות עוף"},
  {"code": 888006, "family": "עוף", "name": "עוף שלם במשקל"},
  {"code": 888008, "family": "עוף", "name": "פרגית עם עור"}
];

const hookWeight = 0.4;
const boxWeight = 1.7;
const summary = {};

window.onload = function () {
  const familySelect = document.getElementById("family");
  const itemSelect = document.getElementById("item");

  // Create search input
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "חפש לפי שם פריט...";
  searchInput.style.marginTop = "10px";
  searchInput.style.width = "100%";
  searchInput.id = "searchInput";
  itemSelect.parentNode.insertBefore(searchInput, itemSelect.nextSibling);

  // Populate unique families
  const families = [...new Set(itemsData.map((item) => item.family))];
  families.forEach((fam) => {
    const opt = document.createElement("option");
    opt.value = fam;
    opt.textContent = fam;
    familySelect.appendChild(opt);
  });

  function updateItemList() {
    const selectedFamily = familySelect.value;
    const searchTerm = searchInput.value.trim().toLowerCase();
    itemSelect.innerHTML = "";
    const filtered = itemsData.filter((item) =>
      item.family === selectedFamily &&
      (item.name.toLowerCase().includes(searchTerm) || item.code.toString().includes(searchTerm))
    );
    if (filtered.length === 0) {
      const opt = document.createElement("option");
      opt.textContent = "לא נמצאו תוצאות";
      itemSelect.appendChild(opt);
    } else {
      filtered.forEach((item) => {
        const opt = document.createElement("option");
        opt.value = item.code;
        opt.textContent = `${item.name} (${item.code})`;
        itemSelect.appendChild(opt);
      });
    }
  }
  familySelect.onchange = updateItemList;
  searchInput.oninput = updateItemList;
  familySelect.dispatchEvent(new Event("change"));
};

function addEntry() {
  const itemCode = document.getElementById("item").value;
  const itemName = document.getElementById("item").selectedOptions[0].text;
  const gross = parseFloat(document.getElementById("gross").value);
  const hooks = parseInt(document.getElementById("hooks").value);
  const boxes = parseInt(document.getElementById("boxes").value);

  if (isNaN(gross)) return alert("יש להזין משקל ברוטו תקין.");

  const net = +(gross - (hooks * hookWeight) - (boxes * boxWeight)).toFixed(2);

  if (!summary[itemCode]) {
    summary[itemCode] = { name: itemName, net: 0 };
  }
  summary[itemCode].net += net;
  summary[itemCode].net = +summary[itemCode].net.toFixed(2);

  updateTable();

  document.getElementById("gross").value = "";
  document.getElementById("hooks").value = 0;
  document.getElementById("boxes").value = 0;
}

function updateTable() {
  const tbody = document.querySelector("#summary tbody");
  tbody.innerHTML = "";

  for (const code in summary) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${code}</td>
      <td>${summary[code].name}</td>
      <td>${summary[code].net}</td>
    `;
    tbody.appendChild(row);
  }
}
