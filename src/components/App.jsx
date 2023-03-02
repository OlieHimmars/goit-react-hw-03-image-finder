import React, { Component } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import fetchImages from 'api/fetch';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';
import css from './App.module.css';

export class App extends Component {
  state = {
    searchInput: '',
    page: 1,
    isLoading: false,
    images: null,
    totalHits: 0,
    imagesOnPage: 0,
    showModal: false,
    currentLargeImageUrl: '',
    currentImageTags: '',
  };

  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevState.searchInput;
    const nextQuery = this.state.searchInput;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (nextQuery !== prevQuery) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      this.setState({ isLoading: true });

      fetchImages(nextQuery, nextPage)
        .then(({ hits, totalHits }) => {
          const arrayOfImages = this.createArrayOfImages(hits);

          this.setState({
            images: arrayOfImages,
            totalHits,
            imagesOnPage: hits.length,
          });
        })
        .catch((error) => {
          console.log(`${error.message}`);
        })
        .finally(() => this.turnOffLoader());
    }

    if (nextPage > prevPage) {
      this.setState({ isLoading: true });

      fetchImages(nextQuery, nextPage)
        .then(({ hits }) => {
          const arrayOfImages = this.createArrayOfImages(hits);

          this.setState(prevState => {
            return { images: [...prevState.images, ...arrayOfImages] };
          });
          this.setState({
            imagesOnPage: this.state.images.length,
          });
        })
        .catch(error => {
          console.log(`${error.message}`);
        })
        .finally(() => this.turnOffLoader());
    }
  }

  createArrayOfImages = data => {
    const arrayOfImages = data.map(element => ({
      tags: element.tags,
      webformatURL: element.webformatURL,
      largeImageURL: element.largeImageURL,
    }));
    return arrayOfImages;
  };

  turnOffLoader = () => {
    return this.setState({ isLoading: false });
  };

  formSubmitHandler = data => {
    this.setState({ searchInput: data, page: 1 });
  };

  nextFetch = () => {
    this.setState(prevState => {
      return { page: prevState.page + 1 };
    });
  };

  openModal = event => {
    const currentLargeImageUrl = event.target.dataset.large;
    const currentImageTags = event.target.alt;

    this.setState({ currentLargeImageUrl, currentImageTags });
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  render() {
    const {
      images,
      isLoading,
      showModal,
      currentLargeImageUrl,
      currentImageTags,
      imagesOnPage,
      totalHits,
    } = this.state;

    return (
      <div className={css.app}>
        <Searchbar onSubmit={this.formSubmitHandler} />
        {images && <ImageGallery images={images} openModal={this.openModal} />}
        {isLoading && <Loader />}
        {imagesOnPage >= 12 && imagesOnPage < totalHits && (
          <Button onClick={this.nextFetch} />
        )}
        {showModal && (
          <Modal
            imageUrl={currentLargeImageUrl}
            imageTags={currentImageTags}
            onClose={this.toggleModal}
          />
        )}
      </div>
    );
  }
};
