export class AcEntity{
    static create(json : any = undefined){
        if (json){
            return Object.assign(new AcEntity(),json);
        }
        return new AcEntity();
    }
}
