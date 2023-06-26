import { create } from "zustand";

interface ChannelList {
  members: Set<string>;
  add: (_member: string) => void;
  remove: (_member: string) => void;
  set: (_members: Set<string>) => void;
}

const useChannelList = create<ChannelList>((set) => ({
  members: new Set<string>(),
  add: (member) => set((state) => ({ members: state.members.add(member) })),
  remove: (user) =>
    set((state) => {
      const newMembers = new Set(state.members);
      newMembers.delete(user);

      return {
        members: newMembers,
      };
    }),
  set: (members) => set({ members: new Set(members) }),
}));

export default useChannelList;
