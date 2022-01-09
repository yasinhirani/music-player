import React, { useEffect, useState } from 'react';
import {app, storage} from './Firebase';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import './App.css';
import Spotify from "./assets/spotify.png";

function App() {

  const [songUrl, setSongUrl] = useState("");
  const [songList, setSongList] = useState([]);
  const [songName, setSongName] = useState("Laal Dupatta - Mujhse Shaadi Karogi");
  let isPlaying = false;
  const music = document.getElementById('audio');
  const list = [...songList];

  const getData = (e) => {
    getDownloadURL(ref(storage, `${e}.mp3`))
    .then((url) => {
      setSongUrl(url);
      // console.log(url);
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
    getSongs();
  }, []);

  const handleChange = (e) => {
    setSongName(e);
    pauseSong();
    music.currentTime = 0;
    // console.log(e);
  }

  const playSong = () => {
    isPlaying = true;
    music.play();
    document.querySelector('#play-pause').classList.remove('fa-play');
    document.querySelector('#play-pause').classList.add('fa-pause');
  }
  const pauseSong = () => {
    isPlaying = false;
    music.pause();
    document.querySelector('#play-pause').classList.remove('fa-pause');
    document.querySelector('#play-pause').classList.add('fa-play');
  }

  const handleSong = () => {
    isPlaying ? pauseSong() : playSong();
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
      }
    });
  }

  // console.log(storage);

  return (
    <div className="App w-full h-full flex flex-col overflow-hidden">
      <header className='bg-gray-900 p-5 border-b border-white flex items-center gap-4'>
        <figure className='w-8'>
          <img src={Spotify}></img>
        </figure>
          <h1 className='font-semibold text-green-500 text-2xl'>Spotify</h1>
      </header>
      <audio id='audio' src={songUrl}></audio>
      <ul className='flex-grow bg-gray-900 overflow-y-auto'>
        {/* <li onClick={() => handleChange('file_example')}>file_example</li> */}
        {songList.map((song_name, id) => {
          return(
            <li className='py-4 px-5 border-b border-green-800 hover:bg-gray-800 text-gray-400 cursor-pointer' key={id} onClick={() => handleChange((song_name._location.path_).replace('.mp3', ''))}>{song_name._location.path_}</li>
          )
        })}
      </ul>
      <div className='player border-t border-white p-5 bg-gray-900 text-white flex flex-col sm:flex-row gap-10 sm:gap-16 items-center'>
        <h1>{songName}</h1>
        <div className='controls flex gap-10'>
          <span className='fa fa-step-backward cursor-pointer' onClick={() => prevSong(list)} title='previous'></span>
          <span id='play-pause' className='fa fa-play cursor-pointer' onClick={() => handleSong()} title="play/pause"></span>
          <span className='fa fa-step-forward cursor-pointer' onClick={() => nextSong(list)} title='next'></span>
        </div>
      </div>
    </div>
  );
}

export default App;
