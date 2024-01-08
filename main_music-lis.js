/**
 * 2. Scroll top ->  OK
 * 3. Play / pause / seek ->  OK
 * 4. CD rotate ->  OK
 * 5. Next / Prev ->  OK
 * 6. Ranbom ->  OK
 * 7. Next / Repeat when ended
 * 8. Active Song
 * 9. Scroll activve song into view
 * 10. play song when click 
 */



    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    const PLAYER_STORAGE_KEY = "F8_PLAYER"

    const player = $(".player");
    const cd = $(".cd");
    const heading = $("header p");
    const cdThumb = $(".cd_thumb");
    const audio = $("#audio");
    const playBtn = $(".btn_toggle-play");
    const progress = $("#progress");
    const prevBtn = $(".btn_prev"); 
    const nextBtn = $(".btn_next");
    const randomBtn = $(".btn_random");
    const repeatBtn = $(".btn_repeat");
    const playlist = $(".playlist");



    const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        songs: [
            {
                name: "Nothin' on me",
                singer: "Leah Marie Perez",
                path: "./Asset/Music/NothinOnMe.mp3",
                image: "./Asset/img/nothin_Music.jpg" 
            },
            {
                name: "Xích Thêm Chút",
                singer: "MCK ft. TLinh",
                path: "./Asset/Music/XichThemChut.mp3",
                image: "./Asset/img/XichThemChut.jpg"
            },
            {
                name: "Sang Xịn Mịn",
                singer: "Gill",
                path: "./Asset/Music/SangXinMin.mp3",
                image: "./Asset/img/SangXinMin.jpg"
            },
            {
                name: "Em Thích",
                singer: "Sean",
                path: "./Asset/Music/EmThich.mp3",
                image: "./Asset/img/EmThich.jpg"
            },
            {
                name: "Tại vì Sao",
                singer: "RPT MCK",
                path: "./Asset/Music/TaiViSao.mp3",
                image: "./Asset/img/TaiViSao.jpg"
            },
            {
                name: "Nếu lúc đó",
                singer: "TLinh",
                path: "./Asset/Music/NeuLucDo.mp3",
                image: "./Asset/img/NeuLucDo.jpg"
            },
            {
                name: "NGTANOISE",
                singer: "Vsoul",
                path: "./Asset/Music/Ngtanoise.mp3",
                image: "./Asset/img/Ngtanoise.jpg"
            }
        ],

        setConfig: function(key, value) {
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
        },

        defineProperties() {
            Object.defineProperty(this, "currentSong", {
                get() {
                    return this.songs[this.currentIndex];
                }
            })

        },

        // 1. Render HTML
        render() {
            const htmls = this.songs.map((song, index) => {
                return `
                    <div class="song ${index === this.currentIndex ? "active" : ""} 
                        data-index="${index}">

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
                `;
            });
            playlist.innerHTML = htmls.join('');
        },

        defineProperties: function() {
            Object.defineProperty(this, 'currentSong', {
                get: function() {
                    return this.songs[this.currentIndex];
                }
            })

            Object.defineProperty(this, 'config', {
                get: function() {
                    return this.con
                }
            })
        },

        // 2. Hàm xử lý các sự kiện 
        handleEvents() {
            const _this = this;
            const cdWidth = cd.offsetWidth;

            // chỉnh kích thước audio 
            document.onscroll = function () {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const newCdWidth = cdWidth  - scrollTop;

                cd.style.width = newCdWidth > 0 ?  newCdWidth + "px" : 0;
                cd.style.opacity = newCdWidth / cdWidth;
            }

            // Quay Picture Song
            const cdTumbAnimate = cdThumb.animate([
                {
                    transform : 'rotate(360deg)'
                }], {
                    duration: 10000, //10s
                    iterations: Infinity
                })
            cdTumbAnimate.pause();

            // Play Audio
            playBtn.onclick = function () {
                if (_this.isPlaying) {
                    audio.pause()
                } else {
                    audio.play()
                }
            }

            audio.onplay = function () {
                _this.isPlaying = true
                player.classList.add("playing")
                cdTumbAnimate.play()
            },
            audio.onpause = function () {
                _this.isPlaying = false
                player.classList.remove("playing")
                cdTumbAnimate.pause()
            }

            // Khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function() {
                if(audio.duration) {
                    const progressPercent = (audio.currentTime / audio.duration*100)
                    progress.value = progressPercent
                }
            }

            // Tua Song
            progress.onchange = function(e) {
                const seekTime = audio.duration / 100 *e.target.value
                audio.currentTime = seekTime
            }

            // Next Song
            nextBtn.onclick = function() {
                if(_this.isRandom){
                    _this.playRandomSong();
                } else{
                    _this.nextSong();
                }

                audio.play()
                _this.render()
                _this.scrollActiveSong()
            }

            prevBtn.onclick = function() {
                if(_this.isRandom) {
                    _this.playRandomSong();
                } else {
                    _this.prevSong();
                }

                audio.play()
                _this.render()
                _this.scrollActiveSong()
            }

            // Xử lý khi chọn Random Song
            randomBtn.onclick = function(e) {
                _this.isRandom = !_this.isRandom

                randomBtn.classList.toggle('active', _this.isRandom)
                // _this.playRandomSong()
            }

            // xu ly lap lai song
            repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat
                repeatBtn.classList.toggle('active', _this.isRepeat)

            }

            audio.onended = function() {
                if (_this.isRepeat){
                    audio.play();
                }else{
                    nextBtn.click()
                }
            }

            playlist.onclick = function(e) {
                const songNode = e.target.closest('.song:not(".active")')
                
                if(songNode || e.target.closest('.option')) {
                    if (songNode) {
                        _this.currentIndex = (songNode.dataset.index)
                        _this.loadCurrentSong()
                        _this.render()
                        audio.play()
                    }

                    if(e.target.closest('.option')) {

                    }
                }
            }
            
        },

        scrollActiveSong() {
            setTimeout(() => {
                $('.song.active .data-index').scrollIntoView(
                    {
                        behavior: 'smooth',
                        block: 'nearest'
                    }
                )
            }, 100)
        },

        loadCurrentSong() {
            heading.textContent = this.currentSong.name
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
            audio.src = this.currentSong.path
        },

        loadConfig: function() {
            this.isRandom = this.config.isRandom
            this.isRepeat = this.config.isRepeat
        },

        nextSong() {
            this.currentIndex++
            if(this.currentIndex >= this.songs.length){
                this.currentIndex = 0
            }
            this.loadCurrentSong();
        },

        prevSong() {
            this.currentIndex--
            if(this.currentIndex < 0){
                this.currentIndex = this.songs.length -1
            }
            this.loadCurrentSong();
        },

        playRandomSong() {
            let newIndex
            do{
                newIndex = Math.floor(Math.random() * this.songs.length)
            } while (newIndex === this.currentIndex)
            this.currentIndex = newIndex
            this.loadCurrentSong();
        },



        start: function() {

            this.conf

            // định nghĩa các thuộc tính cho object 
            this.defineProperties();


            // Lắng nghe / xử lý các sự kiện (DOM events)
            this.handleEvents();

            // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
            this.loadCurrentSong();

            // this.nextSong();

            // Render playlist
            this.render();

            randomBtn.classList.toggle('active', _this.isRandom)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
    };

app.start();
