const express = require('express')
const sqlite3 = require('sqlite3')
const fs = require('fs')

const app = express()
const port = 3000

function buildSQL(gran) {
    "SELECT * FROM mytable"
}

/**TODO
 * 
 * -Add endpoints for SQL Queries
 * -Add params for SQL Queries
 * -Watch for SQL Injection, terminate all queries
 * 
 */

/**
 * /?granularity=???&
 * Granularity:
 *      None = all relevant data
 *      Day
 *      Week
 *      Month
 *      Year
 */
app.get('data/:granularity', (req, res) => {
    res.send(req.params)
    console.log(req.params)

})

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

db.close((err) => {
    if (err) return console.error(err.message)
    console.log('Closed in-memory db')
})

/*
db.all("SELECT time FROM mytable WHERE time BETWEEN \'2018-10-16\' AND \'2018-10-18\'", (err, rows) => {
    if(err) return err.message
    rows.forEach((row) => {
        console.log(row)
    })
})*/