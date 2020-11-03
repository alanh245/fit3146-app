let {PythonShell} = require('python-shell');
const express = require('express');
const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Initialise LED strip by setting to available
PythonShell.run('set_available.py', null, function (err, results) {
    console.log(results);
});
var isAvailable = true;

app.get('/', function (req, res) {
    res.render(__dirname + '/index.html', {isAvailable: isAvailable})
    console.log(isAvailable);
});

app.get('/busy', function (req, res) {
    PythonShell.run('set_busy.py', null, function (err, results) {
        console.log(results);
    });
    isAvailable = false;
    res.sendFile(__dirname + '/busy.html')
});

app.get('/available', function (req, res) {
    PythonShell.run('set_available.py', null, function (err, results) {
        console.log(results);
    });
    isAvailable = true;
    res.sendFile(__dirname + '/available.html')
});


app.listen(8080);
console.log('App running at localhost:8080');