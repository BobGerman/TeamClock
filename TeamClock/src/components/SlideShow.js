import React from 'react';
import DigitalClock from './DigitalClock';

class SlideShow extends React.Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this._addParticipant = this._addParticipant.bind(this);
    this.state = {
      slideIndex: 0,
      numberOfSlides: this._getNumberOfSlides()
    }
  }

  componentDidMount() {
    this.showSlides(this.state.slideIndex);
    window.addEventListener("resize", this.updateWindowDimensions);
    this.forceUpdate();
  }
  componentWillUnmount() {

  }

  updateWindowDimensions() {
    // When the window resizes we want to reset the number of slides we have 
    this.setState({
      slideIndex: 0,
      numberOfSlides: this._getNumberOfSlides()
    });

  }

  //The left and right slide buttons
  plusSlides(n) {
    if ((this.state.slideIndex + n) === this.state.numberOfSlides) {
      this.setState({ slideIndex: 0 });
    } else {
      this.setState({ slideIndex: this.state.slideIndex + n }); //.state.slideIndex += n;
    }

    this.showSlides(this.state.slideIndex);
  }

  //Change the slide based on buttons
  currentSlide(n) {
    this.setState({ slideIndex: n });
    this.showSlides(this.state.slideIndex);
  }

  //Show the slides and set the active states
  showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length - 1) { this.setState({ slideIndex: 0 }) }
    if (n < 0) { this.setState({ slideIndex: slides.length - 1 }) }

    for (i = 0; i < slides.length; i++) {
      slides[i].style = "display:none";
    }
    slides[this.state.slideIndex].style = "display:inline-flex";
  }

  //Get the width of the screen and decide how many users to show per slide
  _getItemsPerSlide() {
    let containerWidth;
    let slideElement = document.getElementsByClassName("slideshow-container");
    if (slideElement.length <= 0) {
      containerWidth = window.innerWidth;
    } else {
      containerWidth = slideElement[0].offsetWidth;
    }

    return Math.floor(containerWidth / 125);;
  }

  _getNumberOfSlides() {
    return Math.ceil(this.props.slides.length / this._getItemsPerSlide());
  }

  _addParticipant(participant) {
    this.props.addParticipant(participant);
  }

  //Render the slides and put the correct number of users in the slide
  _renderSlides() {
    let itemsPerSlide = this._getItemsPerSlide();
    let clocks = [];

    //Create an array of all the users
    this.props.slides.map((m, index) => {
      let clock = <DigitalClock clockService={this.props.clockService} key={`clock-` + index} timeZoneObj={m} showPhoto={true} user={this.props.user} timeFormat={this.props.timeFormat} addParticipant={this._addParticipant} participants={this.props.participants}></DigitalClock>;
      return clocks.push(clock);
    });

    let slideCounter = 0;

    let x;
    let slideCollection = [];
    //Create a slide for each one
    for (x = 0; x < this.state.numberOfSlides; x++) {
      let slideMembers = [];
      let i;
      //For each slide add the correct number of clocks per slide
      for (i = 0; i < itemsPerSlide; i++) {
        slideMembers.push(clocks[slideCounter]);
        slideCounter = slideCounter + 1;
      }
      let active = "";
      if (x === this.state.slideIndex) {
        active = " inline-flex";
      } else {
        active = "none";
      }
      //Create the slide and add the clocks to the slide
      let slide = React.createElement('div', { className: "mySlides fade", key: "slide-" + x, style: { display: active } }, slideMembers);
      //Add the slide to the collection
      slideCollection.push(slide);
    }


    let navigationArray = [];

    if (this.state.numberOfSlides > 1) {
      var currentSlide = this.state.slideIndex + 1;
      if (currentSlide === 1) {
        navigationArray.push(React.createElement('div', { className: `button left disabled` }, "<"));
      } else {
        navigationArray.push(React.createElement('div', { className: `button left`, onClick: () => this.plusSlides(-1) }, "<"));
      }

      navigationArray.push(React.createElement('div', { className: `count`, onClick: () => this.plusSlides(-1) }, currentSlide + " of " + this.state.numberOfSlides));

      if (this.state.slideIndex === this.state.numberOfSlides - 1) {
        navigationArray.push(React.createElement('div', { className: `button right disabled` }, ">"));
      } else {
        navigationArray.push(React.createElement('div', { className: `button right`, onClick: () => this.plusSlides(1) }, ">"));
      }

    }
    let navDiv = React.createElement('div', { className: 'navControls' }, navigationArray);
    let slideContainer = React.createElement('div', { className: "slideshow-container" }, slideCollection, navDiv);
    //Render the slides container
    let container = React.createElement('div', {}, [slideContainer]);
    return container;

  }
  render() {
    return (this._renderSlides());
  }
}

export default SlideShow;