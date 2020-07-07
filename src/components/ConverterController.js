import { currencies,currencyDecimal,currencyPairRates,currencyTable } from '../rules/Rules';
import { CONST } from '../util/CONST';

export default class ConverterController{
    static getCurrencies(){
        return currencies;
    }

    static getCurrencyDecimal(currency){
        return currencyDecimal[currency];
    }

    static getCurrencyPairRate(one,two){
        let pair = one+two;
        return currencyPairRates[pair];
    }

    static getCrossValue(cur1,cur2){
        return currencyTable[cur1][cur2];
    }

    static calculate(from,to){
        let cur1 = from.currency;
        let amount1 = from.amount;
        let cur2 = to.currency;

        if(!cur1 || !cur2 || !amount1) return null;
        
        if(!amount1) return 0;

        let crossValue = this.getCrossValue(cur1,cur2);
        let cross = CONST.CROSS_VALUE;

        switch(crossValue){
            case cross.D:
                return this.calculateDirect(from,to);
            case cross.INV:
                return this.calculateInverse(from,to);
            case cross.ONE:
                return amount1;
            default:
                return this.calculateCross(from,to,crossValue);
        }
    }

    static fixDecimal(cur,value){
        let decimal = this.getCurrencyDecimal(cur);
        try {
            return value.toFixed(decimal);
        } catch(e){
            console.log("Error--",e);
            return value
        }
    }

    static calculateDirect(from,to){
        let cur1 = from.currency;
        let amount1 = from.amount;
        let cur2 = to.currency;

        let rate = this.getCurrencyPairRate(cur1,cur2);
        if(!rate) return null;
        return (amount1 * rate);
    }

    static calculateInverse(from,to){
        let cur1 = from.currency;
        let amount1 = from.amount;
        let cur2 = to.currency;

        let rate = this.getCurrencyPairRate(cur2,cur1);
        if(!rate) return null;
        return (amount1 / rate);
    }

    static calculateCross(from,to,crossValue){
        let rate1 = this.calculate(from,{currency : crossValue});
        
        let newFrom = {
            currency : crossValue,
            amount : rate1,
        }

        let result = this.calculate(newFrom,to);
        return result;
    }
}