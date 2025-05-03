import CompanyLogo from "../assets/images/logo/company.svg";
import CompanyDarkLogo from "../assets/images/logo/companyDark.svg";

const CustomLogo = ({ width = 4, height = 4, isDark = false }) => {
  return (
    <img
      src={isDark ? CompanyDarkLogo : CompanyLogo}
      style={{ width: `${width}rem`, height: `${height}rem` }}
    />
  );
};

export default CustomLogo;
