const cp = require('child_process');
const ffmpeg = require('ffmpeg-static');

const timestamps = ['00:00:01', '00:00:03', '00:00:05', '00:00:07', '00:00:09'];
timestamps.forEach((ts, idx) => {
  cp.spawnSync(ffmpeg, [
    '-y',
    '-ss', ts,
    '-i', 'C:/Users/agnas/.gemini/antigravity/brain/2fc3b641-f292-4a8f-9f1e-24ff2d412b93/.user_uploaded/media_1794204396722_b4b26f4e.mp4',
    '-vframes', '1',
    '-q:v', '2',
    'C:/Users/agnas/.gemini/antigravity/brain/2fc3b641-f292-4a8f-9f1e-24ff2d412b93/.user_uploaded/video_hand_frame_' + idx + '.jpg'
  ]);
});
console.log('Frames extracted!');

