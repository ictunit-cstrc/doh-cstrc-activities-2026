 let activities = {};
    function groupByMonth(activities) {
      return activities.reduce((result, item) => {
        const date = new Date(item.DATE);
        const month = date.toLocaleString("en-US", { month: "long" });

        if (!result[month]) {
          result[month] = [];
        }

        result[month].push({
          ...item,
          displayDate: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          })
        });

        return result;
      }, {});
    }

  fetch("json/activities.json")
  .then(res => res.json())
  .then(data => {
     activities = groupByMonth(data);
   renderMonths();
  });
  
function renderMonths() {
  const monthsEl = document.getElementById('months');
  monthsEl.innerHTML = '';

  Object.keys(activities).forEach(month => {

    const col = document.createElement('div');
    col.className = 'col-4';

    const item = document.createElement('div');
    item.className = 'item wow fadeIn';
    item.onclick = () => openModal(month);

    const icon = document.createElement('div');
    icon.className = 'item-logo';
    icon.innerHTML = '<i class="fa fa-calendar"></i>';

    const rightText = document.createElement('div');
    rightText.className = 'right-text';
    rightText.innerHTML = `
      <h4 style="font-size:12pt;">${month}</h4>
     
    `;

    item.appendChild(icon);
    item.appendChild(rightText);
    col.appendChild(item);
    monthsEl.appendChild(col);
  });
}

function openModal(month) {
    document.getElementById('modalTitle').textContent = month + ' 2026';
    const body = document.getElementById('tbldata');
    body.innerHTML = '';
    
    // Get today's date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight
    
    activities[month].forEach(act => {
      const date = new Date(act.DATE);
      date.setHours(0, 0, 0, 0); // Reset time to midnight
      
      const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
     
      const keywords = ["HOLIDAY", "NON-WORKING DAY","SPECIAL WORKING DAY","NON WORKING DAY"];
      const isHoliday = keywords.some(keyword =>
        act.ACTIVITY.toUpperCase().includes(keyword)
      );
      
      // Check if the activity date is in the past
      const isPast = date < today;
      
      // Build class list
      let rowClass = '';
      if (isHoliday) rowClass += 'holiday ';
      if (isPast) rowClass += 'past-activity';
      
      body.innerHTML += `<tr class="${rowClass.trim()}">
                <td>${formatted}</td>
                <td>${act.ACTIVITY}</td>
                <td>${act.VENUE}</td>
                <td>${act.PROPONENT}</td>
                <td>${act.ATTENDEES}</td>
              </tr>`;
    });
    document.getElementById('modal').style.display = 'flex';
}

  function closeModal() {
    document.getElementById('modal').style.display = 'none';

  }






