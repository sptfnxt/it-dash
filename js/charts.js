// Chart.js Manager — NCSA IT Support Dashboard (Teal Pill Nav Style)
// Charts: Overview Bar, Dept Donut, Mini Donut, Paper Monthly, Paper Ratio, License, Cases, Projects

let chartInstances = {};

function initAllCharts() {
  Chart.defaults.font.family = "'Prompt', 'Sarabun', sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = "#475569";

  initOverviewCharts();
  initPaperCharts();
  initLicenseCharts();
  initProjectCharts();
  initCaseOverviewCharts();
  initCaseCategoryChart();
  initCaseDeptChart();
  initCaseLevelChart();
  initCasePositionChart();
}

// Helper: linear gradient top→bottom
function createGradient(ctx, colorTop, colorBottom, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height || 260);
  gradient.addColorStop(0, colorTop);
  gradient.addColorStop(1, colorBottom);
  return gradient;
}

// ============================================================
// 1. OVERVIEW CHARTS
// ============================================================
function initOverviewCharts() {
  // --- A. Monthly Bar (Row 1 Left) ---
  const ctxBar = document.getElementById('overviewPaperChart');
  if (ctxBar) {
    const ctx2d = ctxBar.getContext('2d');
    const barGrad = createGradient(ctx2d, '#1e3a8a', '#3b82f6');

    chartInstances.overviewPaper = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: NCSA_DATA.paperUsage.monthlyTrend.map(d => d.month),
        datasets: [{
          label: 'Case IT Support รายเดือน',
          data: [18, 24, 15, 29, 22, 19, 26],
          backgroundColor: barGrad,
          hoverBackgroundColor: createGradient(ctx2d, '#0d9488', '#2dd4bf'),
          borderRadius: 8,
          borderSkipped: false,
          borderWidth: 0,
          hoverBorderWidth: 2,
          hoverBorderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1200, easing: 'easeOutBack' },
        onClick: (event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            if (typeof openChartDetailModal === 'function') {
              openChartDetailModal('overviewPaper', idx);
            }
          }
        },
        onHover: (event, chartElements) => {
          if (event.native && event.native.target) {
            event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e3a8a',
            padding: 10,
            cornerRadius: 8,
            titleFont: { size: 12, weight: '700' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { font: { size: 10, weight: '600' } }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 10, weight: '600' } }
          }
        }
      }
    });
  }

  // --- B. Dept Doughnut (Row 1 Right) ---
  const ctxDept = document.getElementById('overviewDeptChart');
  if (ctxDept) {
    const COLORS = ['#3b82f6', '#1e3a8a', '#dc2626', '#10b981', '#f59e0b', '#8b5cf6'];
    chartInstances.overviewDept = new Chart(ctxDept, {
      type: 'doughnut',
      data: {
        labels: ['สบก.', 'สปซ.', 'สยป.', 'สวบ.', 'สกส.', 'สสท.'],
        datasets: [{
          data: calculateDeptHardwareCounts(),
          backgroundColor: COLORS,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 14,
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { animateScale: true, animateRotate: true, duration: 1400, easing: 'easeOutQuart' },
        onClick: (event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            if (typeof openChartDetailModal === 'function') {
              openChartDetailModal('overviewDept', idx);
            }
          }
        },
        onHover: (event, chartElements) => {
          if (event.native && event.native.target) {
            event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.raw} เครื่อง`
            }
          }
        },
        cutout: '62%'
      }
    });
  }

  // --- Row 3 Col 1: Hardware Assets Breakdown ---
  const ctxHw = document.getElementById('overviewHwChart');
  if (ctxHw) {
    const ctx2d = ctxHw.getContext('2d');
    chartInstances.overviewHw = new Chart(ctxHw, {
      type: 'bar',
      data: {
        labels: ['ใช้งานปกติ', 'ส่งซ่อม/บำรุง', 'สำรองพร้อมใช้'],
        datasets: [{
          label: 'จำนวน (เครื่อง)',
          data: [1180, 45, 23],
          backgroundColor: ['#10b981', '#f59e0b', '#3b82f6'],
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1000 },
        onClick: (event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            if (typeof openChartDetailModal === 'function') {
              openChartDetailModal('overviewHw', idx);
            }
          }
        },
        onHover: (event, chartElements) => {
          if (event.native && event.native.target) {
            event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            padding: 8,
            cornerRadius: 8,
            callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} เครื่อง` }
          }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 9 } } },
          x: { grid: { display: false }, ticks: { font: { size: 9, weight: '600' } } }
        }
      }
    });
  }

  // --- Row 3 Col 2: Software License Allocation ---
  const ctxLic = document.getElementById('overviewLicChart');
  if (ctxLic) {
    chartInstances.overviewLic = new Chart(ctxLic, {
      type: 'doughnut',
      data: {
        labels: ['M365', 'Windows 11', 'Kaspersky', 'Adobe', 'VMware', 'อื่นๆ'],
        datasets: [{
          data: [1140, 1420, 270, 280, 28, 3565],
          backgroundColor: ['#3b82f6', '#1e3a8a', '#059669', '#dc2626', '#d97706', '#94a3b8'],
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { animateScale: true, duration: 1200 },
        onClick: (event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            if (typeof openChartDetailModal === 'function') {
              openChartDetailModal('overviewLic', idx);
            }
          }
        },
        onHover: (event, chartElements) => {
          if (event.native && event.native.target) {
            event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
          }
        },
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 9 }, padding: 6, usePointStyle: true } },
          tooltip: {
            callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw.toLocaleString()} สิทธิ์` }
          }
        },
        cutout: '62%'
      }
    });
  }

  // --- Row 3 Col 3: Paper Usage Monthly Trend ---
  const ctxPaperMini = document.getElementById('overviewPaperMiniChart');
  if (ctxPaperMini) {
    const ctx2d = ctxPaperMini.getContext('2d');
    chartInstances.overviewPaperMini = new Chart(ctxPaperMini, {
      type: 'bar',
      data: {
        labels: NCSA_DATA.paperUsage.monthlyTrend.map(d => d.month),
        datasets: [{
          label: 'การใช้กระดาษ (รีม)',
          data: NCSA_DATA.paperUsage.monthlyTrend.map(d => d.reams),
          backgroundColor: createGradient(ctx2d, '#0d9488', '#5eead4'),
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1000 },
        onClick: (event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            if (typeof openChartDetailModal === 'function') {
              openChartDetailModal('overviewPaperMini', idx);
            }
          }
        },
        onHover: (event, chartElements) => {
          if (event.native && event.native.target) {
            event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: ctx => ` การใช้กระดาษ: ${ctx.raw} รีม` }
          }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 9 } } },
          x: { grid: { display: false }, ticks: { font: { size: 9 } } }
        }
      }
    });
  }

  // --- Row 3 Col 4: IT Projects Status Breakdown ---
  const ctxProj = document.getElementById('overviewProjChart');
  if (ctxProj) {
    const projects = (typeof NCSA_DATA !== 'undefined' && NCSA_DATA.projects) ? NCSA_DATA.projects : [];
    const onTrackCount = projects.filter(p => p.status === 'เป็นไปตามแผน' || p.status === 'ตามแผน').length || 1;
    const aheadCount = projects.filter(p => p.status === 'เร็วกว่าแผน').length || 2;

    chartInstances.overviewProj = new Chart(ctxProj, {
      type: 'doughnut',
      data: {
        labels: ['เป็นไปตามแผน', 'เร็วกว่าแผน'],
        datasets: [{
          data: [onTrackCount, aheadCount],
          backgroundColor: ['#3b82f6', '#10b981'],
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { animateScale: true, duration: 1200 },
        onClick: (event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            if (typeof openChartDetailModal === 'function') {
              openChartDetailModal('overviewProj', idx);
            }
          }
        },
        onHover: (event, chartElements) => {
          if (event.native && event.native.target) {
            event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
          }
        },
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 9 }, padding: 6, usePointStyle: true } },
          tooltip: {
            callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} โครงการ` }
          }
        },
        cutout: '62%'
      }
    });
  }
}

// Helper: count hardware per dept
function calculateDeptHardwareCounts() {
  const depts = ['สบก.', 'สปซ.', 'สยป.', 'สวบ.', 'สกส.', 'สสท.'];
  return depts.map(code => NCSA_DATA.hardware.filter(h => h.deptCode === code || h.dept.includes(code)).length);
}

// ============================================================
// 2. PAPER CHARTS (View 3)
// ============================================================
function initPaperCharts() {
  const ctxMonthly = document.getElementById('paperMonthlyChart');
  if (ctxMonthly) {
    const ctx2d = ctxMonthly.getContext('2d');
    const fillGradient = createGradient(ctx2d, 'rgba(59,130,246,0.48)', 'rgba(59,130,246,0.05)', 220);
    chartInstances.paperMonthly = new Chart(ctxMonthly, {
      type: 'line',
      data: {
        labels: NCSA_DATA.paperUsage.monthlyTrend.map(d => d.month),
        datasets: [{
          label: 'ปริมาณกระดาษ (รีม)',
          data: NCSA_DATA.paperUsage.monthlyTrend.map(d => d.reams),
          fill: true,
          backgroundColor: fillGradient,
          borderColor: '#2563eb',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          cubicInterpolationMode: 'monotone'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1200 },
        onClick: (event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            if (typeof openChartDetailModal === 'function') {
              openChartDetailModal('paperMonthly', idx);
            }
          }
        },
        onHover: (event, chartElements) => {
          if (event.native && event.native.target) {
            event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e3a8a',
            padding: 10,
            cornerRadius: 8,
            titleFont: { size: 12, weight: '700' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#eff6ff' },
            ticks: { font: { size: 11, weight: '600' }, color: '#475569' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11, weight: '600' }, color: '#475569' }
          }
        }
      }
    });
  }

  const ctxRatio = document.getElementById('paperRatioChart');
  if (ctxRatio) {
    const deptLabels = NCSA_DATA.paperUsage.departmentBreakdown.map(d => d.dept.match(/\(([^)]+)\)/)?.[1] || d.dept);
    const deptData = NCSA_DATA.paperUsage.departmentBreakdown.map(d => d.reams);
    chartInstances.paperRatio = new Chart(ctxRatio, {
      type: 'pie',
      data: {
        labels: deptLabels,
        datasets: [{
          data: deptData,
          backgroundColor: ['#3b82f6', '#1e3a8a', '#dc2626', '#059669', '#d97706', '#7c3aed'],
          hoverOffset: 14,
          borderWidth: 3,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { animateScale: true, duration: 1400 },
        onClick: (event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            if (typeof openChartDetailModal === 'function') {
              openChartDetailModal('paperRatioDept', idx);
            }
          }
        },
        onHover: (event, chartElements) => {
          if (event.native && event.native.target) {
            event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
          }
        },
        plugins: { legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true } } }
      }
    });
  }
}

// ============================================================
// 3. LICENSE CHARTS (View 4)
// ============================================================
function initLicenseCharts() {
  const ctxLic = document.getElementById('licenseSeatChart');
  if (ctxLic) {
    const ctx2d = ctxLic.getContext('2d');
    chartInstances.licenseSeat = new Chart(ctxLic, {
      type: 'bar',
      data: {
        labels: NCSA_DATA.licenses.map(l => l.name),
        datasets: [
          {
            label: 'ใช้งานแล้ว',
            data: NCSA_DATA.licenses.map(l => l.usedSeats),
            backgroundColor: createGradient(ctx2d, '#1e3a8a', '#3b82f6'),
            borderRadius: 6
          },
          {
            label: 'ว่างอยู่',
            data: NCSA_DATA.licenses.map(l => l.availableSeats),
            backgroundColor: createGradient(ctx2d, '#38bdf8', '#0284c7'),
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 1300 },
        onClick: (event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            const lic = NCSA_DATA.licenses[idx];
            if (lic && typeof openLicenseModal === 'function') {
              openLicenseModal(lic.id);
            }
          }
        },
        onHover: (event, chartElements) => {
          if (event.native && event.native.target) {
            event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
          }
        },
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, beginAtZero: true }
        },
        plugins: { legend: { position: 'top' } }
      }
    });
  }
}

// ============================================================
// UPDATE ALL CHARTS on Excel import
// ============================================================
function updateAllCharts() {
  if (chartInstances.overviewPaper) {
    chartInstances.overviewPaper.data.labels = NCSA_DATA.paperUsage.monthlyTrend.map(d => d.month);
    chartInstances.overviewPaper.data.datasets[0].data = NCSA_DATA.paperUsage.monthlyTrend.map(d => d.reams);
    chartInstances.overviewPaper.update();
  }

  if (chartInstances.overviewDept) {
    chartInstances.overviewDept.data.datasets[0].data = calculateDeptHardwareCounts();
    chartInstances.overviewDept.update();
  }

  if (chartInstances.overviewBarMini) {
    chartInstances.overviewBarMini.data.labels = NCSA_DATA.paperUsage.monthlyTrend.map(d => d.month);
    chartInstances.overviewBarMini.data.datasets[0].data = NCSA_DATA.paperUsage.monthlyTrend.map(d => d.reams);
    chartInstances.overviewBarMini.data.datasets[1].data = NCSA_DATA.paperUsage.monthlyTrend.map(d => Math.round(d.cost / 100));
    chartInstances.overviewBarMini.update();
  }

  if (chartInstances.paperMonthly) {
    chartInstances.paperMonthly.data.labels = NCSA_DATA.paperUsage.monthlyTrend.map(d => d.month);
    chartInstances.paperMonthly.data.datasets[0].data = NCSA_DATA.paperUsage.monthlyTrend.map(d => d.cost);
    chartInstances.paperMonthly.update();
  }

  if (chartInstances.licenseSeat) {
    chartInstances.licenseSeat.data.labels = NCSA_DATA.licenses.map(l => l.name);
    chartInstances.licenseSeat.data.datasets[0].data = NCSA_DATA.licenses.map(l => l.usedSeats);
    chartInstances.licenseSeat.data.datasets[1].data = NCSA_DATA.licenses.map(l => l.availableSeats);
    chartInstances.licenseSeat.update();
  }
}

// Modal License Dept Chart (View 4 License Detail Popup)
function renderModalLicenseDeptChart(assignedDepts, licenseName) {
  const canvas = document.getElementById('modalLicenseDeptChart');
  if (!canvas) return;

  if (chartInstances.modalLicenseDept) {
    chartInstances.modalLicenseDept.destroy();
  }

  const ctx = canvas.getContext('2d');
  const labels = assignedDepts.map(d => d.dept);
  const data = assignedDepts.map(d => d.seats);
  const colors = [
    '#1e3a8a', '#2563eb', '#0284c7', '#059669', '#7c3aed', '#d97706', '#dc2626', '#0d9488'
  ];

  chartInstances.modalLicenseDept = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'จำนวนสิทธิ์ที่จัดสรร (Seats)',
        data: data,
        backgroundColor: colors.slice(0, labels.length),
        borderRadius: 4,
        borderWidth: 0,
        barPercentage: 0.65
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          padding: 6,
          cornerRadius: 6,
          callbacks: {
            label: (ctx) => `  สิทธิ์ที่ได้รับ: ${ctx.parsed.x.toLocaleString()} Seats`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: 'rgba(226, 232, 240, 0.6)' },
          ticks: { font: { size: 9 } }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 10, weight: '700', family: "'Prompt', sans-serif" }, color: '#1e3a8a' }
        }
      }
    }
  });
}

// --------------------------------------------------------------------------
// PROJECT CHARTS
// --------------------------------------------------------------------------
function initProjectCharts() {
  const pieCanvas = document.getElementById('projBudgetPieChart');
  const donutCanvas = document.getElementById('projStatusDonutChart');
  
  if (pieCanvas) {
    if (chartInstances.projBudgetPie) {
      chartInstances.projBudgetPie.destroy();
    }
    const pieCtx = pieCanvas.getContext('2d');
    chartInstances.projBudgetPie = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: [
          'แผนแม่บท ICT & EA (ยุทธศาสตร์ 1)',
          'นวัตกรรม Cyber, Big Data & AI (ยุทธศาสตร์ 4)',
          'ระบบ Smart Back Office (ยุทธศาสตร์ 4)'
        ],
        datasets: [{
          data: [1, 1, 1],
          backgroundColor: ['#1e3a8a', '#3b82f6', '#10b981'],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 14,
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 10, bottom: 16, left: 10, right: 10 }
        },
        animation: { animateScale: true, animateRotate: true, duration: 1200, easing: 'easeOutQuart' },
        onClick: (event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            if (typeof openChartDetailModal === 'function') {
              openChartDetailModal('projStrategy', idx);
            }
          }
        },
        onHover: (event, chartElements) => {
          if (event.native && event.native.target) {
            event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
          }
        },
        plugins: {
          legend: {
            position: 'right',
            labels: { boxWidth: 12, font: { size: 10, family: "'Prompt', sans-serif" } }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 8,
            titleFont: { family: "'Prompt', sans-serif", size: 11, weight: '700' },
            bodyFont: { family: "'Prompt', sans-serif", size: 11 },
            callbacks: {
              label: function(context) {
                return ' ' + context.label + ': คลิกเพื่อดูรายละเอียดโครงการ';
              }
            }
          }
        }
      }
    });
  }

  if (donutCanvas) {
    if (chartInstances.projStatusDonut) {
      chartInstances.projStatusDonut.destroy();
    }
    const donutCtx = donutCanvas.getContext('2d');

    // Dynamic project status counts from NCSA_DATA.projects
    const projects = (typeof NCSA_DATA !== 'undefined' && NCSA_DATA.projects) ? NCSA_DATA.projects : [];
    const onTrackList = projects.filter(p => p.status === 'เป็นไปตามแผน' || p.status === 'ตามแผน');
    const aheadList = projects.filter(p => p.status === 'เร็วกว่าแผน');
    const delayedList = projects.filter(p => p.status === 'ล่าช้ากว่าแผน' || p.status === 'ล่าช้า');

    chartInstances.projStatusDonut = new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ['เป็นไปตามแผน', 'เร็วกว่าแผน', 'ล่าช้ากว่าแผน'],
        datasets: [{
          data: [onTrackList.length || 1, aheadList.length || 2, delayedList.length || 0],
          backgroundColor: ['#3b82f6', '#10b981', '#ef4444'], // เป็นไปตามแผน = สีฟ้า (#3b82f6), เร็วกว่าแผน = สีเขียว (#10b981), ล่าช้ากว่าแผน = สีแดง (#ef4444)
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 18, // 3D slice pop-out on hover without clipping edges
          hoverBorderWidth: 4,
          hoverBorderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 12, bottom: 20, left: 12, right: 12 }
        },
        animation: { animateScale: true, animateRotate: true, duration: 1200, easing: 'easeOutBack' },
        onClick: (event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            if (typeof openChartDetailModal === 'function') {
              openChartDetailModal('overviewProj', idx);
            }
          }
        },
        onHover: (event, chartElements) => {
          if (event.native && event.native.target) {
            event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
          }
        },
        plugins: {
          legend: {
            position: 'right',
            labels: { boxWidth: 12, font: { size: 10, family: "'Prompt', sans-serif" } }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 8,
            titleFont: { family: "'Prompt', sans-serif", size: 11, weight: '700' },
            bodyFont: { family: "'Prompt', sans-serif", size: 11 },
            callbacks: {
              label: function(context) {
                return ' ' + context.label + ': ' + context.parsed + ' โครงการ (คลิกเพื่อดูรายละเอียด)';
              }
            }
          }
        },
        cutout: '66%'
      },
      plugins: [{
        id: 'donut3DShadow',
        beforeDraw(chart) {
          const { ctx } = chart;
          ctx.save();
          ctx.shadowColor = 'rgba(15, 23, 42, 0.22)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetY = 5;
          ctx.shadowOffsetX = 2;
        },
        afterDraw(chart) {
          const { ctx } = chart;
          ctx.restore();
        }
      }]
    });
  }
}

// ============================================================
// REPORT CASE STATISTICAL CHARTS (5 Excel Sheets)
// ============================================================
function initCaseOverviewCharts() {
  const ctxPie = document.getElementById('caseYearlyPieChart');
  if (!ctxPie || !NCSA_DATA.caseStatistics) return;

  if (chartInstances.caseYearlyPie) chartInstances.caseYearlyPie.destroy();

  const data = NCSA_DATA.caseStatistics.total_by_year;
  chartInstances.caseYearlyPie = new Chart(ctxPie, {
    type: 'doughnut',
    data: {
      labels: data.years.map(y => 'พ.ศ. ' + y),
      datasets: [{
        data: data.counts,
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#94a3b8'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { animateScale: true, duration: 900 },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            padding: 10,
            font: { size: 10, weight: '600' }
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw.toLocaleString()} ครั้ง`
          }
        }
      },
      cutout: '68%'
    }
  });
}

function initCaseCategoryChart() {
  const ctx = document.getElementById('caseCategoryChart');
  if (!ctx || !NCSA_DATA.caseStatistics) return;
  if (chartInstances.caseCategory) chartInstances.caseCategory.destroy();

  const items = NCSA_DATA.caseStatistics.by_category.filter(c => (c.y2569 + c.y2568) > 0);
  const labels = items.map(i => i.name.length > 25 ? i.name.slice(0, 25) + '...' : i.name);

  chartInstances.caseCategory = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'ปี 2569',
          data: items.map(i => i.y2569),
          backgroundColor: '#3b82f6',
          borderRadius: 6
        },
        {
          label: 'ปี 2568',
          data: items.map(i => i.y2568),
          backgroundColor: '#93c5fd',
          borderRadius: 6
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12 } },
        tooltip: { backgroundColor: '#0f172a', padding: 10, cornerRadius: 8 }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: '#f1f5f9' } },
        y: { grid: { display: false }, ticks: { font: { size: 10 } } }
      }
    }
  });
}

function initCaseDeptChart() {
  const ctx = document.getElementById('caseDeptChart');
  if (!ctx || !NCSA_DATA.caseStatistics) return;
  if (chartInstances.caseDept) chartInstances.caseDept.destroy();

  const items = NCSA_DATA.caseStatistics.by_dept.filter(d => (d.y2569 + d.y2568 + d.y2567 + d.y2566) > 0);
  const labels = items.map(i => i.name);
  const data2569 = items.map(i => i.y2569);

  chartInstances.caseDept = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data2569,
        backgroundColor: ['#3b82f6', '#1e3a8a', '#dc2626', '#10b981', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
      },
      cutout: '60%'
    }
  });
}

function initCaseLevelChart() {
  const ctx = document.getElementById('caseLevelChart');
  if (!ctx || !NCSA_DATA.caseStatistics) return;
  if (chartInstances.caseLevel) chartInstances.caseLevel.destroy();

  const items = NCSA_DATA.caseStatistics.by_level.filter(l => (l.y2569 + l.y2568) > 0);

  chartInstances.caseLevel = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: items.map(i => i.name),
      datasets: [
        {
          label: 'ปี 2569',
          data: items.map(i => i.y2569),
          backgroundColor: '#1d4ed8',
          borderRadius: 6
        },
        {
          label: 'ปี 2568',
          data: items.map(i => i.y2568),
          backgroundColor: '#60a5fa',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12 } },
        tooltip: { backgroundColor: '#0f172a', padding: 10, cornerRadius: 8 }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
        x: { grid: { display: false } }
      }
    }
  });
}

function initCasePositionChart() {
  const ctx = document.getElementById('casePositionChart');
  if (!ctx || !NCSA_DATA.caseStatistics) return;
  if (chartInstances.casePosition) chartInstances.casePosition.destroy();

  const items = [...NCSA_DATA.caseStatistics.by_position]
    .filter(p => p.y2569 > 0)
    .sort((a, b) => b.y2569 - a.y2569)
    .slice(0, 8);

  const labels = items.map(i => i.name.length > 25 ? i.name.slice(0, 25) + '...' : i.name);

  chartInstances.casePosition = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'จำนวนคำขอปี 2569 (ครั้ง)',
        data: items.map(i => i.y2569),
        backgroundColor: '#7c3aed',
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#0f172a', padding: 10, cornerRadius: 8 }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: '#f1f5f9' } },
        y: { grid: { display: false }, ticks: { font: { size: 9 } } }
      }
    }
  });
}

window.initCaseOverviewCharts = initCaseOverviewCharts;
window.initCaseCategoryChart = initCaseCategoryChart;
window.initCaseDeptChart = initCaseDeptChart;
window.initCaseLevelChart = initCaseLevelChart;
window.initCasePositionChart = initCasePositionChart;

