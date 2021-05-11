const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
    songs: [
        {
          name: 'Hoa Hải Đường',
          singer: 'Jack',
          path: './music/audio1.mp3',
          image: './img/anh1.jpg'
        },
        {
          name: 'Đom Đóm',
          singer: 'Jack',
          path: './music/audio2.mp3',
          image: './img/anh2.jpg'
        },
        {
          name: 'Hoa Hải Đường',
          singer: 'Jack',
          path: './music/audio1.mp3',
          image: './img/anh1.jpg'
        },
        {
          name: 'Đom Đóm',
          singer: 'Jack',
          path: './music/audio2.mp3',
          image: './img/anh2.jpg'
        },
        {
          name: 'Hoa Hải Đường',
          singer: 'Jack',
          path: './music/audio1.mp3',
          image: './img/anh1.jpg'
        },
        {
          name: 'Đom Đóm',
          singer: 'Jack',
          path: './music/audio2.mp3',
          image: './img/anh2.jpg'
        },
        {
          name: 'Hoa Hải Đường',
          singer: 'Jack',
          path: './music/audio1.mp3',
          image: './img/anh1.jpg'
        },
        {
          name: 'Đom Đóm',
          singer: 'Jack',
          path: './music/audio2.mp3',
          image: './img/anh2.jpg'
        },
        {
          name: 'Hoa Hải Đường',
          singer: 'Jack',
          path: './music/audio1.mp3',
          image: './img/anh1.jpg'
        },
        {
          name: 'Đom Đóm',
          singer: 'Jack',
          path: './music/audio2.mp3',
          image: './img/anh2.jpg'
        }
    ],
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
              <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
              <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
              </div>
              <div class="option">
                <i class="fas fa-ellipsis-h"></i>
              </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function(){
      Object.defineProperty(this, 'currentSong', {
        get: function() {
          return this.songs[this.currentIndex]
        }
      })
    },
    handleEvents: function(){
      const _this = this
      const cdWidth = cd.offsetWidth

      // Xử lý CD quay / dừng
      const cdThumbAnimate = cdThumb.animate([
        { transform: 'rotate(360deg)'}
      ], {
        duration: 10000,
        iterations: Infinity
      })
      cdThumbAnimate.pause()

      // Xử lý phòng to / thu nhỏ CD
      document.onscroll = function (){
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const newCdWidth = cdWidth - scrollTop
        
        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
        cd.style.opacity = newCdWidth / cdWidth
      }

      // Xử lý khi click play
      playBtn.onclick = function() {
        if(_this.isPlaying){
          audio.pause()
        } else {
          audio.play()
        }
      }
      //Khi song đc play
      audio.onplay = function() {
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
      }
      //Khi song đc pause
      audio.onpause = function() {
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
      }

      //Khi tiến độ bài hát thay đổi
      audio.ontimeupdate = function(){
        if (audio.duration) {
          const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
          progress.value = progressPercent
        }
      }

      // Xử lý khi tua song
      progress.onchange = function (e) {
        const seekTime = audio.duration / 100 * e.target.value
        audio.currentTime = seekTime
      }

      // Khi next song
      nextBtn.onclick = function() {
        if (_this.isRandom) {
          _this.playRandomSong()
        } else {
          _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }
      prevBtn.onclick = function() {
        if (_this.isRandom) {
          _this.playRandomSong()
        } else {
          _this.prevSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }
      
      // Xử lý bật tắt random song
      randomBtn.onclick = function(e){
        _this.isRandom = !_this.isRandom
        randomBtn.classList.toggle('active', _this.isRandom)
      }
      
      // Xử lý lặp lại một song
      repeatBtn.onclick = function() {
        _this.isRepeat = !_this.isRepeat
        repeatBtn.classList.toggle('active', _this.isRepeat)
      }
      
      // Xử lý next song khi audio ended
      audio.onended = function () {
        if (_this.isRepeat){
          audio.play()
        } else {
          nextBtn.click()
        }
      }

      // lắng nghe hành vi click vào playlist
      playlist.onclick = function(e){
        const songNode = e.target.closest('.song:not(.active)')
        if (songNode || e.target.closest('.option')) {
          if (songNode) {
            _this.currentIndex = Number(songNode.dataset.index)
            _this.loadCurrentSong()
            _this.render()
            audio.play()
          }
        }
      }
    },
    scrollToActiveSong: function () {
      setTimeout(() => {
        $('.song.active').scrollIntoView({
          bahavior: 'smooth',
          block: 'nearest'
        })
      }, 300)
    },
    loadCurrentSong: function() {

      heading.textContent = this.currentSong.name
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path

    },
    nextSong: function(){
      this.currentIndex++
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
      }
      this.loadCurrentSong()
    },
    prevSong: function(){
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1
      }
      this.loadCurrentSong()
    },
    playRandomSong: function(){
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * this.songs.length)
      } while (newIndex === this.currentIndex)
      this.currentIndex = newIndex
      this.loadCurrentSong()
    },
    start: function() {
      // Định nghĩa các thuộc tính cho object
      this.defineProperties()

      //Lắng nghe/ xử lý các sự kiện (DOM events)
      this.handleEvents()

      //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
      this.loadCurrentSong()
      
      //Render playlist
      this.render()
    }
}
app.start()