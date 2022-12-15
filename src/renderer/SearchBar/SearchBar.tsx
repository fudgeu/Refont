import './styles.css';
import SearchIcon from '../../../assets/search.svg';

type SearchBarProp = {
  handleSearch: (search: string) => void;
};

const SearchBar = ({ handleSearch }: SearchBarProp) => {
  return (
    <div className="SearchBarContainer">
      <input
        className="SearchBar"
        type="text"
        placeholder="Search"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <img className="SearchBarIcon" alt="Search Icon" src={SearchIcon} />
    </div>
  );
};

export default SearchBar;
