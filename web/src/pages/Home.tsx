import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

function Home() {
  const navigate = useNavigate();
  const [room, setRoom] = createSignal("");

  const navigateToRoom = (room: string) => {
    navigate(`/${room}`);
  };

  return (
    <div class="flex flex-row gap-4 h-screen items-center justify-center">
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
                setRoom(e.currentTarget.value);
              }}
            />
          </div>

          <div class="form-control w-full max-w-xs">
            <button
              class="btn btn-primary"
              disabled={!room()}
              onClick={() => navigateToRoom(room())}
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
              onClick={() => navigateToRoom("test")}
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
