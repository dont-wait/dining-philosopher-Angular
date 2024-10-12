import { Component } from '@angular/core';
import { codeSnippets } from '../../assets/code_snippet/code_snippets';
import { BinarySemaphore } from './binarySemaphore';

@Component({
  selector: 'app-philosophers',
  templateUrl: './philosophers.component.html',
  styleUrls: ['./philosophers.component.css']
})
export class PhilosophersComponent {
  philosophers = [
    { id: 0, state: 'Thinking', time: 0, image: '../../assets/images/philosopher1.jpg' },
    { id: 1, state: 'Thinking', time: 0, image: '../../assets/images/philosopher2.jpg' },
    { id: 2, state: 'Thinking', time: 0, image: '../../assets/images/philosopher3.jpg' },
    { id: 3, state: 'Thinking', time: 0, image: '../../assets/images/philosopher4.jpg' },
    { id: 4, state: 'Thinking', time: 0, image: '../../assets/images/philosopher5.jpg' }
  ];
  waitingQueue: number[] = [];
  isOpen = false;
  selectionOption = '';
  code = '';
  private spoons: BinarySemaphore[];
  showResultModal = false;
  result = '';
  constructor() {
    this.spoons = Array.from({ length: 5 }, () => new BinarySemaphore(1));
  }

  async philosopher(id: number): Promise<void> {
    return new Promise(async (resolve) => {
      let log = '';
      const startThinkingTime = Date.now();
  
      log += (`Triết gia ${id} đang suy nghĩ...\n`);
      this.updateState(id, 'Thinking');
      await new Promise(res => setTimeout(res, 1000));
  
      await this.spoons[id].wait(id);
      await this.spoons[(id + 1) % 5].wait((id + 1) % 5);
      //ăn được thì sẽ hiện màu xanh
      const plateElement = document.querySelector(`.plate-wrap:nth-child(${id + 1}) .plate`);
      if (plateElement) {
        plateElement.classList.add('eating');
      }
      
      log += (`-- --Triết gia ${id} đang ăn...\n`);
      this.updateState(id, 'Eating');
      await new Promise(res => setTimeout(res, 2000));
  
      this.spoons[id].signal(id);
      this.spoons[(id + 1) % 5].signal((id + 1) % 5);
      
      if (plateElement) {
        plateElement.classList.remove('eating');  // Thêm class 'eating'
      }

      log += (`-> Triết gia ${id} đã ăn xong và quay lại nghĩ!\n`);
      this.updateState(id, 'Thinking');
  
      //await new Promise(res => setTimeout(res, 1000)); 
  
      const timeSpentThinking = (Date.now() - startThinkingTime) / 1000;
      this.philosophers[id].time = timeSpentThinking;
      this.result += log;
  
      resolve();
    });
  }
  
  async runAlgorithm() {
    this.result = '';
    this.showResultModal = false;
    
    this.philosophers.forEach(philosopher => {
      philosopher.state = 'Thinking';
      philosopher.time = 0;
    });
    
    
    const philosopherPromises = Array.from({ length: 5 }, (_, i) => this.philosopher(i));
    await Promise.all(philosopherPromises);
    
    this.showResultModal = true;
  }
  

  updateState(id: number, state: string) {
    this.philosophers[id].state = state;
  }

  

  closeResultModal() {
    this.showResultModal = false; // Đóng modal
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  removeActive() {
    document.getElementById("code-container")?.classList.toggle("active");
  }

  selectOption(option: string) {
    console.log('Option selected:', option);
    this.isOpen = false; // Đóng thanh lựa chọn
    this.selectionOption = option;

    const codeContainer = document.getElementById('code-container');
    codeContainer?.classList.toggle('active'); // Chỉ gọi một lần

    if (option === 'mutex_lock') {
      this.runMutexLockAlgorithm();
      this.code = codeSnippets.mutex_lock;
    } else if (option === 'Semaphore') {
      this.runSemaphoreAlgorithm();
      this.code = codeSnippets.semaphore;
    }
  }

  runMutexLockAlgorithm() {
    // Chạy thuật toán mutex lock ở đây
    this.philosophers.forEach((philosopher, index) => {
      // Code cho mutex lock
    });
  }

  runSemaphoreAlgorithm() {
    // Chạy thuật toán semaphore ở đây
    this.philosophers.forEach((philosopher, index) => {
      // Code cho semaphore
    });
  }

}


