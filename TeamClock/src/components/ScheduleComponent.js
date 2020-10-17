import React from 'react';

class ScheduleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.slideIndex = 0;
  }

  componentDidMount() {
    this.showTimes(this.slideIndex);
    window.addEventListener("resize", this.updateWindowDimensions);

  }
  componentWillUnmount() {

  }

  updateWindowDimensions() {
    // When the window resizes we want to reset the number of slides we have 
    this.forceUpdate();
  }
  //Change the slide based on buttons
  currentSlide(n) {
    this.slideIndex = n;
    this.showTimes(this.slideIndex);
  }
  plusSlides(n) {
    this.slideIndex += n;
    this.showTimes(this.slideIndex);
  }

  //Show the slides and set the active states
  showTimes(n) {
    var i;
    var slides = document.getElementsByClassName("timeSlide");
    var scheduleElement = document.getElementsByClassName("schedules");
    var dots = [];
    if (scheduleElement.length > 0) {
      dots = scheduleElement[0].getElementsByClassName("dot");
    }

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
          <div className="timeSlotsContainer">
            <section className="rowHighlight timeSlide fade">
              <ul>
                <li>Thurs. 12pm</li>
                <li>Fri. 8am</li>
                <li>Fri. 2am</li>
                <li>Thurs. 6pm</li>
                <li>Thurs. 5pm</li>
                <li>Thurs. 3pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
              </ul>
            </section>
            <section className="rowHighlight timeSlide fade">
              <ul>
                <li>Thurs. 1pm</li>
                <li>Fri. 8am</li>
                <li>Fri. 2am</li>
                <li>Thurs. 6pm</li>
                <li>Thurs. 5pm</li>
                <li>Thurs. 3pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
              </ul>
            </section>
            <section className="rowHighlight timeSlide fade">
              <ul>
                <li>Thurs. 2pm</li>
                <li>Fri. 8am</li>
                <li>Fri. 2am</li>
                <li>Thurs. 6pm</li>
                <li>Thurs. 5pm</li>
                <li>Thurs. 3pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
              </ul>
            </section>
            <section className="rowHighlight timeSlide fade">
              <ul>
                <li>Thurs. 3pm</li>
                <li>Fri. 8am</li>
                <li>Fri. 2am</li>
                <li>Thurs. 6pm</li>
                <li>Thurs. 5pm</li>
                <li>Thurs. 3pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
              </ul>
            </section>
            <section className="rowHighlight timeSlide fade">
              <ul>
                <li>Thurs. 4pm</li>
                <li>Fri. 8am</li>
                <li>Fri. 2am</li>
                <li>Thurs. 6pm</li>
                <li>Thurs. 5pm</li>
                <li>Thurs. 3pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
              </ul>
            </section>
            <section className="rowHighlight timeSlide fade">
              <ul>
                <li>Thurs. 5pm</li>
                <li>Fri. 8am</li>
                <li>Fri. 2am</li>
                <li>Thurs. 6pm</li>
                <li>Thurs. 5pm</li>
                <li>Thurs. 3pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
              </ul>
            </section>
            <section className="rowHighlight timeSlide fade">
              <ul>
                <li>Thurs. 6pm</li>
                <li>Fri. 8am</li>
                <li>Fri. 2am</li>
                <li>Thurs. 6pm</li>
                <li>Thurs. 5pm</li>
                <li>Thurs. 3pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
              </ul>
            </section>
            <section className="rowHighlight timeSlide fade">
              <ul>
                <li>Thurs. 7pm</li>
                <li>Fri. 8am</li>
                <li>Fri. 2am</li>
                <li>Thurs. 6pm</li>
                <li>Thurs. 5pm</li>
                <li>Thurs. 3pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
              </ul>
            </section>
            <section className="rowHighlight timeSlide fade">
              <ul>
                <li>Thurs. 8pm</li>
                <li>Fri. 8am</li>
                <li>Fri. 2am</li>
                <li>Thurs. 6pm</li>
                <li>Thurs. 5pm</li>
                <li>Thurs. 3pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
              </ul>
            </section>
            <section className="rowHighlight timeSlide fade">
              <ul>
                <li>Thurs. 9pm</li>
                <li>Fri. 8am</li>
                <li>Fri. 2am</li>
                <li>Thurs. 6pm</li>
                <li>Thurs. 5pm</li>
                <li>Thurs. 3pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
              </ul>
            </section>
            <section className="rowHighlight timeSlide fade">
              <ul>
                <li>Thurs. 10pm</li>
                <li>Fri. 8am</li>
                <li>Fri. 2am</li>
                <li>Thurs. 6pm</li>
                <li>Thurs. 5pm</li>
                <li>Thurs. 3pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
              </ul>
            </section>
            <section className="rowHighlight timeSlide fade">
              <ul>
                <li>Thurs. 11pm</li>
                <li>Fri. 8am</li>
                <li>Fri. 2am</li>
                <li>Thurs. 6pm</li>
                <li>Thurs. 5pm</li>
                <li>Thurs. 3pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
                <li>Thurs. 12pm</li>
              </ul>
            </section>
            <a href="# " className="prev" key="prev" onClick={() => { this.plusSlides(-1) }}>&#10094;</a>
            <a href="# " className="next" key="next" onClick={() => { this.plusSlides(1) }}>&#10095;</a>

          </div>
          <div>
            <span className="dot 0" onClick={() => this.currentSlide(0)} ></span>
            <span className="dot 1" onClick={() => this.currentSlide(1)} ></span>
            <span className="dot 2" onClick={() => this.currentSlide(2)} ></span>
            <span className="dot 3" onClick={() => this.currentSlide(3)} ></span>
            <span className="dot 4" onClick={() => this.currentSlide(4)} ></span>
            <span className="dot 5" onClick={() => this.currentSlide(5)} ></span>
            <span className="dot 6" onClick={() => this.currentSlide(6)} ></span>
            <span className="dot 7" onClick={() => this.currentSlide(7)} ></span>
            <span className="dot 8" onClick={() => this.currentSlide(8)} ></span>
            <span className="dot 9" onClick={() => this.currentSlide(9)} ></span>
            <span className="dot 10" onClick={() => this.currentSlide(10)} ></span>
            <span className="dot 11" onClick={() => this.currentSlide(11)} ></span>
          </div>
        </section>
      </div>
    );
  }
}

export default ScheduleComponent;