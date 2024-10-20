import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { task } from '../../interfaces/task.interface';

interface Task {
  name: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {

  task = new FormControl<string>('', { nonNullable: true});

  tasks = signal<Task[]>([]);

  addTask(){
    this.tasks.update((tasks) => [
      ...tasks,
      { name: this.task.value, isCompleted: false},
    ]);
    this.task.setValue('');
  }


  //check de tareas completadas
  toggleCompletedTask(task: Task){
    this.tasks.mutate((tasks) => {
    const taskToUpdate = this.tasks().find((t) => t.name === task.name);
    if(taskToUpdate) taskToUpdate.isCompleted = !taskToUpdate.isCompleted;
    return tasks;
    })
  }


  deleteTask(task: Task){
    this.tasks.update((tasks) => {
      return tasks.filter((t) => t.name !== task.name);
  });
  }

  resetTask(){
    this.tasks.set([]);
  }

  //USo de computed
  //contar las tareas completadas
  //El codigo del computed se puede hacer como esta opcion o la otra no comentada abajo
  // completedTasksCount = computed(() => {
  //   this.tasks().filter((task) => task.isCompleted)
  // });

  completedTasksCount = computed(() => {
    const completedTasks = this.tasks().filter((task) => task.isCompleted);
    return completedTasks;
  });

  //contar las tareas completadas
  // uncompletedTasksCount = computed(() => {
  //   this.tasks().filter((task) => !task.isCompleted)
  // });

  uncompletedTasksCount = computed(() => {
    const uncompletedTasks = this.tasks().filter((task) =>!task.isCompleted);
    return uncompletedTasks;
  });

   // uso de effect
  constructor () {
    effect(() => {
      if (this.uncompletedTasksCount().length > 3) 
        alert(`Tienes ${this.uncompletedTasksCount().length} tareas pendientes. Cuidado!`)
    })
  }
 

}
