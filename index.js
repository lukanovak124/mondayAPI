const monday = require('./libs/monday');
const fs = require('fs');
const csv_stringify = require('csv-stringify')

const sql = require('mssql')
 
const config = {
    user: 'SA',
    password: 'projectBerry1',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'dev',
 
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}

const getEscapeString = (value) => {
    if (value == null) return null;
    return value.replace(/\'/g,"''");
}

const output_projects = (boards) => {
    fs.writeFileSync('projects.json', JSON.stringify(boards, null, 4), 'utf8');

    let result = [['url', 'id', 'name', 'description', 'board_kind', 'created_at', 'updated_at', 'columns', 'groups']];

    let p = sql.connect(config);
    p = p.then(() => {
        return sql.query('TRUNCATE TABLE dbo.MondayProjects;');
    })

    boards.forEach(board => {
        result.push([board.url, board.id, board.name, board.description, board.board_kind, board.created_at, board.updated_at, JSON.stringify(board.columns), JSON.stringify(board.groups)]);
        p = p.then(pool => {
            // Query
            return sql
                .query(`INSERT INTO dbo.MondayProjects (ProjectId, ProjectUrl, ProjectName, ProjectDescription, ProjectKind, Columns, CreatedAt, UpdatedAt) 
                    VALUES ('${board.id}', '${getEscapeString(board.url)}', '${getEscapeString(board.name)}', '${getEscapeString(board.description)}', 
                    '${getEscapeString(board.board_kind)}', '${getEscapeString(JSON.stringify(board.columns))}', '${board.created_at}', '${board.updated_at}');`);
        });
    });
    csv_stringify(result, (err, output) => {
        if (err) console.log(err);
        else fs.writeFileSync('projects.csv', output, 'utf8');
    })

    return p.then(() => {
            sql.close();
        })
        .catch(err => {
            console.log(err);
        });
}

const output_tasks = (pulses) => {
    fs.writeFileSync('tasks.json', JSON.stringify(pulses, null, 4), 'utf8');

    let result = [['url', 'id', 'name', 'updates_count', 'board_id', 'created_at', 'updated_at', 'column_values']];
    let p = sql.connect(config);
    p = p.then(() => {
        return sql.query('TRUNCATE TABLE dbo.MondayTasks;');
    })
    pulses.forEach(pulse => {
        result.push([pulse.pulse.url, pulse.pulse.id, pulse.pulse.name, pulse.pulse.updates_count, pulse.pulse.board_id, pulse.pulse.created_at, pulse.pulse.updated_at, JSON.stringify(pulse.column_values)]);
        p = p.then(pool => {
            // Query
            return sql
                .query(`INSERT INTO dbo.MondayTasks (TaskId, TaskUrl, TaskName, UpdatesCount, ProjectId, CreatedAt, UpdatedAt, ColumnValues) 
                    VALUES ('${pulse.pulse.id}', '${getEscapeString(pulse.pulse.url)}', '${getEscapeString(pulse.pulse.name)}', '${pulse.pulse.updates_count}', 
                    '${pulse.pulse.board_id}', '${pulse.pulse.created_at}', '${pulse.pulse.updated_at}', '${getEscapeString(JSON.stringify(pulse.column_values))}');`);
        });
    });
    csv_stringify(result, (err, output) => {
        if (err) console.log(err);
        else fs.writeFileSync('tasks.csv', output, 'utf8');
    })
    return p.then(() => {
            sql.close();
        })
        .catch(err => {
            console.log(err);
        });
}

const output_users = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 4), 'utf8');

    let result = [['url', 'id', 'name', 'email', 'photo_url', 'title', 'position', 'phone', 'location', 'status', 'birthday', 'is_guest', 'created_at', 'updated_at']];

    let p = sql.connect(config);
    p = p.then(() => {
        return sql.query('TRUNCATE TABLE dbo.MondayUsers;');
    })

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
        p = p.then(pool => {
            // Query
            return sql
                .query(`
                    INSERT INTO dbo.MondayUsers
                    (
                        UserId, 
                        UserUrl, 
                        UserName,
                        UserEmail,
                        PhotoUrl,
                        Title,
                        Position,
                        Phone,
                        UserLocation,
                        UserStatus,
                        UserBirthday,
                        IsGuest,
                        CreatedAt,
                        UpdatedAt
                    ) 
                    VALUES 
                    (
                        '${user.id}',
                        '${getEscapeString(user.url)}',
                        '${getEscapeString(user.name)}',
                        '${getEscapeString(user.email)}',
                        '${getEscapeString(user.photo_url)}',
                        '${getEscapeString(user.title)}',
                        '${getEscapeString(user.position)}',
                        '${getEscapeString(user.phone)}',
                        '${getEscapeString(user.location)}',
                        '${getEscapeString(user.status)}',
                        '${getEscapeString(user.birthday)}',
                        '${user.is_guest == 'true' ? 1 : 0}',
                        '${user.created_at}',
                        '${user.updated_at}'
                    );`);
        });

    });
    csv_stringify(result, (err, output) => {
        if (err) console.log(err);
        else fs.writeFileSync('users.csv', output, 'utf8');
    });
    return p.then(() => {
            sql.close();
        })
        .catch(err => {
            console.log(err);
        });

}

monday.get_boards()
    .then(boards => {
        let p = output_projects(boards);

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
            return output_tasks(tasks);
        });
    })
    .then(() => {
        return monday.get_users()
            .then(users => {
                return output_users(users);
            })
            .catch(err => {
                console.log(err);
            });    
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