const perms = [
  {
    name: "Admin Settings",
    key: "adminSettings",
    access: false,
    order: 1,
  },
  {
    name: "Dashboard",
    key: "dashboard",
    access: true,
    order: 2,
  },
  {
    name: "Stock Tracking",
    key: "stockTracking",
    access: true,
    order: 3,
    children: [
      {
        name: "Inward",
        key: "inward",
        access: true,
        order: 1,
      },
      {
        name: "Outward",
        key: "outward",
        access: true,
        order: 2,
      },
      {
        name: "Branch Transfer",
        key: "branchTransfer",
        access: true,
        order: 3,
      },
    ],
  },
  {
    name: "Company Details",
    key: "companyDetails",
    access: true,
    order: 4,
  },
  {
    name: "Challan List",
    key: "challanList",
    access: true,
    order: 5,
  },
  {
    name: "Stock Summary",
    key: "stockSummary",
    access: true,
    order: 6,
  },
  {
    name: "Job Work",
    key: "jobWork",
    access: true,
    order: 7,
  },
  {
    name: "Processing Unit",
    key: "processingUnit",
    access: true,
    order: 8,
  },
  {
    name: "Transport Details",
    key: "transportDetails",
    access: true,
    order: 9,
  },
];

export default perms;
