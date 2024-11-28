import { Component, OnInit, ViewChild } from '@angular/core';
import { Stepper, StepperModule } from 'primeng/stepper';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DonorAddService } from '../../services/donor-add.service';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MenuModule } from 'primeng/menu';
import {
  DonorTypes,
  AddressTypes,
  States,
  RelationshipTypes,
  SameHouseHolds,
  DonorFlags,
  DonorFlag,
} from '../../models/DonorModel';
import { DonorAddressComponent } from './donor-address/donor-address.component';
import { DonorRelationshipTypesComponent } from './donor-relationshiptypes/donor-relationshiptypes.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-donor-add',
  standalone: true,
  templateUrl: './donor-add.component.html',
  styleUrl: './donor-add.component.scss',
  imports: [
    MenuModule,
    CommonModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    AccordionModule,
    InputTextModule,
    MultiSelectModule,
    StepperModule,
    ButtonModule,
    InputSwitchModule,
    ToastModule,
    ConfirmDialogModule,
    CheckboxModule,
    RadioButtonModule,
    DropdownModule,
    ProgressSpinnerModule,
    DonorAddressComponent,
    DonorRelationshipTypesComponent,
    CalendarModule,
    AutoCompleteModule,
    DialogModule,
  ],
  providers: [ConfirmationService, MessageService, DonorAddService],
})
export class DonorAddComponent {
  form: FormGroup;

  isEmployed: string = 'yes';
  donorFlagName: string = '';
  cycleYear: string = '';
  flagDescription: string = '';

  showDialog: boolean = false;

  employmentStatuses = [
    { name: 'Retired', value: 'Retired' },
    { name: 'Student', value: 'Student' },
    { name: 'Unemployed', value: 'London' },
  ];

  filteredFlags: any[] = [];

  shds = [
    { key: '1', value: 'Yes' },
    { key: '0', value: 'No' },
  ];

  donorTypes: DonorTypes[] = [];
  addressTypes: AddressTypes[] = [];
  states: States[] = [];
  relationshipTypes: RelationshipTypes[] = [];
  sameHouseHolds: SameHouseHolds[] = [];
  donorFlags: DonorFlags[] = [];

  constructor(
    private fb: FormBuilder,
    private donorAddService: DonorAddService
  ) {
    this.form = this.fb.group({
      prefix: [''],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      suffix: [''],
      currentlyEmployed: ['yes'],
      employeeType: [''],
      employmentStatus: [''],
      employer: [''],
      Occupation: [''],

      donorId: [{ value: '', disabled: true }],
      legacyId: [''],
      candidateId: [''],
      dateOfBirth: [''],

      //Contacts
      addresses: this.fb.array([this.createAddress()]),
      homePhone: [''],
      mobilePhone: [''],
      faxNumber: [''],
      officePhone: [''],
      alternatePhone: [''],
      emails: this.fb.array([this.createEmailControl()]),

      //Relation ships
      relationshipTypes: this.fb.array([this.createRelationshipType()]),

      informalName: [''],
      formalSalutation: [''],
      mailSalutation: [''],

      //Additional details
      //donorFlag: [''],
      donorFlagIds: this.fb.array([this.createDonorFlagControl()]),

      doNotCall: [false],
      doNotEmail: [false],
      doNotMail: [false],
      doNotSolicit: [false],
      isDeceased: [false],
    });

    this.form.get('currentlyEmployed')?.valueChanges.subscribe((value) => {
      this.isEmployed = value;
    });

    this.donorAddService.getDonorTypes().subscribe((data: any) => {
      this.donorTypes = data;
    });

    this.sameHouseHolds = this.shds;

    this.donorAddService.getStates().subscribe((data: any) => {
      this.states = data;
    });

    this.donorAddService.getAddressTypes().subscribe((data: any) => {
      this.addressTypes = data;
    });

    this.donorAddService.getRelationTypes().subscribe((data: any) => {
      this.relationshipTypes = data;
    });

    this.donorAddService.getDonorFlags().subscribe((data: any) => {
      this.donorFlags = data;
    });
  }

  get addressForms(): FormArray {
    return this.form.get('addresses') as FormArray;
  }

  get addressFormsControls(): FormGroup[] {
    return this.addressForms.controls as FormGroup[];
  }

  createAddress(): FormGroup {
    return this.fb.group({
      addressType: [''],
      address1: [''],
      address2: [''],
      city: [''],
      state: [''],
      zipcode: [''],
      country: [''],
      primary: [false],
    });
  }

  addAddress() {
    this.addressForms.push(this.createAddress());
  }

  removeAddress(index: number) {
    this.addressForms.removeAt(index);
  }

  createEmailControl(): FormControl {
    return new FormControl('', [Validators.email]);
  }

  get emailControls(): FormArray {
    return this.form.get('emails') as FormArray;
  }

  addEmail(): void {
    this.emailControls.push(this.createEmailControl());
  }

  createRelationshipType(): FormGroup {
    return this.fb.group({
      relationshipTypeId: [''],
      firstName: [''],
      lastName: [''],
      sameHouseHold: [true],
    });
  }

  get relationshipTypeForms(): FormArray {
    return this.form.get('relationshipTypes') as FormArray;
  }

  get relationshipTypeFormsControls(): FormGroup[] {
    return this.relationshipTypeForms.controls as FormGroup[];
  }

  addRelationshipType() {
    this.relationshipTypeForms.push(this.createRelationshipType());
  }

  removeRelationshipType(index: number) {
    this.relationshipTypeForms.removeAt(index);
  }

  createDonorFlagControl(): FormControl {
    return new FormControl(null);
  }

  get donorFlagControls(): FormArray {
    return this.form.get('donorFlagIds') as FormArray;
  }

  addDonorFlag(): void {
    this.donorFlagControls.push(this.createDonorFlagControl());
  }

  filterFlags(event: any) {
    const query = event.query.toLowerCase();
    this.filteredFlags = this.donorFlags.filter((f) =>
      f.value.toLowerCase().includes(query)
    );
  }

  onDonorFlagSelect(flagValue: any, i: number) {
    // if(flagValue) {
    //   this.donorFlagControls.at(i).setValue(flagValue.value);
    // }

    if (flagValue && Number.isInteger(flagValue.value.key)) {
      this.donorFlagControls.at(i).setValue(flagValue.value.value);
    }
  }

  saveNewDonorFlagType() {
    const flag: DonorFlag = {
      year: parseInt(this.cycleYear, 10),
      description: this.flagDescription,
      title: this.donorFlagName,
    };
    this.donorAddService.addDonorFlag(flag).subscribe({
      next: (response) => {
        console.log('Donor flag added successfully');
//bind control

        this.showDialog = false;
        this.cycleYear = '';
        this.flagDescription = '';
        this.donorFlagName = '';
      },
      error: (error) => {
        console.log('Failed to add Donor flag');
      },
    });
  }

  save() {
    if (this.form.invalid || this.addressForms.length === 0) {
      return;
    }

    //  const flags= this.form.value.donorFlagIds
    //     .filter((flag: { key: number }) => flag && flag.key !== null)  // Ensure `flag` is not null
    //     .map((flag: { key: number }) => flag.key);

    const flags = this.form.value.donorFlagIds
      .filter((flag: { key: number }) => flag && flag.key !== null)
      .map((flag: { key: number }) => flag.key);

    this.form.patchValue({
      donorFlagIds: flags,
    });

    console.log(this.form.value);

    console.log(JSON.stringify(this.form.value));
  }
}
