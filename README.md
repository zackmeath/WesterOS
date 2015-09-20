# WesterOS - A Browser-based Operating System in TypeScript

This is the Operating Systems class project.
See http://www.labouseur.com/courses/os/ for details.

# TypeScript

**What's TypeScript?**
TypeScript is a language that allows you to write in a statically-typed language that outputs standard JavaScript.
It's all kinds of awesome.

**Why should I use it?**
This will be especially helpful for an OS or a Compiler that may need to run in the browser as you will have all of the great benefits of type checking built right into your language.

**Where can I get more info on TypeScript**
[Right this way!](http://www.typescriptlang.org/)

### Setup

1. Install the [npm](https://www.npmjs.org/) package manager if you don't already have it.
2. Run `npm install -g typescript` to get the TypeScript Compiler. (You may need to do this as root.)

# Gulp

Gulp will automatically:

- Watch for changes in your source/scripts/ directory for changes to .ts files and run the TypeScript Compiler on them.
- Watch for changes to your source/styles/ directory for changes to .css files and copy them to the distrib/ folder if you have them there.

**Where can I get more info on Gulp?**
[Right this way!](http://gulpjs.com/)

### Setup

1. `npm install gulp` to get the Gulp Task Runner.
2. `npm install gulp-tsc` to get the Gulp TypeScript plugin.

Run `gulp` at the command line in the root directory of this project.
Edit your TypeScript files in the source/scripts directory in your favorite editor.

