import { A } from '@solidjs/router';
import { useUser } from '../api/user';

function HeaderComponent() {
  const user = useUser();

  return (
    <div class="navbar sticky bg-base-100">
      <div class="flex-1">
        <A class="btn btn-ghost text-xl" href="/">Story Points</A>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li>
            <A href="/user">Change Name ({ user.user()?.name })</A>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HeaderComponent;
