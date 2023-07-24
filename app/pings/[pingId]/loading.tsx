import { BodyLoader } from "./components/Loaders/BodyLoader";
import { FooterLoader } from "./components/Loaders/FooterLoader";
import { HeaderLoader } from "./components/Loaders/HeaderLoader";

const data = Array.from({ length: 7 }, () => ({
  isOwn: Math.random() < 0.5,
}));

const Loading = () => {
  return (
    <div className="lg:pl-[22rem] h-full">
      <div className="h-full w-full flex flex-col">
        <HeaderLoader />
        <div className="flex-1 h-[80%] w-full overflow-auto">
          {data.map((el, idx) => (
            <BodyLoader key={idx} data={el} />
          ))}
        </div>
        <FooterLoader />
      </div>
    </div>
  );
};

export default Loading;
