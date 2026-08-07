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
      switchToView(targetId);
    });
  });
}

function switchToView(targetId) {
  const pills = document.querySelectorAll('.nav-pill');
  const views = document.querySelectorAll('.page-view');
  const subTabs = document.querySelectorAll('.hardware-sub-tab');
  const topTargetId = (targetId === 'view-paper') ? 'view-hardware' : (targetId === 'view-project-details' ? 'view-projects' : targetId);

  pills.forEach(p => p.classList.toggle('active', p.getAttribute('data-target') === topTargetId));
  views.forEach(v => v.classList.toggle('active', v.id === targetId));
  subTabs.forEach(tab => tab.classList.toggle('active', tab.getAttribute('data-target') === targetId));

  window.dispatchEvent(new Event('resize'));
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
      onClick: (event, activeElements) => {
        if (activeElements && activeElements.length > 0) {
          const idx = activeElements[0].index;
          if (typeof openChartDetailModal === 'function') {
            openChartDetailModal('slaTrend', idx);
          }
        }
      },
      onHover: (event, chartElements) => {
        if (event.native && event.native.target) {
          event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
        }
      },
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
function downloadTemplate(type = 'all') {
  const wb = XLSX.utils.book_new();
  let fileName = 'NCSA_IT_Dashboard_Template.xlsx';

  if (type === 'hardware' || type === 'all') {
    const hwData = NCSA_DATA.hardware.map(h => ({
      'รหัสสินทรัพย์': h.id, 'ชื่ออุปกรณ์ / สเปค': h.name,
      'ประเภทอุปกรณ์': h.type, 'ชื่อผู้ถือครอง (Holder)': h.holder,
      'ชื่อผู้รับ / ผู้ใช้งานจริง': h.recipient, 'IP Address': h.ip,
      'MAC Address': h.mac, 'สำนักผู้ใช้': h.dept, 'รหัสสำนัก': h.deptCode,
      'สถานะ': h.status, 'Serial Number': h.serial,
      'สถานที่ติดตั้ง': h.location, 'วันที่รับมอบ': h.receivedDate
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hwData), 'Hardware');
    if (type === 'hardware') fileName = 'Hardware_Template.xlsx';
  }

  if (type === 'cases' || type === 'all') {
    const caseData = NCSA_DATA.cases.map(c => ({
      'Case ID': c.id, 'หัวข้อคำขอรับบริการ': c.title, 'ความด่วน': c.severity,
      'สำนักที่ขอซ่อม': c.dept, 'รหัสสำนัก': c.deptCode, 'ผู้แจ้งเรื่อง': c.reporter,
      'ช่าง IT ผู้รับผิดชอบ': c.assignee, 'สถานะการแก้ไข': c.status,
      'วันที่แจ้ง': c.reportedDate, 'สถานะ SLA': c.slaStatus, 'สรุปการแก้ไข': c.description
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(caseData), 'Cases');
    if (type === 'cases') fileName = 'Cases_Template.xlsx';
  }

  if (type === 'license' || type === 'all') {
    const licData = NCSA_DATA.licenses.map(l => ({
      'id': l.id, 'ชื่อซอฟต์แวร์': l.name, 'หมวดหมู่': l.category,
      'ผู้ให้บริการ': l.vendor, 'สิทธิ์ทั้งหมด': l.totalSeats,
      'สิทธิ์ที่ใช้แล้ว': l.usedSeats, 'สิทธิ์ที่ว่าง': l.availableSeats,
      'วันหมดอายุ': l.expiryDate, 'ราคาต่อสิทธิ์': l.unitCostTHB
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(licData), 'Licenses');
    if (type === 'license') fileName = 'Licenses_Template.xlsx';
  }

  if (type === 'projects' || type === 'all') {
    const projData = NCSA_DATA.projects.map(p => ({
      'รหัสโครงการ': p.id, 'ชื่อโครงการ': p.name, 'สำนักเจ้าของ': p.dept,
      'งบประมาณ': p.budgetTHB, 'วันที่เริ่ม': p.startDate, 'วันที่สิ้นสุด': p.endDate,
      'ความคืบหน้า (%)': p.progressPercent, 'สถานะ': p.status
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(projData), 'Projects');
    if (type === 'projects') fileName = 'Projects_Template.xlsx';
  }

  if (type === 'paper' || type === 'all') {
    // We don't have paper data array structure for import yet, just create an empty template with headers
    const paperHeaders = [{
      'เดือน': 'ม.ค.', 'ปริมาณกระดาษ (รีม)': 410, 'จำนวนแผ่น': 205000, 'มูลค่า (บาท)': 49200
    }];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(paperHeaders), 'Paper');
    if (type === 'paper') fileName = 'Paper_Template.xlsx';
  }

  XLSX.writeFile(wb, fileName);
  showToast(`📥 ดาวน์โหลดไฟล์ ${fileName} เรียบร้อยแล้ว`);
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
function getHardwareLogoSrc(hwName) {
  const name = (hwName || '').toLowerCase();
  if (name.includes('dell')) return 'assets/dell.png';
  if (name.includes('lenovo')) return 'assets/lenovo.png';
  if (name.includes('hp')) return 'assets/hp.png';
  if (name.includes('apple') || name.includes('macbook')) return 'assets/apple.png';
  if (name.includes('canon')) return 'assets/canon.png';
  if (name.includes('cisco')) return 'assets/cisco.png';
  return 'assets/logo.png';
}

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
    const logoSrc = getHardwareLogoSrc(hw.name);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${hw.id}</strong></td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="${logoSrc}" alt="${hw.name} logo" style="width:32px;height:32px;object-fit:contain;border-radius:6px;border:1px solid #cbd5e1;background:#fff;padding:2px;flex-shrink:0;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div>
            <div style="font-weight:600;color:#1e3a8a;">${hw.name}</div>
            <div style="font-size:0.74rem;color:#64748b;">${hw.type} | S/N: ${hw.serial}</div>
          </div>
        </div>
      </td>
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
function getLicenseLogoSrc(licenseName) {
  const logoMap = {
    'Microsoft 365 Enterprise E5': 'assets/offi.png',
    'CrowdStrike Falcon Complete EDR': 'assets/crow.png',
    'Adobe Creative Cloud All Apps': 'assets/adobe.jpg',
    'Palo Alto Cortex XSOAR Enterprise': 'assets/cortex.jpg',
    'VMware vSphere 8 Enterprise Plus': 'assets/vm.png',
    'Tableau Enterprise Creator & Server': 'assets/Tableau-Server-Icon-1.png',
    'Windows 11 Pro Enterprise Volume': 'assets/window.jpg',
    'Kaspersky Endpoint Security Enterprise': 'assets/kas.png'
  };
  return logoMap[licenseName] || 'assets/logo.png';
}

function renderLicenseCards() {
  const container = document.getElementById('licensesContainer');
  if (!container) return;
  container.innerHTML = '';

  NCSA_DATA.licenses.forEach(lic => {
    const pct = Math.round((lic.usedSeats / lic.totalSeats) * 100);
    const barC = pct > 95 ? 'bg-red' : pct > 85 ? 'bg-gold' : 'bg-blue';
    const card = document.createElement('div');
    card.className = 'license-card';
    const logoSrc = getLicenseLogoSrc(lic.name);
    card.innerHTML = `
      <div class="license-header">
        <img src="${logoSrc}" alt="${lic.name} logo" class="license-card-logo">
        <div class="license-info"><h3>${lic.name}</h3><p>${lic.category} | ${lic.vendor}</p></div>
      </div>
      <div class="license-usage-block">
        <div>
          <div class="license-usage-label">เปิดใช้งาน</div>
          <div class="license-usage-value"><strong>${lic.usedSeats.toLocaleString()}</strong> / ${lic.totalSeats.toLocaleString()}</div>
        </div>
        <div class="license-usage-pct">${pct}%</div>
      </div>
      <div class="progress-bar-wrap"><div class="progress-bar-fill ${barC}" style="width:${pct}%"></div></div>
      <div class="license-meta-row">
        <div class="license-meta-item"><span>หมดอายุ</span><strong>${lic.expiryDate}</strong></div>
        <div class="license-badge license-badge-available">ว่าง ${lic.availableSeats}</div>
      </div>
      <button type="button" class="btn-action btn-outline license-detail-btn"><i class="fa-solid fa-circle-info"></i> ดูรายละเอียด</button>`;
    card.querySelector('.license-detail-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      openLicenseModal(lic.id);
    });
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
    const statusMap = {
      'เร็วกว่าแผน': 'badge-green',
      'เป็นไปตามแผน': 'badge-blue',
      'ตามแผน': 'badge-blue',
      'ล่าช้ากว่าแผน': 'badge-red',
      'มีความเสี่ยงล่าช้า': 'badge-red',
      'เสร็จสิ้น': 'badge-green'
    };
    const sc = statusMap[p.status] || (p.status.includes('เร็วกว่า') ? 'badge-green' : 'badge-blue');
    const fillC = p.status === 'เร็วกว่าแผน' ? 'bg-green' : (p.status === 'ล่าช้ากว่าแผน' || p.status.includes('ล่าช้า')) ? 'bg-red' : 'bg-blue';
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

// Filter project details page table by status
function showProjectDetailsByStatus(statusFilter = 'all') {
  switchToView('view-project-details');

  const titleEl = document.getElementById('projDetailHeaderTitle');
  const subEl = document.getElementById('projDetailHeaderSubtitle');
  const countEl = document.getElementById('projDetailTotalCount');
  const budgetEl = document.getElementById('projDetailTotalBudget');
  const progressEl = document.getElementById('projDetailAvgProgress');
  const tbody = document.getElementById('projTableBody');

  const allProjects = (typeof NCSA_DATA !== 'undefined' && NCSA_DATA.projects) ? NCSA_DATA.projects : [];
  let filtered = allProjects;

  if (statusFilter === 'เป็นไปตามแผน' || statusFilter === 'on-track') {
    filtered = allProjects.filter(p => p.status === 'เป็นไปตามแผน' || p.status === 'ตามแผน');
  } else if (statusFilter === 'เร็วกว่าแผน' || statusFilter === 'ahead') {
    filtered = allProjects.filter(p => p.status === 'เร็วกว่าแผน');
  } else if (statusFilter === 'ล่าช้ากว่าแผน' || statusFilter === 'delayed') {
    filtered = allProjects.filter(p => p.status === 'ล่าช้ากว่าแผน' || p.status === 'ล่าช้า');
  }

  // Update Header
  if (titleEl) {
    if (statusFilter === 'all') {
      titleEl.innerHTML = `<i class="fa-solid fa-list-check" style="margin-right: 6px;"></i> รายละเอียด 3 โครงการ (สทส.)`;
    } else {
      titleEl.innerHTML = `<i class="fa-solid fa-filter" style="margin-right: 6px; color:#3b82f6;"></i> รายละเอียดโครงการ — สถานะ: ${statusFilter}`;
    }
  }

  if (subEl) {
    subEl.textContent = statusFilter === 'all'
      ? 'ข้อมูลรายละเอียดแผนงาน กิจกรรม ความคืบหน้า และสถานะโครงการทั้งหมด'
      : `แสดงเฉพาะโครงการที่มีสถานะ "${statusFilter}" (${filtered.length} โครงการ)`;
  }

  // Update Summary Cards
  if (countEl) countEl.innerHTML = `${filtered.length} <span style="font-size: 0.85rem; font-weight: 400;">โครงการ</span>`;

  const totalBudget = filtered.reduce((acc, p) => acc + (p.budgetTHB || 0), 0);
  if (budgetEl) budgetEl.innerHTML = `${(totalBudget / 1000000).toFixed(1)}M <span style="font-size: 0.85rem; font-weight: 400; color: #64748b;">บาท</span>`;

  const avgProg = filtered.length ? (filtered.reduce((acc, p) => acc + (p.progressPercent || 0), 0) / filtered.length).toFixed(1) : '0.0';
  if (progressEl) progressEl.innerHTML = `${avgProg}%`;

  // Update active filter pill
  document.querySelectorAll('.proj-filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.status === statusFilter);
  });

  // Update Table Body
  if (!tbody) return;
  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px 20px; color: #94a3b8;">
          <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 8px; color: #cbd5e1; display: block;"></i>
          <div style="font-weight: 700; font-size: 0.9rem; color: #64748b;">ไม่มีรายการโครงการในสถานะ "${statusFilter}"</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((p, idx) => {
    const isAhead = p.status === 'เร็วกว่าแผน';
    const isDelayed = p.status === 'ล่าช้ากว่าแผน' || p.status === 'ล่าช้า';
    const badgeBg = isAhead ? '#eff6ff' : (isDelayed ? '#fef2f2' : '#ecfdf5');
    const badgeColor = isAhead ? '#1d4ed8' : (isDelayed ? '#b91c1c' : '#047857');
    const iconClass = isAhead ? 'fa-bolt' : (isDelayed ? 'fa-triangle-exclamation' : 'fa-check');
    const barColor = isAhead ? '#3b82f6' : (isDelayed ? '#ef4444' : '#10b981');

    return `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 14px 18px; color: #64748b; font-weight: 600;">${idx + 1}</td>
        <td style="padding: 14px 18px; font-weight: 600; color: #0f172a; line-height: 1.5;">${p.name}</td>
        <td style="padding: 14px 18px; color: #64748b;">${p.budgetTHB ? (p.budgetTHB / 1000000).toFixed(1) + 'M' : '-'}</td>
        <td style="padding: 14px 18px; color: #64748b;">งบดำเนินงาน</td>
        <td style="padding: 14px 18px; color: #64748b;">ต.ค. 68</td>
        <td style="padding: 14px 18px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 700; color: #1e3a8a;">${p.progressPercent}%</span>
            <div style="flex: 1; background: #e2e8f0; height: 7px; border-radius: 4px; overflow: hidden; min-width: 50px;">
              <div style="height: 100%; width: ${p.progressPercent}%; background: ${barColor}; border-radius: 4px;"></div>
            </div>
          </div>
        </td>
        <td style="padding: 14px 18px;">
          <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 5px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; display: inline-block; white-space: nowrap;">
            <i class="fa-solid ${iconClass}"></i> ${p.status}
          </span>
        </td>
      </tr>
    `;
  }).join('');
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
  if (typeof chartInstances !== 'undefined' && chartInstances.modalLicenseDept) {
    chartInstances.modalLicenseDept.destroy();
    chartInstances.modalLicenseDept = null;
  }
}

function openHardwareModal(hwId) {
  const hw = NCSA_DATA.hardware.find(h => h.id === hwId);
  if (!hw) return;
  const logoSrc = getHardwareLogoSrc(hw.name);
  document.getElementById('modalTitle').innerText = `รายละเอียดอุปกรณ์: ${hw.id}`;
  document.getElementById('modalBody').innerHTML = `
    <div style="text-align:center;margin-bottom:14px;">
      <div style="width:64px;height:64px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #cbd5e1;display:flex;align-items:center;justify-content:center;padding:6px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <img src="${logoSrc}" alt="${hw.name} logo" style="width:100%;height:100%;object-fit:contain;">
      </div>
      <h4 style="font-size:1rem;color:#1e3a8a;margin-top:10px;font-weight:700;">${hw.name}</h4>
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

function openLicenseModal(licenseId) {
  const lic = NCSA_DATA.licenses.find(item => item.id === licenseId);
  if (!lic) return;
  const pct = Math.round((lic.usedSeats / lic.totalSeats) * 100);
  const totalAssignedSeats = (lic.assignedDepts || []).reduce((sum, d) => sum + d.seats, 0);

  const logoSrc = getLicenseLogoSrc(lic.name);
  document.getElementById('modalTitle').innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;">
      <img src="${logoSrc}" alt="${lic.name} logo" style="width:26px;height:26px;object-fit:contain;border-radius:6px;background:#fff;padding:2px;border:1px solid #cbd5e1;box-shadow:0 1px 3px rgba(0,0,0,0.1);flex-shrink:0;">
      <span>รายละเอียดสิทธิ์: ${lic.name}</span>
    </div>
  `;
  document.getElementById('modalBody').innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;background:#f8fafc;padding:8px 10px;border-radius:10px;border:1px solid #e2e8f0;">
      <img src="${logoSrc}" alt="${lic.name} logo" style="width:36px;height:36px;object-fit:contain;border-radius:8px;border:1px solid #cbd5e1;background:#fff;padding:2px;box-shadow:0 1px 4px rgba(0,0,0,0.05);">
      <div style="flex:1;">
        <h4 style="margin:0;font-size:0.88rem;color:#1e3a8a;font-weight:700;line-height:1.2;">${lic.name}</h4>
        <p style="margin:2px 0 0;font-size:0.72rem;color:#64748b;">${lic.category} | ${lic.vendor}</p>
      </div>
    </div>
    
    <div class="detail-row" style="padding:3px 0;font-size:0.75rem;"><span>เปิดใช้งานแล้ว</span><strong>${lic.usedSeats.toLocaleString()} / ${lic.totalSeats.toLocaleString()} (${pct}%)</strong></div>
    <div class="detail-row" style="padding:3px 0;font-size:0.75rem;"><span>วันหมดอายุสัญญา</span><strong>${lic.expiryDate}</strong></div>
    <div class="detail-row" style="padding:3px 0;font-size:0.75rem;"><span>โควต้าคงเหลือว่าง</span><strong style="color:#059669;">${lic.availableSeats.toLocaleString()} Seats</strong></div>
    
    <div style="margin-top:10px;">
      <div style="font-weight:700;font-size:0.8rem;color:#1e3a8a;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
        <span><i class="fa-solid fa-chart-pie" style="color:#2563eb;"></i> สถิติจัดสรรสิทธิ์ตามสำนัก</span>
        <span style="font-size:0.7rem;color:#64748b;font-weight:600;background:#eff6ff;padding:2px 6px;border-radius:10px;border:1px solid #dbeafe;">รวม ${totalAssignedSeats.toLocaleString()} Seats</span>
      </div>

      <!-- Canvas for Horizontal Bar Chart (Compact Height: 125px) -->
      <div style="position:relative;height:125px;width:100%;background:#ffffff;padding:6px 8px;border-radius:10px;border:1px solid #e2e8f0;box-shadow:0 1px 4px rgba(15,23,42,0.03);margin-bottom:8px;">
        <canvas id="modalLicenseDeptChart"></canvas>
      </div>

      <!-- Compact 2-Column Grid for Department Breakdown -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        ${(lic.assignedDepts || []).map((d, i) => {
          const deptPct = Math.round((d.seats / (totalAssignedSeats || 1)) * 100);
          const colorList = ['#1e3a8a', '#2563eb', '#0284c7', '#059669', '#7c3aed', '#d97706', '#dc2626', '#0d9488'];
          const color = colorList[i % colorList.length];
          return `
            <div style="background:#fff;padding:5px 8px;border-radius:8px;border:1px solid #f1f5f9;">
              <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.72rem;margin-bottom:3px;">
                <span style="font-weight:600;color:#0f172a;display:flex;align-items:center;gap:4px;">
                  <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};"></span>${d.dept}
                </span>
                <span style="font-weight:700;color:#1e3a8a;font-size:0.7rem;">${d.seats.toLocaleString()} <span style="font-weight:400;color:#64748b;">(${deptPct}%)</span></span>
              </div>
              <div style="width:100%;height:4px;background:#f1f5f9;border-radius:3px;overflow:hidden;">
                <div style="width:${deptPct}%;height:100%;background:${color};border-radius:3px;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>`;

  document.getElementById('modalOverlay')?.classList.add('active');

  setTimeout(() => {
    if (typeof renderModalLicenseDeptChart === 'function') {
      renderModalLicenseDeptChart(lic.assignedDepts, lic.name);
    }
  }, 60);
}

function exportDashboardReport() { window.print(); }

// --------------------------------------------------------------------------
// GENERIC DYNAMIC CHART POPUP DETAIL MODAL
// --------------------------------------------------------------------------
function openChartDetailModal(chartType, index, datasetIndex) {
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalOverlay = document.getElementById('modalOverlay');
  if (!modalTitle || !modalBody || !modalOverlay) return;

  if (chartType === 'overviewPaper') {
    const months = NCSA_DATA.paperUsage.monthlyTrend.map(d => d.month);
    const month = months[index] || `เดือนที่ ${index + 1}`;
    const casesCount = [18, 24, 15, 29, 22, 19, 26][index] || 20;
    const paperInfo = NCSA_DATA.paperUsage.monthlyTrend[index] || { reams: 350, pages: 175000, cost: 42000 };

    // Filter or show case samples relevant to clicked month
    const monthNums = ['01', '02', '03', '04', '05', '06', '07'];
    const mNum = monthNums[index] || '07';
    let monthCases = NCSA_DATA.cases.filter(c => c.reportedDate && c.reportedDate.includes(`2026-${mNum}`));
    if (monthCases.length === 0) {
      // Pick a subset of cases matching month index for demonstration
      monthCases = NCSA_DATA.cases.slice(0, Math.min(NCSA_DATA.cases.length, 3));
    }

    modalTitle.innerHTML = `<i class="fa-solid fa-chart-bar" style="color:#3b82f6;"></i> รายละเอียด Case IT Support — เดือน ${month}`;
    modalBody.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="background:#eff6ff;padding:10px;border-radius:10px;border:1px solid #bfdbfe;text-align:center;">
          <div style="font-size:0.72rem;color:#1e40af;font-weight:600;">Case IT Support ที่รับเรื่อง</div>
          <div style="font-size:1.4rem;font-weight:800;color:#1e3a8a;">${casesCount} <span style="font-size:0.75rem;">รายการ</span></div>
          <div style="font-size:0.68rem;color:#059669;font-weight:600;"><i class="fa-solid fa-check"></i> SLA Resolution 98.2%</div>
        </div>
        <div style="background:#f0fdf4;padding:10px;border-radius:10px;border:1px solid #bbf7d0;text-align:center;">
          <div style="font-size:0.72rem;color:#166534;font-weight:600;">ปริมาณการใช้กระดาษ</div>
          <div style="font-size:1.4rem;font-weight:800;color:#15803d;">${paperInfo.reams} <span style="font-size:0.75rem;">รีม</span></div>
          <div style="font-size:0.68rem;color:#64748b;">(${paperInfo.pages.toLocaleString()} แผ่น | ฿${paperInfo.cost.toLocaleString()})</div>
        </div>
      </div>

      <div style="margin-bottom:8px;font-weight:700;font-size:0.82rem;color:#1e3a8a;display:flex;align-items:center;justify-content:space-between;">
        <span><i class="fa-solid fa-list-check"></i> รายการ Case IT Support — เดือน ${month}</span>
        <span class="badge badge-blue" style="font-size:0.68rem;">รวม ${casesCount} Cases</span>
      </div>

      <div style="max-height:220px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;">
        <table class="custom-table" style="font-size:0.75rem;">
          <thead>
            <tr>
              <th>ID</th>
              <th>หัวข้อปัญหา</th>
              <th>ความด่วน</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${monthCases.map(c => `
              <tr>
                <td><strong>${c.id}</strong></td>
                <td><div style="font-weight:600;color:#1e3a8a;">${c.title.slice(0,30)}...</div><div style="font-size:0.68rem;color:#64748b;">${c.deptCode} | ${c.reporter}</div></td>
                <td><span class="badge ${c.severity==='Critical'?'badge-red':c.severity==='High'?'badge-yellow':'badge-blue'}" style="font-size:0.65rem;">${c.severity}</span></td>
                <td><span class="badge ${c.status==='กำลังดำเนินการ'?'badge-yellow':'badge-green'}" style="font-size:0.65rem;">${c.status}</span></td>
                <td><button class="btn-action" style="padding:2px 6px;font-size:0.68rem;" onclick="openCaseModal('${c.id}')">ดูเคส</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

  } else if (chartType === 'overviewDept') {
    const depts = ['สบก.', 'สปซ.', 'สยป.', 'สวบ.', 'สกส.', 'สสท.'];
    const deptFullNames = {
      'สบก.': 'สำนักบริหารงานกลาง',
      'สปซ.': 'สำนักปฏิบัติการทางไซเบอร์',
      'สยป.': 'สำนักยุทธศาสตร์และการวางแผน',
      'สวบ.': 'สำนักวิชาการและการพัฒนาบุคลากร',
      'สกส.': 'สำนักกำกับดูแลและส่งเสริมความปลอดภัยไซเบอร์',
      'สสท.': 'สำนักสื่อสารและเทคโนโลยีสารสนเทศ (IT Support)'
    };
    const deptCode = depts[index] || 'สบก.';
    const deptName = deptFullNames[deptCode] || deptCode;
    const items = NCSA_DATA.hardware.filter(h => h.deptCode === deptCode || h.dept.includes(deptCode));

    const pcCount = items.filter(h => h.type.includes('คอมพิวเตอร์')).length;
    const nbCount = items.filter(h => h.type.includes('โน๊ตบุ๊ค')).length;
    const prCount = items.filter(h => h.type.includes('เครื่องพิมพ์')).length;
    const svCount = items.filter(h => h.type.includes('เซิร์ฟเวอร์') || h.type.includes('เครือข่าย')).length;

    modalTitle.innerHTML = `<i class="fa-solid fa-desktop" style="color:#1e3a8a;"></i> รายละเอียดอุปกรณ์ไอที — ${deptCode}`;
    modalBody.innerHTML = `
      <div style="background:#f8fafc;padding:10px;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:12px;">
        <h4 style="margin:0 0 6px 0;font-size:0.88rem;color:#1e3a8a;font-weight:700;">${deptName}</h4>
        <div style="display:flex;gap:6px;flex-wrap:wrap;font-size:0.72rem;">
          <span class="badge badge-blue"><i class="fa-solid fa-desktop"></i> PC: ${pcCount}</span>
          <span class="badge badge-teal"><i class="fa-solid fa-laptop"></i> โน๊ตบุ๊ค: ${nbCount}</span>
          <span class="badge badge-green"><i class="fa-solid fa-print"></i> เครื่องพิมพ์: ${prCount}</span>
          <span class="badge badge-yellow"><i class="fa-solid fa-server"></i> Server/NW: ${svCount}</span>
        </div>
      </div>

      <div style="margin-bottom:6px;font-weight:700;font-size:0.8rem;color:#1e3a8a;display:flex;justify-content:space-between;align-items:center;">
        <span><i class="fa-solid fa-list"></i> รายชื่ออุปกรณ์ที่จัดสรรเฉพาะ ${deptCode} (${items.length} รายการ)</span>
      </div>

      <div style="max-height:240px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;">
        <table class="custom-table" style="font-size:0.74rem;">
          <thead>
            <tr>
              <th>รหัส / อุปกรณ์</th>
              <th>ผู้ถือครอง</th>
              <th>IP Address</th>
              <th>สถานะ</th>
              <th>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            ${items.length === 0 ? '<tr><td colspan="5" style="text-align:center;padding:14px;color:#64748b;">ไม่พบข้อมูลอุปกรณ์สังกัดนี้</td></tr>' : 
              items.map(hw => {
                const logoSrc = getHardwareLogoSrc(hw.name);
                return `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <img src="${logoSrc}" alt="${hw.name} logo" style="width:28px;height:28px;object-fit:contain;border-radius:6px;border:1px solid #cbd5e1;background:#fff;padding:2px;flex-shrink:0;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                    <div>
                      <div style="font-weight:700;color:#1e3a8a;line-height:1.2;">${hw.id}</div>
                      <div style="font-size:0.68rem;color:#64748b;">${hw.name}</div>
                    </div>
                  </div>
                </td>
                <td><i class="fa-solid fa-user" style="color:#3b82f6;margin-right:2px;"></i>${hw.holder}</td>
                <td><code style="font-size:0.7rem;background:#f1f5f9;padding:1px 4px;border-radius:4px;">${hw.ip}</code></td>
                <td><span class="badge ${hw.status==='ส่งซ่อม'?'badge-red':hw.status==='สำรอง'?'badge-yellow':'badge-green'}" style="font-size:0.65rem;">${hw.status}</span></td>
                <td><button class="btn-action" style="padding:2px 6px;font-size:0.68rem;" onclick="openHardwareModal('${hw.id}')">ดูข้อมูล</button></td>
              </tr>
            `;}).join('')}
          </tbody>
        </table>
      </div>
    `;

  } else if (chartType === 'overviewHw') {
    const statuses = ['ใช้งานปกติ', 'ส่งซ่อม/บำรุง', 'สำรองพร้อมใช้'];
    const colors = ['#10b981', '#f59e0b', '#3b82f6'];
    const statusLabel = statuses[index] || statuses[0];
    const color = colors[index] || '#10b981';

    let filterKey = 'ใช้งานปกติ';
    if (index === 1) filterKey = 'ส่งซ่อม';
    if (index === 2) filterKey = 'สำรอง';

    const items = NCSA_DATA.hardware.filter(h => h.status === filterKey || (index === 1 && h.status.includes('ซ่อม')));
    const totalCount = [1180, 45, 23][index] || items.length;

    modalTitle.innerHTML = `<i class="fa-solid fa-boxes-stacked" style="color:${color};"></i> รายละเอียดอุปกรณ์ไอที — สถานะ: ${statusLabel}`;
    modalBody.innerHTML = `
      <div style="background:#f8fafc;padding:12px;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:0.75rem;color:#475569;font-weight:600;">สถานะการใช้งาน</div>
          <div style="font-size:1.3rem;font-weight:800;color:${color};">${statusLabel}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.75rem;color:#475569;font-weight:600;">จำนวนอุปกรณ์ทั้งหมด</div>
          <div style="font-size:1.5rem;font-weight:800;color:#1e3a8a;">${totalCount.toLocaleString()} <span style="font-size:0.75rem;">เครื่อง</span></div>
        </div>
      </div>

      <div style="margin-bottom:6px;font-weight:700;font-size:0.8rem;color:#1e3a8a;display:flex;justify-content:space-between;align-items:center;">
        <span><i class="fa-solid fa-list"></i> รายการอุปกรณ์ที่มีสถานะ "${statusLabel}"</span>
      </div>

      <div style="max-height:230px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;">
        <table class="custom-table" style="font-size:0.74rem;">
          <thead>
            <tr>
              <th>รหัส / อุปกรณ์</th>
              <th>สำนัก</th>
              <th>ผู้ถือครอง</th>
              <th>สถานที่</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${items.length === 0 ? `<tr><td colspan="5" style="text-align:center;padding:16px;color:#64748b;">มีอุปกรณ์ในระบบสถานะ ${statusLabel} ทั้งหมด ${totalCount} เครื่อง</td></tr>` :
              items.map(hw => {
                const logoSrc = getHardwareLogoSrc(hw.name);
                return `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <img src="${logoSrc}" alt="${hw.name}" style="width:26px;height:26px;object-fit:contain;border-radius:4px;border:1px solid #cbd5e1;background:#fff;padding:2px;">
                    <div>
                      <div style="font-weight:700;color:#1e3a8a;">${hw.id}</div>
                      <div style="font-size:0.68rem;color:#64748b;">${hw.name}</div>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-blue" style="font-size:0.65rem;">${hw.deptCode}</span></td>
                <td>${hw.holder}</td>
                <td>${hw.location}</td>
                <td><button class="btn-action" style="padding:2px 6px;font-size:0.68rem;" onclick="openHardwareModal('${hw.id}')">ดูข้อมูล</button></td>
              </tr>
            `;}).join('')}
          </tbody>
        </table>
      </div>
    `;

  } else if (chartType === 'overviewLic') {
    const licNames = ['M365', 'Windows 11', 'Kaspersky', 'Adobe', 'VMware', 'อื่นๆ'];
    const targetLicName = licNames[index] || 'M365';

    let lic = NCSA_DATA.licenses.find(l => l.name.toLowerCase().includes(targetLicName.toLowerCase()));
    if (!lic) {
      lic = NCSA_DATA.licenses[index] || NCSA_DATA.licenses[0];
    }

    const logoSrc = getLicenseLogoSrc(lic.name);

    modalTitle.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="${logoSrc}" alt="${lic.name} logo" style="width:26px;height:26px;object-fit:contain;border-radius:6px;background:#fff;padding:2px;border:1px solid #cbd5e1;box-shadow:0 1px 3px rgba(0,0,0,0.1);flex-shrink:0;">
        <span>รายละเอียด Software License — ${lic.name}</span>
      </div>
    `;
    modalBody.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;background:#f8fafc;padding:10px 14px;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:12px;">
        <img src="${logoSrc}" alt="${lic.name} logo" style="width:42px;height:42px;object-fit:contain;border-radius:8px;border:1px solid #cbd5e1;background:#fff;padding:3px;box-shadow:0 2px 6px rgba(0,0,0,0.06);flex-shrink:0;">
        <div>
          <h4 style="margin:0;font-size:0.95rem;color:#1e3a8a;font-weight:700;line-height:1.2;">${lic.name}</h4>
          <div style="font-size:0.73rem;color:#64748b;margin-top:3px;">
            หมวดหมู่: <strong style="color:#1e3a8a;">${lic.category || 'Software License'}</strong> | ผู้พัฒนา: <strong>${lic.vendor || '-'}</strong>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;margin-bottom:12px;">
        <div style="background:#eff6ff;padding:10px;border-radius:10px;border:1px solid #bfdbfe;text-align:center;">
          <div style="font-size:0.7rem;color:#1e40af;font-weight:600;">สิทธิ์ทั้งหมด (Total)</div>
          <div style="font-size:1.3rem;font-weight:800;color:#1e3a8a;">${lic.totalSeats.toLocaleString()} <span style="font-size:0.75rem;">Seats</span></div>
        </div>
        <div style="background:#f0fdf4;padding:10px;border-radius:10px;border:1px solid #bbf7d0;text-align:center;">
          <div style="font-size:0.7rem;color:#166534;font-weight:600;">เปิดใช้งานแล้ว (Used)</div>
          <div style="font-size:1.3rem;font-weight:800;color:#15803d;">${lic.usedSeats.toLocaleString()} <span style="font-size:0.75rem;">Seats</span></div>
        </div>
        <div style="background:#fff7ed;padding:10px;border-radius:10px;border:1px solid #ffedd5;text-align:center;">
          <div style="font-size:0.7rem;color:#c2410c;font-weight:600;">คงเหลือว่าง (Available)</div>
          <div style="font-size:1.3rem;font-weight:800;color:#ea580c;">${lic.availableSeats.toLocaleString()} <span style="font-size:0.75rem;">Seats</span></div>
        </div>
      </div>

      <div style="margin-bottom:6px;font-weight:700;font-size:0.8rem;color:#1e3a8a;display:flex;justify-content:space-between;align-items:center;">
        <span><i class="fa-solid fa-building"></i> การจัดสรรสิทธิ์ตามสำนัก (${lic.name})</span>
        <button class="btn-action btn-blue" style="padding:2px 8px;font-size:0.7rem;" onclick="openLicenseModal('${lic.id}')">ดูรายละเอียดฉบับเต็ม</button>
      </div>

      <div style="max-height:190px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;">
        <table class="custom-table" style="font-size:0.74rem;">
          <thead>
            <tr>
              <th>สำนัก / หน่วยงาน</th>
              <th>จำนวนสิทธิ์ (Seats)</th>
              <th>สัดส่วนการจัดสรร</th>
            </tr>
          </thead>
          <tbody>
            ${(lic.assignedDepts || []).map(d => {
              const pct = Math.round((d.seats / lic.usedSeats) * 100);
              return `
              <tr>
                <td><strong>${d.dept}</strong></td>
                <td><span style="font-weight:700;color:#1e3a8a;">${d.seats.toLocaleString()} Seats</span></td>
                <td>
                  <div style="display:flex;align-items:center;gap:6px;">
                    <div style="flex:1;height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden;">
                      <div style="width:${pct}%;height:100%;background:#3b82f6;border-radius:3px;"></div>
                    </div>
                    <span style="font-size:0.68rem;color:#64748b;">${pct}%</span>
                  </div>
                </td>
              </tr>
            `;}).join('')}
          </tbody>
        </table>
      </div>
    `;

  } else if (chartType === 'overviewPaperMini' || chartType === 'paperMonthly') {
    const item = NCSA_DATA.paperUsage.monthlyTrend[index] || NCSA_DATA.paperUsage.monthlyTrend[0];
    modalTitle.innerHTML = `<i class="fa-solid fa-print" style="color:#0d9488;"></i> สถิติการใช้กระดาษ — เดือน ${item.month}`;
    modalBody.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="background:#f0fdf4;padding:10px;border-radius:10px;border:1px solid #bbf7d0;">
          <div style="font-size:0.72rem;color:#166534;font-weight:600;">ปริมาณพิมพ์กระดาษประจำเดือน ${item.month}</div>
          <div style="font-size:1.3rem;font-weight:800;color:#15803d;">${item.reams} <span style="font-size:0.75rem;">รีม</span></div>
          <div style="font-size:0.68rem;color:#64748b;">คิดเป็น ${item.pages.toLocaleString()} แผ่น</div>
        </div>
        <div style="background:#fff7ed;padding:10px;border-radius:10px;border:1px solid #ffedd5;">
          <div style="font-size:0.72rem;color:#c2410c;font-weight:600;">ค่าใช้จ่ายรวมระบบพิมพ์ประจำเดือน ${item.month}</div>
          <div style="font-size:1.3rem;font-weight:800;color:#ea580c;">฿${item.cost.toLocaleString()}</div>
          <div style="font-size:0.68rem;color:#059669;font-weight:600;"><i class="fa-solid fa-leaf"></i> ลดลง 12.4% YoY</div>
        </div>
      </div>

      <div style="font-weight:700;font-size:0.8rem;color:#1e3a8a;margin-bottom:6px;">
        <i class="fa-solid fa-building-user"></i> โควต้าและการใช้งานกระดาษแยกสำนักประจำเดือน ${item.month}
      </div>
      <div style="max-height:220px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;">
        <table class="custom-table" style="font-size:0.74rem;">
          <thead>
            <tr>
              <th>สำนัก</th>
              <th>ปริมาณที่ใช้</th>
              <th>โควต้าเต็ม</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            ${NCSA_DATA.paperUsage.departmentBreakdown.map(d => `
              <tr>
                <td><strong>${d.dept.split(' ')[0]}</strong></td>
                <td>${d.reams} รีม</td>
                <td>${d.quota} รีม</td>
                <td><span class="badge ${d.percent > 90 ? 'badge-red' : d.percent < 60 ? 'badge-green' : 'badge-blue'}" style="font-size:0.65rem;">${d.percent}% (${d.status})</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

  } else if (chartType === 'overviewProj') {
    const statuses = ['เป็นไปตามแผน', 'เร็วกว่าแผน', 'ล่าช้ากว่าแผน'];
    const statusColors = ['#3b82f6', '#10b981', '#ef4444'];
    const badgeClasses = ['badge-blue', 'badge-green', 'badge-red'];
    const bgColors = ['#eff6ff', '#f0fdf4', '#fef2f2'];
    const borderColors = ['#bfdbfe', '#bbf7d0', '#fecaca'];
    const textColors = ['#1d4ed8', '#15803d', '#dc2626'];

    const targetStatus = statuses[index] || statuses[0];
    const color = statusColors[index] || '#3b82f6';
    const badgeClass = badgeClasses[index] || 'badge-blue';
    const bgColor = bgColors[index] || '#eff6ff';
    const borderColor = borderColors[index] || '#bfdbfe';
    const textColor = textColors[index] || '#1d4ed8';

    const items = NCSA_DATA.projects.filter(p => {
      if (index === 0) return p.status === 'เป็นไปตามแผน' || p.status === 'ตามแผน';
      if (index === 1) return p.status === 'เร็วกว่าแผน';
      return p.status === 'ล่าช้ากว่าแผน' || p.status === 'ล่าช้า';
    });

    modalTitle.innerHTML = `<i class="fa-solid fa-diagram-project" style="color:${color};"></i> รายละเอียดโครงการพัฒนาไอที — สถานะ: ${targetStatus}`;
    modalBody.innerHTML = `
      <div style="background:${bgColor};padding:12px;border-radius:10px;border:1px solid ${borderColor};margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-size:0.75rem;color:#475569;font-weight:600;">สถานะโครงการ</div>
          <div style="font-size:1.3rem;font-weight:800;color:${textColor};">${targetStatus}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.75rem;color:#475569;font-weight:600;">จำนวนโครงการ</div>
          <div style="font-size:1.5rem;font-weight:800;color:${textColor};">${items.length} <span style="font-size:0.75rem;">โครงการ</span></div>
        </div>
      </div>

      <div style="font-weight:700;font-size:0.8rem;color:#1e3a8a;margin-bottom:6px;">
        <i class="fa-solid fa-list-check"></i> รายการโครงการที่มีสถานะ "${targetStatus}"
      </div>
      <div style="max-height:220px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;">
        <table class="custom-table" style="font-size:0.74rem;">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ชื่อโครงการ / กิจกรรม</th>
              <th>ความคืบหน้า</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            ${items.length === 0 ? `<tr><td colspan="4" style="text-align:center;padding:16px;color:#94a3b8;">ไม่มีโครงการในสถานะ ${targetStatus}</td></tr>` :
              items.map(p => `
              <tr>
                <td><strong>${p.id}</strong></td>
                <td><div style="font-weight:600;color:#1e3a8a;">${p.name}</div><div style="font-size:0.68rem;color:#64748b;">${p.dept}</div></td>
                <td><span style="font-weight:700;color:${color};">${p.progressPercent}%</span></td>
                <td><span class="badge ${badgeClass}" style="font-size:0.65rem;">${p.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

  } else if (chartType === 'paperRatioDept') {
    const deptObj = NCSA_DATA.paperUsage.departmentBreakdown[index] || NCSA_DATA.paperUsage.departmentBreakdown[0];
    modalTitle.innerHTML = `<i class="fa-solid fa-building-user" style="color:#3b82f6;"></i> รายละเอียดการใช้กระดาษ — ${deptObj.dept}`;
    modalBody.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="background:#eff6ff;padding:10px;border-radius:10px;border:1px solid #bfdbfe;text-align:center;">
          <div style="font-size:0.72rem;color:#1e40af;font-weight:600;">ปริมาณการใช้กระดาษ</div>
          <div style="font-size:1.4rem;font-weight:800;color:#1e3a8a;">${deptObj.reams} <span style="font-size:0.75rem;">รีม</span></div>
          <div style="font-size:0.68rem;color:#64748b;">(${deptObj.pages.toLocaleString()} แผ่น)</div>
        </div>
        <div style="background:#f8fafc;padding:10px;border-radius:10px;border:1px solid #e2e8f0;text-align:center;">
          <div style="font-size:0.72rem;color:#475569;font-weight:600;">โควต้าที่ได้รับ</div>
          <div style="font-size:1.4rem;font-weight:800;color:#0f172a;">${deptObj.quota} <span style="font-size:0.75rem;">รีม</span></div>
          <div style="font-size:0.68rem;color:${deptObj.percent > 90 ? '#dc2626' : '#059669'};font-weight:600;">ใช้อยู่ ${deptObj.percent}% (${deptObj.status})</div>
        </div>
      </div>

      <div style="font-weight:700;font-size:0.8rem;color:#1e3a8a;margin-bottom:6px;">
        <i class="fa-solid fa-print"></i> เครื่องพิมพ์และสถิติในสังกัด ${deptObj.dept.split(' ')[0]}
      </div>
      <div style="max-height:200px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;padding:10px;background:#f8fafc;font-size:0.75rem;color:#334155;">
        <div style="margin-bottom:6px;">• อัตราการประหยัดกระดาษ: <strong>${100 - deptObj.percent > 0 ? (100 - deptObj.percent).toFixed(1) : 0}%</strong> ของโควต้าคงเหลือ</div>
        <div style="margin-bottom:6px;">• การใช้เอกสารผ่าน e-Document: <strong>82.4%</strong></div>
        <div>• ข้อเสนอแนะ: <strong>${deptObj.percent > 90 ? 'แนะนำให้ใช้ e-Doc แทนการพิมพ์เอกสารฉบับร่าง' : 'ปฏิบัติตามมาตรการประหยัดกระดาษได้เป็นอย่างดี'}</strong></div>
      </div>
    `;

  } else if (chartType === 'projStrategy') {
    const stratNames = [
      'ยุทธศาสตร์ที่ 1: กิจกรรมการจัดทำแผนแม่บท ICT และ Enterprise Architecture (สทส.)',
      'ยุทธศาสตร์ที่ 4: กิจกรรมจัดหานวัตกรรม Cyber Security, Big Data & AI (สทส.)',
      'ยุทธศาสตร์ที่ 4: กิจกรรมการพัฒนาระบบ Smart Back Office (สทส.)'
    ];
    const titleText = stratNames[index] || stratNames[0];
    const proj = NCSA_DATA.projects[index] || NCSA_DATA.projects[0];

    modalTitle.innerHTML = `<i class="fa-solid fa-chess-king" style="color:#1e3a8a;"></i> รายละเอียดโครงการตามยุทธศาสตร์`;
    modalBody.innerHTML = `
      <div style="background:#eff6ff;padding:12px;border-radius:10px;border:1px solid #bfdbfe;margin-bottom:12px;">
        <h4 style="margin:0 0 4px 0;font-size:0.88rem;color:#1e3a8a;font-weight:700;">${titleText}</h4>
        <div style="font-size:0.72rem;color:#64748b;">หน่วยงานรับผิดชอบ: ${proj.manager}</div>
      </div>

      <div style="font-weight:700;font-size:0.8rem;color:#1e3a8a;margin-bottom:6px;">
        <i class="fa-solid fa-circle-check"></i> กิจกรรมและ Milestones โครงการ (${proj.name})
      </div>
      <div style="max-height:220px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;padding:10px;background:#fff;">
        <div style="font-size:0.75rem;margin-bottom:8px;"><strong>ความคืบหน้าโครงการ:</strong> <span style="color:#059669;font-weight:700;">${proj.progressPercent}%</span> (${proj.status})</div>
        ${proj.milestones.map(m => `
          <div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #f1f5f9;font-size:0.73rem;">
            <i class="fa-solid ${m.done ? 'fa-circle-check' : 'fa-circle-notch'}" style="color:${m.done ? '#10b981' : '#f59e0b'};"></i>
            <span style="${m.done ? 'color:#1e293b;' : 'color:#64748b;'}">${m.title}</span>
          </div>
        `).join('')}
      </div>
    `;

  } else if (chartType === 'digitalVsPaper' || chartType === 'paperRatio') {
    const isDigital = index === 0;
    const digPct = NCSA_DATA.paperUsage?.printVsDigitalRatio?.digitalDocPercent ?? 78.4;
    const papPct = NCSA_DATA.paperUsage?.printVsDigitalRatio?.paperDocPercent ?? 21.6;

    modalTitle.innerHTML = `<i class="fa-solid fa-file-contract" style="color:${isDigital?'#10b981':'#dc2626'};"></i> สถิติเอกสาร ${isDigital ? 'e-Document (ดิจิทัล)' : 'กระดาษพิมพ์ (Paper)'}`;
    modalBody.innerHTML = `
      <div style="background:${isDigital?'#f0fdf4':'#fef2f2'};padding:12px;border-radius:10px;border:1px solid ${isDigital?'#bbf7d0':'#fecaca'};margin-bottom:12px;text-align:center;">
        <div style="font-size:0.78rem;color:${isDigital?'#166534':'#991b1b'};font-weight:600;">สัดส่วนการใช้อิเล็กทรอนิกส์เทียบกับกระดาษ</div>
        <div style="font-size:2rem;font-weight:800;color:${isDigital?'#15803d':'#dc2626'};">${isDigital ? digPct : papPct}%</div>
        <div style="font-size:0.72rem;color:#475569;margin-top:2px;">
          ${isDigital ? '<i class="fa-solid fa-leaf" style="color:#10b981;"></i> ประหยัดกระดาษสะสมได้กว่า 184 ต้นในปีนี้' : '<i class="fa-solid fa-triangle-exclamation" style="color:#dc2626;"></i> มีเป้าหมายลดการใช้กระดาษอีก 15% ในไตรมาสถัดไป'}
        </div>
      </div>

      <div style="font-weight:700;font-size:0.8rem;color:#1e3a8a;margin-bottom:6px;">
        <i class="fa-solid fa-print"></i> เครื่องพิมพ์ที่มีปริมาณการใช้งานสูงสุดในองค์กร
      </div>
      <div style="max-height:200px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;">
        <table class="custom-table" style="font-size:0.74rem;">
          <thead>
            <tr>
              <th>ชื่อเครื่องพิมพ์</th>
              <th>สถานที่ติดตั้ง</th>
              <th>ปริมาณแผ่นเดือนนี้</th>
            </tr>
          </thead>
          <tbody>
            ${NCSA_DATA.paperUsage.topPrinters.map(p => {
              const logoSrc = getHardwareLogoSrc(p.name);
              return `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <img src="${logoSrc}" alt="${p.name} logo" style="width:24px;height:24px;object-fit:contain;border-radius:5px;border:1px solid #cbd5e1;background:#fff;padding:2px;flex-shrink:0;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                    <strong style="color:#1e3a8a;">${p.name}</strong>
                  </div>
                </td>
                <td>${p.location}</td>
                <td><span style="font-weight:700;color:#059669;">${p.pagesThisMonth.toLocaleString()} แผ่น</span></td>
              </tr>
            `;}).join('')}
          </tbody>
        </table>
      </div>
    `;

  } else if (chartType === 'slaTrend') {
    const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.'];
    const month = months[index] || 'ก.ค.';
    const slaVal = [92, 94, 96, 95, 97, 98, 98.2][index] || 98.2;

    modalTitle.innerHTML = `<i class="fa-solid fa-square-poll-vertical" style="color:#0d9488;"></i> ประสิทธิภาพการให้บริการตาม SLA — เดือน ${month}`;
    modalBody.innerHTML = `
      <div style="background:#f0fdf4;padding:12px;border-radius:10px;border:1px solid #bbf7d0;text-align:center;margin-bottom:12px;">
        <div style="font-size:0.78rem;color:#166534;font-weight:600;">อัตราการแก้ไข Case สำเร็จตาม SLA</div>
        <div style="font-size:2rem;font-weight:800;color:#0d9488;">${slaVal}%</div>
        <div style="font-size:0.72rem;color:#059669;font-weight:600;"><i class="fa-solid fa-circle-check"></i> ผ่านเกณฑ์มาตรฐานขั้นต่ำ (95.0%)</div>
      </div>
      <div style="font-size:0.78rem;color:#475569;line-height:1.6;">
        <strong>สรุปผลงาน IT Support:</strong><br>
        • ระยะเวลาเฉลี่ยในการเข้าแก้ไขปัญหา: <strong>1.5 ชั่วโมง</strong><br>
        • จำนวนทีมช่างประจำศูนย์: <strong>8 ท่าน</strong><br>
        • คะแนนความพึงพอใจผู้ใช้งาน (CSAT): <strong>4.85 / 5.0</strong>
      </div>
    `;
  }

  modalOverlay.classList.add('active');
}

// --------------------------------------------------------------------------
// KPI MINI-CARDS SUMMARY POPUP MODALS
// --------------------------------------------------------------------------
function openKpiDetailModal(kpiType) {
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalOverlay = document.getElementById('modalOverlay');
  if (!modalTitle || !modalBody || !modalOverlay) return;

  if (kpiType === 'hardware') {
    const total = NCSA_DATA.hardware.length;
    const normal = NCSA_DATA.hardware.filter(h => h.status === 'ใช้งานปกติ').length;
    const maint = NCSA_DATA.hardware.filter(h => h.status === 'ส่งซ่อม').length;
    const spare = NCSA_DATA.hardware.filter(h => h.status === 'สำรอง').length;

    modalTitle.innerHTML = `<i class="fa-solid fa-desktop" style="color:#2d9d8f;"></i> สรุปภาพรวมอุปกรณ์ฮาร์ดแวร์ในดูแล`;
    modalBody.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-bottom:14px;text-align:center;">
        <div style="background:#eff6ff;padding:10px;border-radius:10px;border:1px solid #bfdbfe;">
          <div style="font-size:0.68rem;color:#1e40af;font-weight:600;">อุปกรณ์รวม</div>
          <div style="font-size:1.3rem;font-weight:800;color:#1e3a8a;">${total} <span style="font-size:0.7rem;">เครื่อง</span></div>
        </div>
        <div style="background:#f0fdf4;padding:10px;border-radius:10px;border:1px solid #bbf7d0;">
          <div style="font-size:0.68rem;color:#166534;font-weight:600;">ใช้งานปกติ</div>
          <div style="font-size:1.3rem;font-weight:800;color:#15803d;">${normal} <span style="font-size:0.7rem;">เครื่อง</span></div>
        </div>
        <div style="background:#fffbebf1;padding:10px;border-radius:10px;border:1px solid #fde68a;">
          <div style="font-size:0.68rem;color:#b45309;font-weight:600;">สำรอง</div>
          <div style="font-size:1.3rem;font-weight:800;color:#d97706;">${spare} <span style="font-size:0.7rem;">เครื่อง</span></div>
        </div>
        <div style="background:#fef2f2;padding:10px;border-radius:10px;border:1px solid #fecaca;">
          <div style="font-size:0.68rem;color:#991b1b;font-weight:600;">ส่งซ่อม</div>
          <div style="font-size:1.3rem;font-weight:800;color:#dc2626;">${maint} <span style="font-size:0.7rem;">เครื่อง</span></div>
        </div>
      </div>

      <div style="font-weight:700;font-size:0.82rem;color:#1e3a8a;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
        <span><i class="fa-solid fa-list-check"></i> รายการอุปกรณ์ล่าสุด</span>
        <button class="btn-action btn-green" style="padding:4px 10px;font-size:0.72rem;" onclick="closeModal();switchToView('view-hardware');">
          <i class="fa-solid fa-arrow-right"></i> ไปหน้าฮาร์ดแวร์ทั้งหมด
        </button>
      </div>

      <div style="max-height:220px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;">
        <table class="custom-table" style="font-size:0.74rem;">
          <thead>
            <tr>
              <th>รหัส / ชื่ออุปกรณ์</th>
              <th>ประเภท</th>
              <th>สังกัดสำนัก</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            ${NCSA_DATA.hardware.slice(0, 6).map(h => {
              const logoSrc = getHardwareLogoSrc(h.name);
              return `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:6px;">
                      <img src="${logoSrc}" alt="logo" style="width:24px;height:24px;object-fit:contain;border-radius:4px;border:1px solid #cbd5e1;background:#fff;padding:2px;">
                      <strong>${h.id}</strong> (${h.name.slice(0, 24)}...)
                    </div>
                  </td>
                  <td>${h.type}</td>
                  <td><span class="badge badge-blue">${h.deptCode}</span></td>
                  <td><span class="badge ${h.status==='ส่งซ่อม'?'badge-red':h.status==='สำรอง'?'badge-yellow':'badge-green'}" style="font-size:0.65rem;">${h.status}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

  } else if (kpiType === 'paper') {
    const totalReams = NCSA_DATA.paperUsage.monthlyTrend.reduce((s,d)=>s+d.reams,0);
    const totalPages = NCSA_DATA.paperUsage.monthlyTrend.reduce((s,d)=>s+d.pages,0);
    const totalCost = NCSA_DATA.paperUsage.monthlyTrend.reduce((s,d)=>s+d.cost,0);

    modalTitle.innerHTML = `<i class="fa-solid fa-leaf" style="color:#f97316;"></i> สรุปสถิติระบบพิมพ์และกระดาษองค์กร`;
    modalBody.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px;text-align:center;">
        <div style="background:#fff7ed;padding:10px;border-radius:10px;border:1px solid #ffedd5;">
          <div style="font-size:0.68rem;color:#c2410c;font-weight:600;">ปริมาณกระดาษที่ใช้</div>
          <div style="font-size:1.3rem;font-weight:800;color:#ea580c;">${totalReams.toLocaleString()} <span style="font-size:0.7rem;">รีม</span></div>
          <div style="font-size:0.68rem;color:#64748b;">(${totalPages.toLocaleString()} แผ่น)</div>
        </div>
        <div style="background:#f0fdf4;padding:10px;border-radius:10px;border:1px solid #bbf7d0;">
          <div style="font-size:0.68rem;color:#166534;font-weight:600;">ประหยัดต้นไม้สะสม</div>
          <div style="font-size:1.3rem;font-weight:800;color:#15803d;">184 <span style="font-size:0.7rem;">ต้น</span></div>
          <div style="font-size:0.68rem;color:#059669;">ลด CO2 2,450 kg</div>
        </div>
        <div style="background:#eff6ff;padding:10px;border-radius:10px;border:1px solid #bfdbfe;">
          <div style="font-size:0.68rem;color:#1e40af;font-weight:600;">งบประมาณค่าพิมพ์</div>
          <div style="font-size:1.3rem;font-weight:800;color:#1e3a8a;">฿${totalCost.toLocaleString()}</div>
          <div style="font-size:0.68rem;color:#2563eb;">ลดลง 12.4% YoY</div>
        </div>
      </div>

      <div style="font-weight:700;font-size:0.82rem;color:#1e3a8a;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
        <span><i class="fa-solid fa-building-user"></i> โควต้ากระดาษประจำสำนัก</span>
        <button class="btn-action btn-green" style="padding:4px 10px;font-size:0.72rem;" onclick="closeModal();switchToView('view-paper');">
          <i class="fa-solid fa-arrow-right"></i> ไปหน้ารายงานกระดาษ
        </button>
      </div>

      <div style="max-height:200px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;">
        <table class="custom-table" style="font-size:0.74rem;">
          <thead>
            <tr>
              <th>สำนัก</th>
              <th>ใช้จริง</th>
              <th>โควต้า</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            ${NCSA_DATA.paperUsage.departmentBreakdown.map(d => `
              <tr>
                <td><strong>${d.dept}</strong></td>
                <td>${d.reams} รีม</td>
                <td>${d.quota} รีม</td>
                <td><span class="badge ${d.percent > 90 ? 'badge-red' : d.percent < 60 ? 'badge-green' : 'badge-blue'}" style="font-size:0.65rem;">${d.percent}% (${d.status})</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

  } else if (kpiType === 'license') {
    const totalSeats = NCSA_DATA.licenses.reduce((s,l)=>s+l.totalSeats,0);
    const usedSeats = NCSA_DATA.licenses.reduce((s,l)=>s+l.usedSeats,0);
    const availSeats = NCSA_DATA.licenses.reduce((s,l)=>s+l.availableSeats,0);
    const utilRate = Math.round((usedSeats / totalSeats) * 100);

    modalTitle.innerHTML = `<i class="fa-solid fa-key" style="color:#059669;"></i> สรุปสิทธิ์ซอฟต์แวร์ลิขสิทธิ์องค์กร`;
    modalBody.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px;text-align:center;">
        <div style="background:#eff6ff;padding:10px;border-radius:10px;border:1px solid #bfdbfe;">
          <div style="font-size:0.68rem;color:#1e40af;font-weight:600;">สิทธิ์ทั้งหมด</div>
          <div style="font-size:1.3rem;font-weight:800;color:#1e3a8a;">${totalSeats.toLocaleString()} <span style="font-size:0.7rem;">สิทธิ์</span></div>
        </div>
        <div style="background:#f0fdf4;padding:10px;border-radius:10px;border:1px solid #bbf7d0;">
          <div style="font-size:0.68rem;color:#166534;font-weight:600;">ใช้งานแล้ว</div>
          <div style="font-size:1.3rem;font-weight:800;color:#15803d;">${usedSeats.toLocaleString()} <span style="font-size:0.7rem;">(${utilRate}%)</span></div>
        </div>
        <div style="background:#fffbebf1;padding:10px;border-radius:10px;border:1px solid #fde68a;">
          <div style="font-size:0.68rem;color:#b45309;font-weight:600;">คงเหลือว่าง</div>
          <div style="font-size:1.3rem;font-weight:800;color:#d97706;">${availSeats.toLocaleString()} <span style="font-size:0.7rem;">สิทธิ์</span></div>
        </div>
      </div>

      <div style="font-weight:700;font-size:0.82rem;color:#1e3a8a;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
        <span><i class="fa-solid fa-cubes"></i> รายการซอฟต์แวร์ไลเซนส์ (${NCSA_DATA.licenses.length} หมวดหมู่)</span>
        <button class="btn-action btn-green" style="padding:4px 10px;font-size:0.72rem;" onclick="closeModal();switchToView('view-license');">
          <i class="fa-solid fa-arrow-right"></i> ไปหน้าการจัดสรรไลเซนส์
        </button>
      </div>

      <div style="max-height:220px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;">
        <table class="custom-table" style="font-size:0.74rem;">
          <thead>
            <tr>
              <th>ชื่อซอฟต์แวร์</th>
              <th>หมวดหมู่</th>
              <th>การใช้งาน</th>
              <th>วันหมดอายุ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${NCSA_DATA.licenses.map(lic => {
              const logoSrc = getLicenseLogoSrc(lic.name);
              const pct = Math.round((lic.usedSeats / lic.totalSeats) * 100);
              return `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:6px;">
                      <img src="${logoSrc}" alt="logo" style="width:22px;height:22px;object-fit:contain;border-radius:4px;border:1px solid #cbd5e1;background:#fff;padding:1px;">
                      <strong>${lic.name}</strong>
                    </div>
                  </td>
                  <td>${lic.category}</td>
                  <td><span class="badge ${pct>90?'badge-blue':'badge-green'}" style="font-size:0.65rem;">${lic.usedSeats}/${lic.totalSeats} (${pct}%)</span></td>
                  <td>${lic.expiryDate}</td>
                  <td><button class="btn-action" style="padding:2px 6px;font-size:0.68rem;" onclick="openLicenseModal('${lic.id}')">รายละเอียด</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

  } else if (kpiType === 'cases') {
    const total = NCSA_DATA.cases.length;
    const critical = NCSA_DATA.cases.filter(c => c.severity === 'Critical').length;
    const high = NCSA_DATA.cases.filter(c => c.severity === 'High').length;
    const active = NCSA_DATA.cases.filter(c => c.status === 'กำลังดำเนินการ').length;
    const done = NCSA_DATA.cases.filter(c => c.status === 'เสร็จสิ้น').length;

    modalTitle.innerHTML = `<i class="fa-solid fa-headset" style="color:#d97706;"></i> สรุปรายการ Case IT Support รับใหม่`;
    modalBody.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-bottom:14px;text-align:center;">
        <div style="background:#eff6ff;padding:10px;border-radius:10px;border:1px solid #bfdbfe;">
          <div style="font-size:0.68rem;color:#1e40af;font-weight:600;">Cases ทั้งหมด</div>
          <div style="font-size:1.3rem;font-weight:800;color:#1e3a8a;">${total} <span style="font-size:0.7rem;">รายการ</span></div>
        </div>
        <div style="background:#fffbebf1;padding:10px;border-radius:10px;border:1px solid #fde68a;">
          <div style="font-size:0.68rem;color:#b45309;font-weight:600;">กำลังดำเนินการ</div>
          <div style="font-size:1.3rem;font-weight:800;color:#d97706;">${active} <span style="font-size:0.7rem;">รายการ</span></div>
        </div>
        <div style="background:#f0fdf4;padding:10px;border-radius:10px;border:1px solid #bbf7d0;">
          <div style="font-size:0.68rem;color:#166534;font-weight:600;">เสร็จสิ้นแล้ว</div>
          <div style="font-size:1.3rem;font-weight:800;color:#15803d;">${done} <span style="font-size:0.7rem;">รายการ</span></div>
        </div>
        <div style="background:#fef2f2;padding:10px;border-radius:10px;border:1px solid #fecaca;">
          <div style="font-size:0.68rem;color:#991b1b;font-weight:600;">Critical / High</div>
          <div style="font-size:1.3rem;font-weight:800;color:#dc2626;">${critical + high} <span style="font-size:0.7rem;">รายการ</span></div>
        </div>
      </div>

      <div style="font-weight:700;font-size:0.82rem;color:#1e3a8a;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
        <span><i class="fa-solid fa-list-check"></i> รายการ Case IT Support ล่าสุด</span>
        <button class="btn-action btn-green" style="padding:4px 10px;font-size:0.72rem;" onclick="closeModal();switchToView('view-cases');">
          <i class="fa-solid fa-arrow-right"></i> ไปหน้า Report Case ทั้งหมด
        </button>
      </div>

      <div style="max-height:220px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;">
        <table class="custom-table" style="font-size:0.74rem;">
          <thead>
            <tr>
              <th>ID</th>
              <th>หัวข้อปัญหา</th>
              <th>ผู้แจ้ง / สำนัก</th>
              <th>ความด่วน</th>
              <th>สถานะ</th>
              <th>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            ${NCSA_DATA.cases.map(c => `
              <tr>
                <td><strong>${c.id}</strong></td>
                <td><div style="font-weight:600;color:#1e3a8a;">${c.title.slice(0, 28)}...</div></td>
                <td>${c.reporter} (${c.deptCode})</td>
                <td><span class="badge ${c.severity==='Critical'?'badge-red':c.severity==='High'?'badge-yellow':'badge-blue'}" style="font-size:0.65rem;">${c.severity}</span></td>
                <td><span class="badge ${c.status==='กำลังดำเนินการ'?'badge-yellow':'badge-green'}" style="font-size:0.65rem;">${c.status}</span></td>
                <td><button class="btn-action" style="padding:2px 6px;font-size:0.68rem;" onclick="openCaseModal('${c.id}')">ดูเคส</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

  } else if (kpiType === 'projects') {
    switchToView('view-projects');
    scrollToProjDetails();
    return;
  }

  modalOverlay.classList.add('active');
}

// Inline data display view navigator and scroll function
function scrollToProjDetails() {
  switchToView('view-projects');
  setTimeout(() => {
    const el = document.getElementById('projDetailsSection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

function openProjectDetailsModal() {
  scrollToProjDetails();
}

