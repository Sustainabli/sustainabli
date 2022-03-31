const express = require('express')
const sqlite3 = require('sqlite3')
const path = require('path')
const fs = require('fs')
const { Router } = require('express')

const app = express()
const port = process.env.PORT || 5000

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

app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`)
})

//The following populates database
//sqldata = fs.readFileSync(path.resolve(__dirname, './static/mock-sash.sql')).toString().split(';')
sqldata = fs.readFileSync(path.resolve(__dirname, './static/mock-cfm.sql')).toString().split(';')
//sqldata = sqldata_sash + sqldata_cfm
//sqldata = sqldata.split(";")
db = new sqlite3.Database(':memory:', (err) => {
    if (err) return console.error(err.message)
    console.log('Connected to in-memory')
})

db.serialize(() => {
    db.run('PRAGMA foreign_keys=OFF;')
    db.run('BEGIN TRANSACTION;')
    sqldata.forEach((elm, idx) => {
        if(elm) {
            elm += ';'
            if(idx > 0) {
                rx = new RegExp("\'.*?\'")
                date_val = elm.match(rx)
                date_val_new = date_val[0].replaceAll("'", "")
                iso_date = "\"" +  (new Date(date_val_new).toISOString()) + "\""
                elm = elm.replace(date_val[0], iso_date)
            }
            db.run(elm, (err) => {
                if(err) console.error(err.message)
            })
        }
    })
    db.run('COMMIT;')
})
app.get('/:db/:gran', (req, res) => {
    db_query = req.params.db.toLocaleLowerCase()
    gran = req.params.gran.toLocaleLowerCase()
    relative = req.query.relative ? req.query.relative.toLocaleLowerCase() : null
    offset = req.query.offset ? req.query.offset.toLocaleLowerCase() : null
    time = req.query.time ? req.query.time.toLocaleLowerCase() : null
    
    db_map = ["cfm", "sash"]
    group_map = {"none": null, "day": "%d", "week":"%W", "month": "%m", "year": "%y"}
    relative_map = {"1day":"-1 days", "3day": "-3 days", "7day": "-7 days", "1month": "-1 month", "1year": "-1 year"}
    time_map = {"day": ["06:00:00", "18:00:00"], "night": ["18:00:00", "06:00:00"]}

    if(!Object.keys(group_map).includes(gran) || !db_map.includes(db_query)) {
        res.status(405)
        return res.send("Argument is incorrect")
    }
    if(relative != null && !Object.keys(relative_map).includes(relative)) {
        res.status(405)
        return res.send("Argument is incorrect")
    }
    if(time != null && !Object.keys(time_map).includes(time)) {
        res.status(405)
        return res.send("Argument is incorrect")
    }

    db.all("PRAGMA table_info(" + db_query + ")", (err, rows) => {
        if (err) {
            console.error(err.message)
            res.status(400)
            return res.send(err.message)
        }

        sql = "SELECT "
        param = []

        col_names = rows.map((x) => x['name'])
        col_names.shift()

        if(gran === "none") {
            sql += "*, "
        } else {
            col_names.forEach((val) => {
                sql += "round(avg(\"" + val + "\"), 3) as " + val + ", "
            })
        }
        sql += "time FROM " + db_query

        if(relative || time)
            sql += " WHERE"

        //Insert date relative
        if(relative) {
            sql += " (datetime(time) BETWEEN datetime(?, ?) AND datetime(?))"
            curr_date = offset ? new Date(offset).toISOString() : (new Date()).toISOString()
            param.push(curr_date)
            param.push(relative_map[relative])
            param.push(curr_date)
        }

        if(relative && time)
            sql += " AND"

        //Insert AM/PM time
        if(time === "day") {
            sql += " (time(time) BETWEEN time(?) AND time(?))"
            param.push(time_map[time][0])
            param.push(time_map[time][1])
        } else if(time === "night") {
            sql += " ((time(time) BETWEEN time(?) AND time(?)) OR (time(time) BETWEEN time(?) AND time(?)))"
            param.push(time_map[time][0])
            param.push("23:59:59")
            param.push("00:00:00")
            param.push(time_map[time][1])
        }

        //Insert groupby
        if(!(gran === "none")) {
            sql += " group by strftime(?, time)"
            param.push(group_map[gran])
        }
        
        sql += ";"
        db.all(sql, param, (err, rows) => {
            if(err) {
                console.log(err.message)
                res.status(400)
                return res.send(err.message)
            }
            res.send(rows)
        })
    })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

app.post("/close", (req, res) => {
    db.close((err) => {
        if (err) {
            res.status(400)
            return res.send(err.message)
        }
        res.send('Closed in-memory db')
        console.log('Closed in-memory db')
    })
})