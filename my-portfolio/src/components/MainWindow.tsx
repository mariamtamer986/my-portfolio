'use client';

import { useRef, useLayoutEffect, useState, useCallback } from "react";
import windowSrc from "../assets/mainwindow.png";
import type { Position } from "../types";

const WINDOW_ASSET_WIDTH = 176;
const WINDOW_ASSET_HEIGHT = 135;

export default function MainWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [windowPosition, setWindowPosition] = useState<Position>({ x: 0, y: 0 });
  const [scaleFactor, setScaleFactor] = useState(1);
  const imgWindowRef = useRef<HTMLImageElement | null>(null);

  const drawWindow = useCallback((
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement | null,
    position: Position,
    scale: number
  ) => {
    if (img) {
      ctx.drawImage(
        img,
        0, 0, WINDOW_ASSET_WIDTH, WINDOW_ASSET_HEIGHT,
        position.x,
        position.y,
        WINDOW_ASSET_WIDTH * scale,
        WINDOW_ASSET_HEIGHT * scale
      );
    }
  }, []);

  const updatePositionAndScale = useCallback((canvas: HTMLCanvasElement) => {
    const scaleW = Math.floor(canvas.width / WINDOW_ASSET_WIDTH);
    const scaleH = Math.floor(canvas.height / WINDOW_ASSET_HEIGHT);
    const newScale = Math.max(1, Math.min(scaleW, scaleH));

    const scaledWidth = WINDOW_ASSET_WIDTH * newScale;
    const scaledHeight = WINDOW_ASSET_HEIGHT * newScale;

    const newX = (canvas.width / 2) - (scaledWidth / 2);
    const newY = (canvas.height / 2) - (scaledHeight / 2);
    
    setScaleFactor(newScale);
    setWindowPosition({ x: newX, y: newY });
  }, []);


  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    
    const img = new Image();
    img.src = windowSrc;
    
    img.onload = () => {
        imgWindowRef.current = img;
        updatePositionAndScale(canvas); 
    };

    if (img.complete) {
        imgWindowRef.current = img;
        updatePositionAndScale(canvas);
    }
    
  }, [updatePositionAndScale]);


  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const img = imgWindowRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        updatePositionAndScale(canvas);
    };

    drawWindow(ctx, img, windowPosition, scaleFactor);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    
  }, [windowPosition, scaleFactor, drawWindow, updatePositionAndScale]);

  
  return (
    <canvas
      ref={canvasRef}
      width={typeof window !== 'undefined' ? window.innerWidth : 800} 
      height={typeof window !== 'undefined' ? window.innerHeight : 600}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10,
        width: "100vw",
        height: "100vh",
        imageRendering: "pixelated",
      }}
    />
  );
}