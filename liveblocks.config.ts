import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

type Presence = {};
type Storage = {};
type UserMeta = {
  id?: string;
  info?: {
    name?: string;
    picture?: string;
  };
};
type RoomEvent = {};
type ThreadMetadata = {};

export const {
  suspense: { RoomProvider, useMyPresence },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(
  client
);
