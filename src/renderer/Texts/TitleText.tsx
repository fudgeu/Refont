import './style.css';

type TitleTextProp = {
  children?: React.ReactNode;
};

const TitleText = ({ children }: TitleTextProp) => {
  return <div className="TitleText">{children}</div>;
};

TitleText.defaultProps = {
  children: [],
};

export default TitleText;
