import { Url } from "url";

export class Beer {
    id!: number;
    name: string = '';
    description: string = '';
    image_url: string = ''; // TODO check for better property type
    food_pairing: string[] = [];
    abv?: number; // % alcohol

}