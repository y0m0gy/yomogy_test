import {
  createCanvas,
  loadImage,
  registerFont,
  CanvasRenderingContext2D,
} from "canvas";
import fs from "fs";

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split("");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

export async function createImage() {
  // ベースとなる画像を読み込む
  const baseImage = await loadImage("public/basic.png");

  // フォントを登録する
  registerFont("src/styles/MPLUSRounded1c-Bold.ttf", {
    family: "M PLUS Rounded 1c",
  });

  // canvasを作成
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  // ベースの画像を描画する
  ctx.drawImage(baseImage, 0, 0);

  // テキストを追加する
  ctx.font = "64px M PLUS Rounded 1c"; // フォントのサイズとファミリーを適宜調整
  wrapText(
    ctx,
    "これはテストです.これはテストです.これはテストです.これはテストです.これはテストです.これはテストです.",
    70,
    120,
    canvas.width - 100,
    64
  );
  // テキストの位置を適宜調整

  // 別の画像を読み込む
  const overlayImage = await loadImage("public/images/authors/y0m0gy.png");

  // ベースの画像に別の画像を追加する
  ctx.drawImage(overlayImage, 70, 350); // 画像の位置を適宜調整

  // 画像を保存する
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("public/ogp-y0m0gy.png", buffer);
}

createImage();
