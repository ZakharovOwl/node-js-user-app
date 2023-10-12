import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "users" })
export class User {
	@PrimaryKey()
	id: number;

	@Property()
	name: string;

	@Property()
	age: number;

	constructor(id: number, name: string, age: number) {
		this.id = id;
		this.name = name;
		this.age = age;
	}
}
