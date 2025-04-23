module.exports = {
  usePorcupine: () => {
    return {
      keywordDetection: null,
      isLoaded: false,
      isListening: false,
      error: null,
      init: () => {},
      start: () => {},
      stop: () => {},
      release: () => {}
    }
  }
}
