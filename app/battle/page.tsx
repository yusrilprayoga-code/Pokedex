'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BattleSimulator() {
  const [pokemon1, setPokemon1] = useState<any>(null);
  const [pokemon2, setPokemon2] = useState<any>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  const simulateBattle = () => {
    // Add battle simulation logic
    setBattleLog([
      `${pokemon1.name} attacked ${pokemon2.name}!`,
      `${pokemon2.name} lost 20 HP!`,
      // ... more battle steps
    ]);
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Battle Simulator</h1>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <Input 
          placeholder="Select Pokémon 1"
          onChange={async (e) => {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${e.target.value}`);
            setPokemon1(await res.json());
          }}
        />
        <Input 
          placeholder="Select Pokémon 2"
          onChange={async (e) => {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${e.target.value}`);
            setPokemon2(await res.json());
          }}
        />
      </div>
      
      <Button onClick={simulateBattle} disabled={!pokemon1 || !pokemon2}>
        Start Battle
      </Button>

      <div className="mt-8 space-y-4">
        {battleLog.map((log, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}