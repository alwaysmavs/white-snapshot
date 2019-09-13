## Introduction
white-web-sdk 预览截图插件，通过 html2canvas 将 white-web-sdk 中特定场景的内容，转换成图片。

## QuickStart

```typescript 
import WhiteSnapshot from "@netless/white-snapshot";
const snapshot = new WhiteSnapshot(room);
const base64 = snapshot.preivewBase64("/init", 600, 400);
document.body.querySelector("init-img").src = base64;
```

## API

```typescript
/**
 * 将特定的场景预览内容转成 Base64 图片
 *
 * @param scenePath 场景路径（场景目录+场景名）
 * @param width 宽
 * @param height 高
 */
previewBase64(scenePath: string, width: number, height: number): Promise<string>;

/**
 * 将特定的场景预览内容转成 Blob。https://mdn.io/toBlob
 *
 * @param div 进行渲染的 div
 * @param scenePath 需要进行截图的场景路径，可选
 */
previewBlob(scenePath: string, width: number, height: number): Promise<Blob>;
```