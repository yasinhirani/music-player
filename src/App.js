import React, { useEffect, useRef, useState } from 'react';
import {app, storage} from './Firebase';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import './App.css';
import Spotify from "./assets/spotify.png";

function App() {

  const [songUrl, setSongUrl] = useState("");
  const [songList, setSongList] = useState([]);
  const [songName, setSongName] = useState("Laal Dupatta - Mujhse Shaadi Karogi");
  const [playing, setPlaying] = useState(false);
  const music = document.getElementById('audio');
  const list = [...songList];
  const [progressValue, setProgressValue] = useState(0);
  const [loadSong, setLoadSong] = useState(true);
  const isMount = useRef(false);

  const getData = (e) => {
    getDownloadURL(ref(storage, `${e}.mp3`))
    .then((url) => {
      setSongUrl(url);
      // console.log(url);
      setLoadSong(false);
    })
  };

  const getSongs = () => {
    listAll(ref(storage)).then((list) => {
      setSongList(list.items);
      // console.log(list.items);
    })
  }

  useEffect(() => {
    getData(songName);
  }, [songName]);

  useEffect(() => {
    if (isMount.current) {
      if (!loadSong) {
        playSong();
      }
    }
    else{
      isMount.current = true;
    }
  }, [loadSong]);

  useEffect(() => {
    getSongs();
  }, []);

  const handleChange = (e) => {
    setSongName(e);
    pauseSong();
    music.currentTime = 0;
    // console.log(e);
    setLoadSong(true);
  }

  const playSong = () => {
    setPlaying(true);
    music.play();
  }
  const pauseSong = () => {
    setPlaying(false);
    music.pause();
  }

  const handleSong = () => {
    playing ? pauseSong() : playSong();
  }

  const nextSong = (e) => {
    // console.log(e);
    e.map((list, id) => {
      if ((list._location.path_).replace('.mp3', '') === songName) {
        // console.log(id);
        setSongName((e[id+1]._location.path_).replace('.mp3', ''));
        pauseSong();
        music.currentTime = 0;
        // console.log(songName);
        setLoadSong(true);
      }
    });
  }
  const prevSong = (e) => {
    // console.log(e);
    e.map((list, id) => {
      if ((list._location.path_).replace('.mp3', '') === songName) {
        // console.log(id);
        setSongName((e[id-1]._location.path_).replace('.mp3', ''));
        pauseSong();
        music.currentTime = 0;
        // console.log(songName);
        setLoadSong(true);
      }
    });
  }

  const timeUpdate = (e) => {
    // console.log(e);
    const {currentTime, duration} = e.target;
    // console.log(currentTime, duration);
    const progress = Math.floor((currentTime / duration) * 100);
    setProgressValue(progress);
  }

  const skipSong = (e) => {
    // console.log(e);
    const {duration} = music;
    let skipMusic = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
    // console.log(skipMusic);
    music.currentTime = skipMusic;
  }

  document.addEventListener('keydown', (e) => {
    // console.log(e);
    if (e.keyCode === 32) {
      handleSong();
    }
  })

  

  // console.log(storage);

  return (
    <div className="App w-full h-full flex flex-col overflow-hidden">
      <header className='bg-gray-900 p-5 border-b border-white flex items-center gap-4'>
        <figure className='w-8'>
          <img src={Spotify}></img>
        </figure>
          <h1 className='font-semibold text-green-500 text-2xl'>Spotify</h1>
      </header>
      <audio id='audio' src={songUrl} onTimeUpdate={timeUpdate} onEnded={() => nextSong(list)}></audio>
      <ul className='flex-grow bg-gray-900 overflow-y-auto'>
        {/* <li onClick={() => handleChange('file_example')}>file_example</li> */}
        {songList.map((song_name, id) => {
          return(
            <li className='py-4 px-5 border-b border-green-800 lg:hover:bg-gray-800 text-gray-400 cursor-pointer' key={id} onClick={() => handleChange((song_name._location.path_).replace('.mp3', ''))}>{song_name._location.path_}</li>
          )
        })}
      </ul>
      <div className='player border-t border-white p-5 bg-gray-900 text-white flex flex-col sm:flex-row gap-6 sm:gap-16 items-center'>
        <h1>{songName}</h1>
        <div className='controls flex items-center flex-col-reverse sm:flex-row gap-8'>
          <div className='flex items-center gap-10'>
            <span className='fa fa-step-backward cursor-pointer' onClick={() => prevSong(list)} title='previous'></span>
            {
              loadSong ? (<span className='loader'></span>) : 
              (<span id='play-pause' className={playing ? "fa fa-pause cursor-pointer" : "fa fa-play cursor-pointer"} onClick={() => handleSong()} title="play/pause"></span>)
            }
            <span className='fa fa-step-forward cursor-pointer' onClick={() => nextSong(list)} title='next'></span>
          </div>
          <progress className='cursor-pointer h-2' value={progressValue} max="100" onClick={skipSong} />
        </div>
      </div>
    </div>
  );
}

export default App;
