class Button {
    visible = false;

    constructor({
        x, // number
        y, // number
        width, // number
        height, // number

        /* optional parameters */
        radius, // number
        align, // string - key word or two key words in any order, separated by a space: 'center' | 'left' | 'right' | 'top' | 'bottom'
        backgroundColor, // string
        linearGradient, // [string, string] - color on the left and color on the right
        color, // string - text color
        fontFamily, // string
        fontSize, // number - font size in px
        text, // string - button inscription
        padding, // number - minimum gap between the border of the button and the text
        onClick, // function - callback
    }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius ?? 0;
        
        this.align(align);

        this.linearGradient = linearGradient;
        this.setBackgroundColor(backgroundColor);
        this.color = color ?? '#000';

        this.setFont({ fontFamily, fontSize, text, padding });

        this.onClick = onClick;

        this.handleClick = this.handleClick.bind(this);
        this.pointerMove = this.pointerMove.bind(this);
    }

    show() {
        this.visible = true;

        canvas.addEventListener('click', this.handleClick);
        canvas.addEventListener('pointermove', this.pointerMove);
    }

    hide() {
        this.visible = false;

        canvas.removeEventListener('click', this.handleClick);
        canvas.removeEventListener('pointermove', this.pointerMove);
    }

    align(value) {
        let alignX = 'right';
        let alignY = 'bottom';

        if (value) {
            const horAlignValues = ['left', 'center', 'right'];
            const vertAlignValues = ['top', 'center', 'bottom'];

            let horAlignSettled = false;
            let vertAlignSettled = false;

            const alignValues = value.split(' ').sort((a, b) => {
                if (b === 'center') return -1;

                return 1;
            });

            if (alignValues.length === 1) alignValues.push('center');
            
            alignValues.forEach(value => {
                if (!horAlignValues.includes(value) && !vertAlignValues.includes(value)) {
                    throw new TypeError(`unknown parameter: ${value}`);
                }

                if (horAlignValues.includes(value) && !horAlignSettled) {
                    alignX = value;
                    horAlignSettled = true;
                }
                
                if (vertAlignValues.includes(value) && !vertAlignSettled) {
                    alignY = value;
                    vertAlignSettled = true;
                } 
            });
        }

        this.centerX = this.x + this.width / 2;
        this.centerY = this.y + this.height / 2;

        if (alignX === 'center') {
            this.centerX -= this.width / 2;
        } else if (alignX === 'left') {
            this.centerX -= this.width;
        }

        if (alignY === 'center') {
            this.centerY -= this.height / 2;
        } else if (alignY === 'top') {
            this.centerY -= this.height;
        }

        if (this.linearGradient) this.setBackgroundColor();
    }

    setBackgroundColor(color) {
        if (this.linearGradient) {
            const { x } = this.getCurrentCords();

            const gradient = ctx.createLinearGradient(x, 0, x + this.width, 0);
    
            gradient.addColorStop(0, this.linearGradient[0]);
            gradient.addColorStop(1, this.linearGradient[1]);
    
            this.backgroundColor = gradient;
        } else if (color) {
            this.backgroundColor = color;
        } else {
            this.backgroundColor = 'transparent';
        }
    }

    setFont({ fontFamily, fontSize, text, padding }) {
        this.fontFamily = fontFamily ?? 'sans-serif';
        this.fontSize = fontSize ?? 16;
        this.text = text ?? this.constructor.name;
        this.padding = padding ?? 0;

        const getFont = () => `${this.fontSize}px ${this.fontFamily}`;

        const availableWidth = this.width - this.padding * 2;
        ctx.font = getFont();
        const textWidth = ctx.measureText(this.text).width;

        if (textWidth > availableWidth) {
            this.fontSize = Math.floor(this.fontSize / (textWidth / availableWidth));
        }

        this.font = getFont();
    }

    handleClick(e) {
        const { x, y } = this.getCurrentCords();

        if (e.offsetX >= x && e.offsetX <= x + this.width && e.offsetY >= y && e.offsetY <= y + this.height) {
            this.onClick?.();
            this._hover = false;
        }
    }

    pointerMove(e) {
        const { x, y } = this.getCurrentCords();

        this._hover = e.offsetX >= x && e.offsetX <= x + this.width && e.offsetY >= y && e.offsetY <= y + this.height;
    }

    getCurrentCords() {
        const x = this.centerX - this.width / 2;
        const y = this.centerY - this.height / 2;

        return { x, y };
    }

    render() {
        if (!this.visible) return;

        ctx.fillStyle = this._hover ? this.color : this.backgroundColor;
        const { x, y } = this.getCurrentCords();
        ctx.fillRoundedRect(x, y, this.width, this.height, this.radius);

        ctx.fillStyle = this._hover ? this.backgroundColor : this.color;
        ctx.font = this.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, this.centerX, this.centerY);
    }
}