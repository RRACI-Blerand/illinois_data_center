import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DATA_TABLE } from '../../datatable';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment'

@Component({
  selector: 'app-export-data',
  standalone: true,
  imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule],
  templateUrl: './export-data.component.html',
  styleUrl: './export-data.component.scss'
})
export class ExportDataComponent {

  dataTable = DATA_TABLE;
  completedTrainings: any[] = [];
  countedCompletedTrainings: any[] = []
  userWithCompletedTrainings: any = []
  dateSetFormGroup!: FormGroup;
  dateFormGroup: FormGroup;
  constructor(private sanitizer: DomSanitizer, private formBuild: FormBuilder) {
    this.dateSetFormGroup = this.formBuild.group({
      startDate: new FormControl({ day: 1, month: 7, year: 2022 }, [Validators.required]),
      trainings: new FormControl(["Electrical Safety for Labs", "X-Ray Safety", "Laboratory Safety Training"], [Validators.required]),
      endDate: new FormControl({ day: 30, month: 6, year: 2023 }, [Validators.required])
    })
    this.dateFormGroup = this.formBuild.group({
      date: new FormControl({ day: 1, month: 10, year: 2023 }, [Validators.required])
    })
  }
  async ngOnInit(): Promise<void> {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    let id = 1;
    await this.dataTable.forEach((element: any) => {
      element.completions.forEach((training: any) => {

        if (this.completedTrainings.find((el: any) => el.trainingName == training.name)) {
          this.completedTrainings.find((item: any) => {
            if (item.trainingName == training.name) {
              item.numberOfCompletions++
            }
          })
        }
        else {
          let obj = {
            numberOfCompletions: 0,
            trainingId: id,
            trainingName: training.name
          }
          this.completedTrainings.push(obj)
          id++
        }
      });
    });
  }
  /*
  Calls generateJsonFile with static params
  */
  listCompletedTrainingWithCounter() {
    this.generateJsonFile(this.completedTrainings, 'Completed trainings ')
  }

  /*
  Lists trainings and users that attended the training  
  */
  listCompletedTrainingWithUsersAttended() {
    let date1 = '';
    let date2 = '';

    let params = this.dateSetFormGroup.get('trainings')?.value
    let userTrainings: any[] = []
    let id = 1;
    let tempUsData = (this.dataTable as Array<any>)
    if (this.dateSetFormGroup.get('startDate')?.valid) {
      date1 = '' + this.dateSetFormGroup.get('startDate')?.value.month + '/' + this.dateSetFormGroup.get('startDate')?.value.day + '/' + this.dateSetFormGroup.get('startDate')?.value.year
    }
    if (this.dateSetFormGroup.get('endDate')?.valid) {
      date2 = '' + this.dateSetFormGroup.get('endDate')?.value.month + '/' + this.dateSetFormGroup.get('endDate')?.value.day + '/' + this.dateSetFormGroup.get('endDate')?.value.year
    }
    tempUsData.forEach((user: any) => {

      let tempTrain: any[] = []
      user.completions.forEach((training: any) => {
        if (moment(training.timestamp).isBetween(moment(date1), moment(date2)) && params.includes(training.name)) {
          if (tempTrain.find((el: any) => el.name == training.name)) {
            tempTrain.find((el: any) => {
              if (el.name == training.name) {
                el.timestamp = moment(el.timestamp).isAfter(training.timestamp) ? el.timestamp : training.timestamp
              }
            })

          }
          else {
            tempTrain.push(training)
          }
          tempTrain.find((el: any) => {
            this.completedTrainings.find((tr: any) => {
              if (el.name == tr.trainingName) {
                el.trainingId = tr.trainingId
              }

            })
          });
        }
      });
      let obj = {
        name: user.name,
        id: id,
        completions: tempTrain
      }
      if (obj.completions.length > 0) {
        userTrainings.push(obj)
      }
      id++
    })

    this.userWithCompletedTrainings = userTrainings
    this.listAllUserserWithCompletedTrainings(userTrainings, 'User with completed trainings from ' + date1 + ' to ' + date2)
  }

  /**
   * Lists all users with most recent completed trainings
   * @param userTrainings all user trainings
   * @param text file name
   */
  listAllUserserWithCompletedTrainings(userTrainings: any[], text: any) {
    let tempTrainings: any[] = []
    let tempCompletedTrainings: any[] = this.completedTrainings;
    tempCompletedTrainings.forEach((training: any) => {
      training.usersThatHaveCompletedTheTraining = []
      userTrainings.forEach((user: any) => {
        user.completions.forEach((compl: any) => {
          if (compl.trainingId == training.trainingId) {

            training.usersThatHaveCompletedTheTraining.push(user)
          }
        });
      })
    })
    this.generateJsonFile(tempCompletedTrainings, text)
  }

  /*
  Generates expired and about to expire data  
  */
  generateExpiredAndNonExpiredData() {
    let userTrainings: any[] = []
    let id = 1;
    let tempUsData = (this.dataTable as Array<any>)
    let date: any;
    if (this.dateFormGroup.get('date')?.valid) {
      date = '' + this.dateFormGroup.get('date')?.value.month + '/' + this.dateFormGroup.get('date')?.value.day + '/' + this.dateFormGroup.get('date')?.value.year
    }
    tempUsData.forEach((user: any) => {

      let tempTrain: any[] = []
      user.completions.forEach((training: any) => {
        if (moment(training.expires).isBefore(moment(date).add(1, 'month')) || moment(training.expires).isBefore(moment(date))) {
          if (tempTrain.find((el: any) => el.name == training.name)) {
            tempTrain.find((el: any) => {
              if (el.name == training.name) {
                el.timestamp = moment(el.timestamp).isAfter(training.timestamp) ? el.timestamp : training.timestamp
              }
            })

          }
          else {
            tempTrain.push(training)
          }
          tempTrain.find((el: any) => {
            this.completedTrainings.find((tr: any) => {
              if (el.name == tr.trainingName) {
                el.trainingId = tr.trainingId
                if (moment(training.expires).isBetween(moment(date), moment(date).add(1, 'month'))) {
                  console.log('KAPI EXP SOON', training)
                  el.status = 'Expiring soon!'
                }
                else {
                  console.log('KAPI EXPIRED', training)
                  el.status = 'Expired!'

                }
              }

            })
          });
        }
      });
      let obj = {
        name: user.name,
        id: id,
        completions: tempTrain
      }
      if (obj.completions.length > 0) {
        userTrainings.push(obj)
      }
      id++
    })


    this.generateJsonFile(userTrainings, 'Users with expired and expiring soon with date ' + date)
  }

  /**
   * Generates a json file with given params
   * @param stream Array for json
   * @param fileName file name
   */
  generateJsonFile(stream: any, fileName: string) {
    const str: any = JSON.stringify(stream, null, 2);
    const bytes = new TextEncoder().encode(str);
    const blob: any = new Blob([bytes], {
      type: "application/json;charset=utf-8"
    });
    var link = document.createElement("a"); // Or maybe get it from the current document
    link.href = URL.createObjectURL(blob);
    link.download = fileName + '____' + new Date().getMonth() + '/' + new Date().getDate() + '/' + new Date().getFullYear() + ".json";
    link.click()
  }
}

