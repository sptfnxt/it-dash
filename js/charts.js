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
    const COLORS = ['#3b82f6','#1e3a8a','#dc2626','#10b981','#f59e0b','#8b5cf6'];
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

  // --- C. Small Bar (Row 3 Col 1) ---
  const ctxMini = document.getElementById('overviewBarMini');
  if (ctxMini) {
    const ctx2d = ctxMini.getContext('2d');
    chartInstances.overviewBarMini = new Chart(ctxMini, {
      type: 'bar',
      data: {
        labels: NCSA_DATA.paperUsage.monthlyTrend.map(d => d.month),
        datasets: [
          {
            label: 'กระดาษ (รีม)',
            data: NCSA_DATA.paperUsage.monthlyTrend.map(d => d.reams),
            backgroundColor: createGradient(ctx2d, '#0d9488', '#5eead4'),
            borderRadius: 6,
            borderSkipped: false
          },
          {
            label: 'Cost (×100฿)',
            data: NCSA_DATA.paperUsage.monthlyTrend.map(d => Math.round(d.cost / 100)),
            backgroundColor: createGradient(ctx2d, '#f97316', '#fdba74'),
            borderRadius: 6,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1000 },
        onClick: (event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const idx = activeElements[0].index;
            if (typeof openChartDetailModal === 'function') {
              openChartDetailModal('overviewBarMini', idx);
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
            position: 'bottom',
            labels: { font: { size: 9 }, padding: 8, usePointStyle: true }
          },
          tooltip: { padding: 8, cornerRadius: 8 }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 9 } } },
          x: { grid: { display: false }, ticks: { font: { size: 9 } } }
        }
      }
    });
  }

  // --- D. Mini Donut (Digital vs Paper) Row 3 Col 2 ---
  const ctxMiniDonut = document.getElementById('miniDonutDigital');
  if (ctxMiniDonut) {
    const dig = NCSA_DATA.paperUsage?.printVsDigitalRatio?.digitalDocPercent ?? 67;
    const pap = NCSA_DATA.paperUsage?.printVsDigitalRatio?.paperDocPercent ?? 33;
    chartInstances.miniDonutDigital = new Chart(ctxMiniDonut, {
      type: 'doughnut',
      data: {
        labels: ['e-Document', 'Paper'],
        datasets: [{
          data: [dig, pap],
          backgroundColor: ['#10b981', '#dc2626'],
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 8
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
              openChartDetailModal('digitalVsPaper', idx);
            }
          }
        },
        onHover: (event, chartElements) => {
          if (event.native && event.native.target) {
            event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
          }
        },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        cutout: '68%'
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
          label: 'ค่าบริการพิมพ์ (บาท)',
          data: NCSA_DATA.paperUsage.monthlyTrend.map(d => d.cost),
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
    const dig = NCSA_DATA.paperUsage?.printVsDigitalRatio?.digitalDocPercent ?? 67;
    const pap = NCSA_DATA.paperUsage?.printVsDigitalRatio?.paperDocPercent ?? 33;
    chartInstances.paperRatio = new Chart(ctxRatio, {
      type: 'pie',
      data: {
        labels: ['เอกสารดิจิทัล (e-Document)', 'กระดาษพิมพ์ (Paper)'],
        datasets: [{
          data: [dig, pap],
          backgroundColor: ['#10b981', '#dc2626'],
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
              openChartDetailModal('digitalVsPaper', idx);
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
    chartInstances.overviewBarMini.data.datasets[1].data = NCSA_DATA.paperUsage.monthlyTrend.map(d => Math.round(d.cost/100));
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

