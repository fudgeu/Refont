import clsx from 'clsx';
import MinorText from 'renderer/Texts/MinorText';
import './style.css';
import RetryIcon from '../../../assets/retry.svg';

type DiscordStatusProp = {
  websocketStatus: string;
  retryConnection: () => void;
};

const DiscordStatus = ({
  websocketStatus,
  retryConnection,
}: DiscordStatusProp) => {
  const generateStatusText = () => {
    switch (websocketStatus) {
      case 'connected':
        return <MinorText>Connected to Discord</MinorText>;
        break;
      case 'attempting':
        return <MinorText>Attempting connection to Discord...</MinorText>;
      default:
        return (
          <>
            <MinorText>Failed to connect to Discord</MinorText>
            <button
              className="DSRelaunchButton"
              type="button"
              onClick={retryConnection}
            >
              <img alt="Relaunch and Retry" src={RetryIcon} />
            </button>
          </>
        );
    }
  };

  return (
    <div className="DiscordStatusContainer">
      <div className="DSTopContainer">
        <span
          className={clsx({
            StatusCircle: true,
            SCConnected: websocketStatus === 'connected',
            SCFailed: websocketStatus === 'disconnected',
            SCAttempting: websocketStatus === 'attempting',
          })}
        />
        {generateStatusText()}
      </div>
    </div>
  );
};

export default DiscordStatus;
