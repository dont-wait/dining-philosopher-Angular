export class BinarySemaphore {
    private count: number;
    private waiting_list: (() => void)[] = [];

    constructor(initCount: number) {
        this.count = initCount;
    }

    wait(id: number) {
        if (this.count <= 0) {
            console.log(`Triết gia ${id} đang đợi để được lấy semaphore`);
            return new Promise<void>(resolve => this.waiting_list.push(resolve));
        }
        this.onChange(id, 'Acquired');
        this.count--;
        console.log(`Triết gia ${id} đã lấy được semaphore`);
        return Promise.resolve();
    }

    signal(id: number) {
        console.log(`Triết gia ${id} đã trả semaphore`);
        if (this.waiting_list.length > 0) {
            const resolve = this.waiting_list.shift();
            if (resolve)
                resolve();
        } else {
            this.count++;
        }
        this.onChange(id, 'Released');
    }

    onChange(id: number, state: string) {
        console.log(`Philosopher ${id} has ${state}`);
    }
}