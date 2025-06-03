import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        LoginPage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty email and password initially', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
  });

  it('should have all required UI elements', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.logo-container')).toBeTruthy();
    expect(compiled.querySelector('.logo ion-img')).toBeTruthy();
    expect(compiled.querySelector('ion-item ion-label[position="stacked"]')).toBeTruthy();
    expect(compiled.querySelectorAll('ion-button').length).toBe(2);
    expect(compiled.querySelector('.forgot-password a')).toBeTruthy();
  });
});
