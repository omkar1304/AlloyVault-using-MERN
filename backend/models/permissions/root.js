const perms = [
  {
    name: "Admin Settings",
    key: "adminSettings",
    access: false,
    order: 1,
  },
  {
    name: "Stock Tracking",
    key: "stockTracking",
    access: true,
    order: 2,
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
    order: 3,
  },
  {
    name: "Challan Generation",
    key: "challanGeneration",
    access: true,
    order: 4,
  },
  {
    name: "Stock Summary",
    key: "stockSummary",
    access: true,
    order: 5,
  },
  {
    name: "Job Work",
    key: "jobWork",
    access: true,
    order: 6,
  },
  {
    name: "Processing Unit",
    key: "processingUnit",
    access: true,
    order: 7,
  },
  {
    name: "History",
    key: "history",
    access: true,
    order: 8,
  },
];

export default perms;
