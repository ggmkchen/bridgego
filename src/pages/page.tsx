import React, { useRef, useEffect, useState } from "react";
import { FaRegFaceGrin, FaRegFaceGrinWink } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { useWebSocket } from "./websocket";
import { useAppStore} from "../stores/store"; // 引入 zustand 狀態


const CustomButton: React.FC<{ label: string; iconUrl?: string; icon?: React.ReactNode; onClick?: () => void }> = ({
  label,
  iconUrl,
  icon,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="relative font-sans bg-yellow-400 m-3 hover:brightness-110 custom-shadow duration-600 text-yellow-800 font-bold py-2 px-4 rounded-full flex items-center space-x-2 tracking-wide"
  >
    {icon ? (
      <div className="w-5 h-5">{icon}</div>
    ) : (
      iconUrl && <img src={iconUrl} className="w-5 h-5" alt={label} />
    )}
    <span className="text-lg">{label}</span>
    {/* 泡泡效果 */}
    <div className="absolute h-1 w-1 bg-white rounded-full top-2 left-1"></div>
    <div
      className="absolute h-1 w-2 bg-white rounded-full top-1 left-2"
      style={{ transform: "rotate(-15deg)" }}
    ></div>
    <div className="absolute h-1 w-1 bg-white rounded-full bottom-2.5 right-2"></div>
    <div
      className="absolute h-1 w-2 bg-white rounded-full bottom-1.5 right-3"
      style={{ transform: "rotate(-30deg)" }}
    ></div>
  </button>
);


const GuestInterface: React.FC = () => {
  const guestNameRef = useRef<HTMLInputElement>(null);  
  const setAccount = useAppStore((state) => state.setAccount);
  const setPage = useAppStore((state) => state.setPage);

  const handleLoginAndFetchGame = async () => {
    if (!guestNameRef.current) return;

    const account = guestNameRef.current.value.trim(); // 取得輸入的訪客名稱
    if (!account) {
      alert("請輸入訪客名稱！");
      return;
    }

    try {
      // 呼叫第一支 API (POST /loginAsGuest)
      const loginResponse = await axios.post(
        "/loginAsGuest",
        { account },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (loginResponse.status === 200) {
        console.log("登入成功：", loginResponse.data);
        setAccount(loginResponse.data.account); // 確保將 account 存入 Store
        alert(`歡迎, ${account}！`);

        // 呼叫第二支 API (GET /game)
        const gameResponse = await axios.get("/games", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (gameResponse.status === 200) {
          console.log("遊戲資料：", gameResponse.data);
          alert("遊戲資料已取得！");
          setPage("gamelist"); // 切換到遊戲頁面或其他頁面
        } else {
          console.error("無法取得遊戲資料：", gameResponse.status, gameResponse.data);
          alert("無法取得遊戲資料！");
        }
      } else {
        console.error("登入失敗：", loginResponse.status, loginResponse.data);
        alert("登入失敗，請稍後再試！");
      }
    } catch (error) {
      console.error("API 呼叫錯誤：", error);
      alert("發生錯誤，請稍後再試！");
    }
  };

  return (
    <div
      className="h-screen bg-center bg-contain bg-no-repeat flex"
      style={{
        backgroundImage: `url('https://i.pinimg.com/736x/a9/c0/9b/a9c09bbdab1958adf2877a0b9a97cdba.jpg')`,
      }}
    >
      <div className="flex flex-col ml-72">
        <CustomButton
          label="設置"
          iconUrl="https://cdn-icons-png.flaticon.com/128/484/484613.png"
          onClick={() => setPage("setting")}
        />
        <CustomButton
          label="幫忙"
          iconUrl="https://cdn-icons-png.flaticon.com/128/25/25333.png"
          onClick={() => setPage("help")}
        />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[230px] h-[250px] z-3 bg-[#FFF7E9] flex flex-col justify-center items-center shadow-md rounded-lg border-2 border-[#804817]">
        <div className="relative my-5 w-[180px] h-[110px] z-0">
          <label
            htmlFor="guestInput"
            className="absolute top-[-15px] left-[5px] px-[5px] text-[#9F7153] text-[18px] font-extrabold pointer-events-none"
          >
            訪客名稱
          </label>
          <input
            type="text"
            id="guestInput"
            ref={guestNameRef}
            className="w-full pt-[12px] p-[10px] z-5 border-none rounded-[4px] box-border bg-[#F7E8C1]"
          />
        </div>
        <div className="flex flex-row">
          <button
            onClick={() => setPage("bidding")} //home
            className="w-[80px] h-[40px] mt-4 py-2 mx-1 px-6 bg-[#f4f1e7] text-[#101010] font-bold rounded shadow hover:brightness-110"
          >
              返回
          </button>
          <button
            onClick={handleLoginAndFetchGame}
            className="w-[80px] h-[40px] mt-4 py-2 mx-1 px-6 bg-[#FFBF00] text-[#9D3E09] font-bold rounded shadow hover:brightness-110"
          >
            前往
          </button>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[210px] h-[230px] z-[-1] flex justify-center items-center border-2 border-dashed border-[#d1b89d] bg-transparent"></div>
      </div>
    </div>
  );
};
  
export default GuestInterface;


const HelpPage: React.FC = () => {
  const setPage = useAppStore((state) => state.setPage);
  const account = useAppStore((state) => state.account); // 從 Zustand Store 獲取 account

  return (
    <div
        className="h-screen bg-center bg-contain bg-no-repeat flex"
        style={{
          backgroundImage: `url('https://i.pinimg.com/736x/a9/c0/9b/a9c09bbdab1958adf2877a0b9a97cdba.jpg')`,
        }}
    >
      <div className="flex flex-col ml-72">
           <CustomButton
             label="設置"
             iconUrl="https://cdn-icons-png.flaticon.com/128/484/484613.png"
             onClick={() => setPage("setting")}
           />
           <CustomButton
             label="幫忙"
             iconUrl="https://cdn-icons-png.flaticon.com/128/25/25333.png"
             onClick={() => setPage("home")}
           />
      </div>
      <div className="w-[450px] h-[600px] flex flex-col justify-center items-center bg-[#FFF7E9] shadow-md left-[550px] top-10 absolute">
          <div className="iframe-container">
            <iframe
              src="https://cat.hfu.edu.tw/~bridge/%A1i%BE%F4%B5P%AA%BA%B0%F2%A5%BB%B3W%ABh%A1j.htm"
              width="100%"
              height="500"
              frameBorder="0"
              allowFullScreen
              title="嵌入的網頁"
            >
              您的瀏覽器不支援 iframe，無法顯示內容。
            </iframe>
          </div>
          <button
            onClick={() => account? setPage("gamelist") : setPage("home")}
            className="w-[100px] h-[40px] mt-4 py-2 px-6 bg-[#FFBF00] text-[#9D3E09] font-bold rounded shadow hover:brightness-110 bottom-12"
          >
            返回
          </button>
      </div>
    </div>
  );
};

export const SettingPage: React.FC = () => {
  const setPage = useAppStore((state) => state.setPage);
  const volume = useAppStore((state) => state.volume); // 獲取音量大小
  const setVolume = useAppStore((state) => state.setVolume); // 獲取設定音量的方法
  const audioRef = useRef<HTMLAudioElement>(null);
  const account = useAppStore((state) => state.account); // 從 Zustand Store 獲取 account
  

  return (
    <div
        className="h-screen bg-center bg-contain bg-no-repeat flex"
        style={{
          backgroundImage: `url('https://i.pinimg.com/736x/a9/c0/9b/a9c09bbdab1958adf2877a0b9a97cdba.jpg')`,
        }}
    >
      <div className="flex flex-col ml-72">
           <CustomButton
             label="設置"
             iconUrl="https://cdn-icons-png.flaticon.com/128/484/484613.png"
             onClick={() => setPage("home")}
           />
           <CustomButton
             label="幫忙"
             iconUrl="https://cdn-icons-png.flaticon.com/128/25/25333.png"
             onClick={() => setPage("help")}
           />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[230px] h-[250px] z-3 bg-[#FFF7E9] flex flex-col justify-center items-center shadow-md rounded-lg border-2 border-[#804817]">
          <h1 className="font-bold text-[30px] text-[#9D3E09] top-3 absolute">
            遊戲音樂
          </h1>
          <div className="flex items-center space-x-4">
          <button
            onClick={() => setVolume(volume - 0.1)} // 減少音量
            className="px-4 py-2 bg-orange-300 text-white rounded shadow hover:brightness-110"
          >
            -
          </button>
          <span>音量：{Math.round(volume * 100)}%</span>
          <button
            onClick={() => setVolume(volume + 0.1)} // 增加音量
            className="px-4 py-2 bg-orange-300 text-white rounded shadow hover:brightness-110"
          >
            +
          </button>
          </div>
          <button
            onClick={() => account? setPage("gamelist") : setPage("home")}
            className="w-[100px] h-[40px] mt-4 px-6 py-2 bg-[#FFBF00] text-[#9D3E09] font-bold rounded shadow hover:brightness-110 absolute bottom-10"
          >
            返回
          </button>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[210px] h-[230px] z-[-1] flex justify-center items-center border-2 border-dashed border-[#d1b89d] bg-transparent"></div>
          </div>
    </div>
  );
};

export const GameListPage: React.FC = () => {
  const [rooms, setRooms] = useState<GameRoom[]>([]); // 儲存房間列表
  const account = useAppStore((state) => state.account); // 從 Zustand Store 獲取 account
  const setPage = useAppStore((state) => state.setPage);
  const audioRef = useRef<HTMLAudioElement>(null);
  const setAccount = useAppStore((state) => state.setAccount);
  const [currentIndex, setCurrentIndex] = useState(0); // 分頁索引
  const itemsPerPage = 3; // 每頁顯示的房間數量
  const setRoomId = useAppStore((state) => state.setRoomId);
  const gameId = useAppStore((state) => state.roomId); // 從 Zustand Store 獲取 gameId

  
  interface Player {
    id: string | null;
    account: string;
    accountMd5: string;
    accountBase64: string | null;
    cards: any; // 如果 `cards` 有具體結構，請用具體型別替代
    points: any; // 如果 `points` 有具體結構，請用具體型別替代
  }
  
  interface GameRoom {
    id: number;
    roomName: string;
    trump: any; // 如果 `trump` 有具體結構，請用具體型別替代
    level: any; // 如果 `level` 有具體結構，請用具體型別替代
    players: Player[];
    rounds: any; // 如果 `rounds` 有具體結構，請用具體型別替代
    callHistory: any; // 如果 `callHistory` 有具體結構，請用具體型別替代
    status: string; // 假設是固定的字串，如 "WAITING" 等
    createTime: string;
    updateTime: string | null;
  }

  // 從後端獲取房間數據
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("/games"); 
        setRooms(response.data);
      } catch (error) {
        console.error("無法獲取房間數據：", error);
      }
    };
    fetchRooms();
  }, []);


  useEffect(() => {
  console.log("從 Store 獲取的 account：", account);
  }, [account]);

  const handleRoomClick = async (roomId: number) => {
    if (!account) {
      console.error("尚未登入，無法進入房間！");
      return;
    }

    try {
      const response = await axios.put(
        `/games/${roomId}/players`,
        {}, // 請求體可以根據需求填寫
        {
          headers: {
            token: account, // 使用 Zustand Store 中的 account
            gameId: roomId.toString(),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log(`已成功加入房間 ${roomId}`);
        setRoomId(roomId.toString());
        setPage("room"); // 切換到遊戲房間頁面
      } else {
        console.error("加入房間失敗：", response.data);
      }
    } catch (error) {
      console.error("API 呼叫錯誤：", error);
    }
  };

  const handlePlayMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("音樂播放失敗：", error);
      });
    }
  };

  // 計算顯示的房間範圍
  const startIndex = currentIndex * itemsPerPage;
  const displayedRooms = rooms.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (startIndex + itemsPerPage < rooms.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div
      className="h-screen bg-center bg-contain bg-no-repeat flex flex-col items-center"
      style={{
        backgroundImage: `url('https://i.pinimg.com/736x/a9/c0/9b/a9c09bbdab1958adf2877a0b9a97cdba.jpg')`,
      }}
    >
      <div className="flex flex-col ml-3 absolute left-72">
            <CustomButton
              label="設置"
              iconUrl="https://cdn-icons-png.flaticon.com/128/484/484613.png"
              onClick={() => setPage("setting")}
            />
            <CustomButton
              label="幫忙"
              iconUrl="https://cdn-icons-png.flaticon.com/128/25/25333.png"
              onClick={() => setPage("help")}
            />
            <CustomButton
              label="音樂"
              iconUrl="https://cdn-icons-png.flaticon.com/128/3083/3083417.png"
              onClick={handlePlayMusic}
            />
           <CustomButton
             label="登出"
             iconUrl="https://cdn-icons-png.flaticon.com/128/553/553416.png"
             onClick={() => {
              setAccount(""); // 清空 account 值
              setPage("home"); // 切換到首頁
             }}
           />
      </div>
      <div className="w-[230px] h-[70px] z-3 bg-[#FFF7E9] flex flex-col justify-center items-center shadow-md border-2 mt-24 border-[#804817]">
        <h1 className="text-3xl font-bold text-yellow-800">
          房間列表
        </h1>
      </div>  
      <div className="mt-40 flex flex-row justify-center gap-6">
        {/* 上一頁 */}
        <button
          onClick={handlePrevPage}
          disabled={currentIndex === 0}
          className={`w-[35px] h-[80px] mt-12 pl-2 ml-6 py-2 rounded-lg font-bold text-white ${
            currentIndex === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          <FaChevronLeft />
        </button>
        {displayedRooms.map((room) => (
          <div
            key={room.id}
            className="relative flex flex-col items-center bg-white p-4 shadow-md rounded-lg w-64 hover:scale-105 transform transition-transform duration-200 cursor-pointer"
            onClick={() => {
              console.log(`進入房間 ${room.roomName}，ID: ${room.id}`);
              handleRoomClick(room.id) // 點擊房間執行 API
            }}
          >
            {/* 按鈕 */}
            <img
              src="https://i.pinimg.com/736x/06/69/ec/0669ec0afef244e84ad08cb6eef11e51.jpg"
              alt="房間按鈕"
              className="w-12 h-12 hover:brightness-110"
            />
            {/* 疊加的文字 */}
            <div className="absolute mt-4 flex justify-center items-center rounded-lg">
              <p className="text-amber-600 text-xl font-bold">{room.players.length}</p>
            </div>
            {/* 房間資訊 */}
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-yellow-800">
                房間名稱：{room.roomName}
              </p>
              <p className="text-sm text-gray-700">ID：{room.id}</p>
              <p className="text-sm text-gray-700">
                遊玩人數：{room.players.length}
              </p>
              <p className="text-sm text-gray-700">狀態：{room.status}</p>
            </div>
          </div>
        ))}
        {/* 下一頁 */}
        <button
          onClick={handleNextPage}
          disabled={startIndex + itemsPerPage >= rooms.length}
          className={`w-[35px] h-[80px] mt-12 pl-2 py-2 rounded-lg font-bold text-white ${
            startIndex + itemsPerPage >= rooms.length
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          <FaChevronRight />  
        </button>
      </div>
    </div>
  );
};

const RoomPage: React.FC = () => {
  const setPage = useAppStore((state) => state.setPage);
  const account = useAppStore((state) => state.account); // 從 Zustand Store 獲取 account
  const audioRef = useRef<HTMLAudioElement>(null);
  const { sendMessage, messages, connected } = useWebSocket();
  const [isGameStartEnabled, setIsGameStartEnabled] = useState(false); // 控制按鈕是否啟用
  const gameId = useAppStore((state) => state.roomId); // 從 Zustand Store 獲取 gameId
  const setRoomId = useAppStore((state) => state.setRoomId);
  const [countdown, setCountdown] = useState<number | null>(null); // 倒數計時
  

  // 播放音樂功能
  const handlePlayMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("音樂播放失敗：", error);
      });
    }
  };

  // 進入房間時發送 ENTRY 訊息。
  // useEffect 確保這個邏輯只會在 connected 改變時執行。
  useEffect(() => {
    if (connected) {
      sendMessage("/topic/entry", {
        type: "ENTRY",
        message: `new player ${account} has entered the room`,
        createTime: new Date().toISOString(),
      });
      console.log("已發送 ENTRY 訊息");
    }
  }, [connected]);

  // 立即開始遊戲 API 呼叫（處理 READY 訊息）
  const handleStartGame = async () => {
    try {
      const token = account; // 使用 account 作為 token
      await axios.put(
        `/games/${gameId}/status`,
        { status: "START" },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 假設 API 需要 Bearer Token 格式
          },
        }
      );
      console.log("遊戲開始 API 呼叫成功");
    } catch (error) {
      console.error("開始遊戲 API 呼叫失敗:", error);
      alert("開始遊戲失敗，請稍後再試");
    }
  };

  // 處理 WebSocket 訊息
  useEffect(() => {
    messages.forEach((msg) => {
      const parsedMsg = JSON.parse(msg.body);

      if (msg.topic.startsWith("/topic/begin/")) {
        console.log("收到 /topic/begin 訊息:", parsedMsg);

        if (parsedMsg.type === "READY") {
          console.log("收到 READY 訊息，呼叫開始遊戲 API");
          handleStartGame(); // 立即打 API，變更遊戲狀態
        }

        if (parsedMsg.type === "BEGIN") {
          console.log("收到 BEGIN 訊息，開始倒數計時！");
          setIsGameStartEnabled(true);
          setCountdown(5);

          // 開始倒數
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev === null || prev <= 1) {
                clearInterval(timer);
                setPage("bidding"); // 倒數結束後自動跳轉
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
    });
  }, [messages]);

  return (
    <div
        className="h-screen bg-center bg-contain bg-no-repeat flex"
        style={{
          backgroundImage: `url('https://i.pinimg.com/736x/a9/c0/9b/a9c09bbdab1958adf2877a0b9a97cdba.jpg')`,
        }}
    >
      <div className="flex flex-col ml-72">
           <CustomButton
              label="音樂"
              iconUrl="https://cdn-icons-png.flaticon.com/128/3083/3083417.png"
              onClick={handlePlayMusic}
            />
      </div>    
      <div className="w-[350px] h-[450px] ml-48 mt-36 flex flex-col items-center bg-white p-4 shadow-md rounded-lg hover:scale-105 transform transition-transform duration-200 cursor-pointer">          
          <h1 className="text-3xl font-bold text-yellow-800">
            房間名稱 : XXX
          </h1>
          <img
              src="./room.png"
              alt="房間狀態"
              className="w-120 h-120 mt-4 hover:brightness-110"
          />
          <div className="flex flex-row gap-6">
            <button
              onClick={() => {
                setPage("gamelist");
                setRoomId("");
              }}
              className="w-[120px] h-[40px] mt-4 py-2 px-6 bg-[#FFBF00] text-[#9D3E09] font-bold rounded shadow hover:brightness-110 bottom-12"
            >
              退出房間
            </button>
            <button
              //onClick={handleStartGame}
              disabled={!isGameStartEnabled} // 動態控制按鈕是否禁用
              className={`w-[120px] h-[40px] mt-4 py-2 px-6 font-bold rounded shadow ${
                isGameStartEnabled
                  ? "bg-[#FFBF00] text-[#9D3E09] hover:brightness-110"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              開始遊戲 {countdown !== null ? `(${countdown}s)` : ""}
            </button>
          </div>
      </div>
    </div>
  );
};


export const GameBidding: React.FC = () => {
  const setPage = useAppStore((state) => state.setPage);
  const gameId = useAppStore((state) => state.roomId); // 從 Zustand Store 獲取 gameId
  const account = useAppStore((state) => state.account); // 從 Zustand Store 獲取 account

  const callTypes = ["NO_KING", "SPADE", "HEART", "DIAMOND", "CLUB"];
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [selectedSuit, setSelectedSuit] = useState<string | null>(null);
  
  return (
    <div
        className="h-screen bg-center bg-contain bg-no-repeat flex"
        style={{ backgroundImage: 'url("/start.png")' }}
    >
      <div className="absolute flex flex-col gap-1 bottom-[10px] right-[330px]">
        <div className="w-[200px] h-[55px] rounded-[15px] border-[3px] border-[#804817] bg-[#964C5F] text-[#FFF] text-[20px] font-extrabold">
            <div className="absolute ml-16 mt-3 font-bold text-[#FFF7E9] text-[16px]">墩數 :</div>
            <div className="absolute w-[180px] h-[35px] border-dashed border-[2px] border-[#FFF7E9] rounded-[10px] m-[7px]"></div>
        </div>
        <div className="w-[200px] h-[120px] rounded-[15px] border-[3px] border-[#804817] bg-[#FFF7E9] text-[#FFF] text-[20px] font-extrabold">
            <div className="absolute ml-16 mt-2 text-[#66635d] text-[25px]">王牌</div>
            <div className="absolute w-[180px] h-[105px] border-dashed border-[2px] border-[#804817] rounded-[10px] m-[6px]">
             <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#4E1D02] text-[25px] font-bold">
              {selectedNum !== null ? `${selectedSuit}${selectedNum}` : "請選擇"}
             </span>
            </div>
        </div>
      </div>
      <div className="absolute flex flex-col items-center justify-center space-y-1 bottom-2 left-[740px]">
      {/* 圖片 */}
        <img src="/rabbit_1.png" alt="" className="h-[25px] w-[40px]" />
      {/* 下方的 div */}
        <div className="relative flex flex-col items-center justify-center w-[68px] h-[30px] bg-transparent border-[3px] border-[#CA986B] rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="inset-[2px] bg-[#593E25] rounded-[25px] w-full h-full"></div>
          <div className="absolute w-full text-center text-[#FFF7E9] font-semibold">0</div>
        </div>
      </div>
      <div className="absolute flex flex-col items-center justify-center space-y-1 top-2 left-[740px]">
      {/* 圖片 */}
        <img src="/rabbit_2.png" alt="" className="h-[25px] w-[40px]" />
      {/* 下方的 div */}
        <div className="relative flex flex-col items-center justify-center w-[68px] h-[30px] bg-transparent border-[3px] border-[#CA986B] rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="inset-[2px] bg-[#593E25] rounded-[25px] w-full h-full"></div>
          <div className="absolute w-full text-center text-[#FFF7E9] font-semibold">0</div>
        </div>
      </div>
      <div className="absolute flex flex-col items-center justify-center space-y-1 top-1/2 left-[330px]">
      {/* 圖片 */}
        <img src="/rabbit_3.png" alt="" className="h-[25px] w-[40px]" />
      {/* 下方的 div */}
        <div className="relative flex flex-col items-center justify-center w-[68px] h-[30px] bg-transparent border-[3px] border-[#CA986B] rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="inset-[2px] bg-[#593E25] rounded-[25px] w-full h-full"></div>
          <div className="absolute w-full text-center text-[#FFF7E9] font-semibold">0</div>
        </div>
      </div>
      <div className="absolute flex flex-col items-center justify-center space-y-1 top-1/2 right-[330px]">
      {/* 圖片 */}
        <img src="/rabbit_4.png" alt="" className="h-[25px] w-[40px]" />
      {/* 下方的 div */}
        <div className="relative flex flex-col items-center justify-center w-[68px] h-[30px] bg-transparent border-[3px] border-[#CA986B] rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="inset-[2px] bg-[#593E25] rounded-[25px] w-full h-full"></div>
          <div className="absolute w-full text-center text-[#FFF7E9] font-semibold">0</div>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] z-3 bg-[#fffbf3] flex flex-col justify-center shadow-md rounded-lg border-2 border-[#804817]">
          <div className="flex flex-col items-center justify-center">
              <div className="relative mb-[10px] w-[88px] h-[40px] bg-transparent border-[3px] border-[#804817] rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                  <div className="absolute inset-[2px] bg-[#804817] rounded-[25px]"></div>
                  <div className="absolute w-full text-center text-[#FFF7E9] font-semibold top-[20%]">王牌區</div>
              </div>
              <div className="flex space-x-2 ml-2 mr-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <div key={num} 
                           onClick={() => {
                              setSelectedNum(num);
                              setSelectedSuit("NT");
                           }} 
                           className="relative flex flex-col items-center cursor-pointer"
                      >
                          <img src="/icon.svg" alt="" className="h-[35px] w-[50px]" />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#4E1D02] text-sm font-bold">
                            {num}NT
                          </span>
                      </div>
                  ))}
              </div>
              <div className="flex space-x-2 ml-2 mr-2 mt-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <div key={num} 
                           onClick={() => {
                            setSelectedNum(num);
                            setSelectedSuit("黑桃");
                          }} 
                           className="relative flex flex-row items-center cursor-pointer"
                      >
                          <img src="/icon-7.svg" alt="" className="h-[35px] w-[55px]" />
                          <span className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 text-[#000000] text-sm font-bold">
                            {num}
                          </span>
                          <img src="/vector.svg" alt="" className="absolute top-[5px] left-[6px] h-[15px] w-[15px]" />
                      </div>
                  ))}
              </div>
              <div className="flex space-x-2 ml-2 mr-2 mt-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <div key={num}
                           onClick={() => {
                            setSelectedNum(num);
                            setSelectedSuit("愛心");
                           }} 
                           className="relative flex flex-row items-center cursor-pointer"
                      >
                          <img src="/icon-14.svg" alt="" className="h-[35px] w-[55px]" />
                          <span className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 text-[#944C88] text-sm font-bold">
                            {num}
                          </span>
                          <img src="/vector-7.svg" alt="" className="absolute top-[6px] left-[3px] h-[20px] w-[20px]" />
                      </div>
                  ))}
              </div>
              <div className="flex space-x-2 ml-2 mr-2 mt-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <div key={num}
                           onClick={() => {
                              setSelectedNum(num);
                              setSelectedSuit("磚塊");
                           }} 
                           className="relative flex flex-row items-center cursor-pointer"
                      >
                          <img src="/icon-21.svg" alt="" className="h-[35px] w-[55px]" />
                          <span className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 text-[#6F4C18] text-sm font-bold">
                            {num}
                          </span>
                          <img src="/vector-14.svg" alt="" className="absolute top-[6px] left-[6px] h-[15px] w-[15px]" />
                      </div>
                  ))}
              </div>
              <div className="flex space-x-2 ml-2 mr-2 mt-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <div key={num}
                           onClick={() => {
                              setSelectedNum(num);
                              setSelectedSuit("梅花");
                           }} 
                           className="relative flex flex-row items-center cursor-pointer"
                      >
                          <img src="/icon-28.svg" alt="" className="h-[35px] w-[55px]" />
                          <span className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 text-[#58B5F9] text-sm font-bold">
                            {num}
                          </span>
                          <img src="/vector-21.svg" alt="" className="absolute top-[6px] left-[6px] h-[15px] w-[15px]" />
                      </div>
                  ))}
              </div>
              {/* 重複的區塊，根據不同的 icon 和樣式調整 */}
              <div className="flex mt-4">
                  <div className="w-[304.3px] flex flex-row gap-[10px]">
                      <div className="relative flex-1 cursor-pointer">
                          <div className="absolute w-[99.24%] h-[91.05%] top-[9.17%] left-[0.76%] bg-green-600 rounded-[15px]"></div>
                          <div className="absolute w-[61.05%] h-[54.59%] top-[15%] left-[23%] text-center font-bold text-xl text-[#FFF7E9]">PASS</div>
                      </div>
                      <div className="relative w-[86px] h-[40px] cursor-pointer">
                          <div className="absolute w-[99.24%] h-[91.05%] top-[9.17%] left-[0.76%] bg-yellow-400 border border-yellow-300 rounded-[15px]"></div>
                          <div className="absolute w-[61.05%] h-[54.59%] top-[15%] left-[23%] text-center font-bold text-xl text-[#FFF7E9]">V</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export const GamePlay: React.FC = () => {
  const setPage = useAppStore((state) => state.setPage);
  
  return (
    <div
        className="h-screen bg-center bg-contain bg-no-repeat flex"
        style={{ backgroundImage: 'url("/start.png")' }}
    >
      <div className="absolute flex flex-col gap-1 bottom-[10px] right-[330px]">
        <div className="w-[200px] h-[55px] rounded-[15px] border-[3px] border-[#804817] bg-[#964C5F] text-[#FFF] text-[20px] font-extrabold">
            <div className="absolute ml-16 mt-3 font-bold text-[#FFF7E9] text-[16px]">墩數 :</div>
            <div className="absolute w-[180px] h-[35px] border-dashed border-[2px] border-[#FFF7E9] rounded-[10px] m-[7px]"></div>
        </div>
        <div className="w-[200px] h-[120px] rounded-[15px] border-[3px] border-[#804817] bg-[#FFF7E9] text-[#FFF] text-[20px] font-extrabold">
            <div className="absolute ml-16 mt-2 text-[#66635d] text-[25px]">王牌</div>
            <div className="absolute w-[180px] h-[105px] border-dashed border-[2px] border-[#804817] rounded-[10px] m-[6px]"></div>
        </div>
      </div>
      <div className="absolute flex flex-col items-center justify-center space-y-1 bottom-2 left-[740px]">
      {/* 圖片 */}
        <img src="/rabbit_1.png" alt="" className="h-[25px] w-[40px]" />
      {/* 下方的 div */}
        <div className="relative flex flex-col items-center justify-center w-[68px] h-[30px] bg-transparent border-[3px] border-[#CA986B] rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="inset-[2px] bg-[#593E25] rounded-[25px] w-full h-full"></div>
          <div className="absolute w-full text-center text-[#FFF7E9] font-semibold">0</div>
        </div>
      </div>
      <div className="absolute flex flex-col items-center justify-center space-y-1 top-2 left-[740px]">
      {/* 圖片 */}
        <img src="/rabbit_2.png" alt="" className="h-[25px] w-[40px]" />
      {/* 下方的 div */}
        <div className="relative flex flex-col items-center justify-center w-[68px] h-[30px] bg-transparent border-[3px] border-[#CA986B] rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="inset-[2px] bg-[#593E25] rounded-[25px] w-full h-full"></div>
          <div className="absolute w-full text-center text-[#FFF7E9] font-semibold">0</div>
        </div>
      </div>
      <div className="absolute flex flex-col items-center justify-center space-y-1 top-1/2 left-[330px]">
      {/* 圖片 */}
        <img src="/rabbit_3.png" alt="" className="h-[25px] w-[40px]" />
      {/* 下方的 div */}
        <div className="relative flex flex-col items-center justify-center w-[68px] h-[30px] bg-transparent border-[3px] border-[#CA986B] rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="inset-[2px] bg-[#593E25] rounded-[25px] w-full h-full"></div>
          <div className="absolute w-full text-center text-[#FFF7E9] font-semibold">0</div>
        </div>
      </div>
      <div className="absolute flex flex-col items-center justify-center space-y-1 top-1/2 right-[330px]">
      {/* 圖片 */}
        <img src="/rabbit_4.png" alt="" className="h-[25px] w-[40px]" />
      {/* 下方的 div */}
        <div className="relative flex flex-col items-center justify-center w-[68px] h-[30px] bg-transparent border-[3px] border-[#CA986B] rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="inset-[2px] bg-[#593E25] rounded-[25px] w-full h-full"></div>
          <div className="absolute w-full text-center text-[#FFF7E9] font-semibold">0</div>
        </div>
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const currentPage = useAppStore((state) => state.currentPage);
  const setPage = useAppStore((state) => state.setPage);
  const setGuestName = useAppStore((state) => state.setGuestName);
  const volume = useAppStore((state) => state.volume); // 獲取音量大小
  const setVolume = useAppStore((state) => state.setVolume); // 獲取設定音量的方法
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // 更新背景音樂的音量
    }
  }, [volume]); // 當音量狀態改變時觸發

  const handlePlayMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("音樂播放失敗：", error);
      });
    }
  };

  return (
    <>
      {/* 背景音樂 */}
      <audio ref={audioRef} autoPlay loop>
        <source src="/bg.mp3" type="audio/mpeg" />
        您的瀏覽器不支援音樂播放。
      </audio>   
      {currentPage === "home" && (
        <div
          className="h-screen bg-center bg-contain bg-no-repeat flex"
          style={{
            backgroundImage: `url('https://i.pinimg.com/736x/a9/c0/9b/a9c09bbdab1958adf2877a0b9a97cdba.jpg')`,
          }}
        >
          <div className="flex flex-col ml-72">
            <CustomButton
              label="設置"
              iconUrl="https://cdn-icons-png.flaticon.com/128/484/484613.png"
              onClick={() => setPage("setting")}
            />
            <CustomButton
              label="幫忙"
              iconUrl="https://cdn-icons-png.flaticon.com/128/25/25333.png"
              onClick={() => setPage("help")}
            />
            <CustomButton
              label="音樂"
              iconUrl="https://cdn-icons-png.flaticon.com/128/3083/3083417.png"
              onClick={handlePlayMusic}
            />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[230px] h-[250px] z-3 bg-[#FFF7E9] flex flex-col justify-center items-center shadow-md rounded-lg border-2 border-[#804817]">
            <button
              className="w-[140px] h-[30px] z-5 mb-[50px] flex justify-center items-center bg-[#FFBF00] border-none rounded-[15px] font-bold text-[20px] cursor-pointer text-[#9D3E09] shadow-md"
            >
              <FaRegFaceGrin style={{ marginRight: "10px" }} />
              我要登入
            </button>
            <button
              className="w-[140px] h-[30px] z-5 mb-[50px] flex justify-center items-center bg-[#FFBF00] border-none rounded-[15px] font-bold text-[20px] cursor-pointer text-[#9D3E09] shadow-md"
              onClick={() => setPage("guest")}
            >
              <FaRegFaceGrinWink style={{ marginRight: "10px" }} />
              我是訪客
            </button>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[210px] h-[230px] z-[-1] flex justify-center items-center border-2 border-dashed border-[#d1b89d] bg-transparent"></div>
          </div>
        </div>
      )}

      {currentPage === "guest" && <GuestInterface />}

      {currentPage === "help" && <HelpPage />}

      {currentPage === "setting" && <SettingPage />}

      {currentPage === "gamelist" && <GameListPage />}

      {currentPage === "room" && <RoomPage />}

      {currentPage === "bidding" && <GameBidding />}

      {currentPage === "play" && <GamePlay />}
    </>
  );
};