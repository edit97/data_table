export function getData(jsonData) {
    const newData = []
    jsonData.forEach(({group_name, unit_name, data}) => {
        data.forEach(({zone_name, time_begin, time_end, duration_in}) => {
            let duration = +new Date(timeParsing(duration_in))
            newData.push({
                group_name,
                day: time_begin.slice(0, 10),
                unit_name,
                zone_name,
                time_begin,
                time_end,
                duration_in: duration,
            })
        })
    })

    return [
        addColTime({
            cols: ['Time duration'],
            rows: groupSplitting(newData),
        }),
    ]
}

function timeParsing(time) {
    let days = 0
    if (time.includes('days')) {
        days = time.split('days')[0]
        time = time.split('days')[1]
    }
    let newTime = time.split(':')
            .reduce((previousValue, currentValue) => Number(previousValue) * 60 + Number(currentValue))
        * 1000 + days * 24 * 3600 * 1000

    return newTime
}

function formatTime(date) {
    const d = new Date(date)
    const days = Math.floor(d / (24 * 3600 * 1000))
    let min = d.getUTCMinutes()
    let sec = d.getUTCSeconds()
    let formattedDate = (days > 0 ? days + ' days ' : '') + d.getUTCHours() + ':' +
        (min < 10 ? '0'+min : '' + min) + ':' + (sec < 10 ? '0' + sec : '' + sec)
    return formattedDate
}

function addColTime(row) {
    row.cols.push(
        formatTime(
            row?.rows?.reduce((accum, next) => {
                return accum + +timeParsing(next?.cols[next.cols.length - 1])
            }, 0)
        )
    )
    return row
}

function groupSplitting(data) {
    let groupSet = new Set(data.map(item => item.group_name));
    return Array.from(groupSet).map((group_name) =>
        addColTime({
            cols: [`Time duration ${group_name}`],
            rows: dateSplitting(data.filter((group) => group?.group_name === group_name))
        })
    )
}

function dateSplitting(data) {
    let daysSet = new Set(data.map(item => item.day));

    return Array.from(daysSet).map((day) =>
        addColTime({
                cols: [`Time duration ${day}`],
                rows: unitSplitting(data.filter((row) => row.day === day))
            }
        )
    )
}

function unitSplitting(data) {
    let unitsSet = new Set(data.map(item => item.unit_name));

    return Array.from(unitsSet).map((unit_name) => {
        const filteredData = data.filter((row) => row.unit_name === unit_name)
        return addColTime({
            cols: [
                `Unit ${unit_name} `,
                `Time begin ${filteredData[0].time_begin.slice(-8)}`,
                `Time end ${filteredData[filteredData.length - 1].time_end.slice(-8)}`,
            ],
            rows: zoneSplitting(filteredData),
        })
    })
}

function zoneSplitting(data) {
    let zoneSet = new Set(data.map(item => item.zone_name));

    return Array.from(zoneSet).map((zone_name) => {
        const filteredData = data.filter((row) => row.zone_name === zone_name)
        return addColTime({
            cols: [
                zone_name,
                `Min: ${filteredData[0].time_begin.slice(-8)}`,
                `Max: ${filteredData[filteredData.length - 1].time_end.slice(-8)}`,
            ],
            rows: filteredData.map(({time_begin, time_end, duration_in}) => {
                return {
                    cols: [
                        zone_name,
                        time_begin.slice(-8),
                        time_end.slice(-8),
                        formatTime(duration_in),
                    ],
                }
            }),
        })
    })
}
