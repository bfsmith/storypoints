import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';
import { useUser } from '../api/user';

function Who() {
  const user = useUser();
  const [username, setUsername] = createSignal("");
  const navigate = useNavigate();

  return (
    <div class="flex flex-row gap-4 h-screen w-screen items-center justify-center">
      <div class="flex flex-row gap-4 items-center">
        <form class="flex flex-col gap-4">
          <div class="form-control w-full max-w-xs">
            <label class="label" for="name">
              <span class="label-text text-xl">Who are you?</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              class="input input-bordered w-full max-w-xs"
              onInput={(e) => {
                setUsername(e.currentTarget.value);
              }}
            />
          </div>

          <div class="form-control w-full max-w-xs">
            <button
              class="btn btn-primary"
              disabled={!username()}
              onClick={() => {
                user.setUser((u) => ({
                  id: u?.id || username(),
                  name: username(),
                }));
                navigate("/");
              }}
            >
              Set
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Who;
