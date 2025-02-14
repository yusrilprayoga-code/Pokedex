"use client"

import { PokemonCard } from "@/components/PokemonCard"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Pokemon {
  id: number
  name: string
  types: string[]
  image: string
  attack: number
  weight: number
}

export default function Home() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [attackFilter, setAttackFilter] = useState("all")
  const [weightFilter, setWeightFilter] = useState("all")
  const pokemonPerPage = 20

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      const data = await response.json()

      const results = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url)
          const details = await res.json()
          return {
            id: details.id,
            name: details.name,
            types: details.types.map((t: any) => t.type.name),
            image: details.sprites.other["official-artwork"].front_default,
            attack: details.stats.find((stat: any) => stat.stat.name === "attack").base_stat,
            weight: details.weight,
          }
        })
      )

      setPokemonList(results)
      setLoading(false)
    }

    fetchPokemon()
  }, [])

  const filteredPokemon = pokemonList.filter((pokemon) => {
    const nameMatch = pokemon.name.toLowerCase().includes(search.toLowerCase())
    const attackMatch =
      attackFilter === "all" ||
      (attackFilter === "high" && pokemon.attack > 80) ||
      (attackFilter === "low" && pokemon.attack <= 80)
    const weightMatch =
      weightFilter === "all" ||
      (weightFilter === "light" && pokemon.weight < 100) ||
      (weightFilter === "medium" && pokemon.weight >= 100 && pokemon.weight < 500) ||
      (weightFilter === "heavy" && pokemon.weight >= 500)

    return nameMatch && attackMatch && weightMatch
  })

  const indexOfLastPokemon = currentPage * pokemonPerPage
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonPerPage
  const currentPokemon = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-5xl font-extrabold text-center mb-10 text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pokédex
        </motion.h1>

        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Input
            placeholder="Search Pokémon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md mx-auto bg-white/10 text-white placeholder-white/50 border-white/20"
          />
          <div className="flex justify-center space-x-4">
            <Select onValueChange={(value) => setAttackFilter(value)}>
              <SelectTrigger className="w-[180px] bg-white/10 text-white border-white/20">
                <SelectValue placeholder="Attack Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Attacks</SelectItem>
                <SelectItem value="high">High Attack (&gt;80)</SelectItem>
                <SelectItem value="low">Low Attack (≤80)</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setWeightFilter(value)}>
              <SelectTrigger className="w-[180px] bg-white/10 text-white border-white/20">
                <SelectValue placeholder="Weight Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Weights</SelectItem>
                <SelectItem value="light">Light (&lt;100)</SelectItem>
                <SelectItem value="medium">Medium (100-499)</SelectItem>
                <SelectItem value="heavy">Heavy (≥500)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl bg-white/10" />
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentPokemon.map((pokemon) => (
                  <PokemonCard key={pokemon.id} {...pokemon} />
                ))}
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex justify-center">
              <Pagination
                pokemonPerPage={pokemonPerPage}
                totalPokemon={filteredPokemon.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface PaginationProps {
  pokemonPerPage: number
  totalPokemon: number
  paginate: (pageNumber: number) => void
  currentPage: number
}

function Pagination({ pokemonPerPage, totalPokemon, paginate, currentPage }: PaginationProps) {
  const pageNumbers = []
  const totalPages = Math.ceil(totalPokemon / pokemonPerPage)

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  const visiblePageNumbers = pageNumbers.filter(
    (number) => number === 1 || number === totalPages || (number >= currentPage - 2 && number <= currentPage + 2)
  )

  return (
    <nav className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="bg-white/10 text-white hover:bg-white/20"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {visiblePageNumbers.map((number, index, array) => (
        <React.Fragment key={number}>
          {index > 0 && array[index - 1] !== number - 1 && <span className="text-white">...</span>}
          <Button
            onClick={() => paginate(number)}
            variant={currentPage === number ? "default" : "outline"}
            className={currentPage === number ? "bg-white text-blue-900" : "bg-white/10 text-white hover:bg-white/20"}
          >
            {number}
          </Button>
        </React.Fragment>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="bg-white/10 text-white hover:bg-white/20"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}