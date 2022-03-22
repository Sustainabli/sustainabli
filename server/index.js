const express = require('express')
const sqlite3 = require('sqlite3')
const fs = require('fs')
const { Router } = require('express')

const app = express()
const port = 3000

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
sqldata = fs.readFileSync('./static/mock-sash.sql').toString().split(';')

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
    relative = req.query.relative ? req.query.relative.toLocaleLowerCase() : null
    offset = req.query.offset ? req.query.offset.toLocaleLowerCase() : null

    group_map = {"none": null, "day": "%d", "month": "%m", "year": "%y"}
    relative_map = {"1day":"-1 days", "3day": "-3 days", "7day": "-7 days", "1month": "-1 month", "1year": "-1 year"}

    if(!Object.keys(group_map).includes(gran)){
        res.status(405)
        return res.send("Argument is incorrect")
    }
    if(relative != null && !Object.keys(relative_map).includes(relative)){
        console.log("Error")
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
            col_names.forEach((val) => {
                sql += "round(avg(\"" + val + "\"), 3) as " + val + ", "
            })
        }
        sql += "time FROM mytable"

        //Insert date relative
        if(relative) {
            sql += " WHERE time BETWEEN datetime(?, ?) AND datetime(?)"
            curr_date = offset ? new Date(offset).toISOString() : (new Date()).toISOString()
            param.push(curr_date)
            param.push(relative_map[relative])
            param.push(curr_date)
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

/*
db.close((err) => {
    if (err) return console.error(err.message)
    console.log('Closed in-memory db')
})*/