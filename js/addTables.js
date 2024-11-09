'use strict';

function addTables() {
    const showDangerIncreaseTable = user.upgrades.firesCount >= 3;

    addPauseTable();
    addUpgradeTable();
    addLeaderboardTable();
    addSettingsTable();

    if (showDangerIncreaseTable) {
        addDangerIncreaseTable();
    }

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

        tables.pause = table;
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
            y: 85,
            width: 580,
            height: 300,
            state: 'upgrade',
            content: tableContent,
            templateColumns: [0.8, 1, 1.9, 1.1, 1.1, 0.8, 0.9],
            color: '#fff',
            fontSize: 19,
        });
    
        tables.upgrade = table;

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
            y: 90,
            width: 400,
            height: 475,
            state: 'leaderboard',
            content: tableContent,
            templateColumns: [1, 3, 4],
            color: '#fff',
            fontSize: 25,
            fontFamily: 'salmapro',
        });

        delete tables.leaderboard;
        tables.leaderboard = table;
        tables.leaderboard.redraw = addLeaderboardTable;
    }

    function addSettingsTable() {
        const tableContent = [
            ['display FPS', () => params.showFPS ? 'ON' : 'OFF', { type: 'component', value: createParamButton('showFPS') }],
            ['sounds', () => params.playSounds ? 'ON' : 'OFF', { type: 'component', value: createParamButton('playSounds') }],
            ['nickname change', () => `${params.changeNicknamePrice}💎`, { type: 'component', value: createChangeNicknameButton() }],
        ];
    
        const table = new Table({
            x: 125,
            y: showDangerIncreaseTable ? 220 : 120,
            width: 350,
            height: 200,
            state: 'settings',
            content: tableContent,
            templateColumns: [1.4, 1, 1],
            color: '#fff',
            fontSize: 19,
        });
    
        tables.settings = table;

        function createParamButton(param) {
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
                    params[param] = !params[param];
                    localStorage.setItem(param, JSON.stringify(params[param]));
                },
            });
        }

        function createChangeNicknameButton() {
            return (x, y) => new Button({
                x,
                y,
                width: 100,
                height: 40,
                radius: 15,
                text: 'change ⇅',
                align: 'center',
                padding: 2,
                color: "#eee",
                reserveHover: true,
                backgroundColor: '#222',
                async onClick() {
                    if (user.balance < params.changeNicknamePrice) {
                        alert('not enough gems');
                        return;
                    }

                    user.nickname = await user.changeNickname();
                    setStyles();
                },
            });
        }
    }

    function addDangerIncreaseTable() {
        const minIncrease = 0;
        const maxIncrease = 5;
        let currentIncrease = JSON.parse(localStorage.getItem('dangerIncrease')) || 0;

        const tableContent = [
            [
                'Additional danger',
                { type: 'component', value: createSignButton('-', -1) },
                () => currentIncrease,
                { type: 'component', value: createSignButton('+', 1) },
            ],
        ];
    
        const table = new Table({
            x: 140,
            y: 155,
            width: 320,
            height: 0,
            state: 'settings',
            content: tableContent,
            templateColumns: [4, 1, 1, 1],
            color: '#fff',
            fontSize: 19,
        });
    
        tables.dangerChange = table;

        function createSignButton(sign, diff) {
            return (x, y) => new Button({
                x,
                y,
                width: 45,
                height: 35,
                radius: 15,
                text: sign,
                align: 'center',
                padding: 2,
                color: "#eee",
                reserveHover: true,
                backgroundColor: '#222',
                onClick() {
                    const nextIncrease = currentIncrease + diff;
                    if (nextIncrease < minIncrease || nextIncrease > maxIncrease) {
                        alert(`Start danger increase must be in range between ${minIncrease} and ${maxIncrease}`);
                        return;
                    }

                    localStorage.setItem('dangerIncrease', JSON.stringify(nextIncrease));
                    setParams();
                    currentIncrease = nextIncrease;
                },
            });
        }
    }
}