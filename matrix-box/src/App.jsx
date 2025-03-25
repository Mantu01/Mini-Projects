import { useState, useEffect } from 'react';

function App() {
  const [clickedBoxes, setClickedBoxes] = useState(Array(9).fill(false));
  const [clickSequence, setClickSequence] = useState([]);
  const [allClicked, setAllClicked] = useState(false);
  const [orangeBoxes, setOrangeBoxes] = useState(Array(9).fill(false));

  const handleBoxClick = (index) => {
    if (allClicked || clickedBoxes[index]) return;
    const newClickedBoxes = [...clickedBoxes];
    newClickedBoxes[index] = true;
    setClickedBoxes(newClickedBoxes);
    const newClickSequence = [...clickSequence, index];
    setClickSequence(newClickSequence);
    if (newClickSequence.length === 9) {
      setAllClicked(true);
    }
  };
  useEffect(() => {
    if (allClicked) {
      clickSequence.forEach((boxIndex, sequenceIndex) => {
        setTimeout(() => {
          setOrangeBoxes((prev) => {
            const newOrangeBoxes = [...prev];
            newOrangeBoxes[boxIndex] = true;
            return newOrangeBoxes;
          });
        }, 300 * sequenceIndex);
      });
    }
  }, [allClicked, clickSequence]);
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-slate-100">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Interactive Grid</h1>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="grid grid-cols-3 gap-2">
          {Array(9).fill().map((_, index) => (
            <div
              key={index}
              onClick={() => handleBoxClick(index)}
              className={
                `w-20 h-20 m-2 rounded-lg transition-all duration-200 flex items-center justify-center text-sm font-medium cursor-pointer hover:shadow-lg ${orangeBoxes[index] ? 'bg-orange-500 text-white' : clickedBoxes[index] ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`
              }
            ></div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="text-slate-600">
            {allClicked
              ? 'All boxes clicked! Watch the animation.'
              : `Clicked ${clickSequence.length} of 9 boxes`}
          </p>
          {allClicked && (
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => {
                setClickedBoxes(Array(9).fill(false));
                setClickSequence([]);
                setAllClicked(false);
                setOrangeBoxes(Array(9).fill(false));
              }}>
              Reset Grid
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;