import { PokemonCard } from "@/components/PokemonCard";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ComparePage() {
  const [selectedPokemon, setSelectedPokemon] = useState<[any?, any?]>([undefined, undefined]);

  const handleSelect = async (index: number, name: string) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();
    const newSelection: [any?, any?] = [...selectedPokemon];
    newSelection[index] = data;
    setSelectedPokemon(newSelection);
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Compare Pokémon</h1>
      <div className="grid grid-cols-2 gap-8">
        {[0, 1].map((index) => (
          <div key={index}>
            <Input 
              placeholder={`Select Pokémon ${index + 1}`}
              onChange={(e) => handleSelect(index, e.target.value)}
            />
            {selectedPokemon[index] && (
              <div className="mt-4">
                <PokemonCard 
                  id={selectedPokemon[index].id}
                  name={selectedPokemon[index].name}
                  types={selectedPokemon[index].types.map((t: any) => t.type.name)}
                  image={selectedPokemon[index].sprites.other["official-artwork"].front_default}
                />
                {/* Add comparison charts here */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}