import { useUnit } from "effector-react";
import { $todos } from "~/todo-model";

export function TodoList() {
  const todos = useUnit($todos);

  return (
    <div className="bg-gray-50 rounded-2xl border shadow-lg max-w-lg overflow-x-auto">
      <h2>Todos</h2>
      <pre>{JSON.stringify(todos, null, 2)}</pre>
    </div>
  );
}
