// We'll start by modifying our class
class UserService {
    static instance: UserService;

    user?: { name: string };

    constructor() {
        if (!UserService.instance) {
            UserService.instance = this;
        }

        return UserService.instance;
    }

    logName() {
        console.log(`Hi, my name is: ${this.user?.name}`);
    }
}

// Now we will use our service to handle
// Two different users of our app

const myService = new UserService();
myService.user = { name: 'Colum' };

const differentService = new UserService();
differentService.user = { name: 'John' };

myService.logName();
differentService.logName();
