# README - Ứng Dụng Đoán Ký Tự Đúng

## Mô tả

Ứng dụng "Đoán Ký Tự Đúng" là một trò chơi nhỏ sử dụng React, nơi người chơi sẽ chọn hai ký tự từ danh sách `['A', 'B', 'C', 'D']` trong thời gian 10 giây. Sau khi hết thời gian, chương trình sẽ so sánh lựa chọn của người chơi với kết quả đúng được chọn ngẫu nhiên và hiển thị kết quả.

---

## Cách thức hoạt động

### 1. **Trạng thái (State) quản lý dữ liệu**

Ứng dụng sử dụng `useState` để quản lý các state chính:

- `status`: Trạng thái của trò chơi (`true`: đang chạy, `false`: chưa bắt đầu).
- `countdown`: Đếm ngược số giây còn lại (mặc định là 10 giây).
- `myChoice`: Danh sách các lựa chọn của người chơi (tối đa 2 ký tự).
- `correctAnswers`: Danh sách 2 ký tự đúng, được chọn ngẫu nhiên.
- `log`: Lịch sử các lần chơi trước.

### 2. **Bắt đầu trò chơi**

- Khi người dùng nhấn nút "Bắt đầu", `status` sẽ được đặt thành `true` và bộ đếm thời gian bắt đầu giảm dần mỗi giây.
- Mỗi lần trò chơi bắt đầu, `correctAnswers` sẽ được tạo ngẫu nhiên bằng cách sắp xếp lại mảng `arr` và chọn 2 phần tử đầu tiên.

### 3. **Lựa chọn ký tự**

- Khi người chơi nhấn vào một ký tự:
  - Nếu ký tự đó đã được chọn, nó sẽ bị loại bỏ khỏi `myChoice`.
  - Nếu chưa chọn và số lượng chọn chưa quá 2, nó sẽ được thêm vào `myChoice`.

### 4. **Đếm ngược thời gian và kiểm tra kết quả**

- `useEffect` được sử dụng để cập nhật countdown mỗi giây khi `status === true`.
- Khi `countdown` về 0:
  - So sánh `myChoice` với `correctAnswers`.
  - Tính toán tỉ lệ đúng.
  - Lưu kết quả vào `log`.
  - Reset trò chơi.

### 5. **Reset trò chơi**

- Khi trò chơi kết thúc (countdown = 0), tất cả các state sẽ được đặt lại:
  - `status` → `false`
  - `countdown` → `10`
  - `myChoice` → `[]`
  - `correctAnswers` → giữ nguyên để lưu kết quả
  - `log` → cập nhật lịch sử trò chơi

---

## Cấu trúc mã nguồn

### 1. **Hàm `generateRandomAnswers`**

```js
const generateRandomAnswers = () => {
  const newArr = [...arr].sort(() => 0.5 - Math.random());
  setCorrectAnswers(newArr.slice(0, 2));
};
```

- Trộn mảng `arr` ngẫu nhiên.
- Lấy 2 phần tử đầu tiên làm kết quả đúng.

### 2. **Hàm `handleChoice`**

```js
const handleChoice = choice => {
  if (myChoice.includes(choice)) {
    setMychoice(myChoice.filter(item => item !== choice));
  } else if (myChoice.length < 2) {
    setMychoice([...myChoice, choice]);
  }
};
```

- Nếu người chơi chọn lại ký tự đã chọn, nó sẽ bị xóa khỏi danh sách.
- Nếu chưa chọn và còn slot trống, nó sẽ được thêm vào danh sách `myChoice`.

### 3. **Hàm `useEffect` quản lý thời gian**

```js
useEffect(() => {
  if (status && countdown > 0) {
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
```

- Nếu `status === true` và `countdown > 0`, trò chơi tiếp tục đếm ngược.
- Khi `countdown === 0`, tính toán kết quả và reset trò chơi.

### 4. **Hàm `resetGame`**

```js
const resetGame = () => {
  setStatus(false);
  setCountdown(10);
  setMychoice([]);
};
```

- Đặt lại trạng thái trò chơi về ban đầu.

---

## Giao diện

### 1. **Hiển thị thời gian còn lại và nút bắt đầu**

```js
<div className="flex gap-2">
  Thời gian còn lại: <h3 className="font-semibold">{countdown} giây</h3>
</div>
<button disabled={status} onClick={() => setStatus(true)}>
  {status ? 'Đang chạy...' : 'Bắt đầu'}
</button>
```

### 2. **Danh sách lựa chọn ký tự**

```js
{
  arr.map(choice => (
    <button
      disabled={!status}
      key={choice}
      onClick={() => handleChoice(choice)}
      className={myChoice.includes(choice) ? 'bg-blue-500' : 'bg-gray-200'}
    >
      {choice}
    </button>
  ));
}
```

### 3. **Hiển thị lịch sử kết quả**

```js
<ul>
  {log.map((item, index) => (
    <li key={index}>
      <strong>Lần {index + 1}:</strong>
      Kết quả đúng: {item.correctAnswers.join(', ')}, Bạn chọn: {item.userChoices.join(
        ', '
      )}, Tỉ lệ đúng: {item.percentCorrect}
    </li>
  ))}
</ul>
```
