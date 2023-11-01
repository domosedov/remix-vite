import { createEffect, createStore, sample } from "effector";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
};

export const fetchTodosFx = createEffect<void, Todo[]>(async () => {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_limit=5"
  );
  if (!res.ok) throw new Error("Failed fetch todos", { cause: res });
  return res.json();
});

export const $todos = createStore<Todo[]>([], { sid: "todos-sid" });

sample({
  clock: fetchTodosFx.doneData,
  target: $todos,
});

export const fetchUserFx = createEffect<void, Todo[]>(async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  if (!res.ok) throw new Error("Failed fetch user", { cause: res });
  return res.json();
});

export const $user = createStore<Todo[]>([], { sid: "user-sid" });

sample({
  clock: fetchUserFx.doneData,
  target: $user,
});
