# assets-manager [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
>  Assets manager provides a different approach to transfer the required files from your registry distributions to the target.

## Installation

```sh
$ npm install --save assets-manager
```

## Usage

```js
import assetsManager from 'assets-manager';

assetsManager('./manifest.json').copy();
```


## Registries
Assets manager can work with different package manager like npm, bower. Also It can use custom folders.

Just defined the registries in the manifest.json.

```js
"registries": {
  "vendor": "path-to-vendor",
  "libs": "path-to-lib"
}
```

## Global options
### cwd
The relative path to the root of the project.
Defaults to the manifest.json directory.

### flattenPackages
Whether to remove all package path parts from generated dest paths.
Defaults to false.

### flattenTypes
Whether to remove all type path parts from generated dest paths.
Defaults to false.

### clean (false)
Whether to clean old exists destination files.
Defaults to false.

### defaultRegistry
Set default registry when package dont have a registry specify.
Defaults to npm.

### types
Set types that assets manage will classicfy files automatically.

Defaults:
```
{
  js: '*.js',
  coffee: '*.coffee',
  es6: '*.es6.js',
  css: '*.css',
  stylus: '*.styl',
  scss: '*.scss',
  sass: '*.sass',
  less: '*.less',
  images: '*.{bmp,jpg,jpeg,png,gif,webp,tiff,wbmp,eps}',
  fonts: '*.{eot,otf,svg,ttc,ttf,woff,woff2}'
}
```

## Packages
### Package key
The package key in the manifest.json take the following form:
```
"registry:package"
"registry:package@version"
"package"
"package@version"
```

The "package" and "package@version" shorter form will use the default registry.

The name of the dependency in the package can be any custom alias, that is then only locally scoped to that specific package.

Typically semver-compatible versions should be used of the form ^x.y.z. Tilde ranges, ~x.y.z are also supported. Ranges without a patch or minor are also supported - x, x.y, ~x.y, ^x.y.

More info about versions:
https://docs.npmjs.com/getting-started/semantic-versioning
https://github.com/npm/node-semver#ranges

### Package definition
You can write in the following ways define the package.

1. simple mode
```
"PACKAGEKEY": true
```

It will use default types config and use default options.

2. use options only
```
"PACKAGEKEY": [
  true,
  {
    "registry": "bower"
  }
]
```

It will use default types config and custom options.

3. use types only
```
"PACKAGEKEY": [{
  "js": "dist/js",
  "css": "dist/css"
}]
```

It will use custom types config and default options.

4. use types only alternatively
```
"PACKAGEKEY": {
  "js": "dist/js",
  "css": "dist/css"
}
```

5. use types and options
```
"PACKAGEKEY": [
  {
    "js": "dist/js",
    "css": "dist/css"
  },
  {
    "registry": "bower"
  }
]
```

It will use custom types config and custom options.

### Types config in the package definition

1. Simple path mapping
```
{
  js: 'path-to-js',
  css: 'path-to-css'
}
```

2. Glob support
```
{
  js: '*.js',
  css: 'css/*.css'
}
```

3. Array support
```
{
  js: ['a.js', 'b.js'],
  css: ['css/*.css', '!css/*.min.css']
}
```

4. You can rename the files
```
js: {
  'bootstrap.js': 'dist/js/bootstrap.js'
},
css: {
  'main.css':'dist/css/bootstrap.css',
  'theme.css':'dist/css/bootstrap-theme.css'
}
```

### Package options
#### defaults
```
{
  clean: true,
  flattenPackages: false,
  flattenTypes: false
  main: false,
  registry: 'npm'
}
```

#### clean, flattenPackages, flattenTypes, registry
These options will override the global options.

#### main
Set to true will use bower/npm's main files.

#### Hooks
Assets manager provides 2 separate hooks that can be used to trigger other automated tools during assets copy operate. 

```
"hook:pre": "<your command here>",
"hook:post": "<your command here>",
```

## Example manifest.json
```js
{
  "cwd": "./",
  "registries": {
    "vendor": "libs"
  },
  "defaultRegistry": "npm",
  "flattenPackages": false,
  "flattenTypes": false,
  "dest": "assets",
  "dests": {
    "images": "images",
    "fonts": "fonts",
    "js": "js",
    "coffee": "source/coffee",
    "es6": "source/es6",
    "css": "css",
    "stylus": "source/stylus",
    "less": "source/less",
    "sass": "source/sass",
    "scss": "source/scss"
  },
  "packages": {
    "bower:jquery": true,
    "npm:bootstrap": [{
      "js": "dist/js",
      "css": "dist/css",
      "less": "less",
      "fonts": "dist/fonts"
    }],
    "vendor:modernizr": {
        "modernizr.js": "dist/modernizr.min.js",
    }
  }
}
```

## License

MIT © [amazingSurge](amazingSurge.com)

[npm-image]: https://badge.fury.io/js/assets-manager.svg
[npm-url]: https://npmjs.org/package/assets-manager
[travis-image]: https://travis-ci.org/amazingSurge/assets-manager.svg?branch=master
[travis-url]: https://travis-ci.org/amazingSurge/assets-manager
[daviddm-image]: https://david-dm.org/amazingSurge/assets-manager.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/amazingSurge/assets-manager
[coveralls-image]: https://coveralls.io/repos/amazingSurge/assets-manager/badge.svg
[coveralls-url]: https://coveralls.io/r/amazingSurge/assets-manager
