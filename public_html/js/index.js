const weekdays = [1, 2, 3, 4, 5];
const holidays = UltraDate.getHolidays();

const app = new Vue({
    el: '#app',
    data: {
        timer: null,
        message: '00時間00分00秒',
        date: moment().format('YYYY-MM-DD'),
        time: '08:00'
    },
    mounted: function () {
        this.init();
        this.startTimer();
    },
    methods: {
        init: function () {
            // 翌営業日をセット
            const now = moment();
            const target = moment([this.date, this.time].join(' '), 'YYYY-MM-DD HH:mm');
            let day = now;

            if (now >= target) {
                day = now.add(1, 'days');
            }

            while (!isBusinessDay(day)) {
                day = day.add(1, 'days');
            }

            this.date = day.format('YYYY-MM-DD');
        },

        /**
         * カウントダウンタイマーをリセット
         */
        restart: function () {
            clearInterval(this.timer);
            this.startTimer();
        },

        /**
         * カウントダウンタイマーを開始
         */
        startTimer: function () {
            this.timer = setInterval(() => {
                const now = moment();
                const targetDateTime = moment([this.date, this.time].join(' '), 'YYYY-MM-DD HH:mm');

                const diff = { hours: 0, minutes: 0, seconds: 0 };
                diff.hours = targetDateTime.diff(now, 'hours');
                diff.minutes = targetDateTime.diff(now, 'minutes');
                diff.seconds = targetDateTime.diff(now, 'seconds');

                const hours = Math.floor(diff.seconds / 60 / 60);
                const minutes = Math.floor(diff.seconds / 60) % 60;
                const seconds = (diff.seconds % 60) % 60;

                this.message = [
                    `${sprintf('%02d', hours)}時間`,
                    `${sprintf('%02d', minutes)}分`,
                    `${sprintf('%02d', seconds)}秒`,
                ].join("");
            }, 100);
        }
    }
});

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
