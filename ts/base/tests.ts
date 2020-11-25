//
// Copyright 2014 Volker Sorge
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//      http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview The module that initializes and runs the tests.
 * @author volker.sorge@gmail.com (Volker Sorge)
 */

import * as fs from 'fs';
import * as process from 'process';
import {ExampleFiles} from '../classes/abstract_examples';
import * as TestFactory from '../classes/test_factory';
import * as BaseTests from '../tests/base_tests';
import {TestRunner} from './runner';
import {TestPath} from './test_util';
import {sre} from './test_external';

export class Tests {

  /**
   * List of all environment variables that can be set.
   */
  public static environmentVars: string[] = [
    'FILE', 'FILES', 'LOCALE', 'BLOCK', 'JSON', 'VERBOSE', 'WARN', 'NOOUTPUT', 'DEBUG'];

  /**
   * List of all available tests.
   */
  public static allTests: any[] = BaseTests.testList;

  /**
   * List of tests to run. Initially empty.
   */
  public testList: any[] = [];

  /**
   * The instantiated environment variables.
   */
  public environment: {[key: string]: number | boolean | string[]} = {
    JSON: true,
    DEBUG: false,
    VERBOSE: 2,
    WARN: 1
  };

  /**
   * The test runner of this test instance.
   */
  public runner: TestRunner = new TestRunner();

  /**
   * Load all json files from the expected directory
   * @return A list of all json file path names.
   */
  public static allJson(): string[] {
    let json: string[] = [];
    Tests.readDir_('', json);
    return json;
  }

  /**
   * Recursively find all files with .json extension under the given path.
   * @param path The top pathname.
   * @param result Accumulator for pathnames.
   */
  private static readDir_(path: string, result: string[]) {
    if (typeof path === 'undefined') {
      return;
    }
    let file = TestPath.EXPECTED + path;
    if (fs.lstatSync(file).isDirectory()) {
      let files = fs.readdirSync(file);
      files.forEach(
        x => Tests.readDir_(path ? path + '/' + x : x, result));
      return;
    }
    if (path.match(/\.json$/)) {
      result.push(path);
    }
  }

  /**
   * Filters the file list wrt. to the string list of an environment variable.
   * @param files The files list.
   * @param filter The filtering list of strings from an env variable.
   * @param start The start of the filtering regular expression.
   * @param end The end of the filtering regular expression. The idea is that a
   * filter is generated as `/start + fil + end/` where `fil \in filter`.
   * @return The filtered list of files.
   */
  private static fileFilter(
    files: string[], filter: string[], start: string, end: string): string[] {
    if (!filter || !filter.length) {
      return files;
    }
    let result: string[] = [];
    for (let fil of filter) {
      result = result.concat(
        files.filter(x => x.match(RegExp(start + fil + end))));
    }
    return result;
  }

  /**
   * @constructor
   */
  constructor() {
    Tests.environmentVars.forEach(x => this.getEnvironment(x));
    let file = this.environment['FILE'] as string[];
    if (file) {
      let names: {[key: string]: Function} = {};
      Tests.allTests.map(x => names[x.name] = x);
      this.testList = file.map((x: string) =>  names[x]);
    }
    let locale = this.environment['LOCALE'] as string[];
    if (locale && locale[0] === 'Base') {
      this.testList = this.testList.concat(BaseTests.testList);
    }
    if (!this.testList.length) {
      this.testList = this.testList.concat(Tests.allTests);
    }
    // This is set via string fields to please the linter!
    this.runner.warn = this.environment['WARN'] as number;
    this.runner.verbose = this.environment['VERBOSE'] as number;

    if (this.environment['JSON']) {
      let files = (
        this.environment['FILES'] || this.getFiles()) as string[];
      for (let key of files) {
        let test = TestFactory.get(key);
        if (test) {
          this.runner.registerTest(test);
        }
      }
    }
  }

  /**
   * Finds and filter the JSON files wrt. locale or category block
   */
  public getFiles(): string[] {
    let files = Tests.allJson() as string[];
    let locale = this.environment['LOCALE'] as string[];
    let block = this.environment['BLOCK'] as string[];
    files = Tests.fileFilter(files, locale, '^', '/');
    files = Tests.fileFilter(files, block, '^(\\w+/(?!\\w+/)|\\w+/', '/\\w+)');
    return files;
  }

  /**
   * Fills the list of environment variables.
   * @param variable The variable name.
   */
  public getEnvironment(variable: string) {
    let env = process.env[variable];
    if (!env) {
      return;
    }
    if (env === 'true' || env === 'false') {
      this.environment[variable] = (JSON.parse(env) as boolean);
      return;
    }
    let num = parseInt(env, 10);
    if (!isNaN(num)) {
      this.environment[variable] = num;
      return;
    }
    this.environment[variable] = env.split(',');
  }

  /**
   * Runs the set of tests.
   */
  public run() {
    ExampleFiles.noOutput = !!this.environment['NOOUTPUT'];
    if (this.environment['DEBUG']) {
      sre.Debugger.getInstance().init();
    }
    let timeIn = (new Date()).getTime();
    for (let i = 0, test; test = this.testList[i]; i++) {
      let obj = new test();
      this.runner.registerTest(obj);
    }
    this.runner.runTests();
    this.runner.summary();
    let timeOut = (new Date()).getTime();
    this.runner.outputLine(0, 'Time for tests: ' + (timeOut - timeIn) + 'ms');
    ExampleFiles.closeFiles();
    process.exit(this.runner.success() ? 0 : 1);
  }

}
