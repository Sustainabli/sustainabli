const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const math = require('mathjs');
const { Router } = require('express');

const app = express();
const port = process.env.PORT || 8000;

/**
 * /?granularity=???&
 * Granularity:
 *      None = all relevant data
 *      Day
 *      Week
 *      Month
 *      Year
 */

app.use(express.static(path.resolve(__dirname, '../build')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (req, res) => {
  console.log(`Listening on port ${port}`);
});

//The following populates database
sqldata_sash = fs
  .readFileSync(path.resolve(__dirname, './static/mock-sash.sql'))
  .toString()
  .split(';');
sqldata_cfm = fs
  .readFileSync(path.resolve(__dirname, './static/mock-cfm.sql'))
  .toString()
  .split(';');
createsash = sqldata_sash[0];
insertsash = sqldata_sash.slice(1);
createcfm = sqldata_cfm[0];
insertcfm = sqldata_cfm.slice(1);
allinserts = insertsash.concat(insertcfm);
sqldata = [].concat(createsash, createcfm, ...allinserts);

db = new sqlite3.Database(':memory:', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to in-memory');
});

db.serialize(() => {
  db.run('PRAGMA foreign_keys=OFF;');
  db.run('BEGIN TRANSACTION;');
  sqldata.forEach((elm, idx) => {
    if (elm) {
      elm += ';';
      if (idx > 1) {
        rx = new RegExp("'.*?'");
        date_val = elm.match(rx);
        date_val_new = date_val[0].replaceAll("'", '');
        iso_date = '"' + new Date(date_val_new).toISOString() + '"';
        elm = elm.replace(date_val[0], iso_date);
      }
      db.run(elm, (err) => {
        if (err) console.error(err.message);
      });
    }
  });
  db.run('COMMIT;');
});
// app.get('/:db/:gran', (req, res) => {
//   db_query = req.params.db.toLocaleLowerCase();
//   gran = req.params.gran.toLocaleLowerCase();
//   relative = req.query.relative ? req.query.relative.toLocaleLowerCase() : null;
//   offset = req.query.offset ? req.query.offset.toLocaleLowerCase() : null;
//   time = req.query.time ? req.query.time.toLocaleLowerCase() : null;
//   start_slice = req.query.start_slice ? req.query.start_slice : '1970-01-01';
//   end_slice = req.query.end_slice ? req.query.end_slice : 'now';
//
//   db_map = ['cfm', 'sash'];
//   group_map = {
//     none: null,
//     day: '%d-%m-%Y',
//     week: '%W-%Y',
//     month: '%m-$Y  ',
//     year: '%y',
//   };
//   relative_map = {
//     '1day': '-1 days',
//     '3day': '-3 days',
//     '7day': '-7 days',
//     '1month': '-1 month',
//     '1year': '-1 year',
//   };
//   time_map = { day: ['06:00:00', '18:00:00'], night: ['18:00:00', '06:00:00'] };
//
//   if (!Object.keys(group_map).includes(gran) || !db_map.includes(db_query)) {
//     res.status(405);
//     return res.send('Argument is incorrect');
//   }
//   if (relative != null && !Object.keys(relative_map).includes(relative)) {
//     res.status(405);
//     return res.send('Argument is incorrect');
//   }
//   if (time != null && !Object.keys(time_map).includes(time)) {
//     res.status(405);
//     return res.send('Argument is incorrect');
//   }
//
//   db.all('PRAGMA table_info(' + db_query + ')', (err, rows) => {
//     if (err) {
//       console.error(err.message);
//       res.status(400);
//       return res.send(err.message);
//     }
//
//     sql = 'SELECT ';
//     param = [];
//
//     col_names = rows.map((x) => x['name']);
//     col_names.shift();
//
//     if (gran === 'none') {
//       sql += '*, ';
//     } else {
//       col_names.forEach((val) => {
//         sql += 'round(avg("' + val + '"), 3) as ' + val + ', ';
//       });
//     }
//     sql += 'time FROM ' + db_query;
//
//     sql += ' WHERE (datetime(time) BETWEEN datetime(?) AND datetime(?))';
//     param.push(start_slice);
//     param.push(end_slice);
//     if (relative || time) sql += ' and';
//
//     //Insert date relative
//     if (relative) {
//       sql += ' (datetime(time) BETWEEN datetime(?, ?) AND datetime(?))';
//       curr_date = offset
//         ? new Date(offset).toISOString()
//         : new Date().toISOString();
//       param.push(curr_date);
//       param.push(relative_map[relative]);
//       param.push(curr_date);
//     }
//
//     if (relative && time) sql += ' AND';
//
//     //Insert AM/PM time
//     if (time === 'day') {
//       sql += ' (time(time) BETWEEN time(?) AND time(?))';
//       param.push(time_map[time][0]);
//       param.push(time_map[time][1]);
//     } else if (time === 'night') {
//       sql +=
//         ' ((time(time) BETWEEN time(?) AND time(?)) OR (time(time) BETWEEN time(?) AND time(?)))';
//       param.push(time_map[time][0]);
//       param.push('23:59:59');
//       param.push('00:00:00');
//       param.push(time_map[time][1]);
//     }
//
//     //Insert groupby
//     if (!(gran === 'none')) {
//       sql += ' group by strftime(?, time)';
//       param.push(group_map[gran]);
//     }
//
//     sql += ' order by time;';
//     db.all(sql, param, (err, rows) => {
//       if (err) {
//         console.log(err.message);
//         res.status(400);
//         return res.send(err.message);
//       }
//       statistics = {};
//
//       col_names.forEach((val, _) => {
//         if (val != 'time') {
//           datapoints = rows.map((data) => data[val]);
//           round = 3;
//           statistics[val] = {
//             stdev: math.round(math.std(datapoints), round),
//             stderror: math.round(
//               math.std(datapoints) / math.sqrt(datapoints.length),
//               round
//             ),
//             n: datapoints.length,
//             avg: math.round(math.mean(datapoints), round),
//           };
//         }
//       });
//       res.send({ stats: statistics, data: rows });
//     });
//   });
// });

app.post('/api/data', (req, res) => {
  const data_type = req.body.data_type;
  const data_format = req.body.data_format;
  const graph_type = req.body.graph_type;
  const granularity = req.body.granularity;
  const time_of_day = req.body.time_of_day;
  const lab_fumehood_mapping = req.body.lab_fumehood_mapping;
  const number_of_competition_weeks = req.body.number_of_competition_weeks;
  const start_slice = req.body.start_slice;
  const end_slice = req.body.end_slice;

  const time_map = {
    day: ['06:00:00', '18:00:00'],
    night: ['18:00:00', '06:00:00'],
  };
  const group_map = {
    none: null,
    day: '%d-%m-%Y',
    week: '%W-%Y',
    month: '%m-$Y  ',
    year: '%y',
  };

  if (
    !data_type ||
    !granularity ||
    !time_of_day ||
    !lab_fumehood_mapping ||
    !start_slice ||
    !end_slice
  ) {
    res.status(405);
    return res.send('Argument is incorrect');
  }

  db.all('PRAGMA table_info(' + data_type + ')', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(400);
      return res.send(err.message);
    }

    sql = 'SELECT ';
    param = [];

    const all_fumehoods = Object.values(lab_fumehood_mapping).reduce(
      (acc, fumehoods) => acc.concat(fumehoods),
      []
    );
    col_names = rows
      .map((x) => x['name'])
      .filter((x) => all_fumehoods.includes(x));

    if (granularity === 'none') {
      sql += '*, ';
    } else {
      col_names.forEach((val) => {
        sql += 'avg("' + val + '") as ' + val + ', ';
      });
    }
    sql += 'time FROM ' + data_type;

    sql += ' WHERE (datetime(time) BETWEEN datetime(?) AND datetime(?))';
    param.push(start_slice);
    param.push(end_slice);

    if (time_of_day !== 'all') sql += ' AND';

    //Insert AM/PM time
    if (time_of_day === 'day') {
      sql += ' (time(time) BETWEEN time(?) AND time(?))';
      param.push(time_map[time_of_day][0]);
      param.push(time_map[time_of_day][1]);
    } else if (time_of_day === 'night') {
      sql +=
        ' ((time(time) BETWEEN time(?) AND time(?)) OR (time(time) BETWEEN time(?) AND time(?)))';
      param.push(time_map[time_of_day][0]);
      param.push('23:59:59');
      param.push('00:00:00');
      param.push(time_map[time_of_day][1]);
    }

    //Insert groupby
    if (granularity !== 'none') {
      sql += ' group by strftime(?, time)';
      param.push(group_map[granularity]);
    }

    sql += ' order by time;';
    db.all(sql, param, (err, rows) => {
      if (err) {
        console.log(err.message);
        res.status(400);
        return res.send(err.message);
      }
      data = {};

      if (graph_type == 'line') {
        if (data_format === 'single_lab') {
          all_fumehoods.forEach((fumehood) => {
            data[fumehood] = [];
          });
          rows.forEach((row) => {
            all_fumehoods.forEach((fumehood) => {
              data[fumehood].push({ time: row.time, value: row[fumehood] });
            });
          });
        } else if (data_format === 'all_labs') {
          Object.keys(lab_fumehood_mapping).forEach((lab) => {
            data[lab] = [];
          });
          rows.forEach((row) => {
            Object.keys(lab_fumehood_mapping).forEach((lab) => {
              data[lab].push({
                time: row.time,
                value: math.round(
                  lab_fumehood_mapping[lab].reduce(
                    (acc, fumehood) => acc + row[fumehood],
                    0
                  ) / lab_fumehood_mapping[lab].length,
                  2
                ),
              });
            });
          });
        }
      } else if (graph_type === 'bar') {
        if (data_format === 'single_lab') {
        } else if (data_format === 'all_labs') {
          const beginningRows = rows.slice(
            0,
            rows.length - number_of_competition_weeks
          );
          data['beginning'] = Object.keys(lab_fumehood_mapping).map((lab) =>
            math.round(
              lab_fumehood_mapping[lab].reduce(
                (acc, fumehood) =>
                  acc +
                  beginningRows.reduce((acc2, row) => acc2 + row[fumehood], 0) /
                    beginningRows.length,
                0
              ) / lab_fumehood_mapping[lab].length,
              2
            )
          );
          for (let i = number_of_competition_weeks; i >= 1; i--) {
            const dataKey = rows[rows.length - i].time;
            data[dataKey] = Object.keys(lab_fumehood_mapping).map((lab) =>
              math.round(
                lab_fumehood_mapping[lab].reduce(
                  (acc, fumehood) => acc + rows[rows.length - i][fumehood],
                  0
                ) / lab_fumehood_mapping[lab].length,
                2
              )
            );
          }
        }
      }
      statistics = {};

      // if (data_format !== 'single_lab') {
      //   // console.log(lab_fumehood_data);
      //   Object.keys(lab_fumehood_data).forEach((key) => {
      //     statistics[key] = lab_fumehood_data[key].map((datapoints) => {
      //       round = 2;
      //       statistics[key].push({
      //         stdev: math.round(math.std(datapoints), round),
      //         stderror: math.round(
      //           math.std(datapoints) / math.sqrt(datapoints.length),
      //           round
      //         ),
      //         n: datapoints.length,
      //         avg: math.round(math.mean(datapoints), round),
      //       });
      //     });
      //   });
      // }
      res.send({ stats: statistics, data: data });
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

app.post('/close', (req, res) => {
  db.close((err) => {
    if (err) {
      res.status(400);
      return res.send(err.message);
    }
    res.send('Closed in-memory db');
    console.log('Closed in-memory db');
  });
});
