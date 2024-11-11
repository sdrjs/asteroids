class User {
    #url = {
        users: 'https://672b35ea976a834dd02611c4.mockapi.io/users',
        leaderboard: 'https://672b35ea976a834dd02611c4.mockapi.io/app/1',
        log: 'https://672b35ea976a834dd02611c4.mockapi.io/app/2',
    };

    async loadData() {
        const userId = localStorage.getItem('id');

        if (userId) {
            const userData = await AJAX.get(`${this.#url.users}/${userId}`);

            if (userData === 'Not found' || userData === 'Something went wrong while parsing response JSON') {
                this.createUser();
            } else {
                for (let key in userData) {
                    if (!key.startsWith('_')) this[key] = userData[key];
                }
            }
        } else {
            this.createUser();
        }
    }

    async createUser() {
        this.nickname = this.getNickname();
        this.balance = 0;
        this.upgrades = {};

        for (let upgrade in upgrades) {
            this.upgrades[upgrade] = 0;
        }

        const time = getTime();
        const newUser = await AJAX.post(`${this.#url.users}`, { ...this, _registered: time.value, _timezone: time.timezone, _log: [] });

        this.id = newUser.id;
        localStorage.setItem('id', this.id);

        await this.updateShortLog({ time: time.value, id: this.id, nickname: this.nickname, action: 'register' });
    }

    getNickname() {
        const maxNameLength = 20;

        const name = prompt('Enter your nickname, please', '');
        if (!name || !name.trim()) {
            alert('nickname must not be empty');
            return this.getNickname();
        }

        if (name.length > maxNameLength) {
            alert(`nickname should not contain more than ${maxNameLength} symbols`);
            return this.getNickname();
        }

        return name.trim();
    }

    async changeNickname() {
        const nickname = this.getNickname();
        this.balance -= 10;

        return await this.update('nickname', nickname);
    }

    async update(action, type) {
        const shipScore = ship.score;
        const savedUser = await AJAX.get(`${this.#url.users}/${this.id}`);

        switch (action) {
            case 'game':
                const leaderboardData = await this.updateLeaderboard(shipScore) || {};

                const gameData = { 
                    score: shipScore,
                    oldBalance: savedUser.balance, 
                    newBalance: this.balance, 
                    ...leaderboardData
                };

                await AJAX.put(`${this.#url.users}/${this.id}`, { ...savedUser, balance: this.balance });
                await this.updateUserLog({ savedUser, action, data: gameData, shortData: `${shipScore} score` });

                break;

            case 'upgrade':
                const upgradeData = {
                    type,
                    oldLevel: savedUser.upgrades[type],
                    newLevel: this.upgrades[type],
                    cost: savedUser.balance - this.balance,
                    oldBalance: savedUser.balance,
                    newBalance: this.balance,
                };

                await AJAX.put(`${this.#url.users}/${this.id}`, { ...savedUser, balance: this.balance, upgrades: { ...savedUser.upgrades, [type]: this.upgrades[type] } });
                await this.updateUserLog({ savedUser, action, data: upgradeData, shortData: `${type} {${this.upgrades[type]}}` });

                break;

            case 'nickname':
                const newNickname = type;

                const nicknameData = {
                    oldNickname: savedUser.nickname,
                    newNickname,
                    oldBalance: savedUser.balance,
                    newBalance: this.balance,
                };

                await AJAX.put(`${this.#url.users}/${this.id}`, { ...savedUser, balance: this.balance, nickname: newNickname });
                await this.updateUserLog({ savedUser, action, data: nicknameData, shortData: `to ${newNickname}` });

                return newNickname;

            default:
                console.error('unknown action');
        }
    }

    async updateUserLog({ savedUser, action, data, shortData }) {
        const time = getTime().value;
        const record = { time, action, data };

        await Promise.all([
            AJAX.put(`${this.#url.users}/${this.id}`, { _log: [...savedUser._log, record] }),
            this.updateShortLog({ time, id: this.id, nickname: this.nickname, action, data: shortData }),
        ]);
    }

    async updateShortLog({ time, id, nickname, action, data }) {
        const oldData = await AJAX.get(this.#url.log);
        data = data ? ` ${data}` : '';

        await AJAX.put(this.#url.log, { log: [...oldData.log, `${time} [${id}]${nickname} ${action}${data}`] });
    }

    async updateLeaderboard(score) {
        const { leaderboard } = await AJAX.get(this.#url.leaderboard);

        const currentPlaceIdx = leaderboard.findIndex(user => user.id === this.id);
        if (currentPlaceIdx !== -1) {
            if (leaderboard[currentPlaceIdx].score >= score) return;

            leaderboard.splice(currentPlaceIdx, 1); // only one place per user
        }

        if (leaderboard.length < params.leaderboardPlaces || leaderboard[params.leaderboardPlaces - 1].score < score) {
            let placeIdx = leaderboard.findIndex(user => score > user.score);
            if (placeIdx === -1) placeIdx = leaderboard.length;
            
            if (leaderboard.length === params.leaderboardPlaces) {
                leaderboard.pop();
            }

            leaderboard.splice(placeIdx, 0, {
                id: this.id,
                nickname: this.nickname,
                score,
            });

            await AJAX.put(this.#url.leaderboard, { leaderboard });

            return { leaderboardPlace: placeIdx + 1 };
        }
    }

    async getLeaderboard() {
        const leaderboard = await AJAX.get(this.#url.leaderboard);

        return leaderboard;
    }
}