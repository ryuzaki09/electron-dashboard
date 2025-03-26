export class MediaRecorderAPI {
  recorder: MediaRecorder | null = null
  audioChunks: Blob[] = []
  stream: MediaStream | null = null

  async start() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      //Feature is not supported in browser
      //return a custom error
      return Promise.reject(
        new Error(
          'mediaDevices API or getUserMedia method is not supported in this browser.'
        )
      )
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { noiseSuppression: true, echoCancellation: true }
    })
    this.recorder = new MediaRecorder(this.stream)

    this.recorder.addEventListener('dataavailable', (event) => {
      this.audioChunks.push(event.data)
    })

    this.recorder.start()
  }

  async stop() {
    return new Promise((resolve) => {
      // const mimType = this.recorder?.mimeType
      this.recorder?.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' })
        resolve(audioBlob)
      })

      this.audioChunks = []
      this.stopStream()
      this.resetRecordingProps()
    })
  }

  stopStream() {
    console.log('stopping stream')
    this.stream?.getTracks().forEach((track) => track.stop())
  }

  resetRecordingProps() {
    console.log('resetting')
    this.recorder = null
    this.stream = null
  }

  get mediaStream() {
    console.log('this stream: ', this.stream)
    return this.stream
  }
}
