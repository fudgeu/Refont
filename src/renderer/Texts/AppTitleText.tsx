import './style.css';

type AppTitleTextProp = {
  children?: React.ReactNode;
};

const AppTitleText = ({ children }: AppTitleTextProp) => {
  return <div className="AppTitleText">{children}</div>;
};

AppTitleText.defaultProps = {
  children: [],
};

export default AppTitleText;
