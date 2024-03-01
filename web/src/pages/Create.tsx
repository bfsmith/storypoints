import { debounce } from '@solid-primitives/scheduled';
import { A, useNavigate } from '@solidjs/router';
import slug from 'slugify';
import { createSignal } from 'solid-js';
import { createRoom, getRoom, RoomCreateOptions } from '../api/api';
import { Room } from '../models/room';

const POINT_FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34];
const POINT_LINEAR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function Create() {
  const navigate = useNavigate();
  const [room, setRoom] = createSignal("");
  const [points, setPoints] = createSignal<number[]>(POINT_FIBONACCI);
  const [existingRoom, setExistingRoom] = createSignal<Room>();

  const checkName = debounce(async (roomName: string) => {
    const foundRoom = await getRoom(slug(roomName));
    setExistingRoom(foundRoom);
  }, 250);

  const setRoomName = (roomName: string) => {
    setRoom(roomName);
    checkName(roomName);
  };

  const navigateToRoom = (room: string) => {
    navigate(`/${room}`);
  };

  const createNewRoom = async (e: Event) => {
    e.preventDefault();
    const roomToCreate: RoomCreateOptions = {
      name: room(),
      pointOptions: points(),
      id: slug(room()),
      title: "",
      description: "",
    };
    const newRoom = await createRoom(roomToCreate);
    navigateToRoom(newRoom.id);
    return false;
  };

  return (
    <div class="flex flex-row gap-4 h-full items-center justify-center">
      <div class="flex flex-row gap-4 items-center">
        <form class="flex flex-col gap-4">
          <div class="form-control w-full max-w-xs">
            <label class="label" for="roomName">
              <span class="label-text text-xl">Room Name</span>
            </label>
            <input
              id="roomName"
              type="text"
              placeholder="Type here"
              class={`input input-bordered w-full max-w-xs ${
                existingRoom() ? "input-error " : ""
              }`}
              onInput={(e) => {
                setRoomName(e.currentTarget.value);
              }}
            />

            <label class="label">
              {existingRoom() ? (
                <span class="label-text text-md">
                  Room already exists,{" "}
                  <A
                    class="link text-secondary"
                    href={`/${existingRoom()?.id}`}
                  >
                    go there now
                  </A>
                  ?
                </span>
              ) : (
                <span class="label-text text-md">&nbsp;</span>
              )}
            </label>
          </div>

          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text text-xl">Point Format</span>
            </label>
            <label class="label cursor-pointer justify-start gap-2">
              <input
                id="points-fibonacci"
                type="radio"
                name="point-format"
                class="radio"
                onChange={() => setPoints(POINT_FIBONACCI)}
                checked={points() == POINT_FIBONACCI}
              />
              <label class="label-text cursor-pointer" for="points-fibonacci">Fibonacci</label>
            </label>
            <label class="label cursor-pointer justify-start gap-2">
              <input
                id="points-linear"
                type="radio"
                name="point-format"
                class="radio"
                onChange={() => setPoints(POINT_LINEAR)}
                checked={points() == POINT_LINEAR}
              />
              <label class="label-text cursor-pointer" for="points-linear">Linear</label>
            </label>
          </div>

          <div class="form-control w-full max-w-xs">
            <button
              class="btn btn-primary"
              disabled={!room() || !!existingRoom()}
              onClick={createNewRoom}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Create;
