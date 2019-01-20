import { PixelOffsetPipe } from './pixel-offset/pixel-offset.pipe';
import { RadiansToDegreesPipe } from './radians-to-degrees/radians-to-degrees.pipe';

// For angular parse usage
export default [
  {pipeName: 'pixelOffset', pipeInstance: new PixelOffsetPipe()},
  {pipeName: 'radiansToDegrees', pipeInstance: new RadiansToDegreesPipe()},
];
