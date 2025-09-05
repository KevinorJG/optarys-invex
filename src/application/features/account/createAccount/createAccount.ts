import { Command } from "@nestjs/cqrs";

export class CreateAccount extends Command<any> {
    constructor(
        public readonly commerce: Commerce,
        public readonly owner: OwnerCommerce
    ) {
        super();
    }
}


export class Commerce {
    constructor(
        public readonly name: string,
        public readonly nit: string,
        public readonly address: string | null,
        public readonly phoneNumber: string
    ) { }
}

export class OwnerCommerce {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly password: string
    ) { }
}