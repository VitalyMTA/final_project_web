const db = require('../../util/database');
const cpanelPokedexApi = require('../../util/cpanelPokedexApi');

const CPANEL_LIST_ACTION = process.env.CPANEL_POKEDEX_LIST_ACTION || 'listPokemon';
const CPANEL_ADD_ACTION = process.env.CPANEL_POKEDEX_ADD_ACTION || 'addPokemon';
const CPANEL_POKEDEX_TABLE = process.env.CPANEL_POKEDEX_TABLE || 'Pokedex';

class Pokedex {
    constructor(pokemon_name, pokemon_type_1, pokemon_type_2, hp, attack, defense, sp_atk, sp_def, pokemon_image, added_by_user, pokemon_image_path = null) {
        this.pokemon_name = pokemon_name;
        this.pokemon_type_1 = pokemon_type_1;
        this.pokemon_type_2 = pokemon_type_2;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.sp_atk = sp_atk;
        this.sp_def = sp_def;
        this.pokemon_image = pokemon_image;
        this.added_by_user = added_by_user;
        this.pokemon_image_path = pokemon_image_path;
    }

    save() {
        if (cpanelPokedexApi.isConfigured()) {
            return cpanelPokedexApi.request(CPANEL_ADD_ACTION, {
                __operation: 'add',
                table: CPANEL_POKEDEX_TABLE,
                pokemon_name: this.pokemon_name,
                pokemon_type_1: this.pokemon_type_1,
                pokemon_type_2: this.pokemon_type_2,
                hp: this.hp,
                attack: this.attack,
                defense: this.defense,
                sp_atk: this.sp_atk,
                sp_def: this.sp_def,
                pokemon_image: this.pokemon_image,
                added_by_user: this.added_by_user,
                __multipartFile: this.pokemon_image_path
                    ? {
                        fieldName: 'pokemon_image',
                        filePath: this.pokemon_image_path,
                        fileName: this.pokemon_image
                    }
                    : null
            });
        }

        return db.execute(
            'INSERT INTO pokedex (pokemon_name, pokemon_type_1, pokemon_type_2, hp, attack, defense, sp_atk, sp_def, pokemon_image, added_by_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [this.pokemon_name, this.pokemon_type_1, this.pokemon_type_2, this.hp, this.attack, this.defense, this.sp_atk, this.sp_def, this.pokemon_image, this.added_by_user]
        );
    }

    static getAll() {
        if (cpanelPokedexApi.isConfigured()) {
            return cpanelPokedexApi.request(CPANEL_LIST_ACTION, {
                __operation: 'list',
                table: CPANEL_POKEDEX_TABLE
            })
                .then((data) => {
                    if (Array.isArray(data)) {
                        return [data];
                    }

                    if (data && Array.isArray(data.rows)) {
                        return [data.rows];
                    }

                    if (data && Array.isArray(data.data)) {
                        return [data.data];
                    }

                    if (data && Array.isArray(data.pokemon)) {
                        return [data.pokemon];
                    }

                    if (data && Array.isArray(data.results)) {
                        return [data.results];
                    }

                    return [[]];
                });
        }

        return db.execute('SELECT * FROM pokedex');
    }

    static resetLocal() {
        return db.execute('DELETE FROM pokedex');
    }
}

module.exports = Pokedex;