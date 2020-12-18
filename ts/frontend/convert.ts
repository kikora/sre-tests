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
 * @fileoverview Front-end methods for conversion.
 *
 * @author volker.sorge@gmail.com (Volker Sorge)
 */

import {JsonTest} from '../base/test_util';
import * as FC from '../firebase/fire_constants';
import {FireTest} from '../firebase/fire_test';
import * as BT  from '../generate/braille_transformer';
import {init as initButtons} from './buttons';

let transformers: Map<string, BT.BrailleTransformer> = new Map<string, BT.BrailleTransformer>([
  ['NABT', new BT.Nabt2Unicode()],
  ['BLDT', new BT.Bldt2Unicode()],
  ['SDF/JKL', new BT.Ascii2Braille('', '')],
  ['1-6', new BT.Numeric2Braille('', '')]
]);

let backtransformers: Map<string, BT.BrailleTransformer> = new Map<string, BT.BrailleTransformer>([
  ['NABT', new BT.Unicode2Nabt()],
  ['BLDT', new BT.Unicode2Bldt()],
  ['SDF/JKL', new BT.Braille2Ascii('', '')],
  ['1-6', new BT.Braille2Numeric('', '')]
]);

let kind = 'NABT';

function transformer() {
  return transformers.get(kind.toUpperCase());
}

function backtransformer() {
  return backtransformers.get(kind.toUpperCase());
}

let field: {[name: string]: Element} = {};
export let fireTest: FireTest = null;
let current: string = '';

declare const MathJax: any;
declare const firebase: any;

/**
 * Method for setting the test into HTML elements.
 * @param {JsonTest} test The test.
 */
function setTest(test: JsonTest) {
  field.name.innerHTML = test.name;
  field.expression.innerHTML = test.input ?
    `<math display="block">${test.input}</math>` : `\\[${test.tex}\\]`;
  field.out.innerHTML = test.expected as string;
  // TODO: Transform here, depending on the transformation value;
  (field.ip as HTMLTextAreaElement).value =
    backtransformer().via(test.expected as string);
  (field.ip as HTMLTextAreaElement).focus();
  setStatus(test[FC.Interaction]);
  setFeedback(test[FC.FeedbackStatus]);
  if (MathJax.typeset) {
    MathJax.typeset();
  }
}

function setFeedback(feedback: FC.Feedback) {
  if (feedback !== undefined) {
    (field.feedback as HTMLButtonElement).value = feedback.toString();
  }
}

function setStatus(status: FC.Status) {
  if (status !== undefined) {
    switch (status) {
      case FC.Status.NEW:
        field.statuscolor.className = 'green';
        field.statusvalue.innerHTML = 'New';
        break;
      case FC.Status.VIEWED:
        field.statuscolor.className = 'yellow';
        field.statusvalue.innerHTML = 'Viewed';
        break;
      case FC.Status.CHANGED:
        field.statuscolor.className = 'red';
        field.statusvalue.innerHTML = 'Changed';
        break;
      default:
        field.statuscolor.className = '';
        field.statusvalue.innerHTML = '';
    }
  }
}

/**
 * Method for getting tests from HTML elements.
 * @return The test fields that are harvested from the HTML.
 */
function getTest(): JsonTest {
  return {expected: field.out.innerHTML};
}

// TODO: Work with localStorage!
export function init(collection: string, file: string) {
  if (firebase) {
    initFile(collection, file);
    return;
  }
  setTimeout(init, 100);
}

async function initFile(collection: string, file: string) {
  // TODO: Sort this out properly!
  const db = firebase.app().firestore();
  fireTest = new FireTest(db, collection, file, getTest, setTest);
  await fireTest.prepareTests();
  field.ip = document.getElementById('input');
  field.out = document.getElementById('braille');
  field.error = document.getElementById('error');
  field.format = document.getElementById('format');
  field.expression = document.getElementById('mathexpression');
  field.name = document.getElementById('mathname');
  field.statuscolor = document.getElementById('statuscolor');
  field.statusvalue = document.getElementById('statusvalue');
  field.feedback = document.getElementById('feedback');
  fireTest.setTest(fireTest.currentTest());
  initButtons(fireTest);
}

function translate(str: string) {
  let [input, error] = transformer().cleanInput(str);
  return [input, transformer().via(input), error];
}

/**
 * Generates with keyboard interaction.
 */
export function generate() {
  let ip = field.ip as HTMLTextAreaElement;
  if (current === ip.value) {
    return;
  }
  if (kind.toUpperCase() === 'SDF/JKL') {
    collateKeys();
  }
  processKeys();
}

let collating = false;
function collateKeys() {
  if (collating) {
    return;
  }
  collating = true;
  setTimeout(() => {
    collating = false;
    processKeys();
    let ip = field.ip as HTMLTextAreaElement;
    if (ip.value[ip.value.length - 1] !== ',') {
      ip.value = ip.value + ',';
    }
  }, 100);
}

function processKeys() {
  let ip = field.ip as HTMLTextAreaElement;
  let cursor = ip.selectionStart;
  // let length = ip.value.length;
  field.out.innerHTML = '';
  field.error.innerHTML = '';
  let [input, output, error] = translate(ip.value);
  if (error) {
    field.error.innerHTML = 'Unknown ' +
      (error.length > 1 ? 'elements ' : 'element ') + error;
  }
  // Change status to changed
  if (input !== current) {
    setStatus(FC.Status.CHANGED);
  }
  ip.value = input;
  current = input;
  field.out.innerHTML = output;
  ip.selectionEnd = cursor - error.length;
}

/**
 * Generates with mouse interaction (e.g., copying).
 */
export function generatem() {
  setTimeout(generate, 100);
}

/**
 * Changes the brf format.
 */
export function changeFormat() {
  fireTest.saveTest(fireTest.getTest());
  kind = (field.format as HTMLButtonElement).value;
  fireTest.setTest(fireTest.currentTest());
}

/**
 * Changes the feedback entry.
 */
export function changeFeedback() {
  let value = parseInt((field.feedback as HTMLButtonElement).value, 10);
  fireTest.currentTest()[FC.FeedbackStatus] = value;
  fireTest.saveFeedback(value);
}
