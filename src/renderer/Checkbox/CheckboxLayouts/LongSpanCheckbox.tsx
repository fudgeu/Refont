import MainText from 'renderer/Texts/MainText';
import Checkbox from '../Checkbox';
import './styles.css';

type LongSpanCheckboxProp = {
  label: string;
  disabled?: boolean;
  checked: boolean;
  onToggle: () => void;
};

const LongSpanCheckbox = ({
  label,
  disabled,
  checked,
  onToggle,
}: LongSpanCheckboxProp) => {
  return (
    <div className="LongSpanCheckbox">
      <MainText>{label}</MainText>
      <Checkbox disabled={disabled} checked={checked} onToggle={onToggle} />
    </div>
  );
};

LongSpanCheckbox.defaultProps = {
  disabled: false,
};

export default LongSpanCheckbox;
