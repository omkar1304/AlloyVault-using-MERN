import CompanyLogo from "../assets/images/logo/company.svg";

const CustomLogo = ({ width = 4, height = 4 }) => {
  return (
    <img
      src={CompanyLogo}
      style={{ width: `${width}rem`, height: `${height}rem` }}
    />
  );
};

export default CustomLogo;
