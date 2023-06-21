import { MdArrowBack } from "@react-icons/all-files/md/MdArrowBack";

interface IParams {
  params: {
    pingId: string;
  };
}

export default async function PingHomePage({}: IParams) {
  return (
    <div className="lg:pl-[27rem] h-full">
      <div className="h-full flex flex-col">
        <div className="flex items-center p-4 h-20 justify-between border-b border-gray-50/10 w-full shadow-sm">
          <div className="p-2 hover:bg-sky-100 rounded-full duration-500 ">
            <MdArrowBack
              size={24}
              className="hover:text-sky-600 cursor-pointer text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
