import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, copyArrayItem, CdkDragEnter } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drag-drop-panel',
  templateUrl: './drag-drop-panel.component.html',
  styleUrls: ['./drag-drop-panel.component.css']
})
export class DragDropPanelComponent {
  images: string[] = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  entered(event: CdkDragEnter) {
    event.item.data = event.item.element.nativeElement.querySelector('img')?.src;
  }
}
