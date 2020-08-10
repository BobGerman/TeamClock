export default class TeamService{

    getTeamMembers () {
        return [
            {
                name: 'Ayca',
                city: 'Dubai',
                utcOffset: 4,
                /* Preferred work week, 1 char/day, o=off, w=work */
                workDays: 'owwwwwo',
                /* Preferred work day, 1 char/hour, n=night, e=extended, d=day */
                workHours: 'nnnnnnneedddddddddeeeeen',
            },
            {
                name: 'Barnam',
                city: 'Melbourne',
                utcOffset: 10,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
            },
            {
                name: 'Bob',
                city: 'Boston',
                utcOffset: -4,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
            },
            {
                name: 'Dan',
                city: 'Phoenix',
                utcOffset: -6,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
            },
            {
                name: 'Emily',
                city: 'Bay area',
                utcOffset: -7,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
            },
            {
                name: 'Matt',
                city: 'Bay area',
                utcOffset: -7,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
            },
            {
                name: 'Todd',
                city: 'Austin',
                utcOffset: -5,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
            },
            {
                name: 'Tomomi',
                city: 'Bay area',
                utcOffset: -7,
                workDays: 'owwwwwo',
                workHours: 'nnnnnnneedddddddddeeeeen',
            },
        ]
    }

}