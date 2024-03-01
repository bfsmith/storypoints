import { faEye, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from '@solidjs/router';
import Fa from 'solid-fa';
import {
  createEffect,
  createMemo,
  createSignal,
  Show
  } from 'solid-js';
import { getRoom, RoomSocket, webSocketConnect } from '../api/api';
import { useUser } from '../api/user';
import Card from '../components/card';
import Loading from '../components/loading';
import { Room } from '../models/room';
import { User } from '../models/user';
``;
interface UserVote {
  user: User;
  vote: number | null;
}

function RoomPage() {
  const params = useParams();
  const navigate = useNavigate();
  const userManagement = useUser();
  const roomId = params.room;
  const [ws, setWs] = createSignal<RoomSocket | undefined>();
  const [selectedPoint, setSelectedPoint] = createSignal<number | undefined>();
  const [room, setRoom] = createSignal<Room | undefined>();

  createEffect(async () => {
    const r = await getRoom(roomId);
    if (!r) {
      navigate("/");
      return;
    }
    setRoom(r);
    const existingVote = r?.votes.find(
      (v) => v.userId === userManagement.user()?.id
    );
    if (existingVote) {
      setSelectedPoint(existingVote.vote);
    }
  });

  createEffect(() => {
    if (room() && ws() == undefined) {
      const connectedWs = webSocketConnect();
      connectedWs.on("connect", () => console.log("connected"));
      connectedWs.on("disconnect", () => console.log("disconnected"));
      connectedWs.on("room", (e) => {
        setRoom(e.room);
        const myVote = e.room.votes.find(
          (v) => v.userId === userManagement.user()!.id
        );
        setSelectedPoint(myVote?.vote);
      });
      const user = userManagement.user()!;
      connectedWs.emit("join", {
        room: room()!.id,
        userId: user.id,
        userName: user.name,
      });
      setWs(connectedWs);
    }
  });

  const vote = (points: number) => {
    if (selectedPoint() === points) {
      setSelectedPoint(undefined);
    } else {
      setSelectedPoint(points);
    }
    if (ws()?.connected) {
      ws()!.emit("vote", {
        vote: selectedPoint(),
        room: roomId,
        userId: userManagement.user()!.id,
      });
    }
  };

  const userVotes = createMemo(() => {
    const members = room()?.members;
    const votes = room()?.votes;
    if (!members || !votes) {
      return [];
    }
    const userVotes = members.map(
      (member) =>
        ({
          user: member,
          vote: votes.find((v) => v.userId === member.id)?.vote ?? null,
        } as UserVote)
    );
    return userVotes;
  });

  return (
    <div class="flex flex-row gap-4 w-full justify-center">
      <Show when={room()} fallback={<Loading />}>
        <div class="flex flex-col gap-16">
          {/* <div>{JSON.stringify(room())}</div> */}
          {/* <div>Welcome to the room {room()!.name}!</div> */}
          {/* <div>{room()!.title}</div>
          <div>{room()?.description}</div> */}
          <div class="flex flex-row flex-wrap gap-4">
            {room()?.pointOptions.map((points) => (
              <Card
                points={points}
                isSelected={points === selectedPoint()}
                onSelect={() => vote(points)}
              />
            ))}
          </div>
          <div>
            <div class="flex flex-row justify-between">
              <div class="text-2xl">Votes</div>
              <div
                class="cursor-pointer"
                onClick={() => {
                  ws()!.emit("clearVotes", {
                    room: room()!.id,
                    userId: userManagement.user()!.id,
                  });
                }}
              >
                <Fa class="inline" icon={faTrash} />
              </div>
            </div>
            <table class="table table-lg text-xl">
              <thead>
                <tr>
                  <th class="text-xl">User</th>
                  <th class="text-xl">
                    Vote{" "}
                    <div
                      class="inline cursor-pointer"
                      onClick={() =>
                        ws()?.emit("show", {
                          room: room()!.id,
                          userId: userManagement.user()!.id,
                          show: !room()!.areVotesVisible,
                        })
                      }
                    >
                      <Fa
                        class="inline"
                        icon={room()?.areVotesVisible ? faEye : faEyeSlash}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {userVotes().map((vote) => (
                  <tr class="hover">
                    <td class="text-xl">{vote.user.name}</td>
                    <td class="text-xl">
                      {vote.vote != undefined
                        ? room()?.areVotesVisible
                          ? vote.vote
                          : "?"
                        : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default RoomPage;
