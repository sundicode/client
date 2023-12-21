"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { v4 } from "uuid";
import { useChartContext } from "./ChartContext";
type Userdata = {
  username: string | undefined;
  roomId: string | undefined;
};
export default function Home() {
  const { socket, userInfo } = useChartContext();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Userdata>();
  const handleForm: SubmitHandler<Userdata> = (data) => {
    socket?.emit("loged-in-user", data.roomId, data.username);
    router.push("/compiler");
  };
  const genearteId = () => {
    const id = v4();
    setValue("roomId", id);
    return toast("Room created");
  };
  return (
    <main className="min-h-screen w-screen bg-[#f5f5f5] flex items-center justify-center">
      <Toaster
        toastOptions={{
          duration: 5000,
          style: {
            background: "#008000",
            color: "#fff",
          },
        }}
      />
      <form
        className=" w-[350px] p-5 bg-white shadow-xl rounded"
        onSubmit={handleSubmit(handleForm)}
      >
        <p className="text-gray-700 text-[1rem] mb-4">
          Paste your invitation code down Below
        </p>
        <div className="flex flex-col gap-y-4">
          <div>
            <input
              type="text"
              className="w-full py-2 px-3 bg-gray-100 text-black rounded focus:outline-none placeholder:text-sm"
              placeholder="Enter Room Id"
              {...register("roomId", { required: "room id is required" })}
            />
            {errors.roomId?.message && (
              <span className="text-red-400 text-[12px]">
                {errors.roomId?.message}
              </span>
            )}
          </div>
          <div>
            <input
              type="text"
              className="w-full py-2 px-3 bg-gray-100 text-black rounded focus:outline-none placeholder:text-sm"
              placeholder="Enter Guess Username"
              {...register("username", { required: "username is required" })}
            />
            {errors.username?.message && (
              <span className="text-red-400 text-[12px]">
                {errors.username?.message}
              </span>
            )}
          </div>
          <button className="bg-yellow-300 py-2 rounded w-full px-5">
            Join
          </button>
        </div>
        <p className="text-gray-700 text-[1rem] mt-4 text-sm mb-6">
          Dont hava an invite code{" "}
          <Link
            href="#"
            className="text-red-400 underline "
            onClick={genearteId}
          >
            Create your own room
          </Link>
        </p>
      </form>
    </main>
  );
}
