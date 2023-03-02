import { Component } from 'react';
import PropTypes from 'prop-types';
import { FcSearch } from "react-icons/fc";
import css from './Searchbar.module.css';
import { toast } from 'react-hot-toast'

class Searchbar extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  state = {
    searchInput: '',
  };

  handleChange = e => {
    this.setState({ searchInput: e.target.value.toLowerCase() });
  };

  handleFormSubmit = e => {
    e.preventDefault();

    if (!this.state.searchInput.trim()) {
      return toast.error('Please enter search text');
    }

    this.props.onSubmit(this.state.searchInput);
    this.setState({ searchInput: '' });
  };

  render() {
    return (
      <header className={css.searchbar}>
        <form onSubmit={this.handleFormSubmit} className={css.searchForm}>
          <button type="submit" className={css.searchFormButton}>
            <FcSearch size={28}/>
          </button>
          
          <input
            className={css.searchFormInput}
            value={this.state.searchInput}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={this.handleChange}
          />          
        </form>
      </header>
    );
  }
}

export default Searchbar;