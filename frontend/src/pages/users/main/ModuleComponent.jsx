import Inward from "../stockTracking/inward/index";
import Outward from "../stockTracking/outward/index";
import BranchTransfer from "../stockTracking/branchTransfer/index";
import CompanyDetails from "../companyDetails/index";
import ChallanGeneration from "../challanGeneration/index";
import StockSummary from "../stockSummary/index";
import JobWork from "../jobWork/index";
import ProcessingUnit from "../processingUnit/index";
import History from "../history/index";

export const ModuleComponents = {

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
  companyDetails: {
    component: CompanyDetails,
    pageTitle: "Company Details",
    pageKey: "companyDetails",
    index: 2,
  },

  //* Challan Generation
  challanGeneration: {
    component: ChallanGeneration,
    pageTitle: "Challan Generation",
    pageKey: "challanGeneration",
    index: 3,
  },

  //* Stock Summary
  stockSummary: {
    component: StockSummary,
    pageTitle: "Stock Summary",
    pageKey: "stockSummary",
    index: 4
  },

  //* Job Work
  jobWork: {
    component: JobWork,
    pageTitle: "Job Work",
    pageKey: "jobWork",
    index: 5
  },

  //* Processing Unit
  processingUnit: {
    component: ProcessingUnit,
    pageTitle: "Processing Unit",
    pageKey: "processingUnit",
    index: 6
  },

  //* History
  history: {
    component: History,
    pageTitle: "History",
    pageKey: "history",
    index: 7
  },
};
