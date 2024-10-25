CanvasRenderingContext2D.prototype._roundedRect = function(x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;

    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();

    return this;
}

CanvasRenderingContext2D.prototype.fillRoundedRect = function(x, y, width, height, radius) {
    this._roundedRect(x, y, width, height, radius).fill();
}

CanvasRenderingContext2D.prototype.strokeRoundedRect = function(x, y, width, height, radius) {
    this._roundedRect(x, y, width, height, radius).stroke();
}