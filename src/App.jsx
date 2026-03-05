import { useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Düşük");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const priorityWeight = { "Yüksek": 1, "Orta": 2, "Düşük": 3 };

  const addTask = () => {
    if (!task.trim()) return;
    const newTodo = { 
      id: Date.now(), 
      text: task, 
      priority: priority, 
      completed: false 
    };
    setTodos([...todos, newTodo]);
    setTask("");
    setPriority("Düşük");
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const saveEdit = (id) => {
    setTodos(todos.map(t => (t.id === id ? { ...t, text: editText } : t)));
    setEditingId(null);
  };

  const sortedTodos = [...todos].sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);

  // Dot Renkleri ve Border Renkleri
  const dotStyles = {
    "Yüksek": "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]",
    "Orta": "bg-orange-500",
    "Düşük": "bg-slate-500"
  };

  const borderStyles = {
    "Yüksek": "border-red-100",
    "Orta": "border-orange-100",
    "Düşük": "border-slate-100"
  };

  return (
    <div className="min-h-screen bg-[#7296ba] flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white shadow-2xl rounded-[2.5rem] w-full max-w-5xl flex flex-col md:flex-row overflow-hidden min-h-[650px] border border-white">
        
        {/* Form Bölümü */}
        <div className="w-full md:w-[35%] bg-slate-900 p-10 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-black">T</div>
              <h1 className="text-xl font-bold tracking-tight">Task Master v1</h1>
            </div>
            
            <h2 className="text-4xl font-black mb-10 leading-tight">Yeni Bir<br/>Görev Planla</h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest mb-3 text-slate-500">Görev Nedir?</label>
                <input 
                  className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="Hangi işi halledeceğiz?"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest mb-3 text-slate-500">Öncelik Seçimi</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.keys(priorityWeight).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`py-3 rounded-xl text-[11px] font-bold transition-all border ${priority === p ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg' : 'bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={addTask}
            className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl hover:bg-indigo-400 hover:text-white transition-all shadow-xl active:scale-[0.98] mt-8"
          >
            LİSTEYE EKLE
          </button>
        </div>

        {/*Liste Bölümü */}
        <div className="w-full md:w-[65%] p-10 bg-[#fafafa] overflow-y-auto max-h-[700px]">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-800">Günlük Planlar</h2>
            <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
              <span className="text-indigo-600 font-black">{todos.length}</span>
              <span className="text-slate-400 text-xs font-bold ml-2">GÖREV</span>
            </div>
          </div>

          <div className="space-y-4">
            {sortedTodos.map((todo) => (
              <div 
                key={todo.id} 
                className={`flex items-center gap-5 p-5 bg-white rounded-3xl border ${borderStyles[todo.priority]} shadow-sm transition-all hover:shadow-md ${todo.completed ? 'opacity-60 bg-slate-50' : ''}`}
              >
                {/* Custom Checkbox */}
                <div 
                  onClick={() => toggleComplete(todo.id)}
                  className={`w-7 h-7 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all ${todo.completed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-200 bg-white'}`}
                >
                  {todo.completed && <span className="text-white text-xs">✓</span>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`relative flex h-2 w-2 rounded-full ${dotStyles[todo.priority]}`}>
                      {/* yanıp sönen animasyon */}
                      {todo.priority === "Yüksek" && !todo.completed && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      )}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      {todo.priority} ÖNCELİK
                    </span>
                  </div>

                  {editingId === todo.id ? (
                    <input 
                      className="w-full border-b-2 border-indigo-500 outline-none py-1 font-bold text-slate-800"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => saveEdit(todo.id)}
                      autoFocus
                    />
                  ) : (
                    <p className={`font-bold text-lg leading-tight ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {todo.text}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => {setEditingId(todo.id); setEditText(todo.text)}} className="p-2 hover:bg-indigo-50 rounded-lg text-slate-300 hover:text-indigo-600 transition-all">
                    ✎
                  </button>
                  <button onClick={() => deleteTask(todo.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-600 transition-all">
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {todos.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[2rem]">
                <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Planlanan görev bulunamadı</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;