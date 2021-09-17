

export class Category {

    name: string;
    value: number;
    type: number;
    security: string | null;

    constructor(name: string, value: number, type: number, security: string | null) {
        this.name = name;
        this.value = value;
        this.type = type;
        this.security = security;
    }

     getValue() {
        return this.value;
    }

}

