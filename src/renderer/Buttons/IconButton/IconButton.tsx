import './styles.css';

type IconButtonProp = {
  src: string;
  alt: string;
  handleClick: () => void;
};

const IconButton = ({ src, alt, handleClick }: IconButtonProp) => {
  return (
    <button className="IconButton" type="button" onClick={handleClick}>
      <img className="IBIcon" src={src} alt={alt} />
    </button>
  );
};

export default IconButton;
