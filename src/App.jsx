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
    <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl text-center font-bold text-gray-800 mb-6 uppercase">
        Đoán ký tự đúng
      </h1>
      <div className="text-center">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600 font-medium">
            Thời gian còn lại:{' '}
            <span className="text-blue-600 font-semibold">
              {countdown} giây
            </span>
          </p>
          <button
            disabled={status}
            onClick={() => setStatus(true)}
            className={`px-4 py-2 font-semibold rounded-lg text-white transition-all ${
              status
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {status ? 'Đang chạy...' : 'Bắt đầu'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 w-3/4 mx-auto mb-6">
          {arr.map(choice => (
            <button
              disabled={!status}
              key={choice}
              onClick={() => handleChoice(choice)}
              className={`p-4 text-lg font-bold rounded-lg transition-all border-2 ${
                myChoice.includes(choice)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-gray-800 mb-2">Kết quả trước đó:</h2>
        <ul className="space-y-2">
          {log.length <= 0 ? (
            <h1 className="text-center font-semibold uppercase text-[12px] opacity-60">
              Chưa có kết quả
            </h1>
          ) : (
            log.map((item, index) => (
              <li
                key={index}
                className="text-sm text-gray-700 border rounded-lg p-2 bg-gray-100"
              >
                <span className="font-semibold">Lần {index + 1}:</span> Kết quả
                đúng:{' '}
                <span className="font-semibold text-green-600">
                  {item.correctAnswers.join(', ')}
                </span>
                , Bạn chọn:{' '}
                <span className="font-semibold text-blue-600">
                  {item.userChoices.length > 0
                    ? item.userChoices.join(', ')
                    : 'Bạn chưa chọn'}
                </span>
                , Tỉ lệ đúng:{' '}
                <span className="font-semibold text-red-600">
                  {item.percentCorrect}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default App;
