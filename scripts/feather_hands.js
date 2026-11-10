const cp = require('child_process');
const ffmpeg = require('ffmpeg-static');

// Crop the exact original image:
// Human: crop=520:582:0:100.
// Let's create an alpha gradient on the left 80px using geq filter:
cp.spawnSync(ffmpeg, [
  '-y',
  '-i', 'C:/Users/agnas/.gemini/antigravity/brain/2fc3b641-f292-4a8f-9f1e-24ff2d412b93/.user_uploaded/media_1794201347741_86cac48e.jpg',
  '-vf', 'crop=520:582:0:100,colorkey=0xf6f8f9:0.12:0.10,colorkey=0xffffff:0.10:0.10,format=rgba,geq=r=\'r(X,Y)\':g=\'g(X,Y)\':b=\'b(X,Y)\':a=\'if(lt(X,80), a(X,Y)*(X/80), a(X,Y))\'',
  'public/assets/hand_human_clean.png'
]);

// Robot X-ray:
cp.spawnSync(ffmpeg, [
  '-y',
  '-i', 'public/assets/hand_robot_xray.png',
  '-vf', 'format=rgba,geq=r=\'r(X,Y)\':g=\'g(X,Y)\':b=\'b(X,Y)\':a=\'if(gt(X,W-80), a(X,Y)*((W-X)/80), a(X,Y))\'',
  'public/assets/hand_robot_xray_faded.png'
]);

cp.spawnSync(ffmpeg, [
  '-y',
  '-i', 'public/assets/hand_robot_xray_faded.png',
  'public/assets/hand_robot_xray.png'
]);

console.log('Feathered wrist edges successfully!');

