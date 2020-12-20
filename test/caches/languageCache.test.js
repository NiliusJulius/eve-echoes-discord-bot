const languageCache = require('../../src/caches/languageCache');

const language1 = 'en';
const language2 = 'test';

const message1Key = 'testkey';
const language1Message1 = 'test';
const language2Message1 = 'testerino';

const message2Key = 'testkey2';
const language1Message2 = 'test{{0}}';
const language2Message2 = 'testerino{{0}}';

const testMessages = new Map();

const english = new Map();
english.set(message1Key, language1Message1);
english.set(message2Key, language1Message2);

const testLanguage = new Map();
testLanguage.set(message1Key, language2Message1);
testLanguage.set(message2Key, language2Message2);

testMessages.set(language1, english);
testMessages.set(language2, testLanguage);

describe('Test getting messages', () => {

  beforeAll(() => {
    languageCache.modifyMessages(testMessages);
  });

  test('should return message in English', () => {
    expect(languageCache.getMessage(message1Key)).toBe(language1Message1);
    expect(languageCache.getMessage(message1Key, language1)).toBe(language1Message1);
  });

  test('should return message in test language', () => {
    expect(languageCache.getMessage(message1Key, language2)).toBe(language2Message1);
  });

  test('should return message with replaced placeholder', () => {
    const replacement = 'uno';
    expect(languageCache.getMessage(message2Key, undefined, [replacement])).toBe(language1Message1 + replacement);
  });

  test('should return message with placeholder not replaced', () => {
    const replacements = [];
    replacements[1] = 'test';
    expect(languageCache.getMessage(message2Key, undefined, replacements)).toBe(language1Message2);
  });

});