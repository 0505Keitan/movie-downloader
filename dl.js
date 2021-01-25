const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const os = require("os");

const args = process.argv;
if(!args[2]){
  console.log(
  `Usage: node dl.js [OPTIONS...] arg

  OPTIONS:
      -h, --help      このヘルプを表示
      -d, --download  YouTubeのリンクから動画をダウンロード args=YouTubeリンク
      -c, --convert   mp4をmp3に args=mp4ファイルパス

  Example: node dl.js -d https://youtu.be/xxxxxxx`
  );
  return false
}
if(args[2] === '-d' || args[2] === '--download'){
  if(!args[3]){ console.log('\nError: リンクを指定してください。'); return}
  if(!args[3].match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm)){ console.log('ytを指定してください。'); return}
  console.log('downloading...')
  ytdl.getBasicInfo(args[3]).then(info => {
    if(os.platform() == 'linux'){
      ytdl(args[3]).pipe(fs.createWriteStream(`/home/${os.userInfo().username}/${info.player_response.videoDetails.title.replace(/\//g, ' - ')}.mp4`));
    }else if(os.platform() == 'darwin'){
      ytdl(args[3]).pipe(fs.createWriteStream(`/Users/${os.userInfo().username}/Downloads/${info.player_response.videoDetails.title.replace(/\//g, ' - ')}.mp4`));
    }
    console.log('download success');
  });
}else if(args[2] === '-c' || args[2] === '--convert'){
  if(!args[3]){ console.log('\nError: ファイルパスを指定してください。'); return}
  console.log('converting...')
  exec(`ffmpeg -vn -sn -dn -i '${args[3]}' -codec:a libmp3lame -qscale:a 4 '${path.dirname(args[3])}/${path.basename(args[3], path.extname(args[3]))}.mp3'`, (err, stdout, stderr) => {
    if(err){
      console.log(err);
    }else{
      console.log('convert success');
    }
  });
}else if(args[2] === '-h' || args[2] === '--help'){
  console.log(
    `Usage: node dl.js [OPTIONS...] arg

    OPTIONS:
        -h, --help      このヘルプを表示
        -d, --download  YouTubeのリンクから動画をダウンロード args=YouTubeリンク
        -c, --convert   mp4をmp3に args=mp4ファイルパス

    Example: node dl.js -d https://youtu.be/xxxxxxx`
  );
}else{
  console.log(`Error: OPTIONが指定されていません。\n詳しくはhelpを`);
}