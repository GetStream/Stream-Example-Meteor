Package.describe({
  name: 'stream-meteor',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Getstream.io integration package for Meteor',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use(['underscore', 'mongo']);
  api.use('matb33:collection-hooks');
  api.use('dburles:mongo-collection-instances');

  api.export('Stream');
  api.addFiles(['stream-meteor.js',
                'collections.js',
                'activity.js',
                'backend.js',]);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('stream-meteor');
  api.addFiles('stream-meteor-tests.js');
});

// Npm.depends({
//   // "getstream-node": "0.1.3",
//   "async": "0.9.0",
// });
