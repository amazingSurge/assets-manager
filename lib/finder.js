import globby from 'globby';
import defaultTypes from './types';
import minimatch from 'minimatch';
import extend from 'deep-extend';
import configure from './configure';

/**
 * Finder
 */
class Finder {
  classifyFilesFromGlobs(dir, globs, types, options = {}) {
    if(!types) {
      types = configure.get('types', defaultTypes);
    }
    let result = {};

    let files = this.listFiles(dir, globs, options);

    for (let type of Object.keys(types)) {
      options = extend({
        matchBase: true
      }, options);
      result[type] = files.filter(minimatch.filter(types[type], options));
    }

    return result;
  }

  classifyFilesFromDir(dir, types, options = {}) {
    if(!types) {
      types = configure.get('types', defaultTypes);
    }

    let result = {};

    for (let type of Object.keys(types)) {
      result[type] = this.filterFilesByType(dir, type, types, options);
    }

    return result;
  }

  classifyFiles(files, types, options = {}) {
    if(!types) {
      types = configure.get('types', defaultTypes);
    }

    let result = {};

    if (!Array.isArray(files)) {
      files = [files];
    }

    for (let type of Object.keys(types)) {
      options = extend({
        matchBase: true
      }, options);
      result[type] = files.filter(minimatch.filter(types[type], options));
    }

    return result;
  }

  listFiles(dir, glob = '**/*', options = {}) {
    options = extend({
      dot: true,
      ignore: ['.*', 'bower_components', 'node_modules']
    }, options);

    return this.filterFiles(dir, glob, options);
  }

  filterFiles(dir, filter, options = {}) {
    options = Object.assign({
      cwd: dir,
      onlyFiles: true
    }, options);

    return globby.sync(filter, options);
  }

  filterFilesByType(dir, type, types, options = {}) {
    if(!types) {
      types = configure.get('types', defaultTypes);
    }

    options = extend({
      matchBase: true
    }, options);

    return this.filterFiles(dir, types[type], options);
  }
}

const finder = new Finder();
export default finder;
