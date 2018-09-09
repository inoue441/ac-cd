const $date = $('#date');
const $time = $('#time');

const weekdays = [1, 2, 3, 4, 5];
const holidays = UltraDate.getHolidays();
const defaultDate = getNextBusinessDay().format('YYYY-MM-DD');
const defaultTime = '08:00';

$date.val(defaultDate);
$time.val(defaultTime);

let timer = startTimer();

$(document).on('change', 'input', (ev) => {
    clearInterval(timer);
    timer = startTimer();
});

/**
 * カウントダウンタイマーを開始
 *
 * @returns {number}
 */
function startTimer() {
    return setInterval(() => {
        const now = moment();
        const targetDateTime = moment([$date.val(), $time.val()].join(' '), 'YYYY-MM-DD HH:mm');

        const diff = { hours: 0, minutes: 0, seconds: 0 };
        diff.hours = targetDateTime.diff(now, 'hours');
        diff.minutes = targetDateTime.diff(now, 'minutes');
        diff.seconds = targetDateTime.diff(now, 'seconds');

        const hours = Math.floor(diff.seconds / 60 / 60);
        const minutes = Math.floor(diff.seconds / 60) % 60;
        const seconds = (diff.seconds % 60) % 60;

        $('#output').text([
            `${sprintf('%02d', hours)}時間`,
            `${sprintf('%02d', minutes)}分`,
            `${sprintf('%02d', seconds)}秒`,
        ].join(""));

        $('title').text([
            `${sprintf('%02d', hours)}:`,
            `${sprintf('%02d', minutes)}:`,
            `${sprintf('%02d', seconds)}`,
        ].join(""));
    }, 1000);
}

/**
 * 翌営業日を取得
 *
 * @returns {*}
 */
function getNextBusinessDay() {
    const now = moment();
    const target = moment([$date.val(), $time.val()].join(' '), 'YYYY-MM-DD HH:mm');
    let day = now;

    if (now >= target) {
        day = now.add(1, 'days');
    }

    while (!isBusinessDay(day)) {
        day = day.add(1, 'days');
    }

    return day;
}

/**
 *
 * @param date
 * @returns {boolean}
 */
function isBusinessDay(date) {
    if (!_.includes(weekdays, date.day())) {
        return false;
    }

    if (_.includes(_.keys(holidays), date.format('YYYY-MM-DD'))) {
        return false;
    }

    return true;
}
