import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestsellersTableComponent } from './bestsellers-table.component';

describe('BestsellersTableComponent', () => {
  let component: BestsellersTableComponent;
  let fixture: ComponentFixture<BestsellersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestsellersTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestsellersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
