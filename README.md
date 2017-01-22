# node-blink1-server
HTTP REST API server in Node for blink(1) devices

Supports plug and unplug of blink(1) while server is running.

Uses new `node-hid@0.5.0` so works with Node 4.x.

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
- `/blink1/fadeToRGB` -- fade blink(1) to a color. query args:
    - `rgb` -- hex color code (e.g. "#ff00ff") [required]
    - `time` -- fade time in seconds (default: 0.1)
    - `ledn` -- LED to control (0=both, 1=top, 2=bottom; default: 0)
- `/blink1/blink` -- blink a color, query args:
    - `rgb` -- hex color code (e.g. "`#ff00ff`") [required]
    - `time` -- fade & blink time in seconds (default: 0.1)
    - `ledn` -- LED to control (0=both, 1=top, 2=bottom; default: 0)
    - `repeats` -- number of times to blink (default: 3)
- `/blink1/pattern` -- blink a pattern of colors, query args:
    - `rgb` -- hex color codes separated by a comma (,) (e.g. "`#ff00ff`") [required]
    - `time` -- blink time in seconds (default: 0.1)
    - `repeats` -- number of times to blink pattern (default: 3)

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

$ curl  'http://localhost:8754/blink1/pattern?rgb=%23ff0000,%23ffffff,%230000ff&time=.2&repeats=8'
{
    "blink1Connected": true,
    "blink1Serials": [
        "200026C1"
    ],
    "time": 0.2,
    "colors": [
        "#ff0000",
        "#ffffff",
        "#0000ff"
    ],
    "repeats": 8,
    "cmd": "pattern",
    "status": "success"
}
```
