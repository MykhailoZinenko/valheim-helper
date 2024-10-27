import { Card } from "@/components/ui/card"
import { CoffeeIcon, FileIcon } from "lucide-react"

const About = () => {
  return (
    <div>
      <h1 className="text-5xl font-norse font-bold text-color-text-primary">
        About Valheim Helper
      </h1>

      <h2 className="text-3xl mt-6 font-norse font-bold text-color-text-secondary">
        Introduction
      </h2>
      <p className="text-color-text-tertiary mt-2 indent-4 leading-relaxed">
        Hi there! I'm Mykhailo Zinenko, solo developer and creator of Valheim
        Helper. This open-source, non-commercial project is inspired by{" "}
        <a
          href="http://valheim.kirilloid.ru/"
          target="_blank"
          className="text-color-link hover:underline"
        >
          Valheim utilities
        </a>{" "}
        by{" "}
        <a
          href="https://github.com/kirilloid"
          target="_blank"
          className="text-color-link hover:underline"
        >
          kirilloid
        </a>{" "}
        and{" "}
        <a
          href="https://valculator.io"
          target="_blank"
          className="text-color-link hover:underline"
        >
          Valculator
        </a>{" "}
        by{" "}
        <a
          href="https://www.studiohelga.co.uk/"
          target="_blank"
          className="text-color-link hover:underline"
        >
          Studio Helga
        </a>
        . You can find the project on{" "}
        <a
          href="https://github.com/MykhailoZinenko/valheim-helper"
          className="text-color-link hover:underline"
        >
          GitHub
        </a>
        .
      </p>

      <h2 className="text-3xl mt-6 font-norse font-bold text-color-text-secondary">
        How It Started
      </h2>
      <p className="text-color-text-tertiary mt-2 indent-4 leading-relaxed">
        The idea for this project started brewing when I became a Valheim fan,
        spending countless nights playing. With every hour, one clear challenge
        became evident: managing resources. Will you have enough materials to
        craft a full set? Enough food for extended exploration? How many plants
        should you cultivate for the next harvest? It was always a game of
        calculations, so our first attempt to solve it was this file:
      </p>

      <Card className="m-4 max-w-[350px]">
        <a
          href="public/assets/What we need for boss №3.txt"
          download={true}
          className="flex items-center p-4 gap-4 text-color-link hover:underline"
        >
          <FileIcon />
          <span>First attempt.txt</span>
        </a>
      </Card>

      <p className="text-color-text-tertiary mt-2 indent-4 leading-relaxed">
        As you can imagine, managing everything in a text file wasn't the most
        efficient solution—it was tedious. So I began searching for better
        alternatives. That’s when I found Valculator and Valheim utilities,
        which served as the inspiration for Valheim Helper. However, constant
        switching between tabs and losing track of progress was still a hassle,
        and I wanted a smoother, all-in-one tool.
      </p>

      <h2 className="text-3xl mt-6 font-norse font-bold text-color-text-secondary">
        The Result
      </h2>
      <p className="text-color-text-tertiary mt-2 indent-4 leading-relaxed">
        These frustrations led me to roll up my sleeves and start building
        Valheim Helper. Between my university studies and regular job, I
        dedicated months to development. Now, I’m thrilled to share the result
        with the Valheim community for testing. I’m incredibly thankful for the
        open-source projects that served as the foundation for this tool. Thanks
        for reading—I hope Valheim Helper enhances your gaming experience!
      </p>

      <h2 className="text-3xl mt-6 font-norse font-bold text-color-text-secondary">
        Credits
      </h2>
      <p className="text-color-text-tertiary mt-2 indent-4 leading-relaxed">
        Huge thanks to the developers whose work inspired this project. You can
        support them and show appreciation for their efforts:
      </p>

      <Card className="m-4 max-w-[350px]">
        <a
          href="http://kirilloid.ru/"
          target="_blank"
          className="flex flex-row items-center justify-between p-4 gap-4 text-color-link hover:underline"
        >
          <span>Kirilloid</span>
          <CoffeeIcon className="mt-0" />
        </a>
      </Card>

      <Card className="m-4 max-w-[350px]">
        <a
          href="https://buymeacoffee.com/studiohelga"
          target="_blank"
          className="flex flex-row items-center justify-between p-4 gap-4 text-color-link hover:underline"
        >
          <span>Studio Helga</span>
          <CoffeeIcon className="mt-0" />
        </a>
      </Card>
    </div>
  )
}

export default About
