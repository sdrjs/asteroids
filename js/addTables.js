'use strict';

function addTables() {
    addPauseTable();
    addUpgradeTable();
    addLeaderboardTable();
    addSettingsTable();

    function addPauseTable() {
        const tableContent = [
            ['game paused'],
            ['click on ship to continue'],
        ];

        const table = new Table({
            x: canvas.width / 2,
            y: 0,
            width: 0,
            height: 600,
            state: 'paused',
            content: tableContent,
            color: 'rgba(0, 0, 0, 0.4)',
            fontFamily: 'salmapro',
            fontSize: 32,
        });

        tables.push(table);
    }

    function addUpgradeTable() {
        const tableContent = [
            ['type', 'level', 'description', 'current', 'new', 'price', 'buy'],
            getUpgradeRow('shield'),
            getUpgradeRow('firesCount'),
            getUpgradeRow('firesInterval'),
        ];
    
        const table = new Table({
            x: 15,
            y: 70,
            width: 580,
            height: 300,
            state: 'upgrade',
            content: tableContent,
            templateColumns: [0.8, 1, 2, 1.1, 1.1, 0.7, 0.9],
            color: '#fff',
            fontSize: 19,
        });
    
        tables.push(table);

        function getUpgradeRow(type) {
            return [
                upgrades[type].title,
                () => `${user.upgrades[type]}/${upgrades[type].levelsCount}`,
                upgrades[type].description,
                getCurrent,
                getNew,
                () => user.upgrades[type] < upgrades[type].levelsCount ? `${upgrades[type][user.upgrades[type] + 1].cost}💎` : '-',
                user.upgrades[type] < upgrades[type].levelsCount ? { type: 'component', value: createUpgradeButton(type) } : '',
            ];

            function getCurrent() {
                let value = upgrades[type][user.upgrades[type]].value;

                if (type === 'shield' || type === 'firesInterval') {
                    value = formatTime(value);
                }

                return value;
            }

            function getNew() {
                let value = user.upgrades[type] < upgrades[type].levelsCount ? upgrades[type][user.upgrades[type] + 1].value : 'MAX';

                if (value === 'MAX') return value;

                if (type === 'shield' || type === 'firesInterval') {
                    value = formatTime(value);
                }

                return value;
            }
        }

        function createUpgradeButton(type) {
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
                    const requiredAmount = upgrades[type][user.upgrades[type] + 1].cost;

                    if (requiredAmount <= user.balance) {
                        user.upgrades[type]++;
                        user.balance -= requiredAmount;

                        if (user.upgrades[type] === upgrades[type].levelsCount) {
                            this.hide();
                        }

                        setParams();
                        user.update('upgrade', type);
                    } else {
                        alert('not enough gems');
                    }
                },
            });
        }
    }

    async function addLeaderboardTable() {
        const rows = await user.getLeaderboard();

        const tableRows = rows.leaderboard.map((row, idx) => [idx + 1, row.score, row.nickname]);

        while (tableRows.length < params.leaderboardPlaces) tableRows.push([tableRows.length + 1, '', '']);

        const tableContent = [
            ['place', 'top score', 'nickname'],
            ...tableRows,
        ];

        const table = new Table({
            x: 100,
            y: 75,
            width: 400,
            height: 475,
            state: 'leaderboard',
            content: tableContent,
            templateColumns: [1, 3, 4],
            color: '#fff',
            fontSize: 19,
        });

        tables.push(table);
    }

    function addSettingsTable() {
        const tableContent = [
            ['display FPS', () => params.showFPS ? 'ON' : 'OFF', { type: 'component', value: createFpsButton() }],
        ];
    
        const table = new Table({
            x: 150,
            y: 70,
            width: 300,
            height: 200,
            state: 'settings',
            content: tableContent,
            color: '#fff',
            fontSize: 19,
        });
    
        tables.push(table);

        function createFpsButton() {
            return (x, y) => new Button({
                x,
                y,
                width: 100,
                height: 40,
                radius: 15,
                text: 'toggle ⇅',
                align: 'center',
                padding: 2,
                color: "#eee",
                reserveHover: true,
                backgroundColor: '#222',
                onClick() {
                    params.showFPS = !params.showFPS;
                },
            });
        }
    }
}