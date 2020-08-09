export default class TeamService{

    getTeamMembers () {
        return [
            {
                name: 'Ayca',
                city: 'Dubai',
                utcOffset: 6,
                /* Preferred work week, 1 char/day, o=off, w=work */
                workDays: 'owwwwwo',
                /* Preferred work day, 1 char/hour, n=night, e=extended, d=day */
                workHours: 'nnnnnnneeddddddddeeeennn',
            },
            {
                name: 'Barnam',
                city: 'Melbourne',
                utcOffset: 14,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneeddddddddeeeennn',
            },
            {
                name: 'Bob',
                city: 'Boston',
                utcOffset: -4,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneeddddddddeeeennn',
            },
            {
                name: 'Dan',
                city: 'Phoenix',
                utcOffset: -6,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneeddddddddeeeennn',
            },
            {
                name: 'Emily',
                city: 'Bay area',
                utcOffset: -7,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneeddddddddeeeennn',
            },
            {
                name: 'Matt',
                city: 'Bay area',
                utcOffset: -7,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneeddddddddeeeennn',
            },
            {
                name: 'Todd',
                city: 'Austin',
                utcOffset: -5,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneeddddddddeeeennn',
            },
            {
                name: 'Tomomi',
                city: 'Bay area',
                utcOffset: -7,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneeddddddddeeeennn',
            },
        ]
    }

}