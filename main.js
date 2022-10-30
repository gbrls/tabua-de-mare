const data = {
    9: [357, 1002, 1610, 2222],
    10: [430, 1033, 1642, 2257],
    11: [504, 1104, 1716, 2335],
    12: [540, 1138, 1753],
    13: [19, 621, 1216, 1837],
    14: [111, 712, 1307, 1935],
    15: [220, 822, 1430, 2051],
};

const first = 1;
const start_day = 9;
const last_day = 15;
const length_days = (last_day - start_day) + 1;

function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function build_array() {
    let arr = [];

    for (let i = 0; i < length_days; i++) {
        const day_data = data[i + start_day];
        for (let j = 0; j < day_data.length; j++) {
            const time = calc_time(i + start_day, Math.floor(day_data[j] / 100), day_data[j] % 100);
            arr.push([(arr.length % 2) == 0 ? 1 : 0, time]);
        }
    }

    console.log(arr);
    return arr;
}

function calc_time(day, hour, minute) {
    return  (day - start_day) * 24 * 60 + hour * 60 + minute;
}

function interval(arr, time) {
    if (time < 0) {
        return {'inside': false};
    }

    // I know I should do a binary search here, but the data is too small.
    for (let i = 1; i < arr.length - 1; i++) {
        if (time <= arr[i][1] && time > arr[i-1][1]) {
            return {'inside': true, 'interval': [arr[i-1], arr[i]]};
        }
    }

    return {'inside': false};
}

function calc_height(arr, time, easing) {
    const data = interval(arr, time);
    if (!data['inside']) {
        return false;
    }

    const x0 = data['interval'][0][1];
    const x1 = data['interval'][1][1];

    const dec = data['interval'][0][0] == 1;

    const x = (time - x0) / (x1 - x0);
    const y = easing(x);

    return [dec ? 1 - y : y, dec];
}

function calc_status(day) {
    if (day < 11) {
        return 'before';
    } else if(day < 16) {
        return 'during';
    } else {
        return 'after';
    }

}

function get_now_data(arr) {
    let date = new Date();
    let time = calc_time(date.getDate() - 15, date.getHours(), date.getMinutes());

    let data = interval(arr, time);
    let height = calc_height(arr, time, easeInOutQuad);

    data['time'] = time;
    data['height'] = height[0];
    data['date'] = `${date.getDate()} de Novembro, ${date.getHours()}:${date.getMinutes()}`;
    data['derivative'] = height[1] ? -1 : 1;

    return data;
}


const built = build_array();
console.log(get_now_data(built));
