import { RxAvatar } from "react-icons/rx";
import { FiBox } from "react-icons/fi";
import { IoIosArrowRoundDown } from "react-icons/io";
import { IoIosArrowRoundUp } from "react-icons/io";
import { PiArrowsDownUpLight } from "react-icons/pi";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { HiOutlineReceiptPercent } from "react-icons/hi2";
import { TbReportAnalytics } from "react-icons/tb";
import { VscTools } from "react-icons/vsc";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { GrHistory } from "react-icons/gr";

export const MenuComponents = {
  adminSettings: <RxAvatar />,
  stockTracking: <FiBox />,
  inward: <IoIosArrowRoundDown />,
  outward: <IoIosArrowRoundUp />,
  branchTransfer: <PiArrowsDownUpLight />,
  companyDetails: <HiOutlineBuildingOffice />,
  challanGeneration: <HiOutlineReceiptPercent />,
  stockSummary: <TbReportAnalytics />,
  jobWork: <VscTools />,
  processingUnit: <HiOutlineHomeModern />,
  history: <GrHistory />,
};
