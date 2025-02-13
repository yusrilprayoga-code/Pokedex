'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const typeChart = {
  // Simplified type effectiveness (you should implement full chart from API)
  normal: { defensive: { weak: ['fighting'], resistant: ['ghost'], immune: ['ghost'] }},
  fire: { defensive: { weak: ['water', 'ground', 'rock'], resistant: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'] }},
  // ... Add all other types
};

export function TypeEffectiveness() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [effectiveness, setEffectiveness] = useState<Record<string, number>>({});

  const calculateEffectiveness = () => {
    const multipliers: Record<string, number> = {};
    // Add calculation logic based on selected types
    return multipliers;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Type Effectiveness Calculator</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="grid gap-4">
          <div className="flex gap-2">
            {['fire', 'water', 'grass', 'electric'].map((type) => (
              <Button
                key={type}
                variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                onClick={() => setSelectedTypes(prev => 
                  prev.includes(type) 
                    ? prev.filter(t => t !== type) 
                    : [...prev, type]
                )}
              >
                {type}
              </Button>
            ))}
          </div>
          <Button onClick={() => setEffectiveness(calculateEffectiveness())}>
            Calculate
          </Button>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(effectiveness).map(([type, multiplier]) => (
              <div 
                key={type}
                className={`p-2 rounded text-center text-sm ${
                  multiplier > 1 ? 'bg-green-100' :
                  multiplier < 1 ? 'bg-red-100' : 'bg-gray-100'
                }`}
              >
                {type} ×{multiplier}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}