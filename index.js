const monday = require('./libs/monday');
const fs = require('fs');
const csv_stringify = require('csv-stringify')

const output_projects = (boards) => {
    fs.writeFileSync('projects.json', JSON.stringify(boards, null, 4), 'utf8');

    let result = [['url', 'id', 'name', 'description', 'board_kind', 'created_at', 'updated_at', 'columns', 'groups']];
    boards.forEach(board => {
        result.push([board.url, board.id, board.name, board.description, board.board_kind, board.created_at, board.updated_at, JSON.stringify(board.columns), JSON.stringify(board.groups)]);
    });
    csv_stringify(result, (err, output) => {
        if (err) console.log(err);
        else fs.writeFileSync('projects.csv', output, 'utf8');
    })
}

const output_tasks = (pulses) => {
    fs.writeFileSync('tasks.json', JSON.stringify(pulses, null, 4), 'utf8');

    let result = [['url', 'id', 'name', 'updates_count', 'board_id', 'created_at', 'updated_at', 'column_values']];
    pulses.forEach(pulse => {
        result.push([pulse.pulse.url, pulse.pulse.id, pulse.pulse.name, pulse.pulse.updates_count, pulse.pulse.board_id, pulse.pulse.created_at, pulse.pulse.updated_at, JSON.stringify(pulse.column_values)]);
    });
    csv_stringify(result, (err, output) => {
        if (err) console.log(err);
        else fs.writeFileSync('tasks.csv', output, 'utf8');
    })
}

const output_users = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 4), 'utf8');

    let result = [['url', 'id', 'name', 'email', 'photo_url', 'title', 'position', 'phone', 'location', 'status', 'birthday', 'is_guest', 'created_at', 'updated_at']];
    users.forEach(user => {
        result.push([
            user.url,
            user.id,
            user.name,
            user.email,
            user.photo_url,
            user.title,
            user.position,
            user.phone,
            user.location,
            user.status,
            user.birthday,
            user.is_guest.toString(),
            user.created_at,
            user.updated_at
        ]);
    });
    csv_stringify(result, (err, output) => {
        if (err) console.log(err);
        else fs.writeFileSync('users.csv', output, 'utf8');
    })
}

monday.get_boards()
    .then(boards => {
        output_projects(boards);

        let p = Promise.resolve();
        let tasks = [];
        for (let board of boards) {
            p = p.then(() => {
                return monday.get_pulses_from_board(board.id)
                    .then(pulses => {
                        tasks = tasks.concat(pulses);
                    });
            })
        }
        return p.then(() => {
            output_tasks(tasks);
        });
    })
    .catch(err => {
        console.log(err);
    });

monday.get_users()
    .then(users => {
        output_users(users);
    })
    .catch(err => {
        console.log(err);
    });

// monday.get_pulses()
//     .then(pulses => {
//         let p = Promise.resolve();
//         console.log(pulses);
//         let tasks = [];
//         for (let pulse of pulses) {
//             p = p.then(() => {
//                 return monday.get_pulse_from_board(pulse.id)
//                     .then(pulse => {
//                         tasks.push(pulse);
//                         return null;
//                     });
//             });
//         }
//         return p.then(() => {
//             fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 4), 'utf8');
//         })
//     })
//     .catch(err => {
//         console.log(err);
//     });