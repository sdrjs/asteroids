class User {
    constructor() {
        localStorage.getItem('user') ? this.getUser() : this.addNewUser();
    }

    getUser() {
        const savedUser = JSON.parse(localStorage.getItem('user'));

        for (let key in savedUser) {
            this[key] = savedUser[key];
        }
    }

    addNewUser() {
        this.balance = 0;
        this.nickname = getName();
        this.upgrages = {};

        this.update();

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

    update() {
        localStorage.setItem('user', JSON.stringify(this));
    }
}