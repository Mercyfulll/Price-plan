export default function pricePlan(){
    var sms = [];
    var calls = [];
    var theSmsSum = 0;
    var theCallSum = 0;
    var id = 0;

    function sortString(usageString){
       
        var arrString = usageString.split(",")
        
        for (let i = 0; i < arrString.length; i++){
            let string = arrString[i].trim() 
            if(string.startsWith("c")){
                calls.push(string)
            }
            if(string.startsWith("s"))
                sms.push(string)
        }
    
    }

    function calculate(pricePlan){
        if(pricePlan == 'sms100'){
            theSmsSum = sms.length * 0.20
            theCallSum = calls.length * 2.35
        }
        else if(pricePlan == 'call100'){
            theSmsSum = sms.length * 0.45
            theCallSum = calls.length * 1.75
        }
        else if(pricePlan == 'text-me'){
            theSmsSum = sms.length * 0.17
            theCallSum = calls.length * 1.54
        }
    }

    function getSmsTotal(){
        return theSmsSum 
    }

    function getCallsTotal(){
        return theCallSum
    }

    function getTotal(){
        let total = theSmsSum + theCallSum
        return total.toFixed(2)
    }

    function getTableId(plan){
        if(plan === 'sms100'){
            id = 1
        } 
        else if(plan === 'call100'){
            id = 2
        }
        else if(plan === 'textme'){
            id = 3
        }
        return id
    } 
    return {
        sortString,
        calculate,
        getSmsTotal,
        getCallsTotal,
        getTableId,
        getTotal

    }
}
