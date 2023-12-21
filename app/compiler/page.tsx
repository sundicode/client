"use client";
import toast, { Toaster } from "react-hot-toast";
import { BiMessageRoundedMinus, BiSend } from "react-icons/bi";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-statusbar";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-jsx";
import { useEffect, useState } from "react";
import { Fira_Mono } from "next/font/google";
import { io } from "socket.io-client";
import { useChartContext } from "../ChartContext";
import { useRouter } from "next/navigation";
import { UserInfo } from "os";
const editorFont = Fira_Mono({ subsets: ["latin"], weight: ["400"] });
type User = {
  roomId: string;
  username: string;
};
const Compiller = () => {
  // const code = "var message = 'Monaco Editor!' \nconsole.log(message);";
  const language = [
    "html",
    "javascript",
    "python",
    "php",
    "css",
    "c_cpp",
    "jsx",
  ];
  const themes = [
    "monokai",
    "twilight",
    "github",
    "cobalt",
    "xcode",
    "one_dark",
    "dracular",
  ];
  const [openLanguageModal, setOpenLanguageModal] = useState<boolean>(true);
  const [mode, setMode] = useState<string>("python");
  const [openThemeModal, setOpenThemeModal] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>("twilight");
  const { userInfo, socket } = useChartContext();
  const [users, setUsers] = useState<User[]>([]);
  const [code, setCode] = useState<string>("");

  const router = useRouter();
  useEffect(() => {
    if (userInfo) {
      setUsers((prev) => [...prev, userInfo]);
    }
  }, [userInfo]);

  useEffect(() => {}, []);
  const handleThemeModal = () => {
    setOpenThemeModal(!openThemeModal);
  };
  const handleMode = (mode: string) => {
    setMode(mode);
    setOpenLanguageModal(true);
  };
  const handleTheme = (theme: string) => {
    setTheme(theme);
    setOpenThemeModal(true);
  };
  const handleLanguageModal = () => {
    setOpenLanguageModal(!openLanguageModal);
  };

  const leaveRoom = () => {
    router.push("/");
  };

  return (
    <div className="w-screen min-h-screen flex relative">
      <Toaster
        toastOptions={{
          duration: 5000,
          style: {
            background: "#008000",
            color: "#fff",
          },
        }}
      />
      <div className="flex-[.19] flex-shrink-0 px-3 pt-4 bg-[#f5f5f5]">
        <div>
          <h1>Active Collaborators</h1>
          <div className="flex flex-col justify-between h-[90vh]">
            <div className="flex flex-wrap gap-3">
              {users.map((user, i) => (
                <div className="flex flex-col items-center" key={i}>
                  <div className="bg-red-700 rounded-full w-[40px] h-[40px] flex items-center text-white justify-center"></div>
                  <p className="text-[12px] text-gray-600">{user.username}</p>
                </div>
              ))}
            </div>
            <div>
              <button
                className="w-full py-2 rounded bg-yellow-500 shadow-sm mb-2 text-white"
                onClick={() => copyId(userInfo.roomId)}
              >
                Copy Room Id
              </button>
              <button
                className="w-full py-2 rounded bg-white shadow-lg"
                onClick={leaveRoom}
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow flex-shrink-0 relative">
        <div
          className={`bg-[#222] rounded text-center w-[150px] absolute top-8 z-10 shadow-lg text-white left-5 ${
            openLanguageModal && "hidden"
          }`}
        >
          {language.map((lang) => (
            <button
              key={lang}
              className="w-full py-2 capitalize px-5 hover:bg-[#333] duration-100 text-[12px]"
              onClick={() => handleMode(lang)}
            >
              {lang == "c_cpp" ? "C++" : lang}
            </button>
          ))}
        </div>
        <div
          className={`bg-[#222] rounded text-center w-[150px] absolute top-8 z-10 shadow-lg text-white left-24 ${
            openThemeModal && "hidden"
          }`}
        >
          {themes.map((theme) => (
            <button
              key={theme}
              className="w-full py-2 capitalize px-5 hover:bg-[#333] duration-100 text-[12px]"
              onClick={() => handleTheme(theme)}
            >
              {theme}
            </button>
          ))}
        </div>
        <div className="h-[3vh] w-full p-1 bg-[#222] text-white flex gap-x-5 px-3 text-sm items-center">
          <button onClick={() => handleLanguageModal()}>Language</button>
          <button onClick={() => handleThemeModal()}>Theme</button>
          <div className="ml-auto capitalize text-[12px] text-green-800 justify-end">
            {mode == "c_cpp" ? "C++" : mode}
          </div>
        </div>
        <AceEditor
          style={{
            fontFamily: "monospace",
          }}
          className={"editor-font"}
          height="97vh"
          width="100%"
          value=""
          mode={mode}
          theme={theme}
          fontSize="16px"
          onChange={editorValue}
          highlightActiveLine={true}
          setOptions={{
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </div>
      <div className="absolute right-3 bottom-3">
        <div className="h-[400px] w-[400px] rounded flex flex-col">
          <div className="h-[80%]"></div>
          <div className="flex h-[20%]">
            <input type="text" className="w-full" />
            <button>
              <BiSend />
            </button>
          </div>
        </div>
        <button className="text-white">
          <BiMessageRoundedMinus size={30} className="text-white" />
        </button>
      </div>
    </div>
  );
};

async function copyId(text: string) {
  try {
    const res = await navigator.clipboard.writeText(text);
    console.log(res);
  } catch (error) {
    return toast("could not coppy");
  }
  return toast("copied..");
}
function editorValue(value: string) {
  // setCode(value.trim());
}

export default Compiller;
