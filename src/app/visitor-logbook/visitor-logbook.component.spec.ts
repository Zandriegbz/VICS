import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorLogbookComponent } from './visitor-logbook.component';

describe('VisitorLogbookComponent', () => {
  let component: VisitorLogbookComponent;
  let fixture: ComponentFixture<VisitorLogbookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitorLogbookComponent]
    });
    fixture = TestBed.createComponent(VisitorLogbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
