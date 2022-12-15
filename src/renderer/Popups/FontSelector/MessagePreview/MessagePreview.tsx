import './styles.css';

type MessagePreviewProp = {
  icon: string;
  username: string;
  timestamp: string;
  text: string;
  font: string;
};

const MessagePreview = ({
  icon,
  username,
  timestamp,
  text,
  font,
}: MessagePreviewProp) => {
  const getPreviewStyle = () => {
    return {
      fontFamily: font,
    };
  };

  return (
    <div className="MessagePreviewContainer">
      <div className="MPLeft">
        <img src={icon} className="MPIcon" alt=" " />
      </div>
      <div className="MPRight" style={getPreviewStyle()}>
        <h3 className="MPUsernameAndTimestamp">
          <span className="MPUsername">{username}</span>
          <span className="MPTimestamp">{timestamp}</span>
        </h3>
        <div className="MPText">{text}</div>
      </div>
    </div>
  );
};

export default MessagePreview;
