import html2canvas from "html2canvas";
import { Displayer } from "white-web-sdk";

export default class SnapshotToolImplement {

    /**
     * 初始化截图类
     * 
     * @param displayer 实时房间 Room 实例/回放房间 Player 实例
     * @param type 转换图片格式
     * @param quality 转换压缩质量
     */
    public constructor(private readonly displayer: Displayer, private readonly type?: string, private readonly quality?: number) {}

    /**
     * 将特定的场景预览内容转成 Base64 图片
     * 
     * @param scenePath 场景路径（场景目录+场景名）
     * @param width 宽
     * @param height 高
     */
    public async previewBase64(scenePath: string, width: number, height: number): Promise<string> {
        const div = this.createShadowDiv(width, height);
        const canvas = await this.divPreviewCanvas(scenePath, div);
        document.body.removeChild(div);
        return canvas.toDataURL(this.type, this.quality);
    }

    /**
     * 将特定的场景预览内容转成 Blob。https://mdn.io/toBlob
     * 
     * @param div 进行渲染的 div
     * @param scenePath 需要进行截图的场景路径，可选
     */
    public async previewBlob(scenePath: string, width: number, height: number): Promise<Blob> {
        const div = this.createShadowDiv(width, height);
        const canvas = await this.divPreviewCanvas(scenePath, div);
        document.body.removeChild(div);
        return await this.canvasToImage(canvas);
    }

    /**
     * 
     * 创建一个符合宽高的div，承载预览场景
     * 
     * @param width 宽
     * @param height 高
     */
    private createShadowDiv(width: number, height: number): HTMLDivElement {
        const div = document.createElement("div");
        div.style.width = width + "px";
        div.style.height = height + "px";
        div.style.position = "fixed";
        div.style.backgroundColor = "white";
        div.style.top = "100%";
        div.style.left = "100%";
        div.style.zIndex = "-1";
        document.body.appendChild(div);
        return div;
    }

    /**
     * 将特定场景的预览内容，渲染到指定 div 上，然后返回 canvas 截图
     * 
     * @param scenePath 场景路径（场景目录+场景名）
     * @param div 用来渲染场景的 div
     */
    public async divPreviewCanvas(scenePath: string, div: HTMLElement): Promise<HTMLCanvasElement> {
        this.displayer.scenePreview(scenePath, div, div.clientWidth, div.clientHeight);
        return await this.div2canvas(div);
    }

    /**
     * 将 div 的内容绘制成 canvas
     * 
     * @param div canvas 截图的目标 div
     */
    private async div2canvas(div: HTMLElement): Promise<HTMLCanvasElement> {
        return html2canvas(div, {useCORS: true, onclone: function(doc: Document): void {
            Array.from(div.getElementsByTagName("svg")).forEach(s => {
                // https://github.com/eKoopmans/html2pdf.js/issues/185
                // https://github.com/niklasvh/html2canvas/issues/1578
                console.log("svg ", s.clientWidth, s.clientHeight);
                s.setAttribute("width", `${s.clientWidth}`);
                s.setAttribute("height", `${s.clientHeight}`);
            });
        }});
    }

    /**
     * 将 canvas 转换为 Blob 对象 
     * 
     * @param canvas 
     * @param type 
     * @param quality 
     */
    private async canvasToImage(canvas: HTMLCanvasElement): Promise<Blob> {
        return new Promise<Blob>((resolve) => {
            canvas.toBlob(blob => {
                resolve(blob);
            }, this.type, this.quality);
        })
    }
}