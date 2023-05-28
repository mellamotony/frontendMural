import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropPanelComponent } from './drag-drop-panel.component';

describe('DragDropPanelComponent', () => {
  let component: DragDropPanelComponent;
  let fixture: ComponentFixture<DragDropPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragDropPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DragDropPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
