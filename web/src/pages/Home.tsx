import { debounce } from '@solid-primitives/scheduled';
import { A, useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';
import { getRoom } from '../api/api';

function Home() {
  const navigate = useNavigate();
  const [room, setRoom] = createSignal("");
  const [roomExists, setRoomExists] = createSignal<boolean | undefined>(
    undefined
  );

  const checkRoomExists = debounce(async (name: string) => {
    const r = await getRoom(name);
    setRoomExists(!!r);
  }, 250);

  const navigateToRoom = async (e: Event) => {
    e.preventDefault();
    const r = await getRoom(room());
    if (r) {
      navigate(`/${r?.id}`);
    }
    return false;
  };

  return (
    <div class="flex flex-row gap-4 h-full items-center justify-center">
      <div class="flex flex-row gap-4 items-center">
        <form class="flex flex-col gap-4">
          <div class="form-control w-full max-w-xs">
            <label class="label" for="roomName">
              <span class="label-text text-xl">Join a room</span>
            </label>
            <input
              id="roomName"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full max-w-xs"
              onInput={(e) => {
                checkRoomExists(e.currentTarget.value);
                setRoom(e.currentTarget.value);
              }}
            />
            {roomExists() === false ? (
              <label class="label" for="roomName">
                <span class="label-text text-md">
                  Room not found, <A href="/create" class="link text-secondary">create</A> it?
                </span>
              </label>
            ) : null}
          </div>

          <div class="form-control w-full max-w-xs">
            <button
              class="btn btn-primary"
              disabled={!roomExists()}
              onClick={(e) => navigateToRoom(e)}
            >
              Join
            </button>
          </div>
        </form>
        <div class="divider divider-horizontal">OR</div>
        <form class="flex flex-col gap-4">
          <div class="form-control w-full max-w-xs">
            <button
              class="btn btn-secondary"
              onClick={() => navigate("/create")}
            >
              Create a room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
