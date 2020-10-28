
import moment from 'moment-timezone'

export default class ClockService {

  static factory() {
    const service = new ClockService();
    return Promise.resolve(service);
  }

  getCurrentTime(format, timezone) {
    return moment.tz(new Date().toISOString(), timezone).format(format);
  };

  getMeetingHours(format, timezone, numberofHours) {
    let hours = [];
    let currentDate = new Date();
    let currentTime = new moment.tz(currentDate.toISOString(), timezone).format(format);
    //currentTime = parseInt(currentTime, 10)
    let x = 1;
    hours.push(currentTime);
    for (x = 1; x <= numberofHours; x++) {
      currentDate.setHours(currentDate.getHours() + 1);
      currentTime = new moment.tz(currentDate.toISOString(), timezone).format(format);
      //currentTime = parseInt(currentTime, 10)
      hours.push(currentTime);
    }
    return hours;
  }

  isNextDay(timezone) {
    let isNextDay = false;
    let now = moment();
    const currentDate = moment.tz(now, moment.tz.guess()).date()
    const compareDate = moment.tz(now, timezone).date()
    if (currentDate !== compareDate) {
      isNextDay = true;
    }
    return isNextDay;
  };

  getTimeZones(teamMembers) {
    let timeZones = [];
    let now = moment();
    let localTimeOffset = moment.tz.zone(moment.tz.guess()).utcOffset(now);

    teamMembers.map((m) => {
      //Check and see if the TimeZone is already in the array
      const isInArray = timeZones.find(x => x.timeZone === m.timeZone);

      if (!isInArray) {
        let currentTimeOffset = moment.tz.zone(m.timeZone).utcOffset(now);
        let offset = ((localTimeOffset - currentTimeOffset) / 60);

        //There are some time zones that have abbreviations dropped This is logic to fix that.
        //I didn't say it was good logic. 
        //let zone = moment.tz.zone(m.timeZone).abbr(now.format('x'));
        //if (zone.startsWith("+") || zone.startsWith("-")) {
        //  zone = moment.tz.zone(m.timeZone).abbrs[0];
        //}
        const membersinTZ = teamMembers.filter(x => x.timeZone === m.timeZone);
        return timeZones.push({
          timeZone: m.timeZone,
          abbreviation: now.tz(m.timeZone).zoneName(),
          offset: offset,
          members: membersinTZ
        })
      } else {
        return null;
      }


    }
    );
    return timeZones;
  }

  convertTimeZone(originalTime, format, convertToTimeZone) {
    return moment(originalTime, null).tz(convertToTimeZone);
  }

}