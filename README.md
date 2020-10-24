# Tests for Speech Rule Engine

This is a separate repository for maintaining and running tests for [Speech Rule Engine](https://speechruleengine.org).

The majority of tests is available in a JSON format.

## JSON format

``` json
{
  "factory": "Mandatory",
  "information": "Optional but recommended",
  "name": "Optional, necessary for analytics only",
  "base": "Optional filename",
  "active": "Optional filename for test output",
  "exclude": [],
  "_commentX_": "Optional",
  ... other test class specific entries
  "tests": "ALL" |
    {
    "test1": {
        "test": true|false,
        "input": "Optional",
        "expected": "Mandatory test output"
        ... other test specific fields
        }
    ... More uniquely named tests
    }
}
```

### Class Fields

| Field         | Required    | Usage                                                              |
| -----         | ----        | :-------                                                           |
| `factory`     | Mandatory   | Specifies the test class factory entry that is used for this test. |
| `information` | Recommended | Information on the test used as description for JEST testsuites.   |
|               |             | See below for description conventions                              |
| `name`        | Optional    | Name of the testsuite. This is necessary for analytics only,       |
|               |             | Analytics files are use this name as prefix and only tests         |
|               |             | that contain a `name` field will be compiled for analytics.        |
|               |             | Consequently, names should be unique. See below for conventions.   |
| `base`        | Optional    | Filename of the input file if this is _input test_.                |
|               |             | This is either an absolute path or relative to the input folder.   |
| `active`      | Optional    | Target filename for tests that produce output.                     |
|               |             | It is used to compile output tests and does not have to be unique. |
|               |             | This is either an absolute path or relative to the ouptut folder.  |
| `exclude`     | Optional    | List of tests to be excluded. Useful if loading from `base` files. |
| `tests`       | Mandatory   | `"ALL"` or Association list of named tests.                        |
|               |             | In case of an _input test_ `"ALL"` specifies that all tests from   |
|               |             | the base file should be run for the given test class.              |
| `...`         | Optional    | Other fields needed to intialise the test class.                   |



### Test Fields

| Field      | Required  | Usage                                                           |
| -----      | ----      | :-------                                                        |
| `test`     | Optional  | Boolean specifying if the test should be run. Default is `true` |
| `input`    | Mandatory | Input for the tests.                                            |
| `expected` | Optional  | The expected output. Can be omitted, for example, in the case   |
|            |           | of tests that compare output for two methods.                   |
| `...`      | Optional  | Other fields that are needed to run a test.                     |


### Input vs Expected only tests

We distinguish _input tests_ and _expected only tests_. The latter contain all
the information for the test in the single JSON object, while the former load
input information from a common `base` file, generally given in the `input`
directory.

The structure of `base` files is similar to the `expected` files. `expected`
files can suppress running of certain tests using the `excluded` field.  Fields
from the expected file overwrite those of the input file.

The non-JEST test runner outputs warnings in case input tests have no expected
value and are not explicitly excluded.

### Names

* `name`: Names are used as prefixes for output in the analytics module. As the
  output structure is flat, they should be unique. For speech rule tests they
  should be of the form `${Locale}${Domain}${Type}` and camel cased.
* `information` entries of speech rule tests are of a similar form: `"${Locale}
  ${Domain} ${Description}"`
* Names and information entries of other tests follow a similar pattern,
 starting with the description of the common aspect moving to the more specialised one. E.g.,


## Running Tests via Jest

``` shell
npm run prepare
```
will build all the necessary files for the tests, both for the Jest and Make.

``` shell
npm run test
```
runs tests separately without producing output. So there are no interactions between single test suites.

``` shell
npm run test-output
```
runs output producing tests only. Combines tests that share common output files into a single suite.

``` shell
npm run test-all
```
runs first singleton tests and then output producing tests.

``` shell
npm run clean
```
Removes all files generated by transpiling and testing.

### Running locales or subsets of tests

``` shell
npx jest --testPathPattern js/json/de/
```
will run German locale only.

``` shell
npx jest --testPathPattern js/json/de/clearspeak js/json/base
```
will run Clearspeak German tests and base tests.

## Running Tests via Make

Run with
``` shell
make test (ENV=n)
```

`ENV` are optional environment parameters.






## Directory structure

### Basic structure

    ├── expected  JSON files with expected output of tests
    ├── input     JSON files with input of tests
    ├── output    Output files generated by tests (mainly HTML files)
    └── ts       Source files for tests

### Source directory structure

    └── ts
        ├── base     Common files used by test classes.
        ├── classes  Classes for tests that take input and expected from JSON files.
        └── tests    Test Classes that run tests via test functions.

### Components of the Input directory

    └── input
        ├── base        Basic tests for components of the engine.
        ├── clearspeak  Speech tests for clearspeak rules.
        ├── common      Speech tests for common use (e.g., fonts, units)
        ├── mathspeak   Speech tests for mathspeak rules.
        └── nemeth      Speech tests for (Nemeth) Braille.


### Components of the Expected directory

    └── expected
        ├── base        Expected values for basic tests.
        ├── locale_1    Expected values for speech tests of locale_1.
        │               ....
        └── locale_n    Expected values for speech tests of locale_n.


### Conent of Expected directories by locales

    └── expected
        └── locale
            ├── clearspeak  Expected values for clearspeak tests
            ├── mathspeak   Expected values for mathspeak tests.
            ├── others      Expected values for all other speech rule tests (e.g., prefix, summary)
            └── symbols     Expected values for symbol tests (character, function, unit)
        │   ...
        └── nemeth
            ├── rules       Expected values for nemeth rules
            └── symbols     Expected values for symbol tests (character, function, unit)


### Components of the Output directory


    └── expected
        │               Potentially other files (with various extensions).
        │               ....
        ├── locale_1    HTML output for speech tests of locale_1.
        │               ....
        └── locale_n    HTML output for speech tests of locale_n.

## Current structure

    ├── expected
    │   ├── base
    │   ├── de
    │   │   ├── clearspeak
    │   │   ├── mathspeak
    │   │   ├── others
    │   │   └── symbols
    │   ├── en
    │   │   ├── clearspeak
    │   │   ├── mathspeak
    │   │   ├── others
    │   │   └── symbols
    │   ├── es
    │   │   ├── mathspeak
    │   │   ├── others
    │   │   └── symbols
    │   ├── fr
    │   │   ├── clearspeak
    │   │   ├── mathspeak
    │   │   ├── others
    │   │   └── symbols
    │   └── nemeth
    │       ├── rules
    │       └── symbols
    ├── input
    │   ├── base
    │   ├── clearspeak
    │   ├── common
    │   ├── mathspeak
    │   └── nemeth
    ├── output
    │   ├── de
    │   ├── en
    │   │   ├── sheets
    │   │   └── symbols
    │   ├── es
    │   │   └── symbols
    │   ├── fr
    │   │   ├── functions
    │   │   ├── sheets
    │   │   ├── symbols
    │   │   └── units
    │   └── nemeth
    │       ├── functions
    │       ├── sheets
    │       ├── symbols
    │       └── units
    └── ts
        ├── base
        ├── classes
        └── tests




# Analytics
