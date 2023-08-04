import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

import { decryptMessage, encryptMessage } from "../utils/encryption";

interface ChannelList {
  members: Set<string>;
  add: (_member: string) => void;
  remove: (_member: string) => void;
  set: (_members: Set<string>) => void;
}

const useChannelList = create<ChannelList>()(
  devtools(
    persist(
      (set) => ({
        members: new Set<string>(),
        add: (member) =>
          set((state) => ({ members: new Set(state.members).add(member) })),
        remove: (user) =>
          set((state) => {
            const newMembers = new Set(state.members);
            newMembers.delete(user);

            return {
              members: newMembers,
            };
          }),
        set: (members) => set({ members: new Set(members) }),
      }),
      {
        name: "pingStore",
        storage: {
          getItem: (name) => {
            const str = decryptMessage(localStorage.getItem(name)!);
            return {
              state: {
                ...JSON.parse(str!).state,
                members: new Map(JSON.parse(str!).state.members),
              },
            };
          },
          setItem: (name, newValue) => {
            const str = encryptMessage(
              JSON.stringify({
                state: {
                  ...newValue.state,
                  members: Array.from(newValue.state.members.entries()),
                },
              })
            );

            localStorage.setItem(name, str);
          },
          removeItem: (name) => localStorage.removeItem(name),
        },
      }
    )
  )
);

export default useChannelList;
