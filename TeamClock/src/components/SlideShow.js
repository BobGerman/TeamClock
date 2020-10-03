import React from 'react';
import DigitalClock from './DigitalClock';

class SlideShow extends React.Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.slideIndex = 0;
  }

  componentDidMount() {
    this.showSlides(this.slideIndex);
    window.addEventListener("resize", this.updateWindowDimensions);
  }
  componentWillUnmount() {

  }

  updateWindowDimensions() {
    // When the window resizes we want to reset the number of slides we have 
    this.forceUpdate();
  }

  //The left and right slide buttons
  plusSlides(n) {
    this.slideIndex += n;
    this.showSlides(this.slideIndex);
  }

  //Change the slide based on buttons
  currentSlide(n) {
    this.slideIndex = n;
    this.showSlides(this.slideIndex);
  }

  //Show the slides and set the active states
  showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length - 1) { this.slideIndex = 0 }
    if (n < 0) { this.slideIndex = slides.length - 1 }

    for (i = 0; i < slides.length; i++) {
      slides[i].style = "display:none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.slideIndex].style = "display:inline-flex";
    if (dots.length > 0) {
      dots[this.slideIndex].className = dots[this.slideIndex].className + " active";
    }

  }

  //Get the width of the screen and decide how many users to show per slide
  _getSlideWidth() {
    let containerWidth = window.innerWidth;
    let itemsPerSlide = 1;

    if ((containerWidth > 500) && (containerWidth < 800)) {
      itemsPerSlide = 2;
    } else if ((containerWidth >= 800) && (containerWidth < 1000)) {
      itemsPerSlide = 3;
    } else if (containerWidth > 1000) {
      itemsPerSlide = this.props.slides.length;
    }

    return itemsPerSlide;
  }

  //Render the slides and put the correct number of users in the slide
  _renderSlides() {
    let itemsPerSlide = this._getSlideWidth();
    let clocks = [];

    //Create an array of all the users
    this.props.slides.map((m, index) => {
      let clock = <DigitalClock clockService={this.props.clockService} key={`clock-` + index} timeZoneObj={m} showPhoto={true} user={this.props.user} timeFormat={this.props.timeFormat}></DigitalClock>;
      return clocks.push(clock);
    });

    //Figure out the number of slides we need based on the number of clocks
    let numberOfSlides = this.props.slides.length / itemsPerSlide;
    //If there is a remainder add an extra slide
    if (this.props.slides.length % itemsPerSlide !== 0) {
      numberOfSlides = numberOfSlides + 1;
    }

    let slideCounter = 0;


    let x;
    let slideCollection = [];
    //Create a slide for each one
    for (x = 0; x < numberOfSlides; x++) {
      let slideMembers = [];
      let i;
      //For each slide add the correct number of clocks per slide
      for (i = 0; i < itemsPerSlide; i++) {
        slideMembers.push(clocks[slideCounter]);
        slideCounter = slideCounter + 1;
      }
      let active = "";
      if (x === this.slideIndex) {
        active = " inline-flex";
      } else {
        active = "none";
      }
      //Create the slide and add the clocks to the slide
      let slide = React.createElement('div', { className: "mySlides fade", key: "slide-" + x, style: { display: active } }, slideMembers);
      //Add the slide to the collection
      slideCollection.push(slide);
    }

    //If we have more than one slide add the left and right arrows
    if (numberOfSlides > 1) {
      slideCollection.push(<a href="# " className="prev" key="prev" onClick={() => { this.plusSlides(-1) }}>&#10094;</a>);
      slideCollection.push(<a href="# " className="next" key="next" onClick={() => { this.plusSlides(1) }}>&#10095;</a>);
      slideCollection.push(<br key="br" />);
    }

    let slideContainer = React.createElement('div', { className: "slideshow-container" }, slideCollection);
    let dotsArray = [];

    //If we have more than one slide add the dots
    if (numberOfSlides > 1) {
      let d = 0;
      for (d = 0; d < numberOfSlides; d++) {
        let m = d;
        let active = "";
        //If we are resizing make sure we set the active state for the dots
        if (d === this.slideIndex) {
          active = " active";
        }
        dotsArray.push(React.createElement('span', { className: `dot ` + d + active, key: `dot-` + d, onClick: () => this.currentSlide(m) }, ""));
      }
    }
    //Render the slides container
    let container = React.createElement('div', {}, [slideContainer, dotsArray]);
    return container;

  }
  render() {
    return (this._renderSlides());
  }
}

export default SlideShow;