import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

interface PokemonCardProps {
  id: number
  name: string
  types: string[]
  image: string
  attack: number
  weight: number
}

export function PokemonCard({ id, name, types, image, attack, weight }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${id}`}>
      <Card className="overflow-hidden bg-white/10 backdrop-blur-lg transition-all hover:scale-105">
        <CardContent className="p-4">
          <Image src={image || "/placeholder.svg"} alt={name} width={200} height={200} className="w-full h-auto" />
          <h2 className="text-xl font-bold mt-2 text-white capitalize">{name}</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {types.map((type) => (
              <span
                key={type}
                className="px-2 py-1 text-xs font-semibold rounded-full"
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {type}
              </span>
            ))}
          </div>
          <div className="mt-2 text-sm text-white">
            <p>Attack: {attack}</p>
            <p>Weight: {weight}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function getTypeColor(type: string): string {
  const colors: { [key: string]: string } = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  }
  return colors[type] || "#888888"
}
