export class Person {
    id: number = -1;
    name: string = '';
    gaf: string = '';
    team: string = '';
    status: string = '';
    statusDay: number = -1;

    constructor(id: number, name: string, status: string) {
        this.id = id;
        this.name = name;
        this.status = status;
    }
}