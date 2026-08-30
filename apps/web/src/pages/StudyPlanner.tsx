import React, { useState } from 'react';
import { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from '../store/api/plannerApi';
import { Plus, Calendar as CalendarIcon, CheckCircle2, Circle, Trash2, Clock } from 'lucide-react';

export const StudyPlanner: React.FC = () => {
  const { data, isLoading } = useGetTasksQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const tasks = data?.data || [];

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await createTask({
      title: newTaskTitle,
      priority,
      dueDate: new Date().toISOString(),
    });
    setNewTaskTitle('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Study Planner</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Plan daily revision schedules, upcoming exams, and track study commitments.
        </p>
      </div>

      {/* Add Task input */}
      <form onSubmit={handleAddTask} className="p-4 rounded-2xl border border-border bg-card shadow-sm flex gap-3">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new study session or assignment milestone..."
          className="flex-1 px-4 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="px-3 py-2 rounded-xl border border-input bg-background text-sm"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button
          type="submit"
          disabled={isCreating || !newTaskTitle.trim()}
          className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Scheduled Tasks & Study Sessions ({tasks.length})
        </h3>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card/40 space-y-2">
            <CalendarIcon className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-medium">No tasks scheduled</p>
            <p className="text-xs text-muted-foreground">Add your first task above to get organized.</p>
          </div>
        ) : (
          tasks.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl border border-border bg-card flex items-center justify-between gap-4 transition-all hover:border-primary/40 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateTask({
                      id: t.id,
                      changes: { isComplete: !t.isComplete },
                    })
                  }
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.isComplete ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div>
                  <p className={`text-sm font-medium ${t.isComplete ? 'line-through text-muted-foreground' : ''}`}>
                    {t.title}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span
                      className={`font-semibold capitalize ${
                        t.priority === 'high'
                          ? 'text-rose-500'
                          : t.priority === 'medium'
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteTask(t.id)}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
