import moment from 'moment-timezone';
import ITimeZone from '../model/ITimeZone';
import IUser from '../model/IUser';

export default class ClockService {

  static factory() {
    const service = new ClockService();
    return Promise.resolve(service);
  }

  getCurrentTime(format: string, timezone: string) {
    return moment.tz(new Date().toISOString(), timezone).format(format);
  };

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
}