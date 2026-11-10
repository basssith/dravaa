const cp = require('child_process');
const ffmpeg = require('ffmpeg-static');

// In ffmpeg geq filter, the alpha channel expression function is alpha(X,Y), not a(X,Y).
// Let's create seamless feathered cutouts:
const res1 = cp.spawnSync(ffmpeg, [
  '-y',
  '-i', 'C:/Users/agnas/.gemini/antigravity/brain/2fc3b641-f292-4a8f-9f1e-24ff2d412b93/.user_uploaded/media_1794204845273_c777695e.jpg',
  '-vf', 'crop=440:482:0:200,colorkey=0xf6f8f9:0.12:0.10,colorkey=0xffffff:0.10:0.10,format=rgba,geq=r=\'r(X,Y)\':g=\'g(X,Y)\':b=\'b(X,Y)\':a=\'alpha(X,Y)*if(gt(Y,380),(482-Y)/102,1)*if(lt(X,100),X/100,1)\'',
  'public/assets/hand_human_seamless.png'
]);
if (res1.status !== 0) console.error('res1 err:', res1.stderr.toString());

const res2 = cp.spawnSync(ffmpeg, [
  '-y',
  '-i', 'C:/Users/agnas/.gemini/antigravity/brain/2fc3b641-f292-4a8f-9f1e-24ff2d412b93/.user_uploaded/media_1794204845273_c777695e.jpg',
  '-vf', 'crop=564:540:460:140,colorkey=0xf6f8f9:0.12:0.10,colorkey=0xffffff:0.10:0.10,format=rgba,geq=r=\'r(X,Y)\':g=\'g(X,Y)\':b=\'b(X,Y)\':a=\'alpha(X,Y)*if(gt(Y,440),(540-Y)/100,1)*if(gt(X,464),(564-X)/100,1)\'',
  'public/assets/hand_robot_seamless.png'
]);
if (res2.status !== 0) console.error('res2 err:', res2.stderr.toString());

console.log('Script finished successfully!');
