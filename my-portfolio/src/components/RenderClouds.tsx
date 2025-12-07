'use client';

import { useRef, useLayoutEffect } from "react";
import skySrc from "../assets/cloudspritesheet.png";

export default function RenderClouds() {
  //similar to getElementById, but for react
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {

    const canvas = canvasRef.current!; //the ref value, which holds the canvas element (canvasRef.current returns the actual DOM 
    //element that the ref is pointing to)
    const ctx = canvas.getContext("2d")!; //the context is the object you use to actually draw on the canvas, 
    //and we use the getContext method to get this drawing object, setting it to render 2D context
    ctx.imageSmoothingEnabled = false;

    const img = new Image();
    img.src = skySrc;

    const frameWidth = 320;
    const frameHeight = 180;
    const totalFrames = 20;
    let currentFrame = 0;

    const fps = 6;
    let lastTime = performance.now(); //for a precise timestamp of the exact moment this line of code runs
    //basically, lastTime is for knowing how much time has passed since the last frame was drawn, so we can control the
    //animation speed

    img.onload = () => {
      function animate(time: number) {
        const delta = time - lastTime;

        if (delta > 1000 / fps) {
          currentFrame = (currentFrame + 1) % totalFrames;
          lastTime = time;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
          img,
          currentFrame * frameWidth, //source X
          0,                         //source Y
          frameWidth,                //source width
          frameHeight,               //source height
          0,                         //destination X
          0,                         //destination Y
          canvas.width,              //scale to full screen
          canvas.height              //scale to full screen
        );

        requestAnimationFrame(animate); //used as a callback function to keep the animation looping
      }

      requestAnimationFrame(animate); //used as a callback function when the browser is ready to animate
    };
  }, []); //empty array = run only once after the component mounts

  return (
    <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
        position: "fixed",   //stay behind all content
        top: 0,
        left: 0,
        zIndex: -1,          //behind everything
        width: "100vw",
        height: "100vh",
        imageRendering: "pixelated",
        }}
    />
  );
}
