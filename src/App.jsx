import { useEffect, useState } from 'react';

const arr = ['A', 'B', 'C', 'D'];
const App = () => {
  const [status, setStatus] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [myChoice, setMychoice] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [log, setLog] = useState([]);

  const generateRandomAnswers = () => {
    const newArr = [...arr].sort(() => 0.5 - Math.random());
    setCorrectAnswers(newArr.slice(0, 2));
  };

  const handleChoice = choice => {
    if (myChoice.includes(choice)) {
      setMychoice(myChoice.filter(item => item !== choice));
    } else if (myChoice.length < 2) {
      setMychoice([...myChoice, choice]);
    }
  };

  useEffect(() => {
    if (status === true && countdown > 0) {
      generateRandomAnswers();
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      const correctCount = myChoice.filter(choice =>
        correctAnswers.includes(choice)
      ).length;
      const percentCorrect = `${(correctCount / 2) * 100}%`;

      const result = {
        correctAnswers: [...correctAnswers],
        userChoices: [...myChoice],
        percentCorrect,
      };

      setLog(prevLog => [...prevLog, result]);
      resetGame();
    }
  }, [status, countdown]);

  const resetGame = () => {
    setStatus(false);
    setCountdown(10);
    setMychoice([]);
  };

  return (
    <div className="w-[40%] mx-auto pt-10 shadow-2xl p-3">
      <h1 className="text-[20px] text-center font-[700] mb-6 uppercase">
        Đoán ký tự đúng
      </h1>
      <div className="px-3">
        <div className=" flex justify-between">
          <div className="flex gap-2">
            Thời gian còn lại:{' '}
            <h3 className="font-semibold">{countdown} giây</h3>
          </div>
          <button
            disabled={status}
            onClick={() => setStatus(true)}
            className="cursor-pointer px-3 py-2 bg-blue-500 text-white font-semibold rounded-sm text-[14px] mb-4"
          >
            {status === true ? (
              <div className="flex justify-center items-center select-none opacity-50 px-3 py-2">
                <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
              </div>
            ) : (
              'Bắt đầu'
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 w-1/2 mx-auto mb-4">
          {arr.map(choice => (
            <button
              disabled={!status}
              key={choice}
              onClick={() => handleChoice(choice)}
              className={`cursor-pointer p-4 text-lg font-bold rounded-lg transition-all ${
                myChoice.includes(choice)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-none'
              }`}
            >
              {choice}
            </button>
          ))}
        </div>

        <div>
          <h1 className="font-semibold mb-2">Kết quả trước đó:</h1>
          <ul>
            {log.map((item, index) => {
              console.log(item);

              return (
                <li className="text-[14px] flex gap-2 mb-1" key={index}>
                  <strong>Lần {index + 1}:</strong> Kết quả đúng:{' '}
                  <h1 className="font-semibold">{item.correctAnswers}</h1>, Bạn
                  chọn:{' '}
                  <h1 className="font-semibold">
                    {item.userChoices.length > 0
                      ? item.userChoices
                      : 'Bạn chưa chọn'}
                  </h1>
                  , Tỉ lệ đúng:{' '}
                  <h1 className="font-semibold">{item.percentCorrect}</h1>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
