import React, {Component} from 'react';
import firebase from 'firebase';

class App extends Component {

   constructor(props) {
       super(props)
       this.state = {
           tasks:
               [   {id: 1, name: 'Running at Damn'},
                   {id: 2, name: 'Write React program'}
               ]
           ,
           task: ''
       }

       let config = {
        apiKey: "AIzaSyAqBS4BGpCH7zfxKhlDW9AvDK5LHZk-9q4",
        authDomain: "todo-a7504.firebaseapp.com",
        databaseURL: "https://todo-a7504.firebaseio.com",
        projectId: "todo-a7504",
        storageBucket: "todo-a7504.appspot.com",
        messagingSenderId: "320649481309"
       };

       if (firebase.apps.length === 0) firebase.initializeApp(config)

       console.log('firebase: ', firebase.database())
       console.log('firebase: ', firebase.app().name)

       let myapp = firebase.database().ref('/');
       let tasksChild = myapp.child('/taskTable')
       tasksChild.remove()
       tasksChild.set({tasks: this.state.tasks})
       myapp.on('value', snapshot => {
           console.log('task0: ', snapshot.val())
       });
   }

   removeTask = (id) => {
       let array = [...this.state.tasks]; // make a separate copy of the array
       let index = array.findIndex((task) => task.id === id)
       array.splice(index, 1)
       this.setState({tasks: array})
       console.log('update states tasks:', this.state.tasks)

       let tasksChild = firebase.database()
           .ref('/')
           .child('/taskTable/tasks/' + (id - 1))
       tasksChild.remove()
           .then(() => console.log("Remove success: "))
           .catch((err) => console.log("Remove failed: " + err))
   }

   addTask = () => {
       let lastItem = this.state.tasks[this.state.tasks.length - 1]
       let newTask = {id: lastItem.id + 1, name: this.state.task}
       this.setState({
           tasks: [...this.state.tasks, newTask]
       })

       let tasksChild = firebase.database()
           .ref('/')
           .child('/taskTable/tasks/' + lastItem.id)
       tasksChild.set(newTask)
           .then(() => console.log("Add successfully: "))
           .catch((err) => console.log("Remove failed: " + err))
   }

   editTask = (id) => {
       let index = this.state.tasks.findIndex((task) => task.id === id)
       this.setState({task: this.state.tasks[index].name})
   }

   updateTask = (id) => {
       console.log('update states tasks:', this.state.tasks)
       let array = [...this.state.tasks]
       let index = array.findIndex((task) => task.id === id)
       array[index].name = this.state.task
       this.setState({tasks: array})

       let tasksChild = firebase.database()
           .ref('/')
           .child('/taskTable/tasks/' + (id - 1))
       tasksChild.set({id: array[index].id, name: this.state.task})
           .then(() => console.log("Update successfully: "))
           .catch((err) => console.log("Update failed: " + err))
   }

   handleChange = (e) => this.setState({task: e.target.value})

   renderTasks = () => {
       if (this.state.tasks.length !== 0)
           return this.state.tasks.map((task, index) => {
               return (
                   <tr key={index}>
                       <td>{task.id}</td>
                       <td> {task.name}</td>
                       <td>
                           <button onClick={() => this.editTask(task.id)}> Get</button>
                       </td>
                       <td>
                           <button onClick={() => this.updateTask(task.id)}> Update</button>
                       </td>
                       <td>
                           <button onClick={() => this.removeTask(task.id)}> Delete</button>
                       </td>
                   </tr>)
           })
   }

   render() {
       return (
           <div style={{margin: '40px'}}>
               <h2>Todo: </h2>
               <input type="text" name="task" onChange={this.handleChange} value={this.state.task}/>
               <button onClick={this.addTask}>Add</button>
               <br/><br/>
               <table>
                   <thead>
                   <tr>
                       <th>ID</th>
                       <th>Task</th>
                       <th colSpan={3}>Action</th>
                   </tr>
                   </thead>
                   <tbody>
                   {this.renderTasks()}
                   </tbody>
               </table>
           </div>
       );
   }
}

export default App;