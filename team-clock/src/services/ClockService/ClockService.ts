import moment from 'moment-timezone';
import ITimeZone from '../../model/ITimeZone';
import IUser from '../../model/IUser';
import IClockService from './IClockService';

export default class ClockService implements IClockService {

  getCurrentTime(date: Date, format: string, timezone: string) {
    return moment.tz(date.toISOString(), timezone).format(format);
  };

  getMeetingHours(date: Date, format: string, timezone: string, numberofHours: number) {
    let hours = [];
    let currentTime = /* new */ moment.tz(date.toISOString(), timezone).format(format);
    //currentTime = parseInt(currentTime, 10)
    let x = 1;
    hours.push(currentTime);
    for (x = 1; x <= numberofHours; x++) {
      date.setHours(date.getHours() + 1);
      currentTime = /* new */ moment.tz(date.toISOString(), timezone).format(format);
      //currentTime = parseInt(currentTime, 10)
      hours.push(currentTime);
    }
    return hours;
  }

  isNextDay(timezone: string) {
    let isNextDay = false;
    let now = moment();
    const currentDate = moment.tz(now, moment.tz.guess()).date()
    const compareDate = moment.tz(now, timezone).date()
    if (currentDate !== compareDate) {
      isNextDay = true;
    }
    return isNextDay;
  };

  getTimeZones(teamMembers: IUser[]) {

    let timeZones: ITimeZone[] = [];
    let now = Date.now(); //moment(); // Upset Typescript terribly
    let momentNow = moment();
    let localTimeOffset = moment.tz.zone(moment.tz.guess())?.utcOffset(now);

    teamMembers.map((m) => {
      //Check and see if the TimeZone is already in the array
      const isInArray = timeZones.find(x => x.timeZone === m.timeZone);

      if (!isInArray) {
        let currentTimeOffset = moment.tz.zone(m.timeZone)?.utcOffset(now);
        if (typeof currentTimeOffset === 'number' && typeof localTimeOffset === 'number') {
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
            abbreviation: momentNow.tz(m.timeZone).zoneName(),
            offset: offset,
            members: membersinTZ
          })
  
        }
      }
      return null;


    });
    
    // ??? Weren't the time zones sorted before? Somehow? Sorting by time -BG
    timeZones.sort((a, b) => { return b.offset - a.offset });

    return timeZones;
  }

  convertTimeZone(originalTime: Date, convertToTimeZone: string) {
    // WOuld not compile, said the 2nd arg to moment was not valid
    // return moment(originalTime, null).tz(convertToTimeZone);
    return moment(originalTime).tz(convertToTimeZone);
  }

  isLeapYear(date: Date): boolean {
    return moment(date.getFullYear()).isLeapYear();
  }
}