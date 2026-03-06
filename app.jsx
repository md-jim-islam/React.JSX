const { HashRouter, Route, Switch, Link, useParams, useRouteMatch } = ReactRouterDOM;
const { useState, useRef, useEffect, useMemo } = React;
const initStudent = [
  { id: 1, name: "Jim", online: true, courses: ["React", "JS"] }
 ,{ id: 2, name: "Robin", online: false, courses: ["Python"] },
  { id: 3, name: "Sara", online: true, courses: ["HTML", "CSS"]}

]
const DashboardHome = ({students}) => {
  const states = useMemo(() => ({
    total: students.length, 
    online: students.filter(s => s.online).length
  }),[students])
  return(
    <div>
      <h3 className='text-2xl font-bold'>Overview </h3>
      <p>total student : {states.total}</p>
      <p>online student : <span className='text-sky-800'>{states.online}</span></p>
    </div>
  )
}
const StudentsList = ({students}) => {
  const {url} = useRouteMatch();
  return(
    <div className='flex flex-col gap-3'>
      <h1 className="text-3xl font-bold mb-4">Students Directory</h1>
      {students.map(({id,name,online,courses}) => {
    return <div key={id}>
        <div>
          <div className='border-2 p-3 rounded flex justify-between border-gray-700'>
            <div>{name} {online ? '🟢online' : '🔴offline'}</div>
            <Link className='text-blue-600' to={`${url}/${id}`}>vew profile</Link>
          </div>
        </div>
       </div>
      })}
    </div>
  )
}
const AddStudent = ({OnAdd}) => {
  const [name,setName] = useState('');
  const inputRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name) return alert('enter a valid name')
    OnAdd(name)
    setName('')
    inputRef.current.focus()
 }
 
 return (
    <div className="max-w-md">
      <h1 className="text-3xl font-bold mb-4">Add New Student</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          className="flex-1 border-2 border-gray-200 p-2 rounded-lg focus:border-blue-500 outline-none transition"
          placeholder="e.g. John Doe"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
          Add
        </button>
      </form>
    </div>
  );

}
const StudentDetail = ({students}) => {
  const {id} = useParams()
  const student = students.find(s => s.id === Number(id))
  if(!student) return <h1>409 user not found </h1>
  const {name,online,courses} = student;
  
    return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <h1 className="text-4xl font-bold mb-2">{name}</h1>
      <div className="mb-4">{online ? '🟢online' : '🔴offline'}</div>
      
      <h3 className="text-xl font-semibold border-b pb-2">Enrolled Courses:</h3>
      <ul className="mt-3 space-y-1 list-inside list-disc text-gray-700">
        {courses.map((course, i) => <li key={i} className="capitalize">{course}</li>)}
        {courses.length === 0 && <p className="text-gray-400 italic">No courses joined yet.</p>}
      </ul>
    </div>
  );

}
const Dashboard = () => {
  const [students,setStudents] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('students'))
    return saved ? saved : initStudent
  })
  useEffect(() => {
    localStorage.setItem('students',JSON.stringify(students))
  },[students])
  const {url,path} = useRouteMatch();
  const handleAddStudent = (name) => {
    const newStudent = {
      id: Date.now(),
      name: name,
      online: false,
      courses: []
    }
    setStudents(prev => [...prev,newStudent])
  }
  const navLinks = [
    {to: url,lable: 'Home'},
    {to: `${url}/students`,lable: 'Students'},
    {to: `${url}/add`,lable: 'Add'}
  ]
  return(
 <div>
      <div className="flex">
          <aside className="w-64 h-screen bg-gray-900 text-white relative block">
            <div className="p-6 text-2xl font-bold border-b border-gray-700">My App</div>
            <nav className="mt-6">
              {navLinks.map((link) => (
                <Link key={link.lable} to={link.to}  className="flex items-center p-4 hover:bg-gray-800 transition">{link.lable}</Link>
             ))}
            </nav>
          </aside>
        
          <main className="flex-1 p-10 bg-gray-100 min-h-screen">
              <Switch>
                <Route exact path={path} render={() => <DashboardHome students={students}/>}/>
                <Route exact path={`${path}/students`} render={() => <StudentsList students={students}/>}/>
                <Route path={`${path}/students/:id`} render={() => <StudentDetail students={students}/>}/>
                <Route  path={`${path}/add`} render={() => <AddStudent OnAdd={handleAddStudent}/>}/>
              </Switch>
          </main>
    </div>
</div>
  )
}
const Home = () => {
  return(
    <div className='flex justify-center h-[70vh] items-center flex-col'>
      <h1 className='font-bold text-2xl '>see all user info</h1>
      <Link className='py-1 px-3 bg-black mt-5 font-bold rounded text-white' to='/dashboard'>Go Dashboard</Link>
    </div>
  )
}
const App = () => {
 return(
 <HashRouter>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/dashboard' component={Dashboard}/>
    </Switch>
  </HashRouter>
 ) 
}
ReactDOM.render(<App />, document.getElementById('root'))