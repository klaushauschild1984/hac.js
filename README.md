# impex.js
Node.js module dealing with Impex files typically used data transport file in SAP Hybris Commerce Suite

## Impex pretty printer

`format.js` exports a function for pretty print an Impex file as `[ORIGN].formatted.impex`. `format-cli.js` house a command line adapter for it.

## Usage
```
const format = require('./format');

const impex_file_name = ...

format(impex_file_name);
```

Turning this

<pre id="this"></pre>

in that

<pre id="that"></pre>

<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
    axios({
        method: 'get',
        url: 'https://raw.githubusercontent.com/klaushauschild1984/impex.js/main/malformatted.impex'
    })
    .then(function (response) {
        document.getElementById("this").innerHTML = response.data;
    });
      
    axios({
        method: 'get',
        url: 'https://raw.githubusercontent.com/klaushauschild1984/impex.js/main/malformatted.formatted.impex'
    })
    .then(function (response) {
        document.getElementById("that").innerHTML = response.data;
    });
</script>

### Binary packages

Build binary packages directly executable with

* `npm run package-windows`
* `npm run package-linux`

This will produce the respective binaries in `bin` folder.
