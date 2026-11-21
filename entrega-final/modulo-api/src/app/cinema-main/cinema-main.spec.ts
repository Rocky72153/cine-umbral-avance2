import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CinemaMain } from './cinema-main';

describe('CinemaMain', () => {
  let component: CinemaMain;
  let fixture: ComponentFixture<CinemaMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CinemaMain],
    }).compileComponents();

    fixture = TestBed.createComponent(CinemaMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
