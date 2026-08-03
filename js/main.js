// Main Application Controller for NCSA IT Support Dashboard (Top Pill Nav Style)

document.addEventListener('DOMContentLoaded', () => {
  initDateDisplay();
  initTabNavigation();
  renderHardwareTable();
  renderLicenseCards();
  renderCaseTable();
  renderProjectCards();
  initAllCharts();
  initOverviewWidgets();
  initModalListeners();
});

// Format Current Date in Thai Format
function initDateDisplay() {
  const dateEl = document.getElementById('currentDateText');
  if (dateEl) {
    const now = new Date();
    const d = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    dateEl.innerHTML = `<i class="fa-regular fa-calendar"></i> ${d}`;
  }
  const todayBadge = document.getElementById('todayBadge');
  if (todayBadge) {
    const now = new Date();
    todayBadge.innerHTML = `<i class="fa-regular fa-calendar"></i> ${now.toLocaleDateString('th-TH', { day:'numeric', month:'short', year:'numeric' })}`;
  }
}

// Tab Switching Navigation Engine
function initTabNavigation() {
  const pills = document.querySelectorAll('.nav-pill');
  const views = document.querySelectorAll('.page-view');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetId = pill.getAttribute('data-target');

      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      views.forEach(v => {
        v.classList.toggle('active', v.id === targetId);
      });

      window.dispatchEvent(new Event('resize'));
    });
  });
}

// --------------------------------------------------------------------------
// OVERVIEW WIDGETS — fill dynamic elements
// --------------------------------------------------------------------------
function initOverviewWidgets() {
  updateKpiCards();
  buildDeptLegend();
  buildRecentCaseList();
  buildDataActivityList();
  initSparklineSLA();
}

function updateKpiCards() {
  const totalHW = NCSA_DATA.hardware.length;
  const totalReams = NCSA_DATA.paperUsage.monthlyTrend.reduce((s,d)=>s+d.reams,0);
  const totalSeats = NCSA_DATA.licenses.reduce((s,l)=>s+l.totalSeats,0);
  const totalCases = NCSA_DATA.cases.length;
  const totalProj = NCSA_DATA.projects.length;

  setEl('kpiHW',    totalHW.toLocaleString());
  setEl('kpiPaper', totalReams.toLocaleString());
  setEl('kpiLic',   totalSeats.toLocaleString());
  setEl('kpiCase',  totalCases);
  setEl('kpiProj',  totalProj);
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

const DEPT_COLORS = ['#3b82f6','#1e3a8a','#dc2626','#10b981','#f59e0b','#8b5cf6'];

function buildDeptLegend() {
  const container = document.getElementById('deptLegendList');
  if (!container) return;
  const depts = ['สบก.', 'สปซ.', 'สยป.', 'สวบ.', 'สกส.', 'สสท.'];
  const counts = depts.map(code => NCSA_DATA.hardware.filter(h => h.deptCode===code || h.dept.includes(code)).length);
  const total = counts.reduce((a,b)=>a+b,0) || 1;

  container.innerHTML = depts.map((d,i)=>{
    const pct = Math.round(counts[i]/total*100);
    return `<div class="legend-item">
      <div class="legend-dot-label">
        <span class="legend-dot" style="background:${DEPT_COLORS[i]};"></span>
        ${d}
      </div>
      <div class="legend-bar-wrap">
        <div class="legend-bar-fill" style="width:${pct}%;background:${DEPT_COLORS[i]};"></div>
      </div>
      <span class="legend-val">${counts[i]} (${pct}%)</span>
    </div>`;
  }).join('');
}

function buildRecentCaseList() {
  const container = document.getElementById('recentCaseList');
  if (!container) return;
  const recent = [...NCSA_DATA.cases].slice(-5).reverse();

  let sevColor = {Critical:'#dc2626', High:'#f97316', Medium:'#3b82f6', Low:'#22c55e'};
  container.innerHTML = recent.map(c => {
    const initials = c.assignee.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || 'IT';
    return `<div class="activity-item">
      <div class="activity-avatar" style="background:#eff6ff;color:#1e3a8a;">${initials}</div>
      <div class="activity-info">
        <div class="activity-name">${c.id}</div>
        <div class="activity-detail">${c.title.slice(0,38)}...</div>
      </div>
      <span class="badge" style="background:${sevColor[c.severity]||'#64748b'}20;color:${sevColor[c.severity]||'#64748b'};font-size:0.65rem;">${c.severity}</span>
    </div>`;
  }).join('');
}

function buildDataActivityList() {
  const container = document.getElementById('dataActivityList');
  if (!container) return;
  const dig = NCSA_DATA.paperUsage?.printVsDigitalRatio?.digitalDocPercent ?? 67;
  const pap = NCSA_DATA.paperUsage?.printVsDigitalRatio?.paperDocPercent ?? 33;

  const miniLabel = document.getElementById('miniDonutLabel');
  if (miniLabel) miniLabel.textContent = `${dig}%`;

  container.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;align-items:center;gap:6px;">
        <span class="legend-dot" style="background:#10b981;"></span>
        <span style="font-weight:600;color:#1e293b;">e-Document</span>
        <span style="margin-left:auto;font-weight:700;color:#10b981;">${dig}%</span>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <span class="legend-dot" style="background:#dc2626;"></span>
        <span style="font-weight:600;color:#1e293b;">Paper Doc</span>
        <span style="margin-left:auto;font-weight:700;color:#dc2626;">${pap}%</span>
      </div>
      <div style="margin-top:4px;padding-top:6px;border-top:1px solid #f1f5f9;font-size:0.68rem;color:#64748b;">
        <i class="fa-solid fa-leaf" style="color:#10b981;"></i> ลดการใช้กระดาษ ${100-pap}% YoY
      </div>
    </div>`;
}

function initSparklineSLA() {
  const canvas = document.getElementById('sparklineSLA');
  if (!canvas) return;

  const total = NCSA_DATA.cases.length || 1;
  const onTime = NCSA_DATA.cases.filter(c => c.slaStatus !== 'เกินกำหนด SLA').length;
  const pct = Math.round(onTime/total*100);
  setEl('slaValue', pct + '%');

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.'],
      datasets: [{
        data: [92,94,96,95,97,98,pct],
        fill: true,
        backgroundColor: 'rgba(13,148,136,0.12)',
        borderColor: '#0d9488',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: {display:false}, tooltip: {enabled:false} },
      scales: { x: {display:false}, y: {display:false, min:85, max:100} },
      animation: { duration: 1200, easing: 'easeOutQuart' }
    }
  });
}

// --------------------------------------------------------------------------
// EXCEL FILE IMPORT & DYNAMIC UPDATE ENGINE (.xlsx / .csv)
// --------------------------------------------------------------------------

function triggerExcelUpload() {
  const input = document.getElementById('excelFileInput');
  if (input) input.click();
}

function handleExcelUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // 1. Process Hardware Sheet
      if (workbook.SheetNames.some(s => s.includes('Hardware') || s.includes('ฮาร์ดแวร์'))) {
        const sheetName = workbook.SheetNames.find(s => s.includes('Hardware') || s.includes('ฮาร์ดแวร์'));
        const rawHW = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        if (rawHW.length > 0) {
          NCSA_DATA.hardware = rawHW.map((row, index) => ({
            id: row['รหัสสินทรัพย์'] || row['id'] || `HW-NEW-${index + 1}`,
            name: row['ชื่ออุปกรณ์ / สเปค'] || row['name'] || 'อุปกรณ์ไอที',
            type: row['ประเภทอุปกรณ์'] || row['type'] || 'คอมพิวเตอร์',
            holder: row['ชื่อผู้ถือครอง (Holder)'] || row['holder'] || 'ไม่ระบุ',
            recipient: row['ชื่อผู้รับ / ผู้ใช้งานจริง'] || row['recipient'] || 'ไม่ระบุ',
            ip: row['IP Address'] || row['ip'] || '10.10.x.x',
            mac: row['MAC Address'] || row['mac'] || '00:00:00:00:00:00',
            dept: row['สำนักผู้ใช้'] || row['dept'] || 'สำนักบริหารงานกลาง',
            deptCode: row['รหัสสำนัก'] || row['deptCode'] || 'สบก.',
            status: row['สถานะ'] || row['status'] || 'ใช้งานปกติ',
            serial: row['Serial Number'] || row['serial'] || 'N/A',
            location: row['สถานที่ติดตั้ง'] || row['location'] || 'อาคาร สกมช.',
            receivedDate: row['วันที่รับมอบ'] || row['receivedDate'] || '2026-01-01'
          }));
        }
      }

      // 2. Process Cases Sheet
      if (workbook.SheetNames.some(s => s.includes('Case') || s.includes('เคส'))) {
        const sheetName = workbook.SheetNames.find(s => s.includes('Case') || s.includes('เคส'));
        const rawCases = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        if (rawCases.length > 0) {
          NCSA_DATA.cases = rawCases.map((row, index) => ({
            id: row['Case ID'] || row['id'] || `IT-CASE-2026-${index + 100}`,
            title: row['หัวข้อคำขอรับบริการ'] || row['title'] || 'คำขอซ่อมไอที',
            severity: row['ความด่วน'] || row['severity'] || 'Medium',
            dept: row['สำนักที่ขอซ่อม'] || row['dept'] || 'สำนักบริหารงานกลาง',
            deptCode: row['รหัสสำนัก'] || row['deptCode'] || 'สบก.',
            reporter: row['ผู้แจ้งเรื่อง'] || row['reporter'] || 'เจ้าหน้าที่',
            assignee: row['ช่าง IT ผู้รับผิดชอบ'] || row['assignee'] || 'ทีมงาน IT Support',
            status: row['สถานะการแก้ไข'] || row['status'] || 'เสร็จสิ้น',
            reportedDate: row['วันที่แจ้ง'] || row['reportedDate'] || '2026-07-27',
            slaStatus: row['สถานะ SLA'] || row['slaStatus'] || 'อยู่ในเวลา SLA',
            description: row['สรุปการแก้ไข'] || row['description'] || 'ดำเนินการเข้าตรวจสอบและแก้ไขเรียบร้อย'
          }));
        }
      }

      // 3. Process Licenses Sheet
      if (workbook.SheetNames.some(s => s.includes('License') || s.includes('ไลเซนส์'))) {
        const sheetName = workbook.SheetNames.find(s => s.includes('License') || s.includes('ไลเซนส์'));
        const rawLic = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        if (rawLic.length > 0) {
          NCSA_DATA.licenses = rawLic.map((row, index) => ({
            id: row['id'] || `LIC-00${index + 1}`,
            name: row['ชื่อซอฟต์แวร์'] || row['name'] || 'Software License',
            category: row['หมวดหมู่'] || row['category'] || 'Enterprise Software',
            vendor: row['ผู้ให้บริการ'] || row['vendor'] || 'Vendor',
            totalSeats: Number(row['สิทธิ์ทั้งหมด']) || 100,
            usedSeats: Number(row['สิทธิ์ที่ใช้แล้ว']) || 80,
            availableSeats: Number(row['สิทธิ์ที่ว่าง']) || 20,
            expiryDate: row['วันหมดอายุ'] || row['expiryDate'] || '2027-12-31',
            unitCostTHB: Number(row['ราคาต่อสิทธิ์']) || 5000,
            assignedDepts: [{ dept: "สบก.", seats: 20 }, { dept: "สปซ.", seats: 30 }, { dept: "สสท.", seats: 30 }]
          }));
        }
      }

      // Re-render all
      renderHardwareTable();
      renderLicenseCards();
      renderCaseTable();
      renderProjectCards();
      updateAllCharts();
      initOverviewWidgets();

      showToast(`✅ นำเข้าข้อมูลจาก Excel สำเร็จ! [ฮาร์ดแวร์ ${NCSA_DATA.hardware.length} เครื่อง | Cases ${NCSA_DATA.cases.length} รายการ]`);
      event.target.value = '';

    } catch (err) {
      console.error('Error parsing Excel file:', err);
      showToast('❌ ไม่สามารถอ่านไฟล์ Excel ได้ กรุณาตรวจสอบรูปแบบไฟล์');
    }
  };
  reader.readAsArrayBuffer(file);
}

// Download Pre-Formatted Excel Template
function downloadExcelTemplate() {
  const wb = XLSX.utils.book_new();

  const hwData = NCSA_DATA.hardware.map(h => ({
    'รหัสสินทรัพย์': h.id, 'ชื่ออุปกรณ์ / สเปค': h.name,
    'ประเภทอุปกรณ์': h.type, 'ชื่อผู้ถือครอง (Holder)': h.holder,
    'ชื่อผู้รับ / ผู้ใช้งานจริง': h.recipient, 'IP Address': h.ip,
    'MAC Address': h.mac, 'สำนักผู้ใช้': h.dept, 'รหัสสำนัก': h.deptCode,
    'สถานะ': h.status, 'Serial Number': h.serial,
    'สถานที่ติดตั้ง': h.location, 'วันที่รับมอบ': h.receivedDate
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hwData), 'Hardware');

  const caseData = NCSA_DATA.cases.map(c => ({
    'Case ID': c.id, 'หัวข้อคำขอรับบริการ': c.title, 'ความด่วน': c.severity,
    'สำนักที่ขอซ่อม': c.dept, 'รหัสสำนัก': c.deptCode, 'ผู้แจ้งเรื่อง': c.reporter,
    'ช่าง IT ผู้รับผิดชอบ': c.assignee, 'สถานะการแก้ไข': c.status,
    'วันที่แจ้ง': c.reportedDate, 'สถานะ SLA': c.slaStatus, 'สรุปการแก้ไข': c.description
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(caseData), 'Cases');

  XLSX.writeFile(wb, 'NCSA_IT_Support_Template.xlsx');
  showToast('📥 ดาวน์โหลดไฟล์แม่แบบ Excel เรียบร้อยแล้ว');
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.innerHTML = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// --------------------------------------------------------------------------
// HARDWARE TABLE RENDER
// --------------------------------------------------------------------------
function renderHardwareTable() {
  const tbody = document.getElementById('hardwareTableBody');
  if (!tbody) return;

  const search = document.getElementById('hwSearchInput')?.value.toLowerCase().trim() || '';
  const typeF  = document.getElementById('hwTypeSelect')?.value || 'all';
  const statF  = document.getElementById('hwStatusSelect')?.value || 'all';

  const filtered = NCSA_DATA.hardware.filter(item => {
    const matchSearch = [item.name, item.holder, item.recipient, item.ip, item.serial, item.mac]
      .some(v => v.toLowerCase().includes(search));
    return matchSearch
      && (typeF === 'all' || item.type === typeF)
      && (statF === 'all' || item.status === statF);
  });

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:20px;color:#64748b;">ไม่พบข้อมูลที่ตรงกัน</td></tr>`;
    return;
  }

  filtered.forEach(hw => {
    let sc = hw.status === 'ส่งซ่อม' ? 'badge-red' : hw.status === 'สำรอง' ? 'badge-yellow' : 'badge-green';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${hw.id}</strong></td>
      <td><div style="font-weight:600;color:#1e3a8a;">${hw.name}</div><div style="font-size:0.74rem;color:#64748b;">${hw.type} | S/N: ${hw.serial}</div></td>
      <td><i class="fa-solid fa-user" style="color:#1e3a8a;margin-right:4px;"></i>${hw.holder}</td>
      <td><i class="fa-regular fa-handshake" style="color:#dc2626;margin-right:4px;"></i>${hw.recipient}</td>
      <td><div style="font-family:monospace;font-weight:600;">${hw.ip}</div><div style="font-size:0.72rem;color:#64748b;font-family:monospace;">${hw.mac}</div></td>
      <td><span class="badge badge-blue">${hw.deptCode}</span></td>
      <td><span class="badge ${sc}">${hw.status}</span></td>
      <td>${hw.location}</td>
      <td><button class="btn-action" style="padding:4px 10px;font-size:0.74rem;" onclick="openHardwareModal('${hw.id}')"><i class="fa-solid fa-circle-info"></i> ดูข้อมูล</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function filterHardware() { renderHardwareTable(); }

// --------------------------------------------------------------------------
// LICENSE CARDS RENDER
// --------------------------------------------------------------------------
function renderLicenseCards() {
  const container = document.getElementById('licensesContainer');
  if (!container) return;
  container.innerHTML = '';

  NCSA_DATA.licenses.forEach(lic => {
    const pct = Math.round((lic.usedSeats / lic.totalSeats) * 100);
    const barC = pct > 95 ? 'bg-red' : pct > 85 ? 'bg-gold' : 'bg-blue';
    const card = document.createElement('div');
    card.className = 'license-card';
    card.innerHTML = `
      <div class="license-header">
        <div class="license-icon-box"><i class="fa-solid fa-key"></i></div>
        <div class="license-info"><h3>${lic.name}</h3><p>${lic.category} | ${lic.vendor}</p></div>
      </div>
      <div>
        <div class="license-stats-row">
          <span>เปิดใช้งาน: <strong style="color:#1e3a8a;">${lic.usedSeats}</strong> / ${lic.totalSeats}</span>
          <span style="color:${pct>90?'#dc2626':'#059669'};">${pct}%</span>
        </div>
        <div class="progress-bar-wrap"><div class="progress-bar-fill ${barC}" style="width:${pct}%"></div></div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;">
        ${lic.assignedDepts.map(d=>`<span class="badge badge-blue">${d.dept}: ${d.seats}</span>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.78rem;border-top:1px solid #e2e8f0;padding-top:8px;">
        <span><i class="fa-regular fa-clock"></i> หมดอายุ: <strong>${lic.expiryDate}</strong></span>
        <span class="badge ${lic.availableSeats < 10 ? 'badge-red' : 'badge-green'}">ว่าง ${lic.availableSeats}</span>
      </div>`;
    container.appendChild(card);
  });
}

// --------------------------------------------------------------------------
// CASE TABLE RENDER
// --------------------------------------------------------------------------
function renderCaseTable() {
  const tbody = document.getElementById('caseTableBody');
  if (!tbody) return;

  const search = document.getElementById('caseSearchInput')?.value.toLowerCase().trim() || '';
  const sevF   = document.getElementById('caseSeveritySelect')?.value || 'all';

  const filtered = NCSA_DATA.cases.filter(c => {
    const matchS = [c.id, c.title, c.dept, c.assignee, c.reporter].some(v => v.toLowerCase().includes(search));
    return matchS && (sevF === 'all' || c.severity === sevF);
  });

  tbody.innerHTML = '';
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;color:#64748b;">ไม่พบข้อมูล</td></tr>`;
    return;
  }

  filtered.forEach(c => {
    const sevMap = {Critical:'badge-red', High:'badge-yellow', Medium:'badge-blue', Low:'badge-green'};
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${c.id}</strong></td>
      <td><div style="font-weight:600;color:#1e3a8a;">${c.title}</div><div style="font-size:0.74rem;color:#64748b;">ผู้แจ้ง: ${c.reporter} (${c.deptCode}) | ${c.reportedDate}</div></td>
      <td><span class="badge ${sevMap[c.severity]||'badge-blue'}">${c.severity}</span></td>
      <td>${c.dept}</td>
      <td><i class="fa-solid fa-headset" style="color:#1e3a8a;margin-right:4px;"></i>${c.assignee}</td>
      <td><span class="badge ${c.status==='กำลังดำเนินการ'?'badge-yellow':'badge-green'}">${c.status}</span></td>
      <td><button class="btn-action" style="padding:4px 10px;font-size:0.74rem;" onclick="openCaseModal('${c.id}')">รายละเอียด</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function filterCases() { renderCaseTable(); }

// --------------------------------------------------------------------------
// PROJECT CARDS RENDER
// --------------------------------------------------------------------------
function renderProjectCards() {
  const container = document.getElementById('projectsContainer');
  if (!container) return;
  container.innerHTML = '';

  NCSA_DATA.projects.forEach(p => {
    const statusMap = {'มีความเสี่ยงล่าช้า':'badge-red','เสร็จสิ้น':'badge-green'};
    const sc = statusMap[p.status] || 'badge-blue';
    const fillC = p.progressPercent === 100 ? 'bg-green' : p.progressPercent < 50 ? 'bg-red' : 'bg-blue';
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-header">
        <div class="project-title-box">
          <h3>${p.name}</h3>
          <div class="project-dept"><i class="fa-solid fa-building-flag"></i> ${p.dept}</div>
        </div>
        <span class="badge ${sc}">${p.status}</span>
      </div>
      <div class="project-meta-row">
        <div class="project-meta-item"><span>ผู้จัดการ:</span><strong>${p.manager}</strong></div>
        <div class="project-meta-item"><span>งบประมาณ:</span><strong style="color:#1e3a8a;">${(p.budgetTHB/1000000).toFixed(1)} ล้านบาท</strong></div>
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:600;margin-bottom:2px;">
          <span>ความคืบหน้า:</span><span style="color:#1e3a8a;">${p.progressPercent}%</span>
        </div>
        <div class="progress-bar-wrap"><div class="progress-bar-fill ${fillC}" style="width:${p.progressPercent}%"></div></div>
      </div>
      <div style="font-size:0.76rem;background:#f8fafc;padding:8px;border-radius:8px;">
        <div style="font-weight:600;color:#64748b;margin-bottom:4px;">Milestones:</div>
        ${p.milestones.map(m=>`
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
            <i class="fa-solid ${m.done?'fa-circle-check':'fa-circle-notch'}" style="color:${m.done?'#059669':'#94a3b8'};"></i>
            <span style="color:${m.done?'#0f172a':'#64748b'};">${m.title}</span>
          </div>`).join('')}
      </div>
      <div style="font-size:0.74rem;color:#64748b;text-align:right;">ระยะเวลา: ${p.startDate} ถึง ${p.endDate}</div>`;
    container.appendChild(card);
  });
}

// --------------------------------------------------------------------------
// MODAL SYSTEM
// --------------------------------------------------------------------------
function initModalListeners() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
}

function closeModal() {
  document.getElementById('modalOverlay')?.classList.remove('active');
}

function openHardwareModal(hwId) {
  const hw = NCSA_DATA.hardware.find(h => h.id === hwId);
  if (!hw) return;
  document.getElementById('modalTitle').innerText = `รายละเอียดอุปกรณ์: ${hw.id}`;
  document.getElementById('modalBody').innerHTML = `
    <div style="text-align:center;margin-bottom:14px;">
      <div style="width:48px;height:48px;background:#eff6ff;color:#1e3a8a;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:1.4rem;">
        <i class="fa-solid ${hw.type.includes('เครื่องพิมพ์')?'fa-print':hw.type.includes('โน๊ตบุ๊ค')?'fa-laptop':hw.type.includes('เซิร์ฟเวอร์')?'fa-server':'fa-desktop'}"></i>
      </div>
      <h4 style="font-size:1rem;color:#1e3a8a;margin-top:6px;">${hw.name}</h4>
      <p style="color:#64748b;font-size:0.8rem;">${hw.type} | ${hw.dept}</p>
    </div>
    ${[['รหัสสินทรัพย์',hw.id],['ผู้ถือครอง',hw.holder],['ผู้รับ/ผู้ใช้จริง',hw.recipient],
       ['IP Address',hw.ip],['MAC Address',hw.mac],['Serial Number',hw.serial],
       ['สถานที่',hw.location],['สถานะ',hw.status],['วันรับมอบ',hw.receivedDate]]
      .map(([k,v])=>`<div class="detail-row"><span>${k}:</span><strong>${v}</strong></div>`).join('')}`;
  document.getElementById('modalOverlay')?.classList.add('active');
}

function openCaseModal(caseId) {
  const c = NCSA_DATA.cases.find(item => item.id === caseId);
  if (!c) return;
  document.getElementById('modalTitle').innerText = `Case: ${c.id}`;
  document.getElementById('modalBody').innerHTML = `
    <div style="background:#eff6ff;border-left:4px solid #1e3a8a;padding:10px;border-radius:8px;margin-bottom:12px;">
      <h4 style="color:#1e3a8a;font-size:0.92rem;">${c.title}</h4>
      <p style="font-size:0.78rem;color:#475569;margin-top:2px;">ระดับความด่วน: <strong>${c.severity}</strong></p>
    </div>
    ${[['สำนัก',c.dept],['ผู้แจ้ง',c.reporter],['ช่าง IT',c.assignee],
       ['วันที่แจ้ง',c.reportedDate],['สถานะ SLA',c.slaStatus]]
      .map(([k,v])=>`<div class="detail-row"><span>${k}:</span><strong>${v}</strong></div>`).join('')}
    <div style="margin-top:12px;"><h5 style="color:#1e3a8a;margin-bottom:6px;font-size:0.84rem;">สรุปการแก้ไข:</h5>
      <div style="background:#f8fafc;padding:10px;border-radius:8px;font-size:0.8rem;color:#334155;">${c.description}</div>
    </div>`;
  document.getElementById('modalOverlay')?.classList.add('active');
}

function exportDashboardReport() { window.print(); }
