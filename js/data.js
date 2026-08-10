// Data Store for NCSA (สกมช.) IT Support Bureau Executive Dashboard

const NCSA_DATA = {
  // 1. Departments / Offices requesting IT Services from our Bureau
  departments: [
    { id: 'sbk', code: 'สบก.', name: 'สำนักบริหารงานกลาง', icon: 'fa-building-user', color: '#3b82f6' },
    { id: 'spz', code: 'สปซ.', name: 'สำนักปฏิบัติการทางไซเบอร์', icon: 'fa-shield-halved', color: '#1e3a8a' },
    { id: 'syp', code: 'สยป.', name: 'สำนักยุทธศาสตร์และการวางแผน', icon: 'fa-chess-king', color: '#dc2626' },
    { id: 'swb', code: 'สวบ.', name: 'สำนักวิชาการและการพัฒนาบุคลากร', icon: 'fa-graduation-cap', color: '#059669' },
    { id: 'sks', code: 'สกส.', name: 'สำนักกำกับดูแลและส่งเสริมความปลอดภัยไซเบอร์', icon: 'fa-user-check', color: '#d97706' },
    { id: 'sst', code: 'สสท.', name: 'สำนักสื่อสารและเทคโนโลยีสารสนเทศ (IT Support)', icon: 'fa-network-wired', color: '#7c3aed' }
  ],

  // Overall IT Support Performance Summary
  summary: {
    totalHardware: 1248,
    activeHardware: 1180,
    maintenanceHardware: 45,
    spareHardware: 23,

    paperThisMonthReams: 342, // reams
    paperDiffPercent: -12.4, // lower than last month
    paperCostThisMonth: 41040, // THB
    treesSavedThisYear: 184,
    co2ReducedKg: 2450,

    totalLicenses: 8,
    totalSeatsPurchased: 7357,
    totalSeatsUsed: 6703,
    licenseUtilizationRate: 91.1,

    totalActiveCases: 18,
    criticalCases: 2,
    highCases: 5,
    mediumCases: 8,
    lowCases: 3,
    slaResolutionRate: 98.2, // 98.2% SLA Resolution Rate

    totalProjects: 3,
    totalBudgetTHB: 0,
    projectsOnTrack: 1,
    projectsAhead: 2,
    projectsDelayed: 0,
    projectsCompleted: 1,
    overallProjectProgress: 83.3
  },

  // 2. Hardware Assets List (คอมพิวเตอร์ printer เซิร์ฟเวอร์ ฯลฯ)
  hardware: [
    {
      id: "HW-PC-2026-001",
      name: "Dell OptiPlex 7010 Tower i7-13700",
      type: "คอมพิวเตอร์ตั้งโต๊ะ",
      holder: "พลเอก ดร.ชูชาติ สุวรรณรัตน์",
      recipient: "นายศุภชัย วงษ์สว่าง",
      ip: "10.10.10.45",
      mac: "70:85:C2:A1:3F:89",
      dept: "สำนักบริหารงานกลาง",
      deptCode: "สบก.",
      status: "ใช้งานปกติ",
      serial: "DEL-7010-98421",
      location: "ชั้น 7 ห้องบริหาร 702",
      receivedDate: "2024-03-15"
    },
    {
      id: "HW-NB-2026-002",
      name: "Lenovo ThinkPad X1 Carbon Gen 11",
      type: "โน๊ตบุ๊ค",
      holder: "ดร.นิวัตน์ สมบูรณ์",
      recipient: "นางสาววิภาดา รัตนกุล",
      ip: "10.10.20.112",
      mac: "8C:16:45:9E:0B:12",
      dept: "สำนักปฏิบัติการทางไซเบอร์",
      deptCode: "สปซ.",
      status: "ใช้งานปกติ",
      serial: "LNV-X1C-44210",
      location: "ชั้น 8 ศูนย์ SOC",
      receivedDate: "2024-06-20"
    },
    {
      id: "HW-PR-2026-003",
      name: "HP LaserJet Enterprise MFP M635h",
      type: "printer",
      holder: "สำนักปฏิบัติการทางไซเบอร์",
      recipient: "เจ้าหน้าที่ SOC ฝ่ายปฏิบัติการ",
      ip: "10.10.20.250",
      mac: "00:1E:0B:44:81:AA",
      dept: "สำนักปฏิบัติการทางไซเบอร์",
      deptCode: "สปซ.",
      status: "ใช้งานปกติ",
      serial: "HP-M635-77892",
      location: "ชั้น 8 โถงกลาง SOC",
      receivedDate: "2023-11-10"
    },
    {
      id: "HW-SV-2026-004",
      name: "Dell PowerEdge R760 Server (64-Core, 256GB)",
      type: "เซิร์ฟเวอร์",
      holder: "สำนักสื่อสารและเทคโนโลยีสารสนเทศ",
      recipient: "นายกิตติศักดิ์ พรหมคุณ",
      ip: "10.10.60.10",
      mac: "D4:F5:EF:11:22:33",
      dept: "สำนักสื่อสารและเทคโนโลยีสารสนเทศ",
      deptCode: "สสท.",
      status: "ใช้งานปกติ",
      serial: "DEL-R760-00192",
      location: "ชั้น 6 Data Center Room A",
      receivedDate: "2024-01-10"
    },
    {
      id: "HW-NB-2026-005",
      name: "Apple MacBook Pro 16 M3 Max",
      type: "โน๊ตบุ๊ค",
      holder: "นายสมชาย อุดมทรัพย์",
      recipient: "นายสมชาย อุดมทรัพย์",
      ip: "10.10.30.88",
      mac: "F4:D4:88:99:AA:BB",
      dept: "สำนักยุทธศาสตร์และการวางแผน",
      deptCode: "สยป.",
      status: "ใช้งานปกติ",
      serial: "APP-MBP-99210",
      location: "ชั้น 7 ห้องแผนงาน",
      receivedDate: "2024-04-05"
    },
    {
      id: "HW-PC-2026-006",
      name: "HP ProDesk 400 G9 SFF i5-12500",
      type: "คอมพิวเตอร์ตั้งโต๊ะ",
      holder: "นางสาวอรทัย มั่นคง",
      recipient: "นางสาวอรทัย มั่นคง",
      ip: "10.10.40.34",
      mac: "B4:B5:2F:3A:4B:5C",
      dept: "สำนักวิชาการและการพัฒนาบุคลากร",
      deptCode: "สวบ.",
      status: "ส่งซ่อม",
      serial: "HP-PD400-55123",
      location: "ชั้น 9 อาคารฝึกอบรม",
      receivedDate: "2023-08-14"
    },
    {
      id: "HW-PR-2026-007",
      name: "Canon imageRUNNER ADVANCE C5535i",
      type: "printer",
      holder: "สำนักบริหารงานกลาง",
      recipient: "ฝ่ายงานสารบรรณ",
      ip: "10.10.10.200",
      mac: "00:80:92:3C:7F:11",
      dept: "สำนักบริหารงานกลาง",
      deptCode: "สบก.",
      status: "ใช้งานปกติ",
      serial: "CAN-IRC5535-331",
      location: "ชั้น 7 งานเอกสารสารบรรณ",
      receivedDate: "2023-05-01"
    },
    {
      id: "HW-NW-2026-008",
      name: "Cisco Catalyst 9300 48-Port Switch",
      type: "อุปกรณ์เครือข่าย",
      holder: "สำนักสื่อสารและเทคโนโลยีสารสนเทศ",
      recipient: "นายธนพล จิตเที่ยง",
      ip: "10.10.60.254",
      mac: "00:27:0D:88:99:00",
      dept: "สำนักสื่อสารและเทคโนโลยีสารสนเทศ",
      deptCode: "สสท.",
      status: "ใช้งานปกติ",
      serial: "CSC-C9300-9941",
      location: "ชั้น 7 Server Rack B2",
      receivedDate: "2024-02-18"
    },
    {
      id: "HW-NB-2026-009",
      name: "Dell Latitude 5440 i7-1365U",
      type: "โน๊ตบุ๊ค",
      holder: "นายปรเมศวร์ นามสมมติ",
      recipient: "นางสาวศิริพร บุญเหลือ",
      ip: "10.10.50.41",
      mac: "34:E6:D7:12:34:56",
      dept: "สำนักกำกับดูแลและส่งเสริมความปลอดภัยไซเบอร์",
      deptCode: "สกส.",
      status: "ใช้งานปกติ",
      serial: "DEL-LAT5440-112",
      location: "ชั้น 9 ฝ่ายกำกับกฎหมาย",
      receivedDate: "2024-05-11"
    },
    {
      id: "HW-PC-2026-010",
      name: "Lenovo ThinkCentre M70s Gen 3",
      type: "คอมพิวเตอร์ตั้งโต๊ะ",
      holder: "นายศุภกิตติ์ แสงอรุณ",
      recipient: "นายศุภกิตติ์ แสงอรุณ",
      ip: "10.10.20.77",
      mac: "A0:C5:89:12:77:88",
      dept: "สำนักปฏิบัติการทางไซเบอร์",
      deptCode: "สปซ.",
      status: "สำรอง",
      serial: "LNV-M70S-88301",
      location: "ชั้น 8 ห้องเก็บอุปกรณ์ไอที",
      receivedDate: "2024-01-25"
    }
  ],

  // 3. Paper Usage Data
  paperUsage: {
    monthlyTrend: [
      { month: 'ม.ค.', reams: 410, pages: 205000, cost: 49200 },
      { month: 'ก.พ.', reams: 390, pages: 195000, cost: 46800 },
      { month: 'มี.ค.', reams: 440, pages: 220000, cost: 52800 },
      { month: 'เม.ย.', reams: 360, pages: 180000, cost: 43200 },
      { month: 'พ.ค.', reams: 380, pages: 190000, cost: 45600 },
      { month: 'มิ.ย.', reams: 350, pages: 175000, cost: 42000 },
      { month: 'ก.ค.', reams: 342, pages: 171000, cost: 41040 }
    ],
    departmentBreakdown: [
      { dept: 'สำนักบริหารงานกลาง (สบก.)', reams: 110, quota: 120, pages: 55000, percent: 91.6, status: 'ปกติ' },
      { dept: 'สำนักปฏิบัติการทางไซเบอร์ (สปซ.)', reams: 45, quota: 70, pages: 22500, percent: 64.2, status: 'ประหยัดมาก' },
      { dept: 'สำนักยุทธศาสตร์และการวางแผน (สยป.)', reams: 78, quota: 80, pages: 39000, percent: 97.5, status: 'ใกล้เต็มโควต้า' },
      { dept: 'สำนักวิชาการและการพัฒนาบุคลากร (สวบ.)', reams: 52, quota: 75, pages: 26000, percent: 69.3, status: 'ปกติ' },
      { dept: 'สำนักกำกับดูแลและส่งเสริม (สกส.)', reams: 38, quota: 50, pages: 19000, percent: 76.0, status: 'ปกติ' },
      { dept: 'สำนักสื่อสารและเทคโนโลยีสารสนเทศ (สสท.)', reams: 19, quota: 40, pages: 9500, percent: 47.5, status: 'ประหยัดมาก' }
    ],
    topPrinters: [
      { name: "Canon iR C5535i (สารบรรณ สบก.)", location: "ชั้น 7 งานสารบรรณ", pagesThisMonth: 48500, userCount: 42 },
      { name: "HP LaserJet M635h (สยป.)", location: "ชั้น 7 โถง สยป.", pagesThisMonth: 34200, userCount: 28 },
      { name: "Kyocera ECOSYS (สวบ.)", location: "ชั้น 9 หน้าห้องอบรม", pagesThisMonth: 24100, userCount: 35 },
      { name: "HP MFP M635h (สปซ.)", location: "ชั้น 8 ศูนย์ SOC", pagesThisMonth: 18900, userCount: 65 }
    ],
    printVsDigitalRatio: {
      digitalDocPercent: 78.4,
      paperDocPercent: 21.6
    }
  },

  // 4. Software License Data
  licenses: [
    {
      id: "LIC-001",
      name: "Microsoft 365 Enterprise E5",
      category: "Office & Productivity",
      vendor: "Microsoft Thailand",
      totalSeats: 1200,
      usedSeats: 1140,
      availableSeats: 60,
      expiryDate: "2027-03-31",
      unitCostTHB: 14500,
      assignedDepts: [
        { dept: "สบก.", seats: 220 },
        { dept: "สปซ.", seats: 350 },
        { dept: "สยป.", seats: 150 },
        { dept: "สวบ.", seats: 180 },
        { dept: "สกส.", seats: 140 },
        { dept: "สสท.", seats: 100 }
      ]
    },
    {
      id: "LIC-002",
      name: "CrowdStrike Falcon Complete EDR",
      category: "Endpoint Security",
      vendor: "CrowdStrike Inc.",
      totalSeats: 1500,
      usedSeats: 1380,
      availableSeats: 120,
      expiryDate: "2026-11-15",
      unitCostTHB: 2800,
      assignedDepts: [
        { dept: "สบก.", seats: 250 },
        { dept: "สปซ.", seats: 420 },
        { dept: "สยป.", seats: 180 },
        { dept: "สวบ.", seats: 210 },
        { dept: "สกส.", seats: 170 },
        { dept: "สสท.", seats: 150 }
      ]
    },
    {
      id: "LIC-003",
      name: "Adobe Creative Cloud All Apps",
      category: "Graphic & Media",
      vendor: "Adobe System",
      totalSeats: 45,
      usedSeats: 42,
      availableSeats: 3,
      expiryDate: "2026-10-30",
      unitCostTHB: 28500,
      assignedDepts: [
        { dept: "สบก. (ประชาสัมพันธ์)", seats: 12 },
        { dept: "สวบ. (สื่อการสอน)", seats: 18 },
        { dept: "สยป. (สื่ออินโฟกราฟิก)", seats: 8 },
        { dept: "สสท.", seats: 4 }
      ]
    },
    {
      id: "LIC-004",
      name: "Palo Alto Cortex XSOAR Enterprise",
      category: "Cybersecurity SOC & SIEM",
      vendor: "Palo Alto Networks",
      totalSeats: 50,
      usedSeats: 48,
      availableSeats: 2,
      expiryDate: "2027-01-15",
      unitCostTHB: 180000,
      assignedDepts: [
        { dept: "สปซ. (ศูนย์ SOC / CERT)", seats: 42 },
        { dept: "สสท.", seats: 6 }
      ]
    },
    {
      id: "LIC-005",
      name: "VMware vSphere 8 Enterprise Plus",
      category: "Infrastructure & Virtualization",
      vendor: "Broadcom / VMware",
      totalSeats: 32,
      usedSeats: 28,
      availableSeats: 4,
      expiryDate: "2027-05-20",
      unitCostTHB: 85000,
      assignedDepts: [
        { dept: "สสท. (Data Center)", seats: 24 },
        { dept: "สปซ. (Lab Test)", seats: 4 }
      ]
    },
    {
      id: "LIC-006",
      name: "Tableau Enterprise Creator & Server",
      category: "Data Analytics & BI",
      vendor: "Salesforce / Tableau",
      totalSeats: 30,
      usedSeats: 25,
      availableSeats: 5,
      expiryDate: "2026-12-31",
      unitCostTHB: 36000,
      assignedDepts: [
        { dept: "สยป. (วิเคราะห์ข้อมูล)", seats: 12 },
        { dept: "สปซ.", seats: 8 },
        { dept: "สกส.", seats: 5 }
      ]
    },
    {
      id: "LIC-007",
      name: "Windows 11 Pro Enterprise Volume",
      category: "Operating System",
      vendor: "Microsoft",
      totalSeats: 1500,
      usedSeats: 1420,
      availableSeats: 80,
      expiryDate: "2028-12-31",
      unitCostTHB: 5200,
      assignedDepts: [
        { dept: "สบก.", seats: 260 },
        { dept: "สปซ.", seats: 450 },
        { dept: "สยป.", seats: 200 },
        { dept: "สวบ.", seats: 220 },
        { dept: "สกส.", seats: 170 },
        { dept: "สสท.", seats: 120 }
      ]
    },
    {
      id: "LIC-008",
      name: "Kaspersky Endpoint Security Enterprise",
      category: "Endpoint Protection",
      vendor: "Kaspersky Lab",
      totalSeats: 300,
      usedSeats: 270,
      availableSeats: 30,
      expiryDate: "2026-09-15",
      unitCostTHB: 1200,
      assignedDepts: [
        { dept: "สวบ. (เครื่องฝึกอบรม)", seats: 200 },
        { dept: "สสท. (เครื่องสำรอง)", seats: 70 }
      ]
    }
  ],

  // 5. IT Support Service Ticket Cases Received by IT Support Bureau
  cases: [
    {
      id: "IT-CASE-2026-0512",
      title: "เครื่องคอมพิวเตอร์เปิดไม่ติดและจอภาพขึ้นบลูสกรีน (Hardware Fault)",
      severity: "Critical",
      dept: "สำนักบริหารงานกลาง",
      deptCode: "สบก.",
      reporter: "พลเอก ดร.ชูชาติ สุวรรณรัตน์",
      assignee: "นายภาณุเดช (IT Support Technician)",
      status: "กำลังดำเนินการ",
      reportedDate: "2026-07-27 09:15",
      slaStatus: "อยู่ในเวลา SLA (เหลือ 2 ชม.)",
      description: "เจ้าหน้าที่แจ้งเรื่องเครื่องคอมพิวเตอร์ดับกระทันหัน ทีม IT Support นำเครื่องโน๊ตบุ๊คสำรองไปเปลี่ยนให้ใช้งานชั่วคราวแล้ว และนำเครื่องเข้าตรวจสอบ RAM/Power Supply"
    },
    {
      id: "IT-CASE-2026-0511",
      title: "คำขอเพิ่มสิทธิ์บัญชีผู้ใช้งาน M365 และเปิดใช้งาน VPN ทางไกล",
      severity: "High",
      dept: "สำนักวิชาการและการพัฒนาบุคลากร",
      deptCode: "สวบ.",
      reporter: "นางสาวอรทัย มั่นคง",
      assignee: "นายธนพล (Network & Account Admin)",
      status: "กำลังดำเนินการ",
      reportedDate: "2026-07-26 16:40",
      slaStatus: "อยู่ในเวลา SLA (เหลือ 6 ชม.)",
      description: "คำขออนุมัติเพิ่มสิทธิ์การเข้าถึงโฟลเดอร์แชร์กลาง และการเชื่อมต่อ FortiClient VPN สำหรับปฏิบัติการนอกสถานที่ ได้ผ่านการอนุมัติจาก ผอ. แล้ว ดำเนินการตั้งค่ารหัสผ่านใหม่"
    },
    {
      id: "IT-CASE-2026-0510",
      title: "printer ประจำสำนัก สยป. ไม่สามารถพิมพ์งานแบบไร้สายได้",
      severity: "Medium",
      dept: "สำนักยุทธศาสตร์และการวางแผน",
      deptCode: "สยป.",
      reporter: "นายสมชาย อุดมทรัพย์",
      assignee: "นายกิตติศักดิ์ (IT Support Staff)",
      status: "เสร็จสิ้น",
      reportedDate: "2026-07-26 11:20",
      slaStatus: "สำเร็จตาม SLA (1.5 ชม.)",
      description: "ได้รับแจ้ง printer Canon iR C5535i หลุดจากวง LAN สสท. เข้าไปตรวจสอบพบสาย UTP ชำรุด ดำเนินการเข้าหัว RJ45 ใหม่และ Reset Print Spooler พิมพ์ได้ปกติ"
    },
    {
      id: "IT-CASE-2026-0509",
      title: "คอมพิวเตอร์ทำงานช้าผิดปกติและมีโฆษณาป๊อบอัปแสดงตลอดเวลา",
      severity: "Medium",
      dept: "สำนักกำกับดูแลและส่งเสริมความปลอดภัยไซเบอร์",
      deptCode: "สกส.",
      reporter: "นายปรเมศวร์ นามสมมติ",
      assignee: "นายภาณุเดช (IT Support Technician)",
      status: "เสร็จสิ้น",
      reportedDate: "2026-07-25 14:10",
      slaStatus: "สำเร็จตาม SLA (2.0 ชม.)",
      description: "เข้าสแกนเครื่องด้วย CrowdStrike EDR ตรวจพบ Adware Extension บน Google Chrome ดำเนินการ Quarantine ลบไฟล์ และ Clean Temp Data ประสิทธิภาพกลับมาปกติ"
    },
    {
      id: "IT-CASE-2026-0508",
      title: "คำขอติดตั้งโปรแกรม Adobe Creative Cloud และ License แท้",
      severity: "Low",
      dept: "สำนักปฏิบัติการทางไซเบอร์",
      deptCode: "สปซ.",
      reporter: "ดร.นิวัตน์ สมบูรณ์",
      assignee: "นายวิศรุต (Software Admin)",
      status: "เสร็จสิ้น",
      reportedDate: "2026-07-24 10:15",
      slaStatus: "สำเร็จตาม SLA",
      description: "เจ้าหน้าที่ขอติดตั้งชุดโปรแกรม Adobe Photoshop & Illustrator เพื่อจัดทำสื่ออินโฟกราฟิก จัดสรรสิทธิ์ M365/Adobe License และ Remote ติดตั้งให้เรียบร้อย"
    },
    {
      id: "IT-CASE-2026-0507",
      title: "สัญญาณ Wi-Fi บริเวณโถงประชุม ชั้น 8 หลุดบ่อยและสัญญาณอ่อน",
      severity: "High",
      dept: "สำนักปฏิบัติการทางไซเบอร์",
      deptCode: "สปซ.",
      reporter: "เจ้าหน้าที่ฝ่ายประสานงาน",
      assignee: "ทีมงาน Network สสท.",
      status: "เสร็จสิ้น",
      reportedDate: "2026-07-23 15:30",
      slaStatus: "สำเร็จตาม SLA",
      description: "ตรวจสอบพบ Cisco Access Point AP-08 ทำงานหนักเกินความจุ ดำเนินการ Re-balance Channel และเพิ่ม Access Point สำรอง 1 จุด สัญญาณกลับมาเสถียร 100%"
    }
  ],

  // 6. IT Projects Managed by IT Bureau (สำนักเทคโนโลยีสารสนเทศ) from data.chaiyapat.space
  projects: [
    {
      id: "34(1)",
      name: "กิจกรรมการจัดทำแผนแม่บท ICT และ Enterprise Architecture และปรับปรุงระบบเทคโนโลยีสารสนเทศสำนักงาน",
      dept: "สำนักเทคโนโลยีสารสนเทศ",
      manager: "สำนักเทคโนโลยีสารสนเทศ",
      budgetTHB: 0,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      progressPercent: 100,
      status: "เร็วกว่าแผน",
      milestones: [
        { title: "จัดทำแผนแม่บท ICT (ICT Master Plan)", done: true },
        { title: "จัดทำสถาปัตยกรรมองค์กร (Enterprise Architecture)", done: true },
        { title: "ปรับปรุงระบบเทคโนโลยีสารสนเทศสำนักงาน", done: true }
      ]
    },
    {
      id: "35(4.1)",
      name: "กิจกรรมจัดหานวัตกรรมด้านความมั่นคงปลอดภัยไซเบอร์ Big Data หรือ AI มาใช้เพื่อพัฒนาขีดความสามารถในการบริหารองค์กรสมัยใหม่",
      dept: "สำนักเทคโนโลยีสารสนเทศ",
      manager: "สำนักเทคโนโลยีสารสนเทศ",
      budgetTHB: 0,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      progressPercent: 75,
      status: "เร็วกว่าแผน",
      milestones: [
        { title: "ศึกษาความต้องการนวัตกรรม Cyber, Big Data & AI", done: true },
        { title: "จัดหาและทดสอบระบบประมวลผลการบริหารองค์กร", done: true },
        { title: "ประเมินและเพิ่มขีดความสามารถในการบริหารสมัยใหม่", done: false }
      ]
    },
    {
      id: "36(4.1)",
      name: "กิจกรรมการพัฒนาระบบ Smart Back Office ให้สามารถสนับสนุนงานหลักได้ทุกกระบวนงาน",
      dept: "สำนักเทคโนโลยีสารสนเทศ",
      manager: "สำนักเทคโนโลยีสารสนเทศ",
      budgetTHB: 0,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      progressPercent: 75,
      status: "ตามแผน",
      milestones: [
        { title: "ออกแบบโครงสร้างระบบ Smart Back Office", done: true },
        { title: "พัฒนาระบบงานสนับสนุนการดำเนินงานหลัก", done: true },
        { title: "ทดสอบการเชื่อมโยงระบบทุกกระบวนงาน", done: false }
      ]
    }
  ]
};
