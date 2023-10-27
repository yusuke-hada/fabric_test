const authenticityToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
import { fabric } from 'fabric';

import {
  createRect,
  createDashedRect,
  createSolidEllipse,
  createDashedEllipse,
} from './shape'; // shape.jsから関数をインポート

document.addEventListener('DOMContentLoaded', function () {
  // 外部キャンバス
  var externalCanvas = new fabric.Canvas('externalCanvas', { selection: true });
 
  // フローチャートキャンバス
  var flowchartCanvas = new fabric.Canvas('flowchartCanvas', { selection: false, stopDoubleClickPropagation: true});

  //フローチャートキャンバスの境界線の設定
 // フローチャートキャンバスの境界線の設定
flowchartCanvas.on('object:moving', function(event) {
  var obj = event.target;
  var zoom = flowchartCanvas.getZoom();
  var zoomMin = 0.5; // 最小のズームレベルを設定

  obj.setCoords();

  var bounds;
  if (obj.type === 'group') {
      bounds = obj.getBoundingRect();
  } else if (obj.type === 'textbox' || obj.type === 'i-text') {
      bounds = obj.getBoundingRect();
  } else {
      bounds = {
          left: obj.left,
          top: obj.top,
          width: obj.width * obj.scaleX,
          height: obj.height * obj.scaleY
      };
  }

  var viewportMatrix = flowchartCanvas.viewportTransform;

  // オブジェクトの実際の座標を計算
  var actualLeft = (obj.left - viewportMatrix[4]) / zoom;
  var actualTop = (obj.top - viewportMatrix[5]) / zoom;
  var actualRight = actualLeft + (bounds.width / zoom); // ズームレベルで調整
  var actualBottom = actualTop + (bounds.height / zoom); // ズームレベルで調整

  // キャンバスの境界を計算
  var canvasBoundLeft = 0;
  var canvasBoundTop = 0;
  var canvasBoundRight = flowchartCanvas.width / (zoom < zoomMin ? zoomMin : zoom); // 最小ズームレベルを適用
  var canvasBoundBottom = flowchartCanvas.height / (zoom < zoomMin ? zoomMin : zoom); // 最小ズームレベルを適用

  // 水平方向の境界チェック
  if (actualLeft < canvasBoundLeft) {
      obj.set('left', obj.left + ((canvasBoundLeft * zoom) - obj.left));
  }
  if (actualRight > canvasBoundRight) {
      obj.set('left', obj.left - ((actualRight - canvasBoundRight) * zoom));
  }

  // 垂直方向の境界チェック
  if (actualTop < canvasBoundTop) {
      obj.set('top', obj.top + ((canvasBoundTop * zoom) - obj.top));
  }
  if (actualBottom > canvasBoundBottom) {
      obj.set('top', obj.top - ((actualBottom - canvasBoundBottom) * zoom));
  }

  obj.setCoords();
});




//マウスホイールで拡大・縮小できる
// Zoomの最大・最小値
var zoomMax = 4;
var zoomMin = 0.5;

flowchartCanvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = flowchartCanvas.getZoom();
    zoom *= 0.95 ** delta; // この値を調整することでズームの速度を制御できます。
    if (zoom > zoomMax) {
        zoom = zoomMax;
    }
    if (zoom < zoomMin) {
        zoom = zoomMin;
    }

    flowchartCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
    flowchartCanvas.renderAll();
});


  // 図形を作成
  var rect = createRect();
  var dashedRect = createDashedRect();
  var solidEllipse = createSolidEllipse();
  var dashedEllipse = createDashedEllipse();


  // 図形を外部キャンバスに追加
  externalCanvas.add(rect ,dashedRect, solidEllipse, dashedEllipse);

  // 外部キャンバス内の図形をドラッグ不可に設定
  externalCanvas.forEachObject(function (obj) {
    obj.set({
      selectable: false, // 選択不可に設定
      evented: true,     
      lockMovementX: true, // X軸方向の移動をロック
      lockMovementY: true, // Y軸方向の移動をロック
    });

    obj.on('mousedown', function (options) {
      if (options.target && !options.target.isCloned) {
        var clonedObject = fabric.util.object.clone(options.target);
        clonedObject.set({ 
          left: options.e.clientX,
          top: options.e.clientY,
          selectable: true,
          evented: true,
          lockMovementX: false,
          lockMovementY: false,
          isCloned: true,
        });
        
        flowchartCanvas.add(clonedObject);
        flowchartCanvas.renderAll();

        // ダブルクリック時のイベントを設定
        clonedObject.on('mousedblclick', function (options) {
          var text = new fabric.IText('', {
            fontSize: 14,
            fill: '#333',
            originX: 'center',
            originY: 'center',
            objectCaching: false
          });

          text.set({
            left: clonedObject.left + (clonedObject.width * clonedObject.scaleX / 2),
            top: clonedObject.top + (clonedObject.height * clonedObject.scaleY / 2)
          }); 

          flowchartCanvas.add(text);  // キャンバスにテキストを追加
          text.bringToFront();
          flowchartCanvas.renderAll();

          text.on('text:changed', function() {
            this.dirty = true;
            flowchartCanvas.renderAll();
          });

          setTimeout(function(){
            text.enterEditing();
            text.selectAll();
            flowchartCanvas.renderAll();
            flowchartCanvas.calcOffset();
        }, 100);

          //ESCキーを押してテキスト入力終了
          text.on('keydown', function(e) {
            if (e.keyCode === 27) {  // ESCキー
              text.exitEditing();
              flowchartCanvas.renderAll();
            }
          });

          // テキスト入力が終了したとき
          text.on('editing:entered', function() {
            var objects = group.getObjects();
            flowchartCanvas.remove(group);
            objects.forEach(function (obj) {
                flowchartCanvas.add(obj);
            });
            text.bringToFront();
            });

            text.on('editing:exited', function() {
              var clonedObjectLeft = clonedObject.left;
              var clonedObjectTop = clonedObject.top;
          
              flowchartCanvas.remove(clonedObject);
              flowchartCanvas.remove(text); 
          
              group = new fabric.Group([ clonedObject, text ], {
                  left: clonedObjectLeft,
                  top: clonedObjectTop,
                  originX: 'center',
                  originY: 'center'
              });
              flowchartCanvas.add(group);
              flowchartCanvas.renderAll();
            }); 
            text.on('editing:entered', function() {
              if (group) {
                  var objects = group.getObjects();
                  flowchartCanvas.remove(group);
                  objects.forEach(function (obj) {
                      flowchartCanvas.add(obj);
                  });
                  text.bringToFront();
              }
          });
          
          text.on('editing:exited', function() {
            // オブジェクトの位置を保存
            var clonedObjectPos = {
                left: clonedObject.left,
                top: clonedObject.top
            };
            var textPos = {
                left: text.left,
                top: text.top
            };
        
            // 既存のグループを削除
            if (group) {
                flowchartCanvas.remove(group);
            }
        
            // グループの中心座標を計算
            var groupCenterX = (clonedObjectPos.left + textPos.left) / 2;
            var groupCenterY = (clonedObjectPos.top + textPos.top) / 2;
        
            // 各オブジェクトの位置をグループ内の相対座標に変換
            clonedObject.set({
                left: clonedObjectPos.left - groupCenterX,
                top: clonedObjectPos.top - groupCenterY
            });
            text.set({
                left: textPos.left - groupCenterX,
                top: textPos.top - groupCenterY
            });
        
            // 新しいグループを作成
            group = new fabric.Group([clonedObject, text], {
                left: groupCenterX,
                top: groupCenterY,
                originX: 'center',
                originY: 'center'
            });
        
            flowchartCanvas.add(group);
            flowchartCanvas.renderAll();
        });
        
          var group = new fabric.Group([ clonedObject, text ], {
            left: clonedObject.left,
            top: clonedObject.top,
          });
          
          flowchartCanvas.remove(clonedObject);
          flowchartCanvas.add(group);
          flowchartCanvas.renderAll();
          text.selectAll();
          flowchartCanvas.renderAll();
        });
        document.getElementById('saveButton').addEventListener('click', function () {
          var json = flowchartCanvas.toJSON();
          fetch('/flowcharts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': authenticityToken, // RailsのCSRFトークンを送信
            },
            body: JSON.stringify({ json_data: json }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data.message); // レスポンスメッセージをコンソールに表示
            })
            .catch((error) => {
              console.error('エラーが発生しました:', error);
            });
        }); 
      }
    });
  });

  // 最後の外部キャンバスの描画
  externalCanvas.renderAll();
});


