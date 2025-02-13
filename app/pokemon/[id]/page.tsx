'use client';

import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EvolutionChain } from "@/components/EvolutionChain";
import { MoveList } from "@/components/MoveList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
  images: string[];
  types: string[];
  moves: any[];
}

export default function PokemonDetail() {
  const params = useParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        if (!params?.id) return;
        
        setLoading(true);
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${params.id}`,
          { next: { revalidate: 3600 } }
        );
        
        if (!response.ok) throw new Error('Pokemon not found');
        
        const data = await response.json();

        setPokemon({
          id: data.id,
          name: data.name,
          height: data.height / 10,
          weight: data.weight / 10,
          stats: data.stats.map((stat: any) => ({
            name: stat.stat.name,
            value: stat.base_stat,
          })),
          images: [
            data.sprites.other["official-artwork"].front_default,
            data.sprites.front_default,
            data.sprites.back_default,
            data.sprites.other.home.front_default,
          ].filter(Boolean),
          types: data.types.map((t: any) => t.type.name),
          moves: data.moves,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [params?.id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (pokemon?.images.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (pokemon?.images.length || 1) - 1 : prev - 1
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-300">{error}</p>
          <Link href="/" className="mt-4 inline-block text-blue-200 hover:text-blue-100">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 text-white">
        <div className="container py-12 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32 mb-8 bg-white/20" />
          <div className="max-w-6xl mx-auto space-y-8">
            <Skeleton className="h-96 w-full rounded-2xl bg-white/20" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 bg-white/20" />
              <Skeleton className="h-24 bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 text-white">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/" 
            className="flex items-center gap-2 mb-8 text-white hover:text-blue-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to list
          </Link>

          <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image Section */}
              <div className="flex-1">
                <div className="relative h-64 sm:h-80 w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={pokemon.images[currentImageIndex]}
                        alt={pokemon.name}
                        fill
                        className="object-contain"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  <button
                    onClick={prevImage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-r-md hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-l-md hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="flex gap-4 mt-4 overflow-x-auto pb-4">
                  {pokemon.images.map((image, i) => (
                    <motion.div
                      key={i}
                      className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 cursor-pointer border-2 rounded-lg overflow-hidden ${
                        i === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentImageIndex(i)}
                    >
                      <Image
                        src={image}
                        alt={pokemon.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1">
                <motion.h1 
                  className="text-3xl sm:text-4xl font-bold capitalize mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {pokemon.name}
                  <span className="text-blue-300 ml-2">#{pokemon.id}</span>
                </motion.h1>

                <motion.div 
                  className="flex flex-wrap gap-2 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 rounded-full bg-white/20 text-white text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </motion.div>

                <motion.div 
                  className="grid grid-cols-2 gap-4 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="bg-white/10 p-4 rounded-xl">
                    <p className="text-sm text-blue-200">Height</p>
                    <p className="font-bold">{pokemon.height}m</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl">
                    <p className="text-sm text-blue-200">Weight</p>
                    <p className="font-bold">{pokemon.weight}kg</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {pokemon.stats.map((stat, index) => (
                    <motion.div 
                      key={stat.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="capitalize">{stat.name}</span>
                        <span className="font-bold">{stat.value}</span>
                      </div>
                      <Progress value={stat.value} className="h-2 bg-white/10" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="info" className="mt-8">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 text-black">
                <TabsTrigger value="info" className="hover:bg-white/20 data-[state=active]:bg-white">
                  Info
                </TabsTrigger>
                <TabsTrigger value="moves" className="hover:bg-white/20 data-[state=active]:bg-white">
                  Moves
                </TabsTrigger>
                <TabsTrigger value="evolutions" className="hover:bg-white/20 data-[state=active]:bg-white">
                  Evolutions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h2 className="text-xl font-bold mb-2">About</h2>
                  <p className="text-white text-2xl
                    font-sans font-light leading-relaxed tracking-wide
                  ">
                    {pokemon.name} is a Pokémon with unique characteristics. 
                    Standing at {pokemon.height} m tall and weighing {pokemon.weight} kg, 
                    it has a special combination of {pokemon.types.join(' and ')} types.

                    {pokemon.name} has a total of {pokemon.moves.length} moves in its arsenal,
                    and is known for its impressive stats.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="moves" className="mt-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <MoveList moves={pokemon.moves} />
                </div>
              </TabsContent>

              <TabsContent value="evolutions" className="mt-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <EvolutionChain id={pokemon.id} />
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}