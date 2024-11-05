import Card from "./components/Card"
import Menu from "./components/Menu"
import Mode from "./components/Mode"
import MatchStatus from "./components/MatchStatus"

function App() {
  return (
    <>
      <div className="h-screen w-full">
        <div className="h-screen w-[100vw] myBg-gradient flex justify-center items-center">
          <Menu/>
          <Mode/>
          <Card/>
          <MatchStatus/>
        </div>
      </div>
    </>
  )
}

export default App
