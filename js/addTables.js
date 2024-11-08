'use strict';

function addTables() {
    addUpgradeTable();

    function addUpgradeTable() {
        const upgradeTableContent = [
            ['type', 'level', 'description', 'current', 'new', 'price', 'buy'],
            [upgrades.shield.title, () => `${user.upgrades.shield}/${upgrades.shield.levelsCount}`, upgrades.shield.description, () => upgrades.shield[user.upgrades.shield].value, () => user.upgrades.shield < upgrades.shield.levelsCount ? upgrades.shield[user.upgrades.shield + 1].value : 'MAX', () => user.upgrades.shield < upgrades.shield.levelsCount ? upgrades.shield[user.upgrades.shield + 1].cost : '-', { type: 'component', value: createUpgradeButton('shield') }],
            [upgrades.firesCount.title, () => `${user.upgrades.firesCount}/${upgrades.firesCount.levelsCount}`, upgrades.firesCount.description, () => upgrades.firesCount[user.upgrades.firesCount].value, () => user.upgrades.firesCount < upgrades.firesCount.levelsCount ? upgrades.firesCount[user.upgrades.firesCount + 1].value : 'MAX', () => user.upgrades.firesCount < upgrades.firesCount.levelsCount ? upgrades.firesCount[user.upgrades.firesCount + 1].cost : '-', { type: 'component', value: createUpgradeButton('firesCount') }],
            [upgrades.firesInterval.title, () => `${user.upgrades.firesInterval}/${upgrades.firesInterval.levelsCount}`, upgrades.firesInterval.description, () => upgrades.firesInterval[user.upgrades.firesInterval].value, () => user.upgrades.firesInterval < upgrades.firesInterval.levelsCount ? upgrades.firesInterval[user.upgrades.firesInterval + 1].value : 'MAX', () => user.upgrades.firesInterval < upgrades.firesInterval.levelsCount ? upgrades.firesInterval[user.upgrades.firesInterval + 1].cost : '-', { type: 'component', value: createUpgradeButton('firesInterval') }],
        ];
    
        const upgradeTable = new Table({
            x: 25,
            y: 70,
            width: 550,
            height: 300,
            state: 'upgrade',
            content: upgradeTableContent,
            templateColumns: [0.8, 1, 2.2, 1.1, 1.1, 0.8],
            color: '#fff',
            fontSize: 19,
        });
    
        tables.push(upgradeTable);

        function createUpgradeButton(type) {
            const handlers = {
                shield() {
                    console.log('shield btn click');
                },
                firesCount() {
                    console.log('fires count btn click');
                },
                firesInterval() {
                    console.log('fires interval btn click');
                },
            };

            return (x, y) => new Button({
                x,
                y,
                width: 50,
                height: 50,
                radius: 15,
                text: '💲',
                align: 'center',
                padding: 3,
                fontSize: 27,
                color: "pink",
                reserveHover: true,
                backgroundColor: '#ccc',
                onClick() {
                    handlers[type].call(this);
                },
            });
        }
    }
}