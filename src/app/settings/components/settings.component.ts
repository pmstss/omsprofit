import { Component, DoCheck, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState, AppStateStore, Investment, MessageService, MessageType, RepoService } from '../../core';
import { AutoUnsubscribe, DialogService } from '../../common-aux';
import { InvestmentComponent } from './investment/investment.component';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, DoCheck {
    investments: Investment[] = [];
    investmentsInitial: Investment[];

    @AutoUnsubscribe private subscription: Subscription;
    @ViewChild('scrollToEl') scrollToEl: ElementRef;
    @ViewChildren(InvestmentComponent) investmentsComponents: QueryList<InvestmentComponent>;

    saveAllowed: boolean = false;
    resetAllowed: boolean = false;

    constructor(private appStateStore: AppStateStore, private repoService: RepoService,
                private messageService: MessageService, private dialogService: DialogService) {
    }

    ngOnInit() {
        this.investmentsInitial = null;

        this.subscription = this.appStateStore.state$.pipe(
            map((state: AppState) => state.investments)
        ).subscribe((investments: Investment[]) => {
            this.investments = investments.map(inv => inv.clone());
            if (!this.investmentsInitial) {
                this.investmentsInitial = this.investments.map(inv => inv.clone());
            }
        });
    }

    private investmentsEqual(investments): boolean {
        if (!this.investments && !investments) {
            return true;
        }

        if (!this.investments || !investments || this.investments.length !== investments.length) {
            return false;
        }

        return this.investments.every((inv, idx) => inv.equals(investments[idx]));
    }

    removeInvestment(idx: number) {
        this.investments.splice(idx, 1);
        this.appStateStore.updateInvestments(this.investments);
    }

    addInvestment() {
        this.investments.push(new Investment());
        setTimeout(() => this.scrollToEl.nativeElement.scrollIntoView({ behavior: 'smooth' }));

        this.messageService.publish({
            message: 'Added!',
            type: MessageType.SUCCESS,
            timeout: 2000
        });
    }

    save() {
        this.appStateStore.updateInvestments(this.investments);
        this.messageService.publish({
            message: 'Saved!',
            type: MessageType.SUCCESS,
            timeout: 1000
        });
    }

    reset() {
        this.dialogService.confirm({ message: 'Unsaved changed will be lost. Are you sure to reset form?' })
            .then((confirmed) => {
                if (confirmed) {
                    this.investments = this.investmentsInitial.map(inv => inv.clone());
                }
            });
    }

    restoreDefaults() {
        this.dialogService.confirm({ message: 'Are you sure to restore defaults?' }).then((confirmed) => {
            if (confirmed) {
                this.appStateStore.resetInvestments();
            }
        });
    }

    ngDoCheck() {
        this.resetAllowed = this.isDirty() || !this.isValid();
        this.saveAllowed = this.isDirty() && this.isValid();
    }

    isDirty(): boolean {
        return !!(this.investmentsComponents && this.investmentsComponents.filter(cmp => cmp.dirty).length > 0);
    }

    isValid(): boolean {
        return !!(this.investmentsComponents && this.investmentsComponents.filter(cmp => !cmp.valid).length === 0);
    }
}
