import Card from "./components/Card"
import SideBar from "./components/SideBar"
import Timer from "./components/Timer"

function App() {

  return (
    <>
      <div>
        <SideBar/>
        <div className="h-screen w-full flex justify-around items-center myBg ">
          <Card/>
          <Timer/>
          <Card/>
        </div>
      </div>
    </>
  )
}

export default App
