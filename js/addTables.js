'use strict';

function addTables() {
    addUpgradeTable();
    addLeaderboardTable();

    function addUpgradeTable() {
        const upgradeTableContent = [
            ['type', 'level', 'description', 'current', 'new', 'price', 'buy'],
            getUpgradeRow('shield'),
            getUpgradeRow('firesCount'),
            getUpgradeRow('firesInterval'),
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

        function getUpgradeRow(type) {
            return [
                upgrades[type].title,
                () => `${user.upgrades[type]}/${upgrades[type].levelsCount}`,
                upgrades[type].description,
                () => upgrades[type][user.upgrades[type]].value,
                () => user.upgrades[type] < upgrades[type].levelsCount ? upgrades[type][user.upgrades[type] + 1].value : 'MAX',
                () => user.upgrades[type] < upgrades[type].levelsCount ? upgrades[type][user.upgrades[type] + 1].cost : '-',
                user.upgrades[type] < upgrades[type].levelsCount ? { type: 'component', value: createUpgradeButton(type) } : '',
            ];
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
        const leaderboardRows = await user.getLeaderboard();

        const leaderboardTableRows = leaderboardRows.leaderboard.map((row, idx) => [idx + 1, row.score, row.nickname]);

        while (leaderboardTableRows.length < params.leaderboardPlaces) leaderboardTableRows.push([leaderboardTableRows.length + 1, '', '']);

        const leaderboardTableContent = [
            ['place', 'top score', 'nickname'],
            ...leaderboardTableRows,
        ];

        const upgradeTable = new Table({
            x: 100,
            y: 75,
            width: 400,
            height: 475,
            state: 'leaderboard',
            content: leaderboardTableContent,
            templateColumns: [1, 3, 4],
            color: '#fff',
            fontSize: 19,
        });

        tables.push(upgradeTable);
    }
}