
export default class DialogComponentController {
    public dialog: any;
     /* @ngInject */
    constructor(){
        const dialogFile = require('../data/dialog-data.json')
        this.dialog = dialogFile.resources[0].content[0]
       // console.log(this.dialog)
    }
    public refreshField(field) {
        console.log("refreshing field");
        return new Promise((resolve, reject) =>{
            resolve({"status":"success"})
        })
    }
}
