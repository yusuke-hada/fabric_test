// shapes.js

import { fabric } from 'fabric';

export function createRect() {
  return new fabric.Rect({
    left: 10,
    top: 10,
    width: 100,
    height: 60,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2,
    objectCaching: false,
  });
}

export function createDashedRect() {
  return new fabric.Rect({
    left: 200,
    top: 10,
    width: 100,
    height: 60,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2,
    strokeDashArray: [5, 5], // 点線を指定
    objectCaching: false,
  });
}

export function createSolidEllipse() {
  return new fabric.Ellipse({
    left: 10,
    top: 100,
    rx: 50,
    ry: 30,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2,
    objectCaching: false,
  });
}

export function createDashedEllipse() {
  return new fabric.Ellipse({
    left: 200,
    top: 100,
    rx: 50,
    ry: 30,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 2,
    strokeDashArray: [5, 5], // 点線を指定
    objectCaching: false,
  });
}