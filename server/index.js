const express = require('express')
const sqlite3 = require('sqlite3')
const path = require('path')
const fs = require('fs')

const app = express()
const port = 5000

/**
 * /?granularity=???&
 * Granularity:
 *      None = all relevant data
 *      Day
 *      Week
 *      Month
 *      Year
 */


app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`)
})

//The following populates database
sqldata = fs.readFileSync(path.resolve(__dirname, './static/mock-sash.sql')).toString().split(';')

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
                iso_date = "\"" + (new Date(date_val[0]).toISOString()) + "\""
                elm = elm.replace(date_val[0], iso_date)
            }
            db.run(elm, (err) => {
                if(err) console.error(err.message)
            })
        }
    })
    db.run('COMMIT;')
})

app.get('/:gran', (req, res) => {
    gran = req.params.gran.toLocaleLowerCase()
    group_map = {"none": null, "day": "%d", "month": "%m", "year": "%y"}

    if(!Object.keys(group_map).includes(gran)){
        res.status(405)
        return res.send("Argument is incorrect")
    }
    db.all("PRAGMA table_info(mytable)", (err, rows) => {
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
            param = [group_map[gran]]
            col_names.forEach((val) => {
                sql += "avg(\"" + val + "\") as " + val + ", "
            })
        }
        sql += "time FROM mytable"
        if(!(gran === "none")) {
            sql += " group by strftime(?, time);"
        } else {
            sql += ";"
        }
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


/*
db.close((err) => {
    if (err) return console.error(err.message)
    console.log('Closed in-memory db')
})*/
