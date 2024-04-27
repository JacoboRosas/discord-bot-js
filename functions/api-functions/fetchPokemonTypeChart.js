const fetchPokemonType = require("./fetchPokemonType");

async function fetchPokemonTypeChart(pokemonData){ //Receive the pokemon name 
    const types = pokemonData.types.map(type => type.type.name);
    let weaknesses = [];
    let fourTimesWeaknesses = [];
    let immunity = [];
    let halfDamage = [];
    let quarterDamage =[];
    let tempWeakness = [];
    for (let type of types) {
      const typeData = await fetchPokemonType(type);
      const typeImmunity = typeData.damage_relations.no_damage_from.map(type=>type.name);
      const typeWeaknesses = typeData.damage_relations.double_damage_from.map(type => type.name);
      const typeHalfDamage = typeData.damage_relations.half_damage_from.map(type => type.name);
      weaknesses = [...weaknesses, ...typeWeaknesses];
      immunity = [...immunity, ...typeImmunity];
      halfDamage = [...halfDamage, ...typeHalfDamage];
    }

    for (let type of weaknesses) {
        if (weaknesses.filter(weakness => weakness === type).length > 1) {
          fourTimesWeaknesses.push(type);
        }
    }

    for (let type of halfDamage) {
        if (halfDamage.filter(resistance => resistance === type).length > 1) {
          quarterDamage.push(type);
        }
    }
    
    fourTimesWeaknesses = [...new Set(fourTimesWeaknesses)];
    quarterDamage = [...new Set(quarterDamage)];
    tempWeakness = weaknesses;
    weaknesses = weaknesses.filter(weakness => !fourTimesWeaknesses.includes(weakness));
    weaknesses = weaknesses.filter(weakness => !immunity.includes(weakness));
    weaknesses = weaknesses.filter(weakness => !halfDamage.includes(weakness));
    halfDamage = halfDamage.filter(type => !tempWeakness.includes(type));
    halfDamage = halfDamage.filter(type => !quarterDamage.includes(type));

    return {weaknesses, fourTimesWeaknesses, immunity, halfDamage, quarterDamage};
} 
module.exports = fetchPokemonTypeChart;