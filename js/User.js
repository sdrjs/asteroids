class User {
    #url = {
        users: 'https://672b35ea976a834dd02611c4.mockapi.io/users',
        leaderboard: 'https://672b35ea976a834dd02611c4.mockapi.io/app/1',
        log: 'https://672b35ea976a834dd02611c4.mockapi.io/app/2',
    };

    async loadData() {
        const userId = localStorage.getItem('id');

        if (userId) {
            const user = await AJAX.get(`${this.#url.users}/${userId}`);

            for (let key in user) {
                this[key] = user[key];
            }
        } else {
            this.nickname = getName();
            this.balance = 0;
            this.upgrages = {};

            const time = getTime();
            const newUser = await AJAX.post(`${this.#url.users}`, { ...this, registered: time.value, timezone: time.timezone, log: [] });
            localStorage.setItem('id', newUser.id);

            await this.updateShortLog({ time: time.value, id: newUser.id, nickname: this.nickname, action: 'register' });
        }

        function getName() {
            const maxNameLength = 20;

            const name = prompt('Enter your nickname, please', '');
            if (!name || !name.trim()) {
                alert('nickname must not be empty');
                return getName();
            }

            if (name.length > maxNameLength) {
                alert(`nickname should not contain more than ${maxNameLength} symbols`);
                return getName();
            }

            return name;
        }
    }

    async update(action) {
        const id = localStorage.getItem('id');
        const savedUser = await AJAX.get(`${this.#url.users}/${id}`);

        switch (action) {
            case 'balance':
                await AJAX.put(`${this.#url.users}/${id}`, { ...savedUser, balance: this.balance });

                await this.updateUserLog({ savedUser, action, data: { oldValue: savedUser.balance, newValue: this.balance } });
                break;

            default:
                console.log('unknown action');
        }
    }

    async updateUserLog({ savedUser, action, data }) {
        const id = localStorage.getItem('id');
        const time = getTime().value;
        const record = { time, action, data };

        await Promise.all([
            AJAX.put(`${this.#url.users}/${id}`, { log: [...savedUser.log, record] }),
            this.updateShortLog({ time, id, nickname: savedUser.nickname, action }),
        ]);
    }

    async updateShortLog({ time, id, nickname, action }) {
        const oldData = await AJAX.get(this.#url.log);
        await AJAX.put(this.#url.log, { log: [...oldData.log, `${time} [${id}]${nickname} ${action}`] });
    }
}