const fs = require('fs');
const path = require('path');

let messages;

/* istanbul ignore next */
function readLanguages() {
  // Create a new map to store the messages
  messages = new Map();
  // Read all language files.
  const LanguageFiles = fs.readdirSync(path.resolve('./resources/languages/')).filter(file => file.endsWith('.json'));
  for (const file of LanguageFiles) {
    const lang = file.replace(/\.[^/.]+$/, '');
    const jsonObject = JSON.parse(fs.readFileSync(`./resources/languages/${file}`));
    const jsonMap = new Map();

    for (const k of Object.keys(jsonObject)) {
      jsonMap.set(k, jsonObject[k]);
    }

    messages.set(lang, jsonMap);
  }
}

function stringTemplateParser(expression, values) {
  const templateMatcher = /\{\{\s?([^{}\s]*)\s?\}\}/g;
  const text = expression.replace(templateMatcher, (substring, value, index) => {
    const replacement = values[value];
    return replacement == undefined ? substring : replacement;
  });
  return text;
}

function getMessage(messageKey, language = 'en', values = []) {

  if (values.length === 0) {
    return messages.get(language).get(messageKey);
  }

  return stringTemplateParser(messages.get(language).get(messageKey), values);
}
exports.getMessage = getMessage;

function modifyMessages(newMessages) {
  messages = newMessages;
}
exports.modifyMessages = modifyMessages;

readLanguages();