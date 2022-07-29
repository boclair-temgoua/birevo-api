// var prefixes = ['api'];
var scopes = [
  'general',
  'root-config',
  'models',
  'tests',
  'database',
  'api',
  'auth',
  'bug',
];

// var _prefixed = scopes.map(function (s) {
//     return prefixes.map(function (p) {
//         return p + '-' + s;
//     });
// });
var prefixed = [].concat.apply([], scopes);
var config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'type-enum': [
      2,
      'always',
      [
        // special:
        'build',
        'ci',
        'release',

        // common-dev
        'chore',
        'wip',
        'feat',
        'fix',
        'hotfix',
        'improve',
        'refactor',
        'lint',

        //
        'test',
        'docs',
      ],
    ],
    'scope-enum': [2, 'always', prefixed],
  },
};

module.exports = config;
