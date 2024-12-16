import React, { useRef } from "react";
import { Link } from "react-router-dom";

interface GuestInterfaceProps {
  login: (guestName: string) => void;
}

const GuestInterface: React.FC<GuestInterfaceProps> = ({ login }) => {
  const guestNameRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="h-screen bg-center bg-contain bg-no-repeat flex"
      style={{
        backgroundImage: `url('https://i.pinimg.com/736x/a9/c0/9b/a9c09bbdab1958adf2877a0b9a97cdba.jpg')`,
      }}
    >
      <div className="relative my-5 w-[180px] h-[110px] z-0">
        <h1
          //htmlFor="guestInput"
          className="absolute top-[-15px] left-[5px] px-[5px] text-[#9F7153] text-[18px] font-extrabold pointer-events-none"
        >
          訪客名稱
        </h1>
        <input
          type="text"
          id="guestInput"
          ref={guestNameRef}
          className="w-full pt-[12px] p-[10px] z-5 border-none rounded-[4px] box-border bg-[#F7E8C1]"
        />
      </div>
      <div className="absolute top-[75%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[88px] h-[33px] z-4 flex justify-center items-center bg-white border border-[#0000FF] rounded-[5px]"></div>
      <Link to="/biding">
        <div
          onClick={() => {
            if (guestNameRef.current) {
              login(guestNameRef.current.value);
            }
          }}
          className="absolute top-[75%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[80px] h-[25px] z-5 flex justify-center items-center bg-[#FEC100] border-none cursor-pointer text-[20px] font-extrabold rounded-[5px]"
        >
          前往
        </div>
      </Link>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[210px] h-[230px] z-[-1] flex justify-center items-center border-2 border-dashed border-[#d1b89d] bg-transparent"></div>
    </div>
  );
};

export default GuestInterface;