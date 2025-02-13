"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface MoveDetails {
  name: string
  type: string
  power: number | string
  accuracy: number | string
  pp: number
  generation: string
}

export function MoveList({ moves }: { moves: any[] }) {
  const [moveDetails, setMoveDetails] = useState<MoveDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleMoves, setVisibleMoves] = useState(20)

  useEffect(() => {
    const fetchMoves = async () => {
      const details = await Promise.all(
        moves.map(async (move) => {
          const res = await fetch(move.move.url)
          const data = await res.json()
          return {
            name: move.move.name,
            type: data.type.name,
            power: data.power || "-",
            accuracy: data.accuracy || "-",
            pp: data.pp,
            generation: data.generation.name.split("-")[1].toUpperCase(),
          }
        }),
      )
      setMoveDetails(details)
      setLoading(false)
    }

    fetchMoves()
  }, [moves])

  const filteredMoves = moveDetails
    .filter((move) => move.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, visibleMoves)

  const loadMore = () => {
    setVisibleMoves((prev) => prev + 20)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="relative">
        <Input
          type="text"
          placeholder="Search moves..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 text-white placeholder-white border-white/20"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5">
                <TableHead className="text-white">Move</TableHead>
                <TableHead className="text-white">Type</TableHead>
                <TableHead className="text-white">Power</TableHead>
                <TableHead className="text-white">Accuracy</TableHead>
                <TableHead className="text-white">PP</TableHead>
                <TableHead className="text-white">Generation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredMoves.map((move, index) => (
                  <motion.tr
                    key={move.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-white/5"
                  >
                    <TableCell className="capitalize font-medium text-white">{move.name.replace("-", " ")}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs bg-${move.type}-500/20 text-${move.type}-300`}>
                        {move.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-white">{move.power}</TableCell>
                    <TableCell className="text-white">{move.accuracy}</TableCell>
                    <TableCell className="text-white">{move.pp}</TableCell>
                    <TableCell className="text-white">{move.generation}</TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      )}

      {visibleMoves < moveDetails.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMore}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform"
          >
            Load More
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

