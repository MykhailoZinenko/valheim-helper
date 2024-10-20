import './App.css'

function App() {
  return (
    <div className="text-center w-full">
      <h1 className="text-5xl">Valheim helper 👍</h1>
      <h2 className="text-3xl mt-2">Work in progress...</h2>
      <ol className="font-mono list-decimal list-inside w-fit text-left mt-2">
        <li>Copy data, types and models to project</li>
        <li>Setup database, server and authentication</li>
        <li>Design app UI and structure</li>
        <li>Implement logic </li>
        <li>Deploy to production</li>
      </ol>
    </div>
  )
}

/*
/obj/:id .... {
    0. armor/weapon/armor/creature ? 
    1. resource 
    2. crafting
    3. drops from 
    4. extracted from
    5. creature ? drops

    6. craftable ? recipe table
}
*/

export default App
