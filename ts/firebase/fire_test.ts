// Copyright 2020 Volker Sorge
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Test handling in front-end and firebase.
 *
 * @author volker.sorge@gmail.com (Volker Sorge)
 */

import {JsonTest, JsonTests} from '../base/test_util';
import * as FC from './fire_constants';
import * as FU from './fire_util';

export class FireTest {

  private countTests = 0;
  private preparedTests: JsonTest[] = [];
  public tests: JsonTests;
  public order: string[];
  private _data: JsonTests;


  constructor(public db: any, public collection: string, public doc: string,
              public getTest: () => JsonTest,
              public setTest: (test: JsonTest) => void) {
  }

  public getData() {
    return this._data;
  }

  /**
   * @return The currently active test.
   */
  public currentTest() {
    return this.preparedTests[this.countTests];
  }

  // This should probably be specialised in a subclass;
  public async prepareTests() {
    this._data = await FU.downloadData(this.db, this.collection, this.doc);
    this.order = this._data.order as string[];
    this.tests = this._data.tests as JsonTests;
    for (let key of this.order) {
      let test = this.tests[key];
      test.brf = '';
      test.unicode = '';
      this.preparedTests.push(test);
    }
  }

  protected nextTest(direction: boolean) {
    this.countTests = this.countTests + (direction ? 1 : -1);
    if (this.countTests < 0) {
      this.countTests = this.preparedTests.length - 1;
    }
    if (this.countTests >= this.preparedTests.length) {
      this.countTests = 0;
    }
    return this.currentTest();
  }

  protected jumpTest(direction: boolean, stop: (x: FC.Status) => boolean) {
    let currentCount = this.countTests;
    let test;
    do {
      test = this.nextTest(direction);
    } while (!stop(test[FC.Interaction]) && this.countTests !== currentCount);
    return currentCount !== this.countTests ? test : this.nextTest(direction);
  }

  // Where should that go?
  public async saveTest(values: JsonTest) {
    let test = this.currentTest();
    let status = null;
    for (let key of Object.keys(values)) {
      if (test[key] !== values[key]) {
        status = FC.Status.CHANGED;
      }
      test[key] = values[key];
    }
    if (status === FC.Status.CHANGED) {
      // Save;
      test[FC.Interaction] = status;
    }
    if (!status && !test[FC.Interaction]) {
      test[FC.Interaction] = FC.Status.VIEWED;
    }
  }

  /**
   * The next test in the cycle.
   * @param {boolean} direction Forward if true.
   */
  public async cycleTests(direction: boolean) {
    await this.saveTest(this.getTest());
    this.setTest(this.nextTest(direction));
  }

  /**
   * Cycle to next test the user has not changeds.
   * @param {boolean} direction Forward if true.
   */
  public async cycleUnchangedTests(direction: boolean) {
    // TODO: Add functionality.
    await this.saveTest(this.getTest());
    this.setTest(this.jumpTest(direction,
                               (x: FC.Status) => x !== FC.Status.CHANGED));
  }

  /**
   * Cycle to next test the user has not seen yet.
   * @param {boolean} direction Forward if true.
   */
  public async cycleNewTests(direction: boolean) {
    // TODO: Add functionality.
    await this.saveTest(this.getTest());
    this.setTest(this.jumpTest(direction,
                               (x: FC.Status) => x === FC.Status.NEW));
  }

}
