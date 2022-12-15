import './style.css';

type MainTextProp = {
  children?: React.ReactNode;
};

const MainText = ({ children }: MainTextProp) => {
  return <div className="MainText">{children}</div>;
};

MainText.defaultProps = {
  children: [],
};

export default MainText;
