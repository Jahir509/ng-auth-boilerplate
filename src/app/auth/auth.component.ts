import {Component, ComponentFactoryResolver, OnDestroy, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import {Observable, Subscription} from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';
import {Router} from "@angular/router";
import {ModalComponent} from '../shared/modal/modal.component';
import {PlaceholderDirective} from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  // @ts-ignore
  @ViewChild(PlaceholderDirective) errorModal : PlaceholderDirective;
  closeModalSub: Subscription;
  constructor(private authService: AuthService,private router:Router,private componentFactoryResolver:ComponentFactoryResolver) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      (resData) => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['recipes']);

      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.showErrorModal(errorMessage);
        this.isLoading = false;
      }
    );

    form.reset();
  }

  private showErrorModal(errorMessage: any) {
    // const errorModal = new ModalComponent(); // this will not work
    const modalCmpFactory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
    const hostViewContainerRef = this.errorModal.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(modalCmpFactory);

    componentRef.instance.message = errorMessage;
    this.closeModalSub = componentRef.instance.close.subscribe(()=>{
      this.closeModalSub.unsubscribe();
      hostViewContainerRef.clear();
    })
  }

  ngOnDestroy(): void {
    if(this.closeModalSub){
      this.closeModalSub.unsubscribe();
    }
  }
}
