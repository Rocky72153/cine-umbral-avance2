import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CinemaPruchase } from './cinema-pruchase';

describe('CinemaPruchase', () => {
  let component: CinemaPruchase;
  let fixture: ComponentFixture<CinemaPruchase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CinemaPruchase],
    }).compileComponents();

    fixture = TestBed.createComponent(CinemaPruchase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
