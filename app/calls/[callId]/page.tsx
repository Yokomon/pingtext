import { getCallDetailsById } from "@/app/actions/getCallDetailsById";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getOtherUserById } from "@/app/actions/getOtherUserById";
import { redirect } from "next/navigation";
import { VideoCall } from "./components/VideoCall";

interface IParams {
  params: {
    callId: string;
  };
}

const CallIdPage = async ({ params }: IParams) => {
  const { callId } = params;
  const currentUser = await getCurrentUser();
  const callDetails = await getCallDetailsById(callId);
  const callReceiver = await getOtherUserById(callDetails?.callReceiverId!);

  const otherUser =
    callReceiver?.id === currentUser!.id ? callDetails?.caller : callReceiver;

  // Only users with right permissions can access this page
  if (callDetails && currentUser) {
    if (
      callDetails.callReceiver.id !== currentUser.id &&
      callDetails.caller.id !== currentUser.id
    ) {
      return redirect("/calls");
    }
  }

  return (
    <main className="lg:pl-[22rem] h-full">
      <VideoCall
        callDetails={callDetails!}
        currentUser={currentUser!}
        otherUser={otherUser!}
      />
    </main>
  );
};

export default CallIdPage;
