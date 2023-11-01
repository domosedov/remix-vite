import { EffectorNext } from "@effector/next";
import { defer, type MetaFunction } from "@remix-run/node";
import { Await, useAsyncValue, useLoaderData } from "@remix-run/react";
import { allSettled, fork, serialize } from "effector";
import { useUnit } from "effector-react";
import { Suspense } from "react";
import { $user, fetchTodosFx, fetchUserFx } from "~/todo-model";
import { TodoList } from "../TodoList";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

async function loadTodos() {
  const scope = fork();
  await allSettled(fetchTodosFx, { scope });
  return serialize(scope);
}

async function loadUser() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const scope = fork();
  await allSettled(fetchUserFx, { scope });
  return serialize(scope);
}

export async function loader() {
  return defer({ values: await loadTodos(), user: loadUser() });
}

export default function Index() {
  const { values, user } = useLoaderData<typeof loader>();

  return (
    <EffectorNext values={values}>
      <div className="grid grid-cols-2">
        <TodoList />
        <Suspense fallback="Loading user">
          <Await resolve={user}>
            <AwaitUser />
          </Await>
        </Suspense>
      </div>
    </EffectorNext>
  );
}

function AwaitUser() {
  const user = useAsyncValue() as Record<string, unknown>;
  return (
    <EffectorNext values={user}>
      <User />
    </EffectorNext>
  );
}

function User() {
  const user = useUnit($user);
  return (
    <div className="bg-yellow-300">
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
