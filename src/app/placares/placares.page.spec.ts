import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlacaresPage } from './placares.page';

describe('PlacaresPage', () => {
  let component: PlacaresPage;
  let fixture: ComponentFixture<PlacaresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacaresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
