import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuportPageComponent } from './suport-page.component';

describe('SuportPageComponent', () => {
  let component: SuportPageComponent;
  let fixture: ComponentFixture<SuportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuportPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
