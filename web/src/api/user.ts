import { Accessor, createSignal } from 'solid-js';
import { User } from '../models/user';

const USER_STORAGE_KEY = "user";

export interface UserManagement {
  user: Accessor<User | undefined>;
  setUser: (user: User | undefined | ((previous: User | undefined) => User | undefined)) => void;
}

export function useUser(): UserManagement {
  const user = getUser();
  const [userAccessor, userSetter] = createSignal<User | undefined>(user);
  const updateUser = (updateUser: User | undefined | ((previous: User | undefined) => User | undefined)) => {
    if (typeof updateUser === 'function') {
      const updatedUser = updateUser(userAccessor());
      setUser(updatedUser);
      userSetter(updateUser);
    } else {
      setUser(updateUser);
      userSetter(updateUser);
    }
  };
  return {
    user: userAccessor,
    setUser: updateUser,
  };
}

function getUser(): User | undefined {
  const userStr = localStorage.getItem(USER_STORAGE_KEY);
  if (!userStr) {
    return undefined;
  }
  try {
    const user = JSON.parse(userStr);
    return user;
  } catch (e) {
    console.error("Error parsing user from local storage", e);
    setUser(undefined);
    return undefined;
  }
}

function setUser(user: User | undefined) {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}
