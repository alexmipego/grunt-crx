/* global describe, it, beforeEach, afterEach, expect */
"use strict";

var grunt = require('grunt');
var rm = require('rimraf');
var mkdir = require('mkdirp');
var path = require('path');
var expect = require('chai').expect;
var sinon = require('sinon');

var extensionHelper = require(__dirname + '/../lib/crx.js').init(grunt);
var autoupdateHelper = require(__dirname + '/../lib/autoupdate.js').init();
var getTaskConfig = require('./helpers')(grunt).getTaskConfig;

describe('lib/autoupdate', function(){
  var sandbox = sinon.sandbox.create();

  before(function(){
    grunt.config.init({
      crx: {
        "standard": extensionHelper.getTaskConfiguration('test-standard'),
        "codebase": extensionHelper.getTaskConfiguration('test-codebase'),
        "exclude": extensionHelper.getTaskConfiguration('test-exclude')
      }
    });
  });

  afterEach(function (done) {
    var filepath = path.join(__dirname, 'data', 'files');

    rm(filepath, mkdir.bind(null, filepath, done));

    sandbox.restore();
  });

  describe('buildXML', function(){
    it('should generate an autoupdate file without codebase, without update_url', function(){
      var config = getTaskConfig('standard');

      return extensionHelper.createObject(config).load(config.src).then(function(crx){
	sandbox.stub(crx.manifest, 'update_url', null);

	return autoupdateHelper.buildXML(config, crx).then(function() {
	  expect(grunt.file.expand('test/data/files/updates.xml')).to.have.lengthOf(0);
	});
      })
    });

    it('should generate an autoupdate file with codebase, without update_url', function(){
      var config = getTaskConfig('codebase');

      return extensionHelper.createObject(config).load(config.src).then(function(crx){
	sandbox.stub(crx.manifest, 'update_url', null);

	return autoupdateHelper.buildXML(config, crx).then(function() {
	  expect(grunt.file.expand('test/data/files/updates.xml')).to.have.lengthOf(0);
	});
      });
    });

    it('should generate an autoupdate file with codebase, with update_url', function(){
      var config = getTaskConfig('codebase');

      return extensionHelper.createObject(config).load(config.src).then(function(crx){
	return autoupdateHelper.buildXML(config, crx).then(function() {
	  expect(grunt.file.expand('test/data/files/updates.xml')).to.have.lengthOf(1);
	});
      });
    });
  });
});
