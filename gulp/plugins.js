// Small gulp transforms built on maintained libraries
// (replacing gulp-concat, gulp-minify, gulp-clean-css and gulp-pug).
const { Transform } = require('node:stream');
const path = require('node:path');
const Vinyl = require('vinyl');
const pugLib = require('pug');
const { minify: terser } = require('terser');
const postcss = require('postcss');
const cssnano = require('cssnano');

function transform(fn) {
  return new Transform({
    objectMode: true,
    transform(file, _enc, cb) {
      if (file.isNull()) return cb(null, file);
      Promise.resolve(fn.call(this, file)).then(() => cb(), cb);
    },
  });
}

// Concatenates all files into one, in stream order.
function concat(name) {
  const parts = [];
  let base;
  return new Transform({
    objectMode: true,
    transform(file, _enc, cb) {
      if (!file.isNull()) { parts.push(file.contents); base = base || file; }
      cb();
    },
    flush(cb) {
      if (base) {
        this.push(new Vinyl({ cwd: base.cwd, base: base.base, path: path.join(base.base, name), contents: Buffer.concat(parts.flatMap((p, i) => (i ? [Buffer.from('\n'), p] : [p]))) }));
      }
      cb();
    },
  });
}

// Emits the original file plus a "-min.js" minified copy (gulp-minify behaviour).
function minifyJs() {
  return transform(async function (file) {
    this.push(file);
    const result = await terser(String(file.contents));
    const min = file.clone();
    min.extname = '';
    min.basename = `${file.stem}-min.js`;
    min.contents = Buffer.from(result.code);
    this.push(min);
  });
}

function minifyCss() {
  return transform(async function (file) {
    const result = await postcss([cssnano()]).process(String(file.contents), { from: file.path });
    file.contents = Buffer.from(result.css);
    this.push(file);
  });
}

function pug() {
  return transform(function (file) {
    file.contents = Buffer.from(pugLib.render(String(file.contents), { filename: file.path }));
    file.extname = '.html';
    this.push(file);
  });
}

module.exports = { concat, minifyJs, minifyCss, pug };
