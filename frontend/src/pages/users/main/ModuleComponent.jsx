import Inward from "../stockTracking/inward/index";
import Outward from "../stockTracking/outward/index";
import BranchTransfer from "../stockTracking/branchTransfer/index";
import CompanyDetails from "../companyDetails/index";
import StockSummary from "../stockSummary/index";
import JobWork from "../jobWork/index";
import ProcessingUnit from "../processingUnit/index";
import History from "../history/index";
import Dashboard from "../dashboard";
import Challan from "../challanList";

export const ModuleComponents = {
  //* Dashbord
  dashboard: {
    component: Dashboard,
    pageTitle: "Dashboard",
    pageKey: "dashboard",
    index: 0,
  },

  //* Stock Tracking
  inward: {
    component: Inward,
    pageTitle: "Inward",
    pageKey: "inward",
    index: 0,
    parentIndex: 1,
  },
  outward: {
    component: Outward,
    pageTitle: "Outward",
    pageKey: "outward",
    index: 1,
    parentIndex: 1,
  },
  branchTransfer: {
    component: BranchTransfer,
    pageTitle: "Branch Transfer",
    pageKey: "branchTransfer",
    index: 2,
    parentIndex: 1,
  },

  //* Company Details
  partyDetails: {
    component: CompanyDetails,
    pageTitle: "Party Details",
    pageKey: "partyDetails",
    index: 3,
  },

  //* Challan Generation
  challanList: {
    component: Challan,
    pageTitle: "Challan List",
    pageKey: "challanList",
    index: 4,
  },

  //* Stock Summary
  stockSummary: {
    component: StockSummary,
    pageTitle: "Stock Summary",
    pageKey: "stockSummary",
    index: 5,
  },

  //* Job Work
  jobWork: {
    component: JobWork,
    pageTitle: "Job Work",
    pageKey: "jobWork",
    index: 6,
  },

  //* Processing Unit
  processingUnit: {
    component: ProcessingUnit,
    pageTitle: "Processing Unit",
    pageKey: "processingUnit",
    index: 7,
  },

  //* History
  history: {
    component: History,
    pageTitle: "History",
    pageKey: "history",
    index: 8,
  },
};
