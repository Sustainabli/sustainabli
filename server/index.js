const express = require('express')
const sqlite3 = require('sqlite3')
const fs = require('fs')

const app = express()
const port = 3000

/**TODO
 * 
 * -Fix Datetime from '01-Oct-18 12:00:00 AM EDT' to ISO
 * -Add endpoints for SQL Queries
 * -Add params for SQL Queries
 * -Watch for SQL Injection, terminate all queries
 * 
 */


app.get('/', (req, res) => {
    res.send('Hello Me')
})

app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`)
})

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
            db.run(elm, (err) => {
                if(err) console.error(err.message)
            })
        }
    })
    db.run('COMMIT;')
})

db.all("SELECT * FROM mytable", (err, rows) => {
    if(err) return err.message
    rows.forEach((row) => {
    })
})

db.close((err) => {
    if (err) return console.error(err.message)
    console.log('Closed in-memory db')
})