class Trie {
  constructor() {
    this.root = {};
  }

  insert(word) {
    let node = this.root;
    for (let char of word) {
      if (!node[char]) {
        node[char] = {};
      }
      node = node[char];
    }
    node.isEndOfWord = true;
  }

  search(prefix) {
    let node = this.root;
    for (let char of prefix) {
      if (!node[char]) {
        return []; // No words found for the prefix
      }
      node = node[char];
    }
    return this.collectWords(node, prefix);
  }

  collectWords(node, prefix) {
    let words = [];
    if (node.isEndOfWord) {
      words.push(prefix);
    }
    for (let char in node) {
      if (char !== 'isEndOfWord') {
        words = words.concat(this.collectWords(node[char], prefix + char));
      }
    }
    return words;
  }
}

export default Trie;
