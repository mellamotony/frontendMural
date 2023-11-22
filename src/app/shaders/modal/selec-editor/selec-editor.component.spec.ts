import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecEditorComponent } from './selec-editor.component';

describe('SelecEditorComponent', () => {
  let component: SelecEditorComponent;
  let fixture: ComponentFixture<SelecEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelecEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
