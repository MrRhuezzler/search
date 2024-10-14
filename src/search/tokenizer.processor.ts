import * as natural from 'natural';

const analyze = (text: string): string[] => {
  let tokens = tokenize(text);
  tokens = lowercaseFilter(tokens);
  tokens = stopwordFilter(tokens);
  tokens = stemmerFilter(tokens);
  return tokens;
};

export const analyzeWithoutStemming = (text: string): string[] => {
  let tokens = tokenize(text);
  tokens = lowercaseFilter(tokens);
  tokens = stopwordFilter(tokens);
  return tokens;
};

const tokenize = (text: string): string[] => {
  // const tokenizer = new natural.WordTokenizer();
  // return tokenizer.tokenize(text);
  return text.split(/[^a-zA-Z0-9]+/).filter(Boolean);
};

const lowercaseFilter = (tokens: string[]): string[] => {
  return tokens.map((token) => token.toLowerCase());
};

const stopwordFilter = (tokens: string[]): string[] => {
  const stopwords = new Set([
    'a',
    'and',
    'be',
    'have',
    'i',
    'in',
    'of',
    'that',
    'the',
    'to',
    'it',
    'for',
    'not',
    'on',
    'with',
    'as',
    'you',
    'do',
    'at',
    'this',
    'but',
    'his',
    'by',
    'from',
    'they',
    'we',
    'say',
    'her',
    'she',
    'or',
    'an',
    'will',
    'my',
    'one',
    'all',
    'www',
    'com',
    'org',
    'net',
    'io',
    'https',
    'http',
    'html',
    'php',
    'asp',
    'co',
  ]);
  return tokens.filter((token) => !stopwords.has(token));
};

const stemmerFilter = (tokens: string[]): string[] => {
  return tokens.map((token) => stem(token));
};

const stem = (token: string): string => {
  const stemmer = natural.PorterStemmer;
  return stemmer.stem(token);
};

export default analyze;
