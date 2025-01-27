import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { AccountsService } from '../services/accounts.service';
import { AccountDetails } from '../model/account.model';
import { Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit {

  accountFormGroup! : FormGroup;
  currentPage : number = 0;
  pageSize : number = 5;
  accountObservable! : Observable<AccountDetails>;
  operationsFormGroup! : FormGroup;
  errorMessage! : string

constructor(private fb: FormBuilder, private accountService : AccountsService) {}

ngOnInit(): void {
  this.accountFormGroup = this.fb.group({
    accountId : this.fb.control('')
  });
  this.operationsFormGroup = this.fb.group({
    operationType: this.fb.control(null),
    amount: this.fb.control(0),
    description:this.fb.control(null),
    accountDestination:this.fb.control(null)
  })
}

handleSearchAccount() {
  let accountId : string = this.accountFormGroup.value.accountId;
  this.accountObservable=this.accountService.getAccount(accountId,this.currentPage,this.pageSize).pipe(
    catchError(err=>{
      this.errorMessage = err.errorMessage;
      return throwError(err);
    })
  )
}

gotoPage(page: number) {
  this.currentPage = page;
  this.handleSearchAccount();
}

handleAccountOperation() {
  let accountId : string = this.accountFormGroup.value.accountId;
  let operationType = this.operationsFormGroup.value.operationType;
  let amount : number= this.operationsFormGroup.value.amount;
  let description : string= this.operationsFormGroup.value.description;
  let accountDestination : string = this.accountFormGroup.value.accountDestination;
  if (operationType=='DEBIT'){
    this.accountService.debit(accountId, amount, description).subscribe({
      next : (data)=>{
        alert('Success Debit');
        this.handleSearchAccount();
      },
      error : (err) =>{
        console.log(err);
      }
    })
  } else if (operationType=='CREDIT'){
    this.accountService.credit(accountId, amount, description).subscribe({
      next : (data)=>{
        alert('Success Credit');
        this.handleSearchAccount();
      },
      error : (err) =>{
        console.log(err);
      }
    })
  } else if (operationType=='TRANSFER'){
    this.accountService.transfer(accountId,accountDestination, amount, description).subscribe({
      next : (data)=>{
        alert('Success Transfer');
        this.handleSearchAccount();
      },
      error : (err) =>{
        console.log(err);
      }
    })
  }
  
}

}
