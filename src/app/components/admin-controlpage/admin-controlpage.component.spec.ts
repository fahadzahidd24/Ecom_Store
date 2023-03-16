import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminControlpageComponent } from './admin-controlpage.component';

describe('AdminControlpageComponent', () => {
  let component: AdminControlpageComponent;
  let fixture: ComponentFixture<AdminControlpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminControlpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminControlpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
