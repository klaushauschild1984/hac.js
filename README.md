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
```
    $macro     =value

# other comment
INSERT_UPDATE     Product   ;code[unique=true]     ;;; ;
#    fdfs
    ;   code

    REMOVE Product;code[unique=true]
;super very long value that is longer than its header

UPDATE Product; code [unique  =true ]  [allownull=true    ,default=code]

```

in that
```
$macro = value

# other comment
INSERT_UPDATE Product; code[unique = true]; 
# fdfs
                     ; code               ; 

REMOVE Product; code[unique = true]                                  ; 
              ; super very long value that is longer than its header ; 

UPDATE Product; code[unique = true, allownull = true, default = code]; 

```

## Formatting rule

* trim all lines and values
* remove trailing empty lines
* remove trailing `;`
* remove multiple empty lines (keeps blocks intact)

### Binary packages

Build binary packages directly executable with

* `npm run package-windows`
* `npm run package-linux`

This will produce the respective binaries in `bin` folder.

Or download from release page

* [Windows](https://github.com/klaushauschild1984/impex.js/releases/download/v1.0.0/format-impex.exe)
* [Linux](https://github.com/klaushauschild1984/impex.js/releases/download/v1.0.0/format-impex)
