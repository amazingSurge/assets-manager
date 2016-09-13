"use strict";

import file from '../lib/file';
import path from 'path';
import cd from './helpers/cd';
import finder from '../lib/finder';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.use(dirtyChai);

const expect = chai.expect;
const FIXTURES = path.join(__dirname, 'fixtures');
const TEMP = path.join(__dirname, 'fixtures', '.tmp');


describe('file', () => {
  afterEach(() => {
    cd.reset();
  });

  after(() => {
    file.remove(TEMP);
  });

  it('should exists', () => {
    expect(file).to.exist();
  });

  it('should return true if path is directory', () => {
    const dir = path.resolve(FIXTURES, 'file');
    expect(file.isDirectory(dir)).to.be.true();
  });

  describe('locate()', () => {
    it('should work with relative directory', () => {
      cd(FIXTURES);

      expect(file.locate('file')).to.be.equal(path.resolve(FIXTURES, 'file'));
    });

    it('should work with full path', () => {
      expect(file.locate(path.resolve(FIXTURES, 'file'))).to.be.equal(path.resolve(FIXTURES, 'file'));
    });
  });

  describe('exists()', () => {
    it('should work with relative directory', () => {
      cd(FIXTURES);

      expect(file.exists('file')).to.be.false();
      expect(file.exists(path.join('file', 'test.js'))).to.be.true();
      expect(file.exists('non-exist')).to.be.false();
    });

    it('should work with full path', () => {
      expect(file.exists(path.resolve(FIXTURES, 'file', 'test.js'))).to.be.true();
    });
  });

  describe('isDirectory()', () => {
    it('should work with relative directory', () => {
      cd(FIXTURES);

      expect(file.isDirectory('file')).to.be.true();
      expect(file.isDirectory(path.join('file', 'test.js'))).to.be.false();
      expect(file.isDirectory('non-exist')).to.be.false();
    });

    it('should work with full path', () => {
      expect(file.isDirectory(path.resolve(FIXTURES, 'file'))).to.be.true();
    });
  });

  describe('readJSON()', () => {
    it('should read json correctly', () => {
      const jsonfile = path.resolve(FIXTURES, 'file', 'test.json');
      expect(file.readJSON(jsonfile)).to.be.eql({
        test: true
      });
    });

    it('should use default value when json file not exist', () => {
      const jsonfile = path.resolve(FIXTURES, 'file', 'non-exist.json');
      const def = {
        test: true
      };
      expect(file.readJSON(jsonfile, def)).to.be.eql(def);
    });

    it('should fail when read json error', () => {
      const jsonfile = path.resolve(FIXTURES, 'file', 'error.json');
      let error;

      try {
        file.readJSON(jsonfile);
      } catch (err) {
        error = err;
      }
      expect(error).to.be.instanceOf(Error);
    });
  });

  it('should copy and clean files with single filepath', () => {
    cd(FIXTURES);

    return file.copyFiles({
      src: path.join('file', 'test.js'),
      dest: path.join('.tmp', 'clean', 'js' ,'test.js'),
    }).then(() => {
      expect(finder.listFiles(path.resolve(TEMP, 'clean'))).to.be.eql([
        'js/test.js'
      ]);
      return file.cleanFiles(path.resolve(TEMP, 'clean', 'js' ,'test.js')).then(()=>{
        expect(finder.listFiles(path.resolve(TEMP, 'clean'))).to.be.eql([]);
      });
    });
  });

  describe('copyFiles()', () => {
    it('should copy files correctly', () => {
      cd(FIXTURES);

      return file.copyFiles([{
        src: path.join('file', 'test.js'),
        dest: path.join('.tmp', 'copy', 'js' ,'test.js'),
      }, {
        src: path.join('file', 'test.css'),
        dest: path.join('.tmp', 'copy', 'css' ,'test.css'),
      }, {
        src: path.join('file', 'sub', 'test2.js'),
        dest: path.join('.tmp', 'copy', 'js' ,'test2.js'),
      }, {
        src: path.join('file', 'sub', 'test2.css'),
        dest: path.join('.tmp', 'copy', 'css' ,'test2.css'),
      }]).then(() => {
        expect(finder.listFiles(path.resolve(TEMP, 'copy'))).to.be.eql([
          'css/test.css',
          'css/test2.css',
          'js/test.js',
          'js/test2.js'
        ]);
      });
    });

    it('should fail if copy files not correctly', () => {
      cd(FIXTURES);

      return file.copyFiles([{
        src: path.join('file', 'non-exist.js'),
        dest: path.join('.tmp', 'non-exist.js'),
      }]).catch(error => {
        expect(error).to.be.exist();
        expect(error).to.contain('Cannot copy');
      });
    });
  });

  describe('cleanFiles()', () => {
    it('should clean files correctly', () => {
      cd(FIXTURES);

      return file.copyFiles([{
        src: path.join('file', 'test.js'),
        dest: path.join('.tmp', 'clean', 'js' ,'test.js'),
      }]).then(() => {
        expect(finder.listFiles(path.resolve(TEMP, 'clean'))).to.be.eql([
          'js/test.js'
        ]);
        return file.cleanFiles([path.resolve(TEMP, 'clean', 'js' ,'test.js')]).then(()=>{
          expect(finder.listFiles(path.resolve(TEMP, 'clean'))).to.be.eql([]);
        });
      });
    });

    it('should fail if clean files not correctly', () => {
      cd(FIXTURES);

      return file.cleanFiles([{
        src: path.join('file', 'non-exist.js'),
        dest: path.join('.tmp', 'non-exist.js'),
      }]).catch(error => {
        expect(error).to.be.exist();
        expect(error).to.contain('Cannot clean');
      });
    });
  });
});