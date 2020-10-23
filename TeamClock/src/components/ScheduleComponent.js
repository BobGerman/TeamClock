import React from 'react';

class ScheduleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state = {
      slideIndex: 0,
      numberOfSlides: this._getNumberOfSlides(),
      time: this.props.clockService.getCurrentTime(this.props.timeFormat, this.props.timeZoneObj.timeZone),
      invitees: []
    }
  }

  componentDidMount() {
    this.showSlides(this.state.slideIndex);
    window.addEventListener("resize", this.updateWindowDimensions);
    //If we are keeping track of the time in both components can we bring it up a level
    //So we are not doing it twice
    // this.intervalID = setInterval(
    //   () => this._tick(),
    //   1000
    // );
    this.forceUpdate();

  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  _tick() {
    this.setState({
      time: this.props.clockService.getCurrentTime(this.props.timeFormat, this.props.timeZoneObj.timeZone)
    });
  }

  updateWindowDimensions() {
    // When the window resizes we want to reset the number of slides we have 
    this.setState({
      slideIndex: 0,
      numberOfSlides: this._getNumberOfSlides()
    });
  }
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
    var slides = document.getElementsByClassName("timeSlides");
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
    let slideElement = document.getElementsByClassName("timeSlotsContainer");
    if (slideElement.length <= 0) {
      containerWidth = window.innerWidth;
    } else {
      containerWidth = slideElement[0].offsetWidth;
    }

    return Math.floor(containerWidth / 125);
  }

  _getNumberOfSlides() {
    return Math.ceil(12 / this._getItemsPerSlide());
  }

  //Render the slides and put the correct number of users in the slide
  _renderSlides() {
    let itemsPerSlide = this._getItemsPerSlide();

    //Get the next 12 hours for the current user to check schedules
    let hours = this.props.clockService.getMeetingHours('h', this.props.timeZoneObj.timeZone, 12);

    //Get the meeting participants
    let participants = ["Derek", "Barnham", "Ayca", "Bob", "Dan", "Martin", "Tomomi", "Emily", "Todd", "Joseph", "Mark", "Max"];
    let timeSlots = [];

    //Create an array the hours in the current users timezone
    hours.map((m, index) => {

      //Loop through participants
      let hoursLIs = [];
      participants.map((participant, index) => {
        //Get the hour that is equivalent to the time represented in the current hour
        let hourli = React.createElement('li', { className: "", key: "li-" + participant + "-" + index }, "Thurs. 12pm");
        return hoursLIs.push(hourli);
      });
      //Create a UL for the hours
      let hoursUL = React.createElement('ul', {}, hoursLIs);

      let slide = React.createElement('section', { className: "rowHighlight timeSlide fade", key: "slide-" + index }, hoursUL);

      return timeSlots.push(slide);
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
        slideMembers.push(timeSlots[slideCounter]);
        slideCounter = slideCounter + 1;
      }
      let active = "";
      if (x === this.state.slideIndex) {
        active = " inline-flex";
      } else {
        active = "none";
      }

      //Create the slide and add the clocks to the slide
      let slide = React.createElement('div', { className: "timeSlides fade", key: "slide-" + x, style: { display: active } }, slideMembers);
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

    //Render the slides container
    let container = React.createElement('div', { className: 'timeSlotsContainer' }, [slideCollection, navDiv]);
    return container;

  }



  render() {
    return (
      <div className="scheduleComponent">
        <header>
          <h2>Scheduling</h2>
        </header>
        <div className="datePicker"></div>
        <section className="schedules">
          <aside>
            <ul>
              <li>Derek</li>
              <li>Barnham</li>
              <li>Ayca</li>
              <li>Bob</li>
              <li>Dan</li>
              <li>Martin</li>
              <li>Tomomi</li>
              <li>Emily</li>
              <li>Todd</li>
              <li>Joseph</li>
              <li>Mark</li>
              <li>Max</li>
            </ul>
          </aside>

          {this._renderSlides()}
        </section>
      </div>
    );
  }
}

export default ScheduleComponent;