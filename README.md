# Static Content Server

This tutorial describes how to create JSON files from content stored in Markdown
files, that can be served from a static server. It can be used, for example, to
simulate a content API for an Angular 2 project.

## Step 1: Create Content in Markdown

The content is stored in Markdown files in a `content` folder, further separated
by folders for each content type. The Markdown file name should be an integer ID
of the content, unique for the type with the extenson `.md`.

Create folder `content/entires`.
Create files `1.md`, `2.md`, `3.md` with some content:

```markdown
---
title: "Some Entry"
---

Some Content
```


## Step 2: Setup Gulp

Gulp is used to read the Markdown files from the `content` directory and create
a JSON file in a `server` directory. Three Gulp tasks will be needed:

* clean
* markdown
* server

`clean` will clean the `server` directory, `markdown` will read the Markdown
files and create a JSON file and `server` will post-process the JSON files.

Install `gulp`:

```shell
npm install gulp --save-dev
```

Create file `gulpfile.js`:

```javascript
/* jshint esnext: true */
/* jshint node: true */
"use strict";

const gulp = require('gulp');

gulp.task('clean', function () {

});

gulp.task('markdown', ['clean'], function () {

});

gulp.task('server', ['markdown'], function () {

});

gulp.task('default', ['server']);
```


## Step 3: Clean Task

The `clean` task will use `del` to cleanup the `server` directory.

Install `del`:
```shell
npm install del --save-dev
```

Require dependencies:

```javascript
const del = require('del');
```

Implement the `clean` task:

```javascript
gulp.task('clean', function () {
  return del('server/**/*');
});
```


## Step 4: Markdown Task

The `markdown` task will use `gulp-markdown-to-json` and `gulp-util` to create
the JSON files.

Install `gulp-markdown-to-json` and `gulp-util `:

```shell
npm install gulp-markdown-to-json --save-dev
npm install gulp-util --save-dev
```

Require dependencies:

```javascript
const markdown = require('gulp-markdown-to-json');
const gutil = require('gulp-util');
```

Implement the `markdown` task:

```javascript
gulp.task('markdown', ['clean'], function () {
  return gulp.src('content/entries/**/*.md')
    .pipe(gutil.buffer())
    .pipe(markdown('entries.json'))
    .pipe(gulp.dest('server'));
});
```


## Step 5: Server Task

The `server` task will use `gulp-json-transform` to post-process the JSON file.
The JSON object will be converted into an array and the ID in the file name will
be written into the content object.

Install `gulp-json-transform`:

```shell
npm install gulp-json-transform --save-dev
```

Require dependencies:

```javascript
const jsonTransform = require('gulp-json-transform');
```

Implement the `server` task:

```javascript
gulp.task('server', ['markdown'], function () {
  return gulp.src('server/**/*.json')
    .pipe(jsonTransform(object => Object.keys(object).map(key => {
      object[key].id = parseInt(key);
      return object[key];
    })))
    .pipe(gulp.dest('server'));
});
```


## Step 6: Result

The result is a JSON file with an array of of content entries.

`server/entries.json`:

```json
[{
  "title": "Some Entry",
  "body": "<p>Some Content</p>\n",
  "id": 1
}, {
  "title": "Some Entry",
  "body": "<p>Some Content</p>\n",
  "id": 2
}, {
  "title": "Some Entry",
  "body": "<p>Some Content</p>\n",
  "id": 3
}]
```
