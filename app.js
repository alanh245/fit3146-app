let {PythonShell} = require('python-shell');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json());

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

app.post('/hook', function (req, res) {
    console.log(req.body);
    // Send OK back to Zoom webook server
    res.status(200).end();
    console.log(req.body.payload.object.presence_status)

    // Parse json and store presence status string value
    var status = req.body.payload.object.presence_status

    // Only check if json received contains presence status
    if (typeof status !== 'undefined') {
        if (status=='Away' || status=='Available') {
            // If the users status change to either Away or Available it means they can be disturbed
            PythonShell.run('set_available.py', null, function (err, results) {
                console.log(results);
            });
            isAvailable = true;
        } else if (status=='Do_Not_Disturb') {
            // Users can manually change their status to Do Not Disturb or it will be automatically changed when joining a Meeting
            PythonShell.run('set_busy.py', null, function (err, results) {
                console.log(results);
            });
            isAvailable = false;
        }
    }
});

app.listen(8080);
console.log('App running at localhost:8080');