'use strict';
var path = require('path');
var test = require('ava');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

test.before(() => {
  return helpers.run(path.join(__dirname, '../generators/gulp'))
    .withOptions({uploading: 'Amazon S3'})
    .toPromise();
});

test('creates gulpfile', () => {
  assert.file('gulpfile.js');
});

test('creates package.json file', () => {
  assert.file('package.json');
});

test('contain correct uploading packages', () => {
  [
    '"gulp-awspublish": "^3.0.1"',
    '"concurrent-transform": "^1.0.0"'
  ].forEach(pack => {
    assert.fileContent('package.json', pack);
  });
});

test('does not contain wrong uploading packages', () => {
  [
    '"gulp-rsync"',
    '"gulp-gh-pages"'
  ].forEach(pack => {
    assert.noFileContent('package.json', pack);
  });
});

test('contains deploy task', () => {
  assert.fileContent('gulpfile.js', '// \'gulp deploy\' -- reads from your AWS Credentials file, creates the correct');
  assert.fileContent('gulpfile.js', '// headers for your files and uploads them to S3');
  assert.fileContent('gulpfile.js', 'gulp.task(\'deploy\'');
});

test('does not contain wrong uploading tasks', () => {
  assert.noFileContent('gulpfile.js', '// \'gulp deploy\' -- reads from your Rsync credentials file and incrementally');
  assert.noFileContent('gulpfile.js', '// uploads your site to your server');
  assert.noFileContent('gulpfile.js', '// \'gulp deploy\' -- pushes your dist folder to Github');
});

test('creates credentials file', () => {
  assert.file('aws-credentials.json');
});