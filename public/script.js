const itemsData = [
  {
    "code": 777444,
    "family": "טלה",
    "name": "אוסובוקו טלה"
  },
  {
    "code": 888402,
    "family": "טלה",
    "name": "טלה טרי עם עצם"
  },
  {
    "code": 888084,
    "family": "טלה",
    "name": "צווואר טלה"
  },
  {
    "code": 888407,
    "family": "מיוחדים",
    "name": "אשכי הודו"
  },
  {
    "code": 888407,
    "family": "מיוחדים",
    "name": "אשכי טלה"
  },
  {
    "code": 888411,
    "family": "מיוחדים",
    "name": "חלקי פנים טלה"
  },
  {
    "code": 887831,
    "family": "מיוחדים",
    "name": "כבד אווז קפוא"
  },
  {
    "code": 57813,
    "family": "מיוחדים",
    "name": "מוח טלה טרי"
  },
  {
    "code": 888466,
    "family": "מיוחדים",
    "name": "קריספי"
  },
  {
    "code": 888467,
    "family": "מיוחדים",
    "name": "קריספי רול"
  },
  {
    "code": 57031,
    "family": "מיוחדים",
    "name": "לסת טלה"
  },
  {
    "code": 432691,
    "family": "מיוחדים",
    "name": "לשון"
  },
  {
    "code": 631144,
    "family": "עגל",
    "name": "שוקיים עגל"
  },
  {
    "code": 888401,
    "family": "עוף",
    "name": "כנפיים עוף"
  },
  {
    "code": 888403,
    "family": "עוף",
    "name": "חזה עוף טרי"
  },
  {
    "code": 888405,
    "family": "כבש",
    "name": "צלעות כבש"
  },
  {
    "code": 888409,
    "family": "כבש",
    "name": "רגל כבש"
  },
  {
    "code": 888410,
    "family": "כבש",
    "name": "כתף כבש"
  },
  {
    "code": 888412,
    "family": "עגל",
    "name": "כתף עגל"
  },
  {
    "code": 888413,
    "family": "עגל",
    "name": "צוואר עגל"
  },
  {
    "code": 888414,
    "family": "עגל",
    "name": "שייטל עגל"
  },
  {
    "code": 888415,
    "family": "עגל",
    "name": "פילה עגל"
  },
  {
    "code": 888416,
    "family": "עגל",
    "name": "אנטריקוט עגל"
  },
  {
    "code": 888417,
    "family": "עגל",
    "name": "סינטה עגל"
  },
  {
    "code": 888418,
    "family": "עגל",
    "name": "ברך עגל"
  },
  {
    "code": 888419,
    "family": "עגל",
    "name": "חזה עגל"
  },
  {
    "code": 888420,
    "family": "עגל",
    "name": "קשת עגל"
  },
  {
    "code": 888421,
    "family": "עגל",
    "name": "צלעות עגל"
  },
  {
    "code": 888422,
    "family": "עגל",
    "name": "גולש עגל"
  },
  {
    "code": 888423,
    "family": "עגל",
    "name": "חלקים טחונים עגל"
  },
  {
    "code": 888424,
    "family": "עגל",
    "name": "שומן עגל"
  },
  {
    "code": 888425,
    "family": "עגל",
    "name": "עצמות עגל"
  },
  {
    "code": 888426,
    "family": "עגל",
    "name": "לשון עגל"
  }
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
