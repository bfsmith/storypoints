import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
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

interface UserVote {
  user: string;
  points: number | null;
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
    console.log("room found", r);
    setRoom(r);
    const existingVote = r?.votes.find(
      (v) => v.user === userManagement.user()?.name
    );
    if (existingVote) {
      setSelectedPoint(existingVote.points);
    }
  });

  createEffect(() => {
    if (room() && ws() == undefined) {
      const connectedWs = webSocketConnect();
      connectedWs.on("connect", () => console.log("connected"));
      connectedWs.on("disconnect", () => console.log("disconnected"));
      connectedWs.on("room", (e) => {
        console.log("room", e);
        setRoom(e.room);
      });
      connectedWs.emit("join", {
        room: room()!.id,
        user: userManagement.user()!.name,
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
        points: selectedPoint(),
        room: roomId,
        user: userManagement.user()?.name ?? "test",
      });
    }
  };

  const userVotes = createMemo(() => {
    const members = room()?.members;
    const votes = room()?.votes;
    console.log("rendering votes");
    if (!members || !votes) {
      return [];
    }
    const userVotes = members.map(
      (member) =>
        ({
          user: member,
          points: votes.find((v) => v.user === member)?.points ?? null,
        } as UserVote)
    );
    return userVotes;
  });

  return (
    <div class="flex flex-row gap-4 w-full justify-center">
      <Show when={room()} fallback={<Loading />}>
        <div class="flex flex-col gap-16">
          {/* <div>{JSON.stringify(room())}</div> */}
          <div>Welcome to the room {room()!.name}!</div>
          <div>{room()!.title}</div>
          <div>{room()?.description}</div>
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
            <div class="text-2xl">Votes</div>
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
                          user: userManagement.user()!.name,
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
                    <td class="text-xl">{vote.user}</td>
                    <td class="text-xl">
                      {vote.points != undefined
                        ? room()?.areVotesVisible
                          ? vote.points
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
