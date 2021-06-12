//
// Copyright (c) 2021 Volker Sorge
//
//
// Copyright (c) 2021 The MathJax Consortium
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
 * @fileoverview Testcases for number words.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Locale} from '../../../speech-rule-engine-tots/js/l10n/messages';

import {SpeechTest} from './speech_test';


export class NumberTest extends SpeechTest {

  protected num: number = 1;

  private kind: string = 'numberToWords';

  /**
   * @override
   */
  public method(...args: string[]) {
    this.num = args[0] === undefined ? 0 : parseInt(args[0], 10);
    this.executeTest(args[0], args[1], args[2]);
  }

  /**
   * @override
   */
  public prepare() {
    super.prepare();
    this.kind = this.jsonTests.kind || this.kind;
  }
  
  /**
   * @override
   */
  public getSpeech(_mml: string) {
    return (Locale.NUMBERS as any)[this.kind](this.num);
  }
  
}
