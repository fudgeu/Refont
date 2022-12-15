import './style.css';

type MinorTextProp = {
  children?: React.ReactNode;
  muted?: boolean;
};

const MinorText = ({ children, muted }: MinorTextProp) => {
  return (
    <div className="MinorText" style={muted ? { color: '#a3a6aa' } : {}}>
      {children}
    </div>
  );
};

MinorText.defaultProps = {
  children: [],
  muted: false,
};

export default MinorText;
