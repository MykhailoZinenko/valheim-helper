import React, { useState, useEffect } from "react"
import { Quote } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const quotes = [
  { text: "The gods are watching", author: "Odin" },
  { text: "Victory or Valhalla!", author: "Viking Warrior" },
  { text: "The ravens guide our path", author: "Elder" },
  {
    text: "Fear not death, for the Valkyries decide our fate",
    author: "Skald",
  },
  {
    text: "Build mighty halls, for they shall echo with tales of glory",
    author: "Master Builder",
  },
  {
    text: "The wind carries whispers of ancient powers",
    author: "Runecaster",
  },
  { text: "In darkness we find strength", author: "The Mountain King" },
  {
    text: "The sea calls to those with courage to answer",
    author: "Norse Navigator",
  },
  {
    text: "Each tree felled is a story written in the earth",
    author: "Woodcutter",
  },
  { text: "The Black Forest holds secrets older than time", author: "Mystic" },
  { text: "Let your hammer speak louder than words", author: "Forge Master" },
  { text: "The meadows whisper tales of ancient battles", author: "Wanderer" },
  {
    text: "In the mountains, even the stones have tales to tell",
    author: "Stone Mason",
  },
  {
    text: "Sail forth, for glory awaits beyond the horizon",
    author: "Viking Captain",
  },
  {
    text: "The stars guide us when the paths grow dark",
    author: "Night Watcher",
  },
  {
    text: "Through storm and steel, we forge our destiny",
    author: "Shield Maiden",
  },
  {
    text: "The plains echo with the thunder of forgotten gods",
    author: "Plains Walker",
  },
  {
    text: "In the depths of the swamp lies wisdom most bitter",
    author: "Bone Reader",
  },
  {
    text: "Every fortress begins with a single stone",
    author: "Master Architect",
  },
  { text: "The wolves howl, but the Viking laughs", author: "Beast Hunter" },
  { text: "Your axe is only as sharp as your wit", author: "Veteran Warrior" },
  {
    text: "The mead hall remembers when warriors forget",
    author: "Tale Keeper",
  },
  { text: "Trust the runes, but keep your sword sharp", author: "Elder Sage" },
  {
    text: "The longship's heart beats with the drums of war",
    author: "Fleet Commander",
  },
  {
    text: "From the ashes of the old, we build the new",
    author: "Village Elder",
  },
  {
    text: "Even trolls fear the courage of true Vikings",
    author: "Troll Slayer",
  },
  {
    text: "The northern lights dance for those brave enough to watch",
    author: "Sky Seer",
  },
  { text: "In unity, we build; in battle, we conquer", author: "Jarl" },
  {
    text: "The world tree's roots run deep in warrior's hearts",
    author: "Keeper of Yggdrasil",
  },
  { text: "Every scar tells a saga worth singing", author: "Battle Skald" },
]

const QuoteBlock = () => {
  const [quote, setQuote] = useState(quotes[0])
  const [key, setKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setQuote(randomQuote)
      setKey((prev) => prev + 1)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="relative border-y border-accent/20 py-12">
        <div className="absolute inset-0 bg-[url('/norse-pattern.svg')] opacity-5" />

        <div className="relative flex flex-col items-center text-center space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
            <Quote className="w-6 h-6 text-accent animate-pulse" />
            <div className="h-px w-16 bg-gradient-to-r from-border to-transparent" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 flex flex-col items-center"
            >
              <p className="text-3xl md:text-4xl font-norse max-w-3xl text-balance px-4">
                "{quote.text}"
              </p>

              <div className="flex items-center gap-4 text-color-text-secondary">
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                <span className="text-lg uppercase tracking-wider font-norse">
                  {quote.author}
                </span>
                <div className="h-px w-12 bg-gradient-to-r from-accent/30 via-accent/30 to-transparent" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default QuoteBlock
