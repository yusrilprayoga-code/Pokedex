"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"

interface EvolutionChain {
  id: string
  name: string
  image: string
  evolvesTo: EvolutionChain[]
}

export function EvolutionChain({ id }: { id: number }) {
  const [chain, setChain] = useState<EvolutionChain | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvolution = async () => {
      try {
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        const speciesData = await speciesRes.json()

        const evolutionRes = await fetch(speciesData.evolution_chain.url)
        const evolutionData = await evolutionRes.json()

        const extractChain = (chain: any): EvolutionChain => ({
          id: chain.species.url.split("/")[6],
          name: chain.species.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${chain.species.url.split("/")[6]}.png`,
          evolvesTo: chain.evolves_to.map(extractChain),
        })

        setChain(extractChain(evolutionData.chain))
      } catch (error) {
        console.error("Error fetching evolution chain:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvolution()
  }, [id])

  const renderChain = (evolution: EvolutionChain, depth = 0) => (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: depth * 0.2 }}
    >
      <Link href={`/pokemon/${evolution.id}`} className="group">
        <Card className="p-4 m-2 hover:shadow-xl transition-all duration-300 bg-white/10 backdrop-blur-md border-white/20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src={evolution.image || "/placeholder.svg"}
              alt={evolution.name}
              width={120}
              height={120}
              className="object-contain"
            />
            <h3 className="text-center capitalize font-medium mt-2 text-white">{evolution.name}</h3>
          </motion.div>
        </Card>
      </Link>
      {evolution.evolvesTo.length > 0 && (
        <div className="flex flex-col items-center mt-4">
          <ChevronRight className="text-white w-6 h-6 animate-pulse" />
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {evolution.evolvesTo.map((evo, index) => (
              <div key={evo.id} className="flex-shrink-0">
                {renderChain(evo, depth + 1)}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Skeleton className="h-32 w-32 rounded-full" />
      </div>
    )
  }

  if (!chain) {
    return (
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white mt-4">
        No evolution data available
      </motion.p>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mt-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Evolution Chain</h2>
        <div className="flex justify-center">{renderChain(chain)}</div>
      </motion.div>
    </AnimatePresence>
  )
}

