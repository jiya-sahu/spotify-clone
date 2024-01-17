// global varibles
let currsong = new Audio();
let songs;
let play = document.querySelector(".songbtns .playsvg");
let i =0;
let cnt = [0,1,2,3,4,5];

function convertToMinuteSecond(durationInSeconds) {
  // Ensure the input is a valid number
  if (isNaN(durationInSeconds) || durationInSeconds < 0) {
    return "Invalid input";
  }

  // Calculate minutes and seconds
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  // Format the result
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return formattedTime;
}

async function getsongs() {
 
  let response = await fetch(`http://127.0.0.1:5500/songs/`);
  let data = await response.text();
  let div = document.createElement("div");
  div.innerHTML = data;
  let as = div.getElementsByTagName("a");
  console.log(as);
  let song = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    {
      if (element.href.endsWith(".mp3")) {
        song.push(element.href.split(`/songs/`)[1]);
      }
    }
  }
  return song;
}
getsongs();

//playmusic function
const playmusic = (track) => {
  currsong.src = "/songs/" + track + ".mp3";

  currsong.play();
  play.src = "img/paused.svg";

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
  document.querySelector(".inputrange").style.opacity = 1;
};



async function main() {
  songs = await getsongs("/songs/");
  let songsul = document
    .querySelector(".songslist")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songsul.innerHTML =
      songsul.innerHTML +
      `<li>
    <div>
    <i class="ri-music-2-fill"></i>
    <span>
    ${song.replaceAll("%20", " ").replaceAll(".mp3", "")}</span></div>
    <div class="playtxt">
    Play now
    <img src="img/play.svg" alt="" class="invert">
    </div>
    </li>`;
  }
  Array.from(
    document.querySelector(".songslist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      console.log(e.querySelector("div").lastElementChild.innerHTML);
      playmusic(e.querySelector("div").lastElementChild.innerHTML.trim());
    });
  });
  play.addEventListener("click", () => {
    if (currsong.paused) {
      currsong.play();
      play.src = "img/paused.svg";
    } else {
      currsong.pause();
      play.src = "img/play.svg";
    }
  });
  //setting  time and duration
  currsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${convertToMinuteSecond(
      currsong.currentTime
    )}/
    ${convertToMinuteSecond(currsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currsong.currentTime / currsong.duration) * 100 + "%";
  });

  //adding functionality to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currsong.currentTime = (currsong.duration * percent) / 100;
  });
  //adding functionality to previous btn
  document
    .querySelector(".songbtns #previous")
    .addEventListener("click", () => {
      let strt = currsong.src.split("/songs/")[1];
      let index = songs.indexOf(strt);

      if (index - 1 >= 0) {
        playmusic(songs[index - 1].replaceAll("%20", " ").split(".mp3")[0]);
      } else if (index - 1 < 0) {
        playmusic(
          songs[songs.length - 1].replaceAll("%20", " ").split(".mp3")[0]
        );
      }
    });
  //adding functionality to next btn
  document.querySelector(".songbtns #next").addEventListener("click", () => {
    let strt = currsong.src.split("/songs/")[1];
    let index = songs.indexOf(strt);

    if (index + 1 < songs.length) {
      playmusic(songs[index + 1].replaceAll("%20", " ").split(".mp3")[0]);
    } else if (index + 1 === songs.length) {
      playmusic(songs[0].replaceAll("%20", " ").split(".mp3")[0]);
    }
  });
  //making volume input
  document
    .querySelector(".inputrange")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currsong.volume = parseInt(e.target.value) / 100;
    });

    //loading playlist when clicked
     Array.from(document.getElementsByClassName("card")).forEach(e=>{
     console.log(e);
   
     e.addEventListener("click",async item=>{
      songs = await getsongs("/songs/");
      if (i<songs.length ) {
        playmusic(songs[i].replaceAll("%20", " ").split(".mp3")[0]);
      }
      else{
        i=0;
      }
      i= i+1;
    })
   })
   document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.display = "block";
    document.querySelector(".right").style.width = "85vw";
    document.querySelector(".playbar").style.width = "70vw";
    document.querySelector(".playbar").style.height = "45px";
   })
}
main();
