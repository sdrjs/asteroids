class Table {
    constructor({
        x, // number
        y, // number
        width, // number
        height, // number
        content, // matrix of strings or callback functions which accept centerX and centerY cell rendering cords
        state, // string - rendering state
        
        /* optional parameters */
        templateColumns, // array of numbers - each number devided by sum of all numbers sets column width
        color, // string - text color
        fontFamily, // string
        fontSize, // number - font size in px
    }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.content = content;
        this.state = state;

        this.setTemplateColumns(templateColumns);
        this.color = color ?? '#000';
        this.fontFamily = fontFamily ?? 'sans-serif';
        this.fontSize = fontSize ?? 16;
        this.font = `${this.fontSize}px ${this.fontFamily}`;

        this.setCords();
        this.initComponents();
    }

    setTemplateColumns(template) {
        if (template) {
            while (template.length < this.content[0].length) {
                template.push(1);
            }

            this.templateColumns = template;
        } else {
            this.templateColumns = Array(this.content[0].length).fill(1);
        }
    }

    setCords() {
        const columnsFractions = this.templateColumns.reduce((acc, cur) => acc + cur, 0);
        const cellWidths = this.templateColumns.map(fraction => Math.round(fraction / columnsFractions * this.width));
        const cellHeights = Array(this.content.length).fill(1).map((fraction, idx, array) => Math.round(fraction / array.length * this.height));

        const centerCords = [];

        let cellY = this.y;
        for (let i = 0; i < cellHeights.length; i++) {
            const rowCords = [];
            const cellHeight = cellHeights[i];
            
            let cellX = this.x;
            for (let j = 0; j < cellWidths.length; j++) {
                const cellWidth = cellWidths[j];

                const x = cellX + cellWidth / 2;
                const y = cellY + cellHeight / 2;

                rowCords.push({ x, y });
                cellX += cellWidth;
            }

            centerCords.push(rowCords);
            cellY += cellHeight;
        }

        this.centerCords = centerCords;
    }

    initComponents() {
        for (let i = 0; i < this.content.length; i++) {
            for (let j = 0; j < this.content[0].length; j++) {
                const cell = this.content[i][j];

                if (cell.type !== 'component') continue;

                const x = this.centerCords[i][j].x;
                const y = this.centerCords[i][j].y;

                const btn = cell.value(x, y);
                btn.show();

                cell.render = () => btn.render();
            }
        }
    }

    render() {
        ctx.save();

        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < this.content.length; i++) {
            for (let j = 0; j < this.content[0].length; j++) {
                const cell = this.content[i][j];
                if (cell.type === 'component') {
                    cell.render();
                    continue;
                }

                const x = this.centerCords[i][j].x;
                const y = this.centerCords[i][j].y;

                const text = typeof cell === 'function' ? cell(x, y) : cell;
                ctx.fillText(text, x, y);
            }
        }

        ctx.restore();
    }
}