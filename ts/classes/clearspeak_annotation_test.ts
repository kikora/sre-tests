//
// Copyright 2017 Volker Sorge
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

// With support from the Mozilla Foundation under a MOSS grant.

/**
 * @file Test simple annotations for Clearspeak.
 * @author Volker.Sorge@gmail.com (Volker Sorge)
 */

import { annotators } from '../../speech-rule-engine/js/semantic_tree/semantic_annotations';
import * as Semantic from '../../speech-rule-engine/js/semantic_tree/semantic';

import { AbstractJsonTest } from './abstract_test';

export class ClearspeakAnnotationTest extends AbstractJsonTest {
  /**
   * @override
   */
  public information = 'Clearspeak Simple Expression tests.';

  /**
   * The clearspeak annotator to test.
   */
  public annotator: any = annotators.get('clearspeak:simple');

  /**
   * Tests simple annotator for Clearspeak.
   *
   * @param mml Snippet of a MathML expression.
   * @param expected The expression is simple or not.
   */
  public executeTest(mml: string, expected: boolean) {
    const mathMl =
      '<math xmlns="http://www.w3.org/1998/Math/MathML">' + mml + '</math>';
    const semantic = Semantic.getTreeFromString(mathMl);
    this.annotator.annotate(semantic.root);
    this.assert.equal(
      semantic.root.hasAnnotation('clearspeak', 'simple'),
      expected
    );
  }

  /**
   * @override
   */
  public method() {
    this.executeTest(this.field('input'), this.field('expected'));
  }
}
