export function fillText(ctx: CanvasRenderingContext2D,
                         fontSize: number,
                         fillStyle: string,
                         text: string,
                         x: number,
                         y: number) {
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = fillStyle;
    ctx.fillText(text, x, y);
}
