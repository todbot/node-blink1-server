# node-blink1-server
HTTP REST API server in Node for blink(1) devices

Supports plug and unplug of blink(1) while server is running.

Uses @lorenc-tomasz branch of `node-hid` so works with Node 4.x.

### Installation

Install globally and use on the commandline:
```
npm install -g node-blink1-server
blink1-server 8754   # starts server on port 8754
```

Or check out and use via npm:
```
git clone https://github.com/todbot/node-blink1-server.git
cd node-blink1-server
npm install
npm start 8754
```

### Supported URIs:
- `/blink1`  -- status info about connected blink1s, lastColor, etc.
- `/blink1/fadeToRGB` -- fade blink(1) to a color

### Examples:
```
$ blink1-server 8754 &
$ curl 'http://localhost8754/blink1'
{
    "blink1Connected": true,
    "blink1Serials": [
        "AB0026C1"
    ],
    "lastColor": "#FF0000",
    "lastTime": 1.5,
    "lastLedn": 0,
    "lastRepeats": 0,
    "cmd": "info",
    "status": "success"
}
$ curl  'http://localhost:8754/blink1/fadeToRGB?rgb=%230000ff&time=2.5&ledn=2'
{
    "blink1Connected": true,
    "blink1Serials": [
        "200026C1"
    ],
    "lastColor": "#0000ff",
    "lastTime": 2.5,
    "lastLedn": 2,
    "lastRepeats": 0,
    "cmd": "fadeToRGB",
    "status": "success"
}
```
