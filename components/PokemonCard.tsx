import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface PokemonCardProps {
  id: number
  name: string
  types: string[]
  image: string
}

export function PokemonCard({ id, name, types, image }: PokemonCardProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Link href={`/pokemon/${id}`}>
        <Card className="p-4 hover:shadow-xl transition-all duration-300 group w-full container mx-auto bg-white/10 backdrop-blur-md border-white/20">
          <div className="relative h-48 w-full mx-auto overflow-hidden rounded-lg">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <h3 className="text-xl font-bold capitalize mt-4 text-white">{name}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {types.map((type) => (
              <span key={type} className="px-3 py-1 rounded-full text-sm bg-white/20 text-white">
                {type}
              </span>
            ))}
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}

