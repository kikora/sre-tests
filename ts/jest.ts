import {get} from './classes/test_factory';

/**
 * Runs tests for a json file.
 * @param file The filename.
 */
export function runJsonTest(file: string) {
  let testcases = get(file);
  if (!testcases) {
    return;
  }
  testcases.prepare();
  describe(
    testcases.information,
    () => {
      // This ensures clean testing even for multiple calls.
      beforeAll(() => {
        testcases.setUpTest();
      });
      afterAll(() => {
        testcases.tearDownTest();
      });
      for (let testcase of testcases.inputTests) {
        if (!testcase.test) {
          continue;
        }
        test(testcase.name, () => {
          testcases.method.bind(testcases).
            apply(null, testcases.pick(testcase));
        });
      }
    });
}
